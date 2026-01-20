import { useEffect, useState } from "react";
import "../../styles/css/Popup/Popup.css";

export const ProductPopup = ({
  open,
  onClose,
  onSubmit,
  initialValue,
  mode,
  selectedCategory
}) => {

  const emptyProduct = {
    productname: "",
    productdiscription: "",
    productprice: "",
    productimage: "",
    category: ""
  };

  const [productData, setProductData] = useState(emptyProduct);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValue) {
      setProductData({
        ...initialValue,
        category: initialValue.category?._id || initialValue.category
      });
    } else {
      setProductData(emptyProduct);
    }

    setError("");
  }, [open, mode, initialValue]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCheckbox = (e) => {
    setProductData({
      ...productData,
      category: e.target.checked ? selectedCategory._id : ""
    });
  };

  const handleSubmit = () => {
    if (!productData.productname.trim()) {
      setError("Product name required");
      return;
    }

    if (!productData.category) {
      setError("Please select category");
      return;
    }

    onSubmit(productData);
    setProductData(emptyProduct);
    setError("");
    onClose();
  };

  const handleClose = () => {
    setProductData(emptyProduct);
    setError("");
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="productpopup-box">
        <h3>{mode === "edit" ? "Edit Product" : "Add Product"}</h3>

         <div className="productdata">

        <input
                            name="productname"
                            placeholder="Product Name"
                            value={productData.productname}
                            onChange={handleChange}
                        />
                        {error && <p className="error-text">{error}</p>}



                        <input
                            name="productdiscription"
                            placeholder="Description"
                            value={productData.productdiscription}
                            onChange={handleChange}
                        />
                        {error && <p className="error-text">{error}</p>}


                        <input
                            name="productprice"
                            type="number"
                            placeholder="Price"
                            value={productData.productprice}
                            onChange={handleChange}
                        />
                        {error && <p className="error-text">{error}</p>}


                        <input
                            name="productimage"
                            placeholder="Image URL"
                            value={productData.productimage}
                            onChange={handleChange}
                        />
                        {error && <p className="error-text">{error}</p>}


        <div className="acceptchek">
          <label>Accepted {selectedCategory?.name}</label>
          <input
            type="checkbox"
            checked={productData.category === selectedCategory?._id}
            onChange={handleCheckbox}
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        </div>

        <div className="popup-actions">
          <button className="cancel" onClick={handleClose}>Cancel</button>
          <button className="submit" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
