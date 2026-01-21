# 🌍 DisasterDetection – AI-Based Disaster Classification & Response System

DisasterDetection is an end-to-end **AI-powered disaster analysis system** that uses **Deep Learning (CNN)** and **Object Detection (YOLOv8)** to identify disasters from images and provide meaningful emergency insights.

The system allows users to upload or capture disaster images and instantly receive:
- Disaster type prediction
- Confidence score
- Severity assessment
- Emergency response suggestions
- Detected objects in the scene

---

## 🚀 Features

- 🧠 **CNN-based Disaster Classification**
- 👁️ **YOLOv8 Object Detection**
- ⚡ **Real-time Image Analysis**
- 📷 **Camera Capture Support**
- 🆘 **Severity & Emergency Response Suggestions**
- 🌐 **REST API with Flask**
- 🖥️ **Modern React Frontend UI**
- 🔄 **CORS Enabled for Frontend–Backend Communication**

---


---

## 🧠 AI Models Used

### 1️⃣ Disaster Classification (CNN)
- Framework: **TensorFlow / Keras**
- Input Size: `224 x 224`
- Output: Disaster class + confidence score
- Model trained manually on disaster image datasets

### 2️⃣ Object Detection
- Model: **YOLOv8 (Ultralytics)**
- Detects objects such as people, damage indicators, vehicles, etc.

---

## 🧪 Disaster Classes (Example)

- Fire
- Flood
- Earthquake
- Human Damage
- Land Damage
- No Damage

> Classes are loaded dynamically from `labels.txt`

---

## 🌐 Backend API Endpoints

Base URL:
http://localhost:5000


Returns:
- Disaster classification
- Confidence score
- Severity assessment
- Emergency response actions
- Detected objects

---

## 🖥️ Frontend Features

- Image upload (drag & drop)
- Live camera capture
- Full / partial analysis buttons
- Real-time result visualization
- Emergency response UI cards
- System health indicator

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
pip install flask flask-cors tensorflow pillow numpy ultralytics
python app.py
```
### FrontEnd Setup
npm install
npm run dev
