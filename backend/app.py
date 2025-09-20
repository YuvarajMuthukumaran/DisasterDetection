import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
from ultralytics import YOLO # Import YOLO

# -------------------------------------
# 1. SETUP AND CONFIGURATION
# -------------------------------------

app = Flask(__name__)
CORS(app)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# -------------------------------------
# 2. LOAD AI MODELS AND LABELS
# -------------------------------------

# === LOAD CLASSIFICATION MODEL (KERAS) ===
CLASSIFICATION_MODEL_PATH = 'model/keras_model.h5'
LABELS_PATH = 'model/labels.txt'

print("Loading Keras classification model...")
classification_model = tf.keras.models.load_model(CLASSIFICATION_MODEL_PATH, compile=False)
print("Keras model loaded successfully.")

print("Loading classification labels...")
with open(LABELS_PATH, 'r') as f:
    class_labels = [line.strip().split(' ', 1)[1] for line in f]
print(f"Labels loaded: {class_labels}")

# === LOAD OBJECT DETECTION MODEL (YOLO) ===
DETECTION_MODEL_PATH = 'model/yolov8n.pt'
print("Loading YOLO object detection model...")
detection_model = YOLO(DETECTION_MODEL_PATH)
print("YOLO model loaded successfully.")


# -------------------------------------
# 3. HELPER FUNCTIONS
# -------------------------------------

def preprocess_image_for_classification(image_bytes):
    """ Prepares an image for the Keras classification model. """
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    return np.expand_dims(normalized_image_array, axis=0)

def generate_mock_response(predicted_class):
    """ Generates a mock response for severity, emergency actions, etc. (No changes needed here) """
    disaster_type = predicted_class.lower().replace(' ', '')
    # This mock_data dictionary remains the same as before.
    mock_data = {
        "fire": {"severity": {"level": "High", "priority": "Immediate", "risk_factors": ["Spreading rapidly"]}, "response": {"immediate_actions": ["Evacuate immediately."], "emergency_contacts": ["Fire Brigade: 101"], "resources_needed": ["Water tankers"]}},
        "humandamage": {"severity": {"level": "Critical", "priority": "Immediate", "risk_factors": ["Multiple casualties"]}, "response": {"immediate_actions": ["Call ambulance (108)."], "emergency_contacts": ["Ambulance: 108"], "resources_needed": ["Medical teams"]}},
        "earthquake": {"severity": {"level": "High", "priority": "Urgent", "risk_factors": ["Aftershocks possible"]}, "response": {"immediate_actions": ["Drop, Cover, Hold On."], "emergency_contacts": ["NDMA: 011-26701728"], "resources_needed": ["Rescue teams"]}},
        "landdamage": {"severity": {"level": "Medium", "priority": "Urgent", "risk_factors": ["Unstable ground"]}, "response": {"immediate_actions": ["Evacuate from the area."], "emergency_contacts": ["District Collector's Office"], "resources_needed": ["Heavy machinery"]}},
        "nodamage": {"severity": {"level": "Low", "priority": "Standard", "risk_factors": ["None apparent"]}, "response": {"immediate_actions": ["Situation appears safe."], "emergency_contacts": ["Local police non-emergency"], "resources_needed": ["None"]}},
        "flood": {"severity": {"level": "High", "priority": "Urgent", "risk_factors": ["Rising water levels"]}, "response": {"immediate_actions": ["Move to higher ground."], "emergency_contacts": ["Disaster Management: 108"], "resources_needed": ["Rescue boats"]}}
    }
    disaster_info = mock_data.get(disaster_type, {"severity": {"level": "Unknown", "priority": "Standard"}, "response": {"immediate_actions": ["Stay calm."]}})
    return disaster_info['severity'], disaster_info['response']

# -------------------------------------
# 4. API ENDPOINTS
# -------------------------------------

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/classify', methods=['POST'])
def classify_image_endpoint():
    """ Endpoint for classification ONLY. """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    file = request.files['image']
    try:
        data = preprocess_image_for_classification(file.read())
        prediction = classification_model.predict(data)
        predicted_index = np.argmax(prediction)
        confidence = float(prediction[0][predicted_index])
        predicted_class = class_labels[predicted_index]
        return jsonify({"disaster_classification": {"predicted_class": predicted_class, "confidence": confidence}})
    except Exception as e:
        return jsonify({"error": f"Classification failed: {str(e)}"}), 500

@app.route('/detect', methods=['POST'])
def detect_objects_endpoint():
    """ Endpoint for object detection ONLY. """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    file = request.files['image']
    try:
        # The YOLO model can take a PIL Image directly
        image = Image.open(file.stream).convert("RGB")
        results = detection_model(image)
        
        detected_objects = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                detected_objects.append({
                    "class": detection_model.names[class_id],
                    "confidence": float(box.conf[0]),
                    "box": box.xyxy[0].tolist() # [x1, y1, x2, y2]
                })
        return jsonify({"object_detection": {"detected_objects": detected_objects}})
    except Exception as e:
        return jsonify({"error": f"Object detection failed: {str(e)}"}), 500

@app.route('/analyze', methods=['POST'])
def full_analysis():
    """ Performs BOTH classification and object detection. """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    image_bytes = file.read() # Read file bytes once for both models
    
    try:
        # --- 1. Classification ---
        class_data = preprocess_image_for_classification(image_bytes)
        prediction = classification_model.predict(class_data)
        predicted_index = np.argmax(prediction)
        confidence = float(prediction[0][predicted_index])
        predicted_class = class_labels[predicted_index]
        classification_result = {"predicted_class": predicted_class, "confidence": confidence}

        # --- 2. Object Detection ---
        image_for_detection = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        detection_results = detection_model(image_for_detection)
        detected_objects = []
        for result in detection_results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                detected_objects.append({
                    "class": detection_model.names[class_id],
                    "confidence": float(box.conf[0]),
                    "box": box.xyxy[0].tolist()
                })
        detection_result = {"detected_objects": detected_objects}

        # --- 3. Generate Mock Response ---
        severity, response = generate_mock_response(predicted_class)
        
        # --- 4. Combine all results ---
        return jsonify({
            "disaster_classification": classification_result,
            "severity_assessment": severity,
            "emergency_response": response,
            "object_detection": detection_result
        })
    except Exception as e:
        return jsonify({"error": f"Full analysis failed: {str(e)}"}), 500

# -------------------------------------
# 5. RUN THE FLASK APP
# -------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)