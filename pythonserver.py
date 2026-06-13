from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# =====================================================
# LOAD MODELS
# =====================================================

cropmodel = joblib.load(
    "cropRecommendation.pkl"
)

fertilizermodel = joblib.load(
    "FertilizerRecommendation.pkl"
)

# =====================================================
# CROP LABELS
# =====================================================

crop_labels = [

    'apple',
    'banana',
    'blackgram',
    'chickpea',
    'coconut',
    'coffee',
    'cotton',
    'grapes',
    'jute',
    'kidneybeans',
    'lentil',
    'maize',
    'mango',
    'mothbeans',
    'mungbean',
    'muskmelon',
    'orange',
    'papaya',
    'pigeonpeas',
    'pomegranate',
    'rice',
    'watermelon'

]

# =====================================================
# FERTILIZER LABELS
# =====================================================

labels_fertilizer = [

    'Balanced NPK Fertilizer',
    'Compost',
    'DAP',
    'General Purpose Fertilizer',
    'Gypsum',
    'Lime',
    'Muriate of Potash',
    'Organic Fertilizer',
    'Urea',
    'Water Retaining Fertilizer'

]

# =====================================================
# CROP DICTIONARY
# =====================================================

crop_dict = {

    0: "Adzuki Beans",
    1: "Black gram",
    2: "Chickpea",
    3: "Coconut",
    4: "Coffee",
    5: "Cotton",
    6: "Ground Nut",
    7: "Jute",
    8: "Kidney Beans",
    9: "Lentil",
    10: "Moth Beans",
    11: "Mung Bean",
    12: "Peas",
    13: "Pigeon Peas",
    14: "Rubber",
    15: "Sugarcane",
    16: "Tea",
    17: "Tobacco",
    18: "apple",
    19: "banana",
    20: "grapes",
    21: "maize",
    22: "mango",
    23: "millet",
    24: "muskmelon",
    25: "orange",
    26: "papaya",
    27: "pomegranate",
    28: "rice",
    29: "watermelon",
    30: "wheat"

}

# =====================================================
# CROP RECOMMENDATION API
# =====================================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

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

        prediction = cropmodel.predict(
            features
        )[0]

        crop_name = crop_labels[
            prediction
        ]

        return jsonify({

            "crop": crop_name

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# =====================================================
# FERTILIZER RECOMMENDATION API
# =====================================================

@app.route(
    "/predictfertilizer",
    methods=["POST"]
)
def predictfertilizer():

    try:

        data = request.json

        # =============================================
        # CONVERT CROP NAME TO LABELENCODER NUMBER
        # =============================================

        cropdata = list(crop_dict.keys())[
            list(crop_dict.values()).index(
                data["Crop"]
            )
        ]

        # =============================================
        # FEATURE ORDER MUST MATCH TRAINING
        # =============================================

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

        # =============================================
        # PREDICTION
        # =============================================

        prediction = fertilizermodel.predict(
            features
        )[0]

        fertilizername = labels_fertilizer[
            prediction
        ]

        # =============================================
        # REMARKS
        # =============================================

        remark = ""

        if fertilizername == "Compost":

            remark = (
                "Enhances organic matter and improves soil structure. "
                "Prefer this for low-carbon soils to boost soil health naturally."
            )

        elif fertilizername == "Balanced NPK Fertilizer":

            remark = (
                "Provides a balanced mix of nitrogen, phosphorus, and potassium for loamy soils. "
                "Prefer this for general-purpose fertilization in well-structured soils."
            )

        elif fertilizername == "Water Retaining Fertilizer":

            remark = (
                "Improves water retention in dry soils. "
                "Prefer this for soils with low moisture to prevent water stress in plants."
            )

        elif fertilizername == "Organic Fertilizer":

            remark = (
                "Enhances fertility naturally, ideal for peaty soils. "
                "Prefer this to improve soil fertility while maintaining organic farming practices."
            )

        elif fertilizername == "Gypsum":

            remark = (
                "Corrects alkaline soil, adds calcium and sulfur. "
                "Prefer this to lower soil pH and enhance soil structure."
            )

        elif fertilizername == "Lime":

            remark = (
                "Neutralizes acidic soil and improves pH balance. "
                "Prefer this to correct low soil pH, improving nutrient availability."
            )

        elif fertilizername == "DAP":

            remark = (
                "Rich in phosphorus, essential for root development. "
                "Prefer this for phosphorus-deficient soils to improve plant establishment."
            )

        elif fertilizername == "Urea":

            remark = (
                "Provides high nitrogen, ideal for rapid leafy growth. "
                "Prefer this for nitrogen-deficient soils as it supports vegetative growth."
            )

        elif fertilizername == "Muriate of Potash":

            remark = (
                "High potassium content, improves fruit and flower quality. "
                "Prefer this for potassium-deficient soils to enhance crop productivity."
            )

        else:

            remark = (
                "Suitable for general use across various soil and crop types. "
                "Prefer this when no specific deficiency is detected."
            )

        # =============================================
        # RETURN RESPONSE
        # =============================================

        return jsonify({

            "fertilizername": fertilizername,
            "remark": remark

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# =====================================================

if __name__ == "__main__":

    print("running")

    app.run(debug=True)