import { useEffect, useState } from "react";
import "../../styles/css/Popup/Popup.css";

export const CategoryPopup = ({ open, onClose, onSubmit, initialValue, mode }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initialValue) {
      setCategoryName(initialValue);
    }
  }, [open, initialValue]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      setError("Category name required");
      return;
    }

    onSubmit(categoryName);
    setCategoryName("");
    setError("");
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>

        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="popup-actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
