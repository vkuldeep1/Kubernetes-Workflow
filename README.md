# Kubernetes Full Stack Deployment (End-to-End)

## Overview

This repository demonstrates a complete, production-style Kubernetes workflow — from containerization to orchestration, configuration management, persistence, and deployment automation.

The system evolves from a simple container deployment into a **multi-service, environment-aware, stateful architecture managed via Helm and prepared for CI/CD pipelines**.

---

## What This Project Covers

This project is not a basic tutorial. It demonstrates:

* Kubernetes fundamentals (Pods, Deployments, Services)
* Namespaces for environment isolation
* ConfigMaps and Secrets for configuration management
* Ingress for domain-based routing
* Multi-service architecture (Frontend + Backend)
* Persistent storage using PVC
* Stateful service integration (Redis)
* Helm for packaging and deployment management
* CI/CD pipeline setup for automation

---

## Architecture

```
User (Browser)
      ↓
Ingress (node.local)
      ↓
-----------------------------
|           |               |
Frontend    Backend (/api)  |
(nginx)         ↓           |
             Redis          |
               ↓            |
        Persistent Volume   |
-----------------------------
```

---

## Tech Stack

* Kubernetes (Kind - local cluster)
* Docker (containerization)
* Helm (deployment management)
* Node.js (backend service)
* Nginx (frontend)
* Redis (stateful service)
* GitHub Actions (CI/CD)
* Docker Hub (image registry)

---

## Project Structure

```
.
├── frontend/
│   ├── index.html
│   └── Dockerfile
│
├── server.js
├── Dockerfile
│
├── k8s/                # Legacy YAML (pre-Helm)
│
├── my-app/             # Helm Chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── redis.yaml
│       └── ingress.yaml
│
└── .github/workflows/
    └── deploy.yaml
```

---

## System Evolution (Important)

This project was built step-by-step to reflect real learning progression:

### Stage 1 — Basic Deployment

* Deploy nginx using Kubernetes
* Understand Pods, Deployments, Services

### Stage 2 — Custom Application

* Build Node.js app
* Containerize using Docker
* Deploy via Kubernetes

### Stage 3 — Configuration Management

* Introduced ConfigMaps
* Introduced Secrets
* Removed hardcoded values

### Stage 4 — Networking

* Exposed services via NodePort
* Implemented Ingress with domain routing

### Stage 5 — Multi-Service Architecture

* Added frontend service
* Routed traffic:

  * `/` → frontend
  * `/api` → backend

### Stage 6 — Stateful System

* Integrated Redis
* Added PersistentVolumeClaim
* Verified data persistence across pod restarts

### Stage 7 — Helm Adoption

* Replaced raw YAML with Helm templates
* Centralized configuration using `values.yaml`
* Enabled reusable deployments

### Stage 8 — CI/CD Preparation

* Built pipeline for:

  * Docker image build
  * Push to registry
  * Helm deployment

---

## Key Concepts Implemented

### 1. Namespaces

Used for environment isolation (`dev`).

### 2. ConfigMaps

Used for non-sensitive configuration:

* Example: `MESSAGE`

### 3. Secrets

Used for sensitive data:

* Example: `API_KEY`

### 4. Ingress

Provides domain-based routing:

* `node.local`
* Path-based routing (`/`, `/api`)

### 5. Persistent Volumes

Ensures data survives pod restarts.

### 6. Helm

Replaces static YAML with:

* templating
* parameterization
* reusable deployments

### 7. CI/CD

Automates:

* image builds
* deployments

---

## Running Locally (Kind)

### 1. Create Cluster (with port mapping)

```bash
kind create cluster --config kind-config.yaml
```

---

### 2. Install Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

---

### 3. Update Hosts File

```
127.0.0.1 node.local
```

---

### 4. Install via Helm

```bash
helm install my-release ./my-app -n dev --create-namespace
```

---

### 5. Access Application

```
http://node.local
```

---

## Updating the Application

Modify values:

```yaml
backend:
  replicas: 4

config:
  MESSAGE: "Updated Message"
```

Then:

```bash
helm upgrade my-release ./my-app -n dev
```

---

## CI/CD Pipeline

Pipeline triggers on push to `main`:

Steps:

1. Build Docker images
2. Push to Docker Hub
3. Deploy via Helm

---

## Important Notes

### 1. Local Cluster Limitation

CI/CD cannot directly deploy to local Kind cluster.

To fully utilize CI/CD:

* Use a cloud Kubernetes cluster (EKS/GKE/AKS)

---

### 2. Redis Deployment

Currently uses `Deployment`.

Production systems should use:

```
StatefulSet
```

---

### 3. Secrets Handling

Currently injected via Helm values.

Production systems should:

* store secrets securely
* avoid plain-text values.yaml

---

## Known Limitations

* No autoscaling (HPA)
* No readiness/liveness probes
* No TLS (HTTPS)
* No production-grade secret management
* No cloud deployment yet

---

## Future Improvements

* Convert Redis → StatefulSet
* Add HPA (Horizontal Pod Autoscaler)
* Add resource limits
* Implement TLS via cert-manager
* Deploy to AWS EKS
* Integrate full CI/CD with remote cluster

---

## Key Learnings

This project demonstrates:

* Difference between stateless and stateful systems
* Importance of configuration separation
* Real-world service communication
* Failure handling in distributed systems
* Infrastructure as code (Helm)
* Deployment automation concepts

---

## Conclusion

This repository represents a transition from:

```
Running containers
→ Managing systems
→ Designing infrastructure
```

It covers the core concepts required to understand and operate Kubernetes in real-world scenarios.

---

