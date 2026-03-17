# Kubernetes Learning & Deployment Project

## Overview

This repository demonstrates a complete, end-to-end workflow for deploying applications using Kubernetes. It covers the full lifecycle:

* Creating a local Kubernetes cluster
* Deploying applications using both imperative and declarative approaches
* Understanding Kubernetes core components
* Building and deploying a custom containerized application
* Exposing services and verifying application behavior

The purpose of this project is to move from zero Kubernetes knowledge to a practical, working understanding of how real-world deployments operate.

---

## Objectives

This project was built with the following goals:

* Understand how Kubernetes manages containers
* Learn the difference between imperative and declarative workflows
* Deploy and scale applications reliably
* Build and deploy a custom Dockerized application
* Understand how services expose applications
* Establish a foundation for production-level Kubernetes usage

---

## Tech Stack

* **Kubernetes (Kind)** – Local cluster setup
* **Docker** – Containerization
* **kubectl** – Kubernetes CLI
* **Node.js** – Sample application
* **WSL (Linux environment)** – Development environment

---

## Project Structure

```
.
├── demo-app/
│   ├── server.js
│   └── Dockerfile
│
├── k8s/
│   ├── deployment.yaml
│   ├── service.yml
│   ├── app-deployment.yaml
│   └── app-service.yaml
│
└── README.md
```

---

## Architecture Overview

```
User (Browser)
      ↓
Port Forward / NodePort
      ↓
Kubernetes Service
      ↓
Load Balancing
   ├── Pod
   ├── Pod
   └── Pod
      ↓
Application Containers
```

---

## Step-by-Step Workflow

### 1. Cluster Setup

A local Kubernetes cluster was created using **Kind** (Kubernetes in Docker).

```bash
kind create cluster
kubectl get nodes
```

Purpose:

* Provides a lightweight, local Kubernetes environment
* Simulates real cluster behavior without cloud dependency

---

### 2. Initial Deployment (Imperative Approach)

```bash
kubectl create deployment web --image=nginx
kubectl scale deployment web --replicas=3
```

Purpose:

* Understand how Kubernetes creates and manages workloads
* Learn internal hierarchy:

  ```
  Deployment → ReplicaSet → Pod → Container
  ```

---

### 3. Service Exposure

```bash
kubectl expose deployment web --type=NodePort --port=80
```

Purpose:

* Provide a stable access point to pods
* Enable load balancing across multiple replicas

---

### 4. Transition to Declarative (YAML)

All resources were then defined using YAML:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yml
```

Purpose:

* Infrastructure as Code (IaC)
* Version control and reproducibility
* Industry-standard deployment method

---

## Kubernetes Concepts Used

### 1. Deployment

Defines desired state of application:

* Number of replicas
* Container image
* Update strategy

### 2. ReplicaSet

Ensures the specified number of pods are always running.

### 3. Pod

Smallest deployable unit:

* Contains one or more containers
* Has its own lifecycle and IP

### 4. Service

Provides:

* Stable networking
* Load balancing
* Service discovery

---

## Custom Application Deployment

### 1. Application Code

A simple Node.js HTTP server:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from Kubernetes\n");
});

server.listen(3000);
```

---

### 2. Dockerization

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
```

---

### 3. Build Image

```bash
docker build -t demo-node-app .
```

---

### 4. Load Image into Kind

```bash
kind load docker-image demo-node-app
```

Reason:

* Kind runs its own internal container environment
* Local images must be explicitly loaded

---

### 5. Kubernetes Deployment (Custom App)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: demo-node-app
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
```

---

### 6. Service for Custom App

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  selector:
    app: node-app
  ports:
    - port: 3000
      targetPort: 3000
  type: NodePort
```

---

### 7. Access Application

```bash
kubectl port-forward service/node-service 8081:3000
```

Visit:

```
http://localhost:8081
```

---

## Key Learnings

### 1. Declarative vs Imperative

* Imperative: quick, not reproducible
* Declarative: scalable, version-controlled, production-ready

---

### 2. Self-Healing

Kubernetes automatically replaces failed pods:

```bash
kubectl delete pod <pod-name>
```

---

### 3. Scaling

```bash
kubectl scale deployment node-app --replicas=3
```

---

### 4. Rolling Updates

Updating image triggers zero-downtime deployment:

```bash
kubectl apply -f deployment.yaml
```

---

### 5. Separation of Concerns

* Application → Docker
* Deployment → Kubernetes YAML
* Networking → Service

---

## Common Commands

```bash
kubectl get pods
kubectl get deployments
kubectl get services

kubectl describe pod <name>
kubectl logs <pod>
kubectl exec -it <pod> -- bash

kubectl apply -f <file>
kubectl delete -f <file>

kubectl scale deployment <name> --replicas=3
```

---

## Current Limitations

This project does NOT yet include:

* Ingress (external HTTP routing)
* ConfigMaps (configuration management)
* Secrets (sensitive data handling)
* Persistent storage
* Multi-service architecture
* CI/CD pipelines
* Cloud deployment

---

## Future Improvements

Planned next steps:

* Add Ingress controller
* Introduce environment variables via ConfigMaps
* Use Secrets for credentials
* Deploy multi-service architecture (frontend + backend + DB)
* Integrate CI/CD pipeline
* Deploy to cloud Kubernetes (EKS / GKE / AKS)

---

## Conclusion

This project establishes a working foundation in Kubernetes by covering:

* Cluster setup
* Application deployment
* Service exposure
* Scaling and self-healing
* Custom application containerization

It represents a transition from basic container usage to structured, orchestrated deployments.

---

## Author Notes

This repository is intentionally structured as a learning-to-production bridge.

The focus is not just running Kubernetes, but understanding:

* why each component exists
* how they interact
* how real systems are designed

---
