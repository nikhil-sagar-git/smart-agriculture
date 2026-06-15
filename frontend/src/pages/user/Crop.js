import { useState } from "react";

export default function Crop() {

  const [form, setForm] = useState({
    nitrogen: "",
    phosporous: "",
    potash: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  let [err,seterr]=useState("")

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {

    if(form.nitrogen === "" ||
      form.phosporous === "" ||
      form.potash === "" ||
      form.temperature === "" ||
      form.humidity === "" ||
      form.ph === "" ||
  form.rainfall === "")
    {
      seterr("enter all fields")
      setResult("")
      return
    }
    else
    {
      seterr("")
    }

    try {

      setLoading(true);

      const response = await fetch(
        "https://smart-agriculture-python3.onrender.com/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      setResult(data.crop);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      alert("Prediction Failed");
    }
  };

  return (

    <div className="main-container">

      <div className="navbar">
        <h2>Crop Recommendation System 🌱</h2>
      </div>

      <div className="form-container">

        <form onSubmit={(e) => e.preventDefault()}>

          <input
            type="number"
            name="nitrogen"
            placeholder="Nitrogen"
            onChange={handleChange}
          />

          <input
            type="number"
            name="phosporous"
            placeholder="Phosphorous"
            onChange={handleChange}
          />

          <input
            type="number"
            name="potash"
            placeholder="Potassium"
            onChange={handleChange}
          />

          <input
            type="number"
            name="temperature"
            placeholder="Temperature"
            onChange={handleChange}
          />

          <input
            type="number"
            name="humidity"
            placeholder="Humidity"
            onChange={handleChange}
          />

          <input
            type="number"
            name="ph"
            placeholder="pH Value"
            onChange={handleChange}
          />

          <input
            type="number"
            name="rainfall"
            placeholder="Rainfall"
            onChange={handleChange}
          />

          <button
            type="button"
            className="btn"
            onClick={handlePredict}
            disabled={loading}
          >

            {
              loading ? (

                <div className="loader-container">

                  <div className="loader"></div>

                  <span>Predicting...</span>

                </div>

              ) : (

                "Get Recommendation"

              )
            }

          </button>
          {
  err && (
    <p
      style={{
        color: "#d32f2f",
        marginTop: "12px",
        fontWeight: "bold",
        textAlign: "center"
      }}
    >
      {err}
    </p>
  )
}

          {
            result && !loading && (


              <div className="result">

                <h3>Recommended Crop 🌾</h3>

                <h2>{result.toUpperCase()}</h2>

              </div>
            )
          }

        </form>

      </div>

    </div>
  );
} 