import React, { useEffect, useState } from "react";
import "../../styles/css/Home/Home.css";

export const TablePopup = ({
  open,
  onClose,
  onSubmit,
  mode = "add",
  initialData = null,
}) => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTableNumber(initialData.tableNumber || "");
      setCapacity(initialData.capacity || "");
    }

    if (mode === "add") {
      setTableNumber("");
      setCapacity("");
    }
  }, [mode, initialData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!tableNumber || !capacity) {
      alert("All fields required");
      return;
    }

    onSubmit({
      tableNumber,
      capacity: Number(capacity),
    });

    setTableNumber("");
    setCapacity("");
  };

 return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{mode === "edit" ? "Update Table" : "Add Table"}</h3>

        <input
          type="text"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <div className="popup-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="submit" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};