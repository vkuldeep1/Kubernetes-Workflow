# ERROR.md — Kubernetes Local Setup (WSL + Docker Desktop + kind)

This document records all errors encountered, their root causes, and fixes while setting up Kubernetes locally.

--- 

# System Architecture (Local Setup)

[ Your App ]
     ↓
[ Kubernetes (kind) ]
     ↓
[ Docker Containers ]
     ↓
[ Docker Desktop VM ]
     ↓
[ WSL (Ubuntu) ]
     ↓
[ Windows Host ]

---

# Debugging Rule

kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>

---

# ERROR 1 — DNS Failure (TLS Handshake Timeout)

Symptom:
TLS handshake timeout

Cause:
Broken DNS in WSL.

Fix:
Set Docker DNS:
{
  "dns": ["1.1.1.1", "8.8.8.8"]
}

Restart Docker.

---

# ERROR 2 — kind Exists but kubectl Fails

Cause:
Cluster metadata exists but container is not running.

Fix:
kind delete cluster
kind create cluster

---

# ERROR 3 — ImagePullBackOff

Cause:
Docker networking/DNS failure.

Fix:
Fix DNS → recreate cluster.

---

# ERROR 4 — NodePort Not Accessible

Cause:
NodePort runs inside Docker, not localhost.

Fix:
kubectl port-forward service/node-service 3000:3000

---

# ERROR 5 — ErrImageNeverPull

Cause:
imagePullPolicy: Never and image not in cluster.

Fix:
kind load docker-image demo-node-app:latest

---

# ERROR 6 — kind load failure

Cause:
Corrupted Docker state.

Fix:
docker system prune -a
recreate cluster

---

# ERROR 7 — App Crash

Cause:
Code bug (server.list instead of listen).

Fix:
Fix code, rebuild image.

---

# ERROR 8 — kubectl apply errors

Fix:
kubectl apply -f file.yaml

---

# ERROR 9 — Docker conflict

Cause:
WSL Docker + Docker Desktop both running.

Fix:
Disable WSL Docker.

---

# ERROR 10 — Cluster disappears

Cause:
kind is ephemeral.

Fix:
Recreate cluster.

---

# ERROR 11 — Multiple deployments

Fix:
kubectl get deployments
kubectl delete deployment <name>

---

# Best Practices

- Use declarative configs
- Use port-forward locally
- Use registry for production
- Debug bottom-up

---

# Final Commands

kind create cluster
kubectl apply -f .
kubectl port-forward service/node-service 3000:3000
