semgrep:
	docker run --rm -v $(CURDIR):/src returntocorp/semgrep semgrep scan --config=.semgrep.yaml --error /src

trivy:
	docker pull aquasec/trivy
	docker run --rm -v $(CURDIR):/src aquasec/trivy fs --severity HIGH,CRITICAL --exit-code 1 /src

trivy-docker-image:
	docker build -t app-test .
	docker run --rm aquasec/trivy image --severity HIGH,CRITICAL --exit-code 1 app-test