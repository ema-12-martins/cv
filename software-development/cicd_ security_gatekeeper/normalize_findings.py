import json
import os
from waivers import apply_waivers

normalized = []

def load_json_safe(path):
    if not os.path.exists(path):
        print(f"[Warning] File not found: {path}")
        return None
    try:
        if os.path.getsize(path) == 0:
            print(f"[Warning] File is empty: {path}")
            return None
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        print(f"[Warning] Failed to load {path}: {e}")
        return None

def extract_semgrep_cwe(issue):
    meta = issue.get("extra", {}).get("metadata", {})
    return meta.get("cwe") or meta.get("cwe_id")

# Semgrep
semgrep_data = load_json_safe("semgrep-report.json")
if semgrep_data:
    for issue in semgrep_data.get("results", []):
        normalized.append({
            "tool": "semgrep",
            "file": issue.get("path"),
            "line": issue.get("start"),
            "rule": issue.get("check_id"),
            "message": issue.get("extra", {}).get("message"),
            "severity": issue.get("extra", {}).get("severity"),
            "cwe": extract_semgrep_cwe(issue)
        })

# Trivy
trivy_data = load_json_safe("trivy-report.json")
if trivy_data:
    for result in trivy_data.get("Results", []):
        target = result.get("Target")
        for vuln in result.get("Vulnerabilities", []):
            normalized.append({
                "tool": "trivy",
                "target": target,
                "vulnerability_id": vuln.get("VulnerabilityID"),
                "package_name": vuln.get("PkgName"),
                "severity": vuln.get("Severity"),
                "description": vuln.get("Description")
            })

normalized = apply_waivers(normalized, "waivers.yaml")

with open("findings.json", "w") as f:
    json.dump(normalized, f, indent=2)

print("findings.json created successfully!")
