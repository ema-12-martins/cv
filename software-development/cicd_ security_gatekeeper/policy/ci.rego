package ci

import rego.v1

################################################################################
# Core blocking logic
################################################################################

default allow := false

# Findings that still block the pipeline
blocking_findings contains finding if {
  some i
  finding := input[i]
  finding.severity in {"HIGH", "CRITICAL", "ERROR"}
}

################################################################################
# Waiver data from waivers.yaml
################################################################################

# Safe default if waivers.yaml isn’t present or has no waivers
waiver_list := data.waivers if {
  data.waivers
} else := [] if {
  not data.waivers
}

waiver_defaults := data.defaults if {
  data.defaults
} else := {"action": "suppress"} if {
  not data.defaults
}

allowed_actions := {"suppress", "downgrade"}
allowed_severities := {
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
  "ERROR",
  "WARNING",
}
allowed_match_keys := {
  "tool",
  "rule",
  "file",
  "target",
  "severity",
  "cwe",
  "package_name",
  "vulnerability_id",
}

################################################################################
# Helpers
################################################################################

has_field(obj, key) if {
  _ := obj[key]
}

# All keys of an object as a set
object_keys(obj) := {k |
  obj[k] = _
}

################################################################################
# Waiver errors (per waiver.id)
#   waiver_errors[w_id] is a set of error objects for that waiver
################################################################################

# 1) id must exist and be non-empty
waiver_errors[w.id] contains {"code": "missing_id"} if {
  w := waiver_list[_]
  not has_field(w, "id")
}
waiver_errors[w.id] contains {"code": "missing_id"} if {
  w := waiver_list[_]
  has_field(w, "id")
  w.id == ""
}

# 2) description must exist and be non-empty
waiver_errors[w.id] contains {"code": "missing_description"} if {
  w := waiver_list[_]
  not has_field(w, "description")
}
waiver_errors[w.id] contains {"code": "missing_description"} if {
  w := waiver_list[_]
  has_field(w, "description")
  w.description == ""
}

# 3) action must be valid (considering defaults)
waiver_errors[w.id] contains {
  "code": "invalid_action",
  "value": action,
} if {
  w := waiver_list[_]
  action := waiver_action(w)
  not action in allowed_actions
}

# 4) match must exist and be non-empty
waiver_errors[w.id] contains {"code": "missing_match"} if {
  w := waiver_list[_]
  not has_field(w, "match")
}
waiver_errors[w.id] contains {"code": "missing_match"} if {
  w := waiver_list[_]
  has_field(w, "match")
  m := w.match
  keys := object_keys(m)
  count(keys) == 0
}

# 5) match must not contain unknown keys
waiver_errors[w.id] contains {
  "code": "invalid_match_keys",
  "keys": bad,
} if {
  w := waiver_list[_]
  has_field(w, "match")
  m := w.match
  keys := object_keys(m)
  bad := {k | k := keys[_]; not allowed_match_keys[k]}
  count(bad) > 0
}

# 6) expires_at must exist
waiver_errors[w.id] contains {"code": "missing_expires_at"} if {
  w := waiver_list[_]
  not has_field(w, "expires_at")
}

# 7) expires_at must not be in the past
waiver_errors[w.id] contains {
  "code": "expired_waiver",
  "expires_at": w.expires_at,
} if {
  w := waiver_list[_]
  has_field(w, "expires_at")
  exp := time.parse_rfc3339_ns(w.expires_at)
  now := time.now_ns()
  now > exp
}

# 8) target_severity must be valid and present if action == downgrade
waiver_errors[w.id] contains {
  "code": "invalid_target_severity",
  "value": w.target_severity,
} if {
  w := waiver_list[_]
  waiver_action(w) == "downgrade"
  not has_field(w, "target_severity")
} 

waiver_errors[w.id] contains {
  "code": "invalid_target_severity",
  "value": w.target_severity,
} if {
  w := waiver_list[_]
  waiver_action(w) == "downgrade"
  has_field(w, "target_severity")
  not w.target_severity in allowed_severities
}

# 9) If action == suppress, target_severity MUST NOT be set
waiver_errors[w.id] contains {
  "code": "suppress_with_target_severity",
  "action": waiver_action(w),
  "target_severity": w.target_severity,
} if {
  w := waiver_list[_]
  waiver_action(w) == "suppress"
  has_field(w, "target_severity")
}

################################################################################
# Helper: effective waiver action
################################################################################

waiver_action(w) := action if {
  has_field(w, "action")
  action := w.action
} else := action if {
  not has_field(w, "action")
  action := waiver_defaults.action
}

################################################################################
# Aggregated waiver validation results
################################################################################

# List of invalid waivers with their errors
invalid_waivers := [res |
  some idx
  w := waiver_list[idx]
  errs := {e | waiver_errors[w.id][e]}
  count(errs) > 0
  res := {
    "id": w.id,
    "description": w.description,
    "errors": errs,
  }
]

waivers_invalid if {
  some _ in invalid_waivers
}

################################################################################
# Final allow + decision
################################################################################

# Pipeline passes only if:
#  - no blocking findings in findings.json, AND
#  - no invalid waivers in waivers.yaml
allow if {
  count(blocking_findings) == 0
  not waivers_invalid
}

decision := {
  "allow": allow,
  "count": count(blocking_findings),
  "violations": blocking_findings,
  "waivers": {
    "total": count(waiver_list),
    "invalid": invalid_waivers,
  },
}
