import { useState } from "react";
import "../../App.css";

export default function Disease() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleDetect = () => {
    // Dummy result (later connect ML model)
    setResult("Detected: Leaf Blight (Confidence: 92%)");
  };

  return (
    <div>
      <div className="navbar">
        <h2>Disease Detection</h2>
      </div>

      <div className="container">
        <h1>Upload Plant Image</h1>

        <input type="file" onChange={handleUpload} />

        {image && (
          <div>
            <img src={image} alt="preview" width="200" />
          </div>
        )}

        <button className="btn" onClick={handleDetect}>
          Detect Disease
        </button>

        {result && <h3>{result}</h3>}
      </div>
    </div>
  );
}