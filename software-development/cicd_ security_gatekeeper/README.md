# CI/CD Security Gatekeeper 🛡️

## Project Overview

A GitLab CI/CD pipeline that enforces secure coding practices by automatically running security analysis tools on every Merge Request. The system uses Policy-as-Code to determine whether code should be merged, blocked, or requires additional review based on security findings.

## Short Description

This project builds an automated security gatekeeper that integrates into the development workflow, catching vulnerabilities before they reach production. Using open-source tools (Semgrep, Trivy, OPA), the system scans code for security issues, evaluates findings against custom policies, and provides clear feedback to developers directly in their Merge Requests.

**Key Features:**
- Automated security scanning on every MR
- Policy-based decision engine (allow/block/warn)
- Waiver system for justified exceptions
- Developer-friendly result presentation
- Zero-cost implementation using OSS tools

## Team Members
- Ema Martins 
- José Miguel Isidro 
- Pedro Simões
- Pedro Vidal Marcelino

## Task Breakdown & Assignments

### Phase 1: Infrastructure & Setup (Week 1)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| Set up GitLab repository and CI/CD pipeline | Member 1 | Nov 17 |
| Create vulnerable demo application (Python/JS) | Member 2 | Nov 17 |
| Install and configure Semgrep + Trivy locally | Member 3 | Nov 17 |
| Set up Docker environment (if needed) | Member 4 | Nov 17 |

### Phase 2: Security Tool Integration (Week 2-3)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| Implement Semgrep scanning stage in CI | Member 1 | Nov 26 |
| Implement Trivy scanning stage in CI | Member 2 | Nov 26 |
| Create result normalization script (findings.json) | Member 3 | Nov 29 |
| Design waiver system structure (waivers.yaml) | Member 4 | Nov 29 |

### Phase 3: Policy Engine (Week 4)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| Install and configure OPA | Member 1 | Dec 3 |
| Write Rego policies (block HIGH/CRITICAL) | Member 2 | Dec 6 |
| Implement CWE-based blocking rules | Member 3 | Dec 6 |
| Create waiver validation logic in OPA | Member 4 | Dec 6 |

### Phase 4: Integration & Automation (Week 5)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| Connect pipeline stages (scan → normalize → OPA) | Member 1 | Dec 10 |
| Implement MR commenting with results | Member 2 | Dec 10 |
| Create test merge requests (5+ scenarios) | Member 3 | Dec 12 |
| Build demo scenarios (vulnerable + clean code) | Member 4 | Dec 12 |

### Phase 5: Demo Preparation (Week 6)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| Measure FP/FN rates on test MRs | Member 1 | Dec 15 |
| Calculate metrics (blocked vs allowed) | Member 2 | Dec 15 |
| Prepare demo presentation (3-5 min) | Member 3 | Dec 16 |
| Demo rehearsal | All Members | Dec 16 |

### Phase 6: Evaluation & Documentation (Week 7-8)
| Task | Assigned To | Deadline |
|------|-------------|----------|
| **Live Demo** | All Members | **Dec 17** |
| Write evaluation report draft (4-6 pages) | Member 3 | Dec 22 |
| Code cleanup and final documentation | Member 1 & Member 2 | Dec 24 |
| Review and polish evaluation report | All Members | Dec 26 |
| Final report compilation | Member 3 | Dec 27 |
| **Final Submission** | All Members | **Dec 28** |

## Expected Deliverables

1. **GitLab Repository** with:
   - Working CI/CD pipeline (.gitlab-ci.yml)
   - Policy files (policy/ci.rego)
   - Waiver system (scripts/waivers.yaml)
   - Normalization scripts (scripts/normalize.py)
   - Demo vulnerable application

2. **Evaluation Report** (4-6 pages):
   - Security effectiveness (FP/FN rates)
   - CWE coverage analysis
   - Developer experience assessment
   - Lessons learned

3. **Live Demo** (in-class):
   - Show pipeline in action
   - Demonstrate blocking/allowing scenarios
   - Explain waiver system
   - Present evaluation results

## Technical Stack

- **CI/CD Platform:** GitLab Free
- **Static Analysis:** Semgrep OSS
- **Dependency Scanning:** Trivy CLI
- **Policy Engine:** Open Policy Agent (OPA/Rego)
- **Container Runtime:** Docker CE (optional)
- **Scripting:** Python 3.x

## Success Metrics

- Pipeline successfully blocks HIGH/CRITICAL vulnerabilities
- Waiver system works with time-bound exceptions
- False Positive rate < 30%
- Clear, actionable feedback in MR comments
- At least 3 different CWE types detected

## Repository Structure

```
/
├── .gitlab-ci.yml              # CI/CD pipeline configuration
├── policy/
│   └── ci.rego                 # OPA security policies
├── scripts/
│   ├── normalize.py            # Convert scan outputs to unified format
│   └── waivers.yaml            # Approved security exceptions
├── demo/                       # Intentionally vulnerable demo app
│   ├── app.py
│   └── requirements.txt
├── test-mrs/                   # Sample merge requests for testing
└── docs/
│   └── evaluation-report.pdf   # Final evaluation (due Dec 28)
├── README.md                   # This document
```