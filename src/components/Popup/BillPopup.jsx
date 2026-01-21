import { useEffect, useState } from "react";
import "../../styles/css/Popup/Popup.css";

export const BillPopup = ({
    open,
    onClose,
    onSubmit,
    tables = [],
    products = [],
    mode = "add",
    initialBill = null
}) => {
    const [tableId, setTableId] = useState("");
    const [search, setSearch] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [items, setItems] = useState([]);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialBill) {
            setTableId(initialBill.table);
            setItems(
                initialBill.items.map(i => ({
                    productId: i.product,
                    quantity: String(i.quantity)
                }))
            );
        } else {
            setTableId("");
            setItems([]);
        }

        setSearch("");
        setProductId("");
        setQuantity("1");
        setError("");
        setShowProductDropdown(false);
    }, [open, mode, initialBill]);


    if (!open) return null;

    const filteredProducts = products.filter((p) =>
        p.productname.toLowerCase().includes(search.toLowerCase())
    );

    const addItem = () => {
        if (!productId || quantity < 1) {
            setError("Select product & quantity");
            return;
        }

        setItems([...items, { productId, quantity }]);
        setProductId("");
        setQuantity(1);
        setSearch("");
        setError("");
    };

    const handleSubmit = () => {
        const validItems = items
            .map(i => ({
                productId: i.productId,
                quantity: Number(i.quantity)
            }))
            .filter(i => i.quantity > 0);

        if (!tableId || validItems.length === 0) {
            setError("Table & at least one product required");
            return;
        }

        onSubmit({
            tableId,
            items: validItems
        });

        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="productpopup-box">
                <h3>Create Bill</h3>

                {/* ================= TABLE DROPDOWN ================= */}
                <select className="selecttable" value={tableId} onChange={(e) => setTableId(e.target.value)}>
                    <option value="" >Select Table</option>
                    {tables
                        .filter((t) => t.status === "available")
                        .map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.tableNumber}
                            </option>
                        ))}
                </select>
                {error && <p className="popup-error">{error}</p>}


                {/* ================= PRODUCT SEARCH DROPDOWN ================= */}
                <div className="search-dropdown">
                    <input
                        className="searchp"
                        placeholder="Search Product"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowProductDropdown(true);
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                    />

                    {showProductDropdown && (
                        <div className="dropdown-list">
                            {filteredProducts.length === 0 && (
                                <p className="no-data">No product found</p>
                            )}

                            {filteredProducts.map((p) => (
                                <div
                                    key={p._id}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setProductId(p._id); // ✅ ID store
                                        setSearch(
                                            `${p.productname} - ₹${p.productprice}`
                                        ); // show name
                                        setShowProductDropdown(false);
                                    }}
                                >
                                    {p.productname} - ₹{p.productprice}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ================= QUANTITY ================= */}
                <div className="productqunsec">
                    <input
                        className="productqun"
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value); // 👈 string allow
                        }}
                    />

                    <button
                        className="addproductbtn"
                        onClick={addItem}
                        disabled={!productId || Number(quantity) <= 0}
                    >
                        + Add Product
                    </button>
                </div>

                {/* ================= SELECTED ITEMS ================= */}
                {items.map((i, index) => {
                    const product = products.find(p => p._id === i.productId);

                    return (
                        <div key={index} className="edit-item-row">
                            <span>{product?.productname}</span>

                            <input
                                type="number"
                                min="0"
                                value={i.quantity}
                                onChange={(e) => {
                                    const updated = [...items];
                                    updated[index].quantity = e.target.value;
                                    setItems(updated);
                                }}
                            />

                            <button
                                onClick={() =>
                                    setItems(items.filter((_, idx) => idx !== index))
                                }
                            >
                                ❌
                            </button>
                        </div>
                    );
                })}


                {/* ================= ACTION BUTTONS ================= */}
                <div className="popup-actions">
                    <button className="cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="submit" onClick={handleSubmit}>
                        Create Bill
                    </button>
                </div>
            </div>
        </div>
    );
};
