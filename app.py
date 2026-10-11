# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import numpy as np
# import os

# app = Flask(__name__)
# CORS(app)

# # =====================================================
# # LAZY MODEL LOADING (IMPORTANT FOR RENDER)
# # =====================================================

# cropmodel = None
# fertilizermodel = None

# def load_models():
#     global cropmodel, fertilizermodel

#     if cropmodel is None:
#         cropmodel = joblib.load("cropRecommendation.pkl")

#     if fertilizermodel is None:
#         fertilizermodel = joblib.load("FertilizerRecommendation.pkl")


# # =====================================================
# # LABELS
# # =====================================================

# crop_labels = [
#     'apple','banana','blackgram','chickpea','coconut','coffee','cotton',
#     'grapes','jute','kidneybeans','lentil','maize','mango','mothbeans',
#     'mungbean','muskmelon','orange','papaya','pigeonpeas','pomegranate',
#     'rice','watermelon'
# ]

# labels_fertilizer = [
#     'Balanced NPK Fertilizer','Compost','DAP','General Purpose Fertilizer',
#     'Gypsum','Lime','Muriate of Potash','Organic Fertilizer','Urea',
#     'Water Retaining Fertilizer'
# ]

# crop_dict = {
#     0: "Adzuki Beans",1: "Black gram",2: "Chickpea",3: "Coconut",
#     4: "Coffee",5: "Cotton",6: "Ground Nut",7: "Jute",
#     8: "Kidney Beans",9: "Lentil",10: "Moth Beans",11: "Mung Bean",
#     12: "Peas",13: "Pigeon Peas",14: "Rubber",15: "Sugarcane",
#     16: "Tea",17: "Tobacco",18: "apple",19: "banana",20: "grapes",
#     21: "maize",22: "mango",23: "millet",24: "muskmelon",
#     25: "orange",26: "papaya",27: "pomegranate",
#     28: "rice",29: "watermelon",30: "wheat"
# }

# # =====================================================
# # CROP PREDICTION
# # =====================================================

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         load_models()

#         data = request.json

#         features = np.array([[
#             float(data["nitrogen"]),
#             float(data["phosporous"]),
#             float(data["potash"]),
#             float(data["temperature"]),
#             float(data["humidity"]),
#             float(data["ph"]),
#             float(data["rainfall"])
#         ]])

#         prediction = cropmodel.predict(features)[0]
#         crop_name = crop_labels[prediction]

#         return jsonify({"crop": crop_name})

#     except Exception as e:
#         return jsonify({"error": str(e)})


# # =====================================================
# # FERTILIZER PREDICTION
# # =====================================================

# @app.route("/predictfertilizer", methods=["POST"])
# def predictfertilizer():
#     try:
#         load_models()

#         data = request.json

#         cropdata = list(crop_dict.keys())[
#             list(crop_dict.values()).index(data["Crop"])
#         ]

#         features = np.array([[
#             float(data["PH"]),
#             float(data["Nitrogen"]),
#             float(data["Phosphorous"]),
#             float(data["Potassium"]),
#             float(data["Temperature"]),
#             float(data["Rainfall"]),
#             float(data["Moisture"]),
#             float(cropdata)
#         ]])

#         prediction = fertilizermodel.predict(features)[0]
#         fertilizername = labels_fertilizer[prediction]

#         remark = "Suitable for general use across various soil and crop types."

#         if fertilizername == "Compost":
#             remark = "Improves soil structure and organic matter."
#         elif fertilizername == "Urea":
#             remark = "High nitrogen for leafy growth."
#         elif fertilizername == "DAP":
#             remark = "Supports root development with phosphorus."
#         elif fertilizername == "Lime":
#             remark = "Neutralizes acidic soil."
#         elif fertilizername == "Gypsum":
#             remark = "Improves soil structure and reduces salinity."

#         return jsonify({
#             "fertilizername": fertilizername,
#             "remark": remark
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)})


# # =====================================================
# # START SERVER (RENDER SAFE)
# # =====================================================

# if __name__ == "__main__":
#     print("Server starting...")

#     port = int(os.environ.get("PORT", 5000))
#     app.run(host="0.0.0.0", port=port)



from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

import joblib
import numpy as np
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# For production, restrict CORS to your actual frontend domain.
# Example:
# CORS(app, resources={r"/*": {"origins": ["https://your-site.vercel.app"]}})


# =====================================================
# LAZY MODEL LOADING
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
    'apple', 'banana', 'blackgram', 'chickpea', 'coconut',
    'coffee', 'cotton', 'grapes', 'jute', 'kidneybeans',
    'lentil', 'maize', 'mango', 'mothbeans', 'mungbean',
    'muskmelon', 'orange', 'papaya', 'pigeonpeas',
    'pomegranate', 'rice', 'watermelon'
]

labels_fertilizer = [
    'Balanced NPK Fertilizer', 'Compost', 'DAP',
    'General Purpose Fertilizer', 'Gypsum', 'Lime',
    'Muriate of Potash', 'Organic Fertilizer', 'Urea',
    'Water Retaining Fertilizer'
]

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
# EXISTING CROP PREDICTION LOGIC
# =====================================================

def get_crop_prediction(data):
    load_models()

    features = np.array([[
        float(data["nitrogen"]),
        float(data["phosporous"]),
        float(data["potash"]),
        float(data["temperature"]),
        float(data["humidity"]),
        float(data["ph"]),
        float(data["rainfall"])
    ]])

    prediction = int(cropmodel.predict(features)[0])

    if not 0 <= prediction < len(crop_labels):
        raise ValueError("Invalid crop prediction returned by model")

    return {"crop": crop_labels[prediction]}


# =====================================================
# EXISTING FERTILIZER PREDICTION LOGIC
# =====================================================

def get_fertilizer_prediction(data):
    load_models()

    crop_name = data["Crop"]

    try:
        cropdata = list(crop_dict.keys())[
            list(crop_dict.values()).index(crop_name)
        ]
    except ValueError:
        raise ValueError(
            f"Unsupported crop name: {crop_name}"
        )

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

    prediction = int(fertilizermodel.predict(features)[0])

    if not 0 <= prediction < len(labels_fertilizer):
        raise ValueError("Invalid fertilizer prediction returned by model")

    fertilizername = labels_fertilizer[prediction]

    remark = (
        "Suitable for general use across various soil "
        "and crop types."
    )

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

    return {
        "fertilizername": fertilizername,
        "remark": remark
    }


# =====================================================
# EXISTING CROP ENDPOINT
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True) or {}
        result = get_crop_prediction(data)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# =====================================================
# EXISTING FERTILIZER ENDPOINT
# =====================================================

@app.route("/predictfertilizer", methods=["POST"])
def predictfertilizer():
    try:
        data = request.get_json(silent=True) or {}
        result = get_fertilizer_prediction(data)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# =====================================================
# LLM API CONFIGURATION
# =====================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL")

groq_client = (
    Groq(api_key=GROQ_API_KEY)
    if GROQ_API_KEY
    else None
)

SYSTEM_PROMPT = """
You are the Smart AI Agriculture Assistant.

Help farmers with:
- Crop recommendations
- Fertilizer recommendations
- Soil nutrients and soil pH
- Irrigation and farming practices
- General plant disease questions

You have two tools:
1. predict_crop
2. predict_fertilizer

Rules:
- Use predict_crop when the user wants a crop prediction
  and has provided every required crop input.
- Crop inputs are nitrogen, phosporous, potash,
  temperature, humidity, ph and rainfall.
- Use predict_fertilizer when the user wants a fertilizer
  prediction and has provided every required input.
- Fertilizer inputs are PH, Nitrogen, Phosphorous,
  Potassium, Temperature, Rainfall, Moisture and Crop.
- Do not invent, assume or silently fill in missing values.
- If inputs are missing, ask the user for them.
- Use tool results as the source of model predictions.
- Explain results in simple language.
- Never claim that you ran a disease detection model
  or checked live weather because those tools are not available.
- Clearly distinguish general guidance from model predictions.
"""


# =====================================================
# LLM TOOL DEFINITIONS
# =====================================================

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "predict_crop",
            "description": (
                "Predict a suitable crop using the existing "
                "crop machine learning model."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "nitrogen": {
                        "type": "number",
                        "description": "Soil nitrogen value"
                    },
                    "phosporous": {
                        "type": "number",
                        "description": "Soil phosphorus value; use this exact spelling"
                    },
                    "potash": {
                        "type": "number",
                        "description": "Soil potassium value"
                    },
                    "temperature": {"type": "number"},
                    "humidity": {"type": "number"},
                    "ph": {"type": "number"},
                    "rainfall": {"type": "number"}
                },
                "required": [
                    "nitrogen",
                    "phosporous",
                    "potash",
                    "temperature",
                    "humidity",
                    "ph",
                    "rainfall"
                ],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "predict_fertilizer",
            "description": (
                "Predict a fertilizer using the existing "
                "fertilizer machine learning model."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "PH": {"type": "number"},
                    "Nitrogen": {"type": "number"},
                    "Phosphorous": {"type": "number"},
                    "Potassium": {"type": "number"},
                    "Temperature": {"type": "number"},
                    "Rainfall": {"type": "number"},
                    "Moisture": {"type": "number"},
                    "Crop": {
                        "type": "string",
                        "enum": list(crop_dict.values())
                    }
                },
                "required": [
                    "PH",
                    "Nitrogen",
                    "Phosphorous",
                    "Potassium",
                    "Temperature",
                    "Rainfall",
                    "Moisture",
                    "Crop"
                ],
                "additionalProperties": False
            }
        }
    }
]


# =====================================================
# CHAT TOOL ROUTER
# =====================================================

TOOL_FUNCTIONS = {
    "predict_crop": get_crop_prediction,
    "predict_fertilizer": get_fertilizer_prediction
}


def execute_tool(tool_name, arguments):
    """
    Run only explicitly allowed tools.
    Never execute arbitrary functions selected by the LLM.
    """

    function = TOOL_FUNCTIONS.get(tool_name)

    if function is None:
        raise ValueError("Unsupported chatbot tool")

    if not isinstance(arguments, dict):
        raise ValueError("Invalid tool arguments")

    # Basic numeric range checks.
    # Adjust these ranges to match your model's training data.
    if tool_name == "predict_crop":
        ranges = {
            "nitrogen": (0, 300),
            "phosporous": (0, 300),
            "potash": (0, 300),
            "temperature": (-10, 70),
            "humidity": (0, 100),
            "ph": (0, 14),
            "rainfall": (0, 10000)
        }

        for key, (minimum, maximum) in ranges.items():
            value = arguments.get(key)

            if isinstance(value, bool) or not isinstance(
                value, (int, float)
            ):
                raise ValueError(f"{key} must be numeric")

            if not minimum <= value <= maximum:
                raise ValueError(f"{key} is outside the allowed range")

    elif tool_name == "predict_fertilizer":
        ranges = {
            "PH": (0, 14),
            "Nitrogen": (0, 300),
            "Phosphorous": (0, 300),
            "Potassium": (0, 300),
            "Temperature": (-10, 70),
            "Rainfall": (0, 10000),
            "Moisture": (0, 100)
        }

        for key, (minimum, maximum) in ranges.items():
            value = arguments.get(key)

            if isinstance(value, bool) or not isinstance(
                value, (int, float)
            ):
                raise ValueError(f"{key} must be numeric")

            if not minimum <= value <= maximum:
                raise ValueError(f"{key} is outside the allowed range")

        crop_name = arguments.get("Crop")

        if crop_name not in crop_dict.values():
            raise ValueError("Unsupported crop name")

    return function(arguments)


# =====================================================
# CHAT ENDPOINT
# =====================================================

@app.route("/chat", methods=["POST"])
def chat():
    if groq_client is None or not GROQ_MODEL:
        return jsonify({
            "error": (
                "Chatbot is not configured. Set GROQ_API_KEY "
                "and GROQ_MODEL in the environment."
            )
        }), 503

    data = request.get_json(silent=True) or {}
    user_message = data.get("message")

    if not isinstance(user_message, str) or not user_message.strip():
        return jsonify({
            "error": "Please enter a message."
        }), 400

    if len(user_message) > 5000:
        return jsonify({
            "error": "Message is too long. Maximum 5000 characters."
        }), 400

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message.strip()}
    ]

    try:
        # Allow a maximum of three tool-calling rounds.
        for _ in range(3):
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
                temperature=0.2
            )

            assistant_message = response.choices[0].message

            if not assistant_message.tool_calls:
                return jsonify({
                    "reply": assistant_message.content or ""
                })

            # Append the assistant's tool request to the conversation.
            messages.append(
                assistant_message.model_dump(exclude_none=True)
            )

            for tool_call in assistant_message.tool_calls:
                tool_name = tool_call.function.name

                try:
                    arguments = json.loads(
                        tool_call.function.arguments
                    )

                    result = execute_tool(tool_name, arguments)

                    tool_result = {
                        "success": True,
                        "result": result
                    }

                except (ValueError, TypeError, KeyError) as exc:
                    tool_result = {
                        "success": False,
                        "error": str(exc)
                    }

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(tool_result)
                })

        # If the tool-call limit is reached, do not execute
        # any additional tools.
        return jsonify({
            "reply": (
                "I couldn't complete that prediction in this attempt. "
                "Please try again with the required input values."
            )
        })

    except Exception:
        app.logger.exception("Chatbot request failed")
        return jsonify({
            "error": "The agriculture chatbot is temporarily unavailable."
        }), 502


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# =====================================================
# START SERVER (RENDER SAFE)
# =====================================================

if __name__ == "__main__":
    print("Server starting...")

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
