import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Paints.css";
function PaintPage() {
  const [paints, setPaints] = useState([]);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch("http://localhost:8000/api/paints/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPaints(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSelect = (paint) => {
    setSelectedPaint(paint);
    setQuantity(paint.quantity);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`http://localhost:8000/api/paints/${selectedPaint.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        ...selectedPaint,
        quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPaints(paints.map((paint) => (paint.id === data.id ? data : paint)));
        setSelectedPaint(null);
        setQuantity("");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Navbar />
      <h1>Paints</h1>
      {paints.map((paint) => (
        <div className="paint-card">
          <form key={paint.id} onSubmit={(e) => handleSubmit(e, paint)}>
            <div>
              <h2>Paint {paint.id}</h2>
              <p>Color: {paint.color}</p>
              <p>Quantity: {paint.quantity}</p>
              {selectedPaint && selectedPaint.id === paint.id ? null : (
                <button type="button" onClick={() => handleSelect(paint)}>
                  Edit
                </button>
              )}
            </div>
            {selectedPaint && selectedPaint.id === paint.id && (
              <div>
                <label>
                  New Quantity:
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Update Quantity</button>
              </div>
            )}
          </form>
        </div>
      ))}
    </div>
  );
}

export default PaintPage;
