import os
import json
import requests

PROJECT_ID = os.getenv('CI_PROJECT_ID')
MR_IID = os.getenv('CI_MERGE_REQUEST_IID')
GITLAB_API_URL_BASE = os.getenv('CI_API_V4_URL') 
GITLAB_TOKEN = os.getenv('GITLAB_CI_TOKEN')

OPA_FILE = 'opa-decision.json'

def generate_markdown(data):
    if data.get('allow'):
        return "**Policy Check Passed**: No critical violations found."
    
    md = f"**Policy Check Failed**\n\n"
    md += f"**Violations found:** {data.get('count', 0)}\n\n"
    
    md += "| Severity | Tool | ID | Description |\n"
    md += "|----------|------|----|-------------|\n"
    
    for v in data.get('violations', []):
        if v.get('tool') == 'trivy':
            desc = v.get('description', 'N/A')[:100].replace('\n', ' ') + "..."
            md += f"| **{v.get('severity')}** | {v.get('tool')} | {v.get('vulnerability_id', 'Rule')} | {desc} |\n"
        else:
            desc = v.get('message', 'N/A')[:100].replace('\n', ' ') + "..."
            md += f"| **{v.get('severity')}** | {v.get('tool')} | {v.get('cwe', 'Rule')} | {desc} |\n"
    
    md += "\nCheck the Job Artifacts for full details."
    return md

def post_comment(message):
    
    if not MR_IID:
        print("Not a Merge Request, skipping comment.")
        return
    
    if not GITLAB_TOKEN:
        print("Error: GITLAB_CI_TOKEN environment variable not set.")
        return

    url = f"{GITLAB_API_URL_BASE}/projects/{PROJECT_ID}/merge_requests/{MR_IID}/notes"

    headers = {"PRIVATE-TOKEN": GITLAB_TOKEN}
    payload = {"body": message}

    print(f"Sending POST request to API...")
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 201:
        print("Comment posted successfully!")
    else:
        print(f"Failed to post comment. Status code: {response.status_code}. Response: {response.text}")

if __name__ == "__main__":
    if os.path.exists(OPA_FILE):
        with open(OPA_FILE, 'r') as f:
            data = json.load(f)
            message = generate_markdown(data)
            post_comment(message)
    else:
        print(f"File {OPA_FILE} not found.")