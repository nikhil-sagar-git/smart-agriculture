from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# =====================================================
# LAZY MODEL LOADING (IMPORTANT FOR RENDER)
# =====================================================

cropmodel = None
fertilizermodel = None

def load_models():
    global cropmodel, fertilizermodel

    if cropmodel is None:
        cropmodel = joblib.load("cropRecommendation.pkl")

    if fertilizermodel is None:
        fertilizermodel = joblib.load("FertilizerRecommendation.pkl")


# =====================================================
# LABELS
# =====================================================

crop_labels = [
    'apple','banana','blackgram','chickpea','coconut','coffee','cotton',
    'grapes','jute','kidneybeans','lentil','maize','mango','mothbeans',
    'mungbean','muskmelon','orange','papaya','pigeonpeas','pomegranate',
    'rice','watermelon'
]

labels_fertilizer = [
    'Balanced NPK Fertilizer','Compost','DAP','General Purpose Fertilizer',
    'Gypsum','Lime','Muriate of Potash','Organic Fertilizer','Urea',
    'Water Retaining Fertilizer'
]

crop_dict = {
    0: "Adzuki Beans",1: "Black gram",2: "Chickpea",3: "Coconut",
    4: "Coffee",5: "Cotton",6: "Ground Nut",7: "Jute",
    8: "Kidney Beans",9: "Lentil",10: "Moth Beans",11: "Mung Bean",
    12: "Peas",13: "Pigeon Peas",14: "Rubber",15: "Sugarcane",
    16: "Tea",17: "Tobacco",18: "apple",19: "banana",20: "grapes",
    21: "maize",22: "mango",23: "millet",24: "muskmelon",
    25: "orange",26: "papaya",27: "pomegranate",
    28: "rice",29: "watermelon",30: "wheat"
}

# =====================================================
# CROP PREDICTION
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():
    try:
        load_models()

        data = request.json

        features = np.array([[
            float(data["nitrogen"]),
            float(data["phosporous"]),
            float(data["potash"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]])

        prediction = cropmodel.predict(features)[0]
        crop_name = crop_labels[prediction]

        return jsonify({"crop": crop_name})

    except Exception as e:
        return jsonify({"error": str(e)})


# =====================================================
# FERTILIZER PREDICTION
# =====================================================

@app.route("/predictfertilizer", methods=["POST"])
def predictfertilizer():
    try:
        load_models()

        data = request.json

        cropdata = list(crop_dict.keys())[
            list(crop_dict.values()).index(data["Crop"])
        ]

        features = np.array([[
            float(data["PH"]),
            float(data["Nitrogen"]),
            float(data["Phosphorous"]),
            float(data["Potassium"]),
            float(data["Temperature"]),
            float(data["Rainfall"]),
            float(data["Moisture"]),
            float(cropdata)
        ]])

        prediction = fertilizermodel.predict(features)[0]
        fertilizername = labels_fertilizer[prediction]

        remark = "Suitable for general use across various soil and crop types."

        if fertilizername == "Compost":
            remark = "Improves soil structure and organic matter."
        elif fertilizername == "Urea":
            remark = "High nitrogen for leafy growth."
        elif fertilizername == "DAP":
            remark = "Supports root development with phosphorus."
        elif fertilizername == "Lime":
            remark = "Neutralizes acidic soil."
        elif fertilizername == "Gypsum":
            remark = "Improves soil structure and reduces salinity."

        return jsonify({
            "fertilizername": fertilizername,
            "remark": remark
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# =====================================================
# START SERVER (RENDER SAFE)
# =====================================================

if __name__ == "__main__":
    print("Server starting...")

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)