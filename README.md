# 🌱 PlantScope: AI-Powered Plant Disease Detection

**🌍 Live Demo:** [https://plant-scope.vercel.app/](https://plant-scope.vercel.app/)

PlantScope is a high-performance, production-ready AI platform designed to help farmers and agronomists instantly diagnose plant diseases. Built with a modern **FastAPI** backend and a premium **React** frontend, it leverages a **Convolutional Neural Network (CNN)** trained in PyTorch to classify leaf images into 39 different categories with extreme precision.

---

## ✨ Key Features
- **Instant Diagnosis:** Sub-second inference for 39 disease classes across 14 crops.
- **Premium UI/UX:** A high-contrast, interactive dashboard inspired by modern SaaS aesthetics (Linear/Vercel).
- **Hybrid Input:** Support for high-resolution image uploads and live camera capture.
- **DevOps Ready:** Fully containerized with Docker and orchestrated with Kubernetes (Minikube).
- **Comprehensive Insights:** Detailed etiology and remediation protocols for every diagnosis.

---

## 🛠 Tech Stack
- **Orchestration:** Docker, Docker Compose, Kubernetes.

---

## 🧠 AI Model & Dataset

### Convolutional Neural Network (CNN)
The core of PlantScope is a custom-built **Convolutional Neural Network** implemented in **PyTorch**. The architecture is optimized for high-dimensional feature extraction from leaf patterns:
- **Input Layer:** Accepts $224 \times 224$ RGB images.
- **Feature Extraction:** Multiple convolutional blocks with Batch Normalization and Max-Pooling to capture intricate disease symptoms like lesions, rust, and chlorosis.
- **Output:** A Softmax-activated fully connected layer classifying inputs into **39 distinct categories**.
- **Performance:** Achieves high validation accuracy on diverse environmental conditions.

### Dataset: PlantVillage
The model was trained on the world-renowned **PlantVillage Dataset**, a gold standard for agricultural computer vision:
- **Total Images:** ~54,305 images of healthy and infected plant leaves.
- **Species Covered:** 14 different crops (Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato).
- **Disease Classes:** 38 specific disease states + 1 healthy category (Total 39).
- **Dataset Access:** You can find the dataset on [Kaggle: PlantVillage Dataset](https://www.kaggle.com/datasets/emmareed/plantvillage-dataset) or the original [PlantVillage GitHub](https://github.com/spMohanty/PlantVillage-Dataset).

---

## 🚀 Getting Started

### ☁️ Cloud Deployment (Vercel & Hugging Face)
The platform is optimized for a split-deployment architecture for maximum performance and cost-efficiency:
1. **Frontend (Vercel)**: Deploy the `AI_Platform/frontend` directory directly to Vercel. Vercel automatically detects the Vite framework and builds the optimized React SPA.
2. **Backend (Hugging Face Spaces)**: Create a Docker Space on Hugging Face and push the `AI_Platform` directory. Hugging Face provides 16GB of free RAM, perfect for loading the 210MB PyTorch model.
3. **Connectivity**: Update `AI_Platform/frontend/vercel.json` with your Hugging Face Space URL to automatically proxy API requests and avoid CORS.

---

### 1. Run Locally with Docker (Recommended)
The easiest way to launch the platform is using Docker Compose:
```bash
cd AI_Platform
docker-compose up -d --build
```
The app will be available at **http://localhost:8000**.

### 2. Run with Kubernetes
If you have Minikube or a K8s cluster running:
```bash
cd AI_Platform
kubectl apply -f k8s/
```

### 3. Local Development
1. **Requirements:** Python 3.8, Node.js 18+.
2. **Backend Setup:**
   ```bash
   cd AI_Platform/backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
3. **Frontend Setup:**
   ```bash
   cd AI_Platform/frontend
   npm install
   npm run dev
   ```

---

## 📂 Project Structure
- `/AI_Platform/backend`: FastAPI server, AI inference services, and modular API structure.
- `/AI_Platform/frontend`: Modern React SPA with Framer Motion animations.
- `/AI_Platform/k8s`: Kubernetes manifests (Deployment, Service, Ingress).
- `plant_disease_model_1_latest.pt`: The trained PyTorch model weights (~210MB).
- `disease_info.csv`: Dataset containing diagnosis descriptions and treatment steps.

---

## 📸 Platform Preview
The platform features a **High-Contrast Mixed Design**:
- **Landing Page:** Ultra-clean light mode with interactive floating UI elements.
- **Diagnostic Engine:** Cinematic dark mode dashboard for immersive analysis.

---

## 🤝 Contribution
This project is open-source. We welcome contributions to:
- Enhance the CNN model's accuracy.
- Add support for more crop species.
- Improve the UI/UX micro-interactions.

---

## 📝 License & Original Work
Original Research & Model: [Plant Disease Detection using CNN and PyTorch](https://medium.com/analytics-vidhya/plant-disease-detection-using-convolutional-neural-networks-and-pytorch-87c00c54c88f)
