FROM python:3.11-slim

RUN apt-get update && apt-get install -y wget git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir semgrep

RUN wget https://github.com/aquasecurity/trivy/releases/latest/download/trivy_Linux-64bit.tar.gz && \
    tar zxvf trivy_Linux-64bit.tar.gz && \
    mv trivy /usr/local/bin/ && \
    rm -f trivy_Linux-64bit.tar.gz

RUN wget https://github.com/open-policy-agent/opa/releases/latest/download/opa_linux_amd64_static -O /usr/local/bin/opa && \
    chmod +x /usr/local/bin/opa

RUN useradd -m appuser

WORKDIR /app
COPY . /app

RUN chown -R appuser:appuser /app

USER appuser

ENTRYPOINT ["/bin/bash"]
