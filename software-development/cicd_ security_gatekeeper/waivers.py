import os
from datetime import datetime
import yaml


def load_waivers(path="waivers.yaml"):
    """
    If waives.yaml doesn't exist, return empty config safely.
    """
    if not os.path.exists(path):
        print(f"[Info] No waivers file found at {path}, skipping waivers.")
        return {"defaults": {}, "waivers": []}

    with open(path) as f:
        data = yaml.safe_load(f) or {}

    return {
        "defaults": data.get("defaults", {}),
        "waivers": data.get("waivers", []),
    }


def waiver_matches_finding(match, finding):
    """
    Generic matcher:
    - All keys in match must match finding exactly
    - Special handling for line, line_min, line_max
    """

    # exact-match keys (everything except line controls)
    simple_keys = set(match.keys()) - {"line", "line_min", "line_max"}

    for key in simple_keys:
        if finding.get(key) != match[key]:
            return False

    # line logic (mainly for semgrep)
    line = finding.get("line")

    if "line" in match:
        if line != match["line"]:
            return False

    if "line_min" in match:
        if line is None or line < match["line_min"]:
            return False

    if "line_max" in match:
        if line is None or line > match["line_max"]:
            return False

    return True


def waiver_is_expired(waiver):
    expires_at = waiver.get("expires_at")
    if not expires_at:
        return False

    try:
        exp = datetime.fromisoformat(expires_at.rstrip("Z"))
        return datetime.utcnow() > exp
    except Exception:
        # Invalid date format = ignore expiry
        return False


def apply_waivers(findings, waiver_file="waivers.yaml"):
    """
    Applies waivers AND enforces upgrades.
    """
    cfg = load_waivers(waiver_file)

    defaults = cfg["defaults"]
    waivers = cfg["waivers"]

    default_action = defaults.get("action", "suppress")
    default_target_sev = defaults.get("target_severity")

    ALWAYS_HIGH_RULES = [
        "trailofbits.generic.mongodb-insecure-transport.mongodb-insecure-transport",
        "python.flask.security.audit.debug-enabled.debug-enabled"
    ]

    output = []

    for f in findings:
        check_id = f.get("rule")
        
        if check_id in ALWAYS_HIGH_RULES:
            f["severity"] = "HIGH"
            output.append(f) 
            continue 

        suppressed = False

        for w in waivers:
            match = w.get("match", {})

            if not waiver_matches_finding(match, f):
                continue

            if waiver_is_expired(w):
                continue

            action = w.get("action", default_action)

            if action == "suppress":
                suppressed = True
                break

            elif action == "downgrade":
                target = w.get("target_severity", default_target_sev)
                if target and "severity" in f:
                    f["severity"] = target
                break

        if not suppressed:
            output.append(f)

    return output
