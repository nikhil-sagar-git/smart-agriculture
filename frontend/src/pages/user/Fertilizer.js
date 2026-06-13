import { useState } from "react";

export default function Fertilizer() {

  const [form, setForm] = useState({

    PH: "",
    Nitrogen: "",
    Phosphorous: "",
    Potassium: "",
    Temperature: "",
    Rainfall: "",
    Moisture: "",
    Crop: ""

  });

  const [fertilizer, setFertilizer] =
    useState("");

  const [remark, setRemark] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });
  };

  // =====================================
  // API CALL
  // =====================================

  const handlePredict = async () => {
    if (

  form.PH === "" ||
  form.Nitrogen === "" ||
  form.Phosphorous === "" ||
  form.Potassium === "" ||
  form.Temperature === "" ||
  form.Rainfall === "" ||
  form.Moisture === "" ||
  form.Crop === ""

)
{
  setError("Enter all fields");
  setFertilizer("")
  setRemark("")
  return;
}

    try {

      const res = await fetch(

        "http://127.0.0.1:5000/predictfertilizer",

        {

          method: "POST",

          headers: {

            "Content-Type":
            "application/json"

          },

          body: JSON.stringify(form)

        }
      );

      const data = await res.json();

      // ==============================
      // SHOW ERROR
      // ==============================

      if (data.error) {

        setError(data.error);

        return;
      }

      // ==============================
      // SHOW RESULT
      // ==============================

      setFertilizer(
        data.fertilizername
      );

      setRemark(
        data.remark
      );

      setError("");

    } catch (err) {

      console.log(err);

      setError(
        "Server Error"
      );
    }
  };

  return (

    <div>

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <div className="navbar">

        <h2>
          Fertilizer Recommendation
        </h2>

      </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <div className="form-container">

        <form
          onSubmit={(e) =>
            e.preventDefault()
          }
        >

          <input
            type="number"
            name="PH"
            placeholder="PH"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Nitrogen"
            placeholder="Nitrogen"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Phosphorous"
            placeholder="Phosphorous"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Potassium"
            placeholder="Potassium"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Temperature"
            placeholder="Temperature"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Rainfall"
            placeholder="Rainfall"
            onChange={handleChange}
          />

          <input
            type="number"
            name="Moisture"
            placeholder="Moisture"
            onChange={handleChange}
          />

          {/* ========================= */}
          {/* CROP DROPDOWN */}
          {/* ========================= */}

          <select
            name="Crop"
            onChange={handleChange}
            className="select-box"
          >

            <option value="">
              Select Crop
            </option>

            <option value="Adzuki Beans">
              Adzuki Beans
            </option>

            <option value="Black gram">
              Black gram
            </option>

            <option value="Chickpea">
              Chickpea
            </option>

            <option value="Coconut">
              Coconut
            </option>

            <option value="Coffee">
              Coffee
            </option>

            <option value="Cotton">
              Cotton
            </option>

            <option value="Ground Nut">
              Ground Nut
            </option>

            <option value="Jute">
              Jute
            </option>

            <option value="Kidney Beans">
              Kidney Beans
            </option>

            <option value="Lentil">
              Lentil
            </option>

            <option value="Moth Beans">
              Moth Beans
            </option>

            <option value="Mung Bean">
              Mung Bean
            </option>

            <option value="Peas">
              Peas
            </option>

            <option value="Pigeon Peas">
              Pigeon Peas
            </option>

            <option value="Rubber">
              Rubber
            </option>

            <option value="Sugarcane">
              Sugarcane
            </option>

            <option value="Tea">
              Tea
            </option>

            <option value="Tobacco">
              Tobacco
            </option>

            <option value="apple">
              apple
            </option>

            <option value="banana">
              banana
            </option>

            <option value="grapes">
              grapes
            </option>

            <option value="maize">
              maize
            </option>

            <option value="mango">
              mango
            </option>

            <option value="millet">
              millet
            </option>

            <option value="muskmelon">
              muskmelon
            </option>

            <option value="orange">
              orange
            </option>

            <option value="papaya">
              papaya
            </option>

            <option value="pomegranate">
              pomegranate
            </option>

            <option value="rice">
              rice
            </option>

            <option value="watermelon">
              watermelon
            </option>

            <option value="wheat">
              wheat
            </option>

          </select>

          {/* ========================= */}
          {/* BUTTON */}
          {/* ========================= */}

          <button
            type="button"
            className="btn"
            onClick={handlePredict}
          >
            Recommend
          </button>

        </form>

        {/* ========================= */}
        {/* RESULT */}
        {/* ========================= */}

        {
          fertilizer &&

          <div className="result-box">

            <h3>

              Fertilizer:
              {" "}
              {fertilizer}

            </h3>

            <p>

              Remark:
              {" "}
              {remark}

            </p>

          </div>
        }

        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {
          error &&

          <p>

            {error}

          </p>
        }

      </div>

    </div>
  );
}