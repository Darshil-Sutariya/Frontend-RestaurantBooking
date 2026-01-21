import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { Header } from '../components/Header/Header';
import "../styles/css/ProductDetails/ProductDetails.css";
import ProductDetailSlider from '../components/Slider/ProductDetailSlider';
import { productResponseApi } from "../api/product";
import { occupyTableApi, tableResponseApi } from '../api/table';
import { viewBill, createBill, updateBill } from "../api/bill";

export const ProductDetails = () => {

  const { productName } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(
    location.state?.product || null
  );

  /* ---------------- TABLE STATES ---------------- */
  const [tables, setTables] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [filteredTables, setFilteredTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [isTableBooked, setIsTableBooked] = useState(false);

  const [tableMessage, setTableMessage] = useState("");
  const [tableMessageType, setTableMessageType] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const res = await tableResponseApi();
    setTables(res.data.data || []);
  };

  useEffect(() => {
    if (!capacity) {
      setFilteredTables([]);
      return;
    }

    const cap = Number(capacity);

    let result = tables.filter(
      t => t.status?.toLowerCase() === "available" && Number(t.capacity) >= cap
    );

    if (isTableBooked && selectedTable) {
      const booked = tables.find(t => t._id === selectedTable);
      if (booked && !result.find(t => t._id === booked._id)) {
        result = [booked, ...result];
      }
    }

    setFilteredTables(result);
  }, [capacity, tables, isTableBooked, selectedTable]);

  const handleAddTable = async () => {
    if (!selectedTable) {
      setTableMessageType("error");
      setTableMessage("Please select a table");
      return;
    }

    await occupyTableApi(selectedTable);

    localStorage.setItem("tableBooked", "true");
    localStorage.setItem("bookedTableId", selectedTable);
    localStorage.setItem("bookedCapacity", capacity);

    setIsTableBooked(true);
    setTableMessageType("success");
    setTableMessage("Table booked successfully");
    fetchTables();
  };

  useEffect(() => {
    const booked = localStorage.getItem("tableBooked");
    const tableId = localStorage.getItem("bookedTableId");
    const cap = localStorage.getItem("bookedCapacity");

    if (booked === "true") {
      setIsTableBooked(true);
      setCapacity(cap || "");
      setSelectedTable(tableId || "");
    }
  }, []);

  /* ---------------- CART (BILL) LOGIC ---------------- */
  const [quantity, setQuantity] = useState(0);




  const getOpenBill = async () => {
    const res = await viewBill();
    const bills = res?.data?.data || [];
    return bills.find(b => b.status === "open") || null;
  };



  useEffect(() => {
    if (!product) return;

    const loadQty = async () => {
      const bill = await getOpenBill();
      if (!bill) {
        setQuantity(0);
        return;
      }

      const items = bill.items || [];

      const item = items.find(i => i.product === product._id);
      setQuantity(item ? item.quantity : 0);
    };

    loadQty();
  }, [product]);


  const handleIncrease = () => setQuantity(q => q + 1);
  const handleDecrease = () => setQuantity(q => (q > 0 ? q - 1 : 0));

  const handleAddToCart = async () => {
    const tableId = localStorage.getItem("bookedTableId");
    if (!tableId) return alert("Please book table first");

    let bill = await getOpenBill();

    if (!bill) {
      await createBill({
        tableId,
        items: [{
          productId: product._id,
          quantity
        }]
      });
    } else {
      const items = [...(bill.items || [])];
      const index = items.findIndex(i => i.product === product._id);

      if (index !== -1) {
        items[index].quantity = quantity;
      } else {
        items.push({ product: product._id, quantity });
      }

      const payloadItems = items.map(i => ({
        productId: i.product,
        quantity: i.quantity
      }));

      await updateBill(bill._id, {
        tableId,
        items: payloadItems
      });
    }
  };

  const fetchProductByName = useCallback(async () => {
    const res = await productResponseApi();
    const found = res.data.data.find(
      p => p.productname.toLowerCase().replace(/\s+/g, "-") === productName
    );
    setProduct(found);
  }, [productName]);

  useEffect(() => {
    if (!product) {
      fetchProductByName();
    }
  }, [product, fetchProductByName]);





  if (!product) return <h2 style={{ textAlign: "center" }}>Product not found</h2>;

  return (
    <div>
      <Header />

      <div className='mainbox'>
        <div className='productleft'>
          <div className='productimage'>
            <img src={product.productimage} alt={product.productname} />
          </div>
          <ProductDetailSlider image={product.productimage} />
        </div>

        <div className='productright'>
          <div className='productdetails'>
            <h2>Product : {product.productname}</h2>

            <p className='productprice'>Price : ₹ {product.productprice}</p>

            <div className='pricelist'>
              <p className='productdec'>
                Description
                <span className='productdescription'>
                  {product.productdiscription}
                </span>
              </p>
            </div>

            <div className='tabledetails'>
              <h3 className='tablebook'>Table Book</h3>

              <div className='tablecapacity'>
                <input
                  className='tablecap'
                  type="number"
                  placeholder='Please Enter Capacity'
                  value={capacity}
                  min={1}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") return setCapacity("");
                    if (Number(v) < 1) return;
                    setCapacity(v);
                  }}
                />

                <select
                  className='tableselect'
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  <option value="">Please Select Table No.</option>
                  {filteredTables.map(t => (
                    <option key={t._id} value={t._id}>{t.tableNumber}</option>
                  ))}
                </select>

                <button className='tablebtn' onClick={handleAddTable}>
                  Add Table
                </button>
              </div>

              <div className='errormsg'>
                {tableMessage && (
                  <p className={tableMessageType === "success" ? "table-success" : "table-error"}>
                    {tableMessage}
                  </p>
                )}
              </div>
            </div>

            <h3 className='cartheading'>Cart</h3>

            <div className='quantitybtn'>
              <button className='minusbtn' onClick={handleDecrease} disabled={quantity === 0}>-</button>
              <p>{quantity}</p>
              <button className='plusbtn' onClick={handleIncrease}>+</button>
            </div>

            <div className='cartbtn'>
              <button
                className='addbtn'
                onClick={handleAddToCart}
                disabled={!isTableBooked || quantity === 0}
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
