import { useEffect, useState } from "react";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { CategoryPopup } from "../components/Popup/CategoryPopup";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ProductPopup } from "../components/Popup/ProductPopup";
import { tableResponseApi } from "../api/table";
import { TablePopup } from "../components/Popup/TablePopup";
import { createTable, deleteTable, updateTable } from "../api/table";
import { deleteBill, updateBill, viewBill } from "../api/bill";
import { createBill } from "../api/bill";

import {
  categoriesResponseApi,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/category";


import { createProduct, deleteProduct, productResponseApi, updateProduct } from "../api/product";
import { useNavigate } from "react-router-dom";
import { BillPopup } from "../components/Popup/BillPopup";

export const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [view, setView] = useState("category");
  // category | subcategory | product

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔥 Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("add"); // add | edit
  const [productpopupMode, setProductPopupMode] = useState("add");
  const [editCategory, setEditCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [tables, setTables] = useState([]);
  const [showTablePopup, setShowTablePopup] = useState(false);
  const [tablePopupMode, setTablePopupMode] = useState("add"); // add | edit
  const [editTable, setEditTable] = useState(null);

  const [bills, setBills] = useState([]);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [editBill, setEditBill] = useState(null);
  const [billPopupMode, setBillPopupMode] = useState("add"); // add | edit





  const navigate = useNavigate();


  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const categoriesResponse = await categoriesResponseApi();
      setCategories(categoriesResponse.data || []);

      const productsResponse = await productResponseApi();
      setProducts(productsResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  // ================= ADD CATEGORY ================= 
  const handleAdd = () => {
    setPopupMode("add");
    setEditCategory(null);
    setShowPopup(true);
  };

  const handleAddProduct = () => {
    setProductPopupMode("add");
    setEditProduct(null);
    setShowProductPopup(true);
  };

  const handleCreateBill = async (data) => {
    await createBill(data);
    fetchBills();
  };

  // ================= EDIT CATEGORY =================
  const handleEditCategory = (category) => {
    setPopupMode("edit");
    setEditCategory(category);
    setShowPopup(true);
  };

  const handleEditProduct = (product) => {
    setProductPopupMode("edit");
    setEditProduct(product);
    setShowProductPopup(true);
  };

  const handleEditTable = (table) => {
    setTablePopupMode("edit");
    setEditTable(table);
    setShowTablePopup(true);
  };

  const handleEditBill = async (bill) => {
    await fetchTables();          // tables load
    setEditBill(bill);            // bill data store
    setBillPopupMode("edit");     // edit mode
    setShowBillPopup(true);       // popup open
  };



  // ================= DELETE CATEGORY =================
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      await fetchData();
    } catch (error) {
      console.error("Delete category error:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await deleteTable(id);   // 👈 API call
      fetchTables();           // 👈 refresh tables
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await deleteBill(billId);
      fetchBills(); // refresh list
    } catch (err) {
      console.error("Delete bill error", err);
    }
  };




  // ================= POPUP SUBMIT =================
  const handleCategorySubmit = async (categoryName) => {
    try {
      if (popupMode === "add") {
        await createCategory({ name: categoryName });
      } else {
        await updateCategory(editCategory._id, {
          name: categoryName,
        });
      }

      await fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error("Category submit error:", error);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      if (productpopupMode === "add") {
        await createProduct(productData);
      } else {
        await updateProduct(editProduct._id, productData);
      }

      await fetchData();
      setShowProductPopup(false);
    } catch (error) {
      console.error("Product submit error:", error);
    }
  };


  // ================= CATEGORY CLICK =================
  const handleCategoryFromSidebar = (category) => {
    if (!category) {
      setView("category");
      setSelectedCategory(null);
      setSelectedProduct(null);
    } else {
      setSelectedCategory(category);
      setSelectedProduct(null);
      setView("subcategory");
    }
  };

  // ================= PRODUCT CLICK =================
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView("product");
  };

  const slugify = (text) => {
    return text
      .toLowerCase()          // Capital → small
      .trim()                 // Extra spaces remove
      .replace(/\s+/g, "-")   // Space → -
      .replace(/[^\w-]+/g, "") // Special characters remove
      .replace(/--+/g, "-");   // Multiple - → single -
  };


  const handleProductDetails = (product) => {
    const productSlug = slugify(product.productname);

    navigate(`/product/${productSlug}`, {
      state: { product }   // product data pass
    });
  };


  const fetchTables = async () => {
    try {
      const res = await tableResponseApi();
      if (res.data.success) {
        setTables(res.data.data);
      }
    } catch (err) {
      console.error("Fetch tables error", err);
    }
  };


  const handleTableFromSidebar = async () => {
    await fetchTables();     // API call
    setView("table");        // 👈 MAIN VIEW CHANGE
  };


  const handleAddTable = () => {
    setShowTablePopup(true);
  };

  const handleTableSubmit = async (tableData) => {
    try {
      if (tablePopupMode === "add") {
        await createTable(tableData);
      } else {
        await updateTable(editTable._id, tableData);
      }

      setShowTablePopup(false);
      setEditTable(null);
      setTablePopupMode("add");
      fetchTables();
    } catch (err) {
      console.error("Table submit error", err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await viewBill();
      if (res.data.success) {
        setBills(res.data.data);
      }
    } catch (err) {
      console.error("Fetch bills error", err);
    }
  };


  const handleBillsFromSidebar = async () => {
    await fetchBills();   // 👈 API call
    setView("bill");      // 👈 view change
  };


  return (
    <div className="app">
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />

      <Sidebar
        collapsed={collapsed}
        categories={categories}
        products={products}
        onCategorySelect={handleCategoryFromSidebar}
        onProductSelect={handleProductClick}
        onTableSelect={handleTableFromSidebar}
        onBillSelect={handleBillsFromSidebar}
      />


      <CategoryPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleCategorySubmit}
        initialValue={editCategory?.name || ""}
        mode={popupMode}
      />

      <ProductPopup
        open={showProductPopup}
        onClose={() => setShowProductPopup(false)}
        onSubmit={handleProductSubmit}
        initialValue={editProduct}
        mode={productpopupMode}
        selectedCategory={selectedCategory}
      />

      <TablePopup
        open={showTablePopup}
        onClose={() => {
          setShowTablePopup(false);
          setEditTable(null);
          setTablePopupMode("add");
        }}
        onSubmit={handleTableSubmit}
        mode={tablePopupMode}
        initialData={editTable}
      />

      <BillPopup
        open={showBillPopup}
        onClose={() => {
          setShowBillPopup(false);
          setEditBill(null);
          setBillPopupMode("add");
        }}
        onSubmit={
          billPopupMode === "add"
            ? handleCreateBill
            : async (data) => {
              await updateBill(editBill._id, data);
              fetchBills();
            }
        }
        tables={tables}
        products={products}
        mode={billPopupMode}
        initialBill={editBill}
      />





      <main className={`content ${collapsed ? "collapsed" : ""}`}>
        {/* ================= CATEGORY VIEW ================= */}
        {view === "category" && (
          <div className="Catepage">
            <div>
              <h2>Categories</h2>

              <div className="parentCat">
                {categories.map((category) => (
                  <div className="CategoryData" key={category._id}>
                    <div className="action">
                      <div
                        className="editicon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <FaEdit />
                      </div>

                      <div
                        className="deleteicon"
                        onClick={() =>
                          handleDeleteCategory(category._id)
                        }
                      >
                        <MdDelete />
                      </div>
                    </div>

                    <p className="Maincategory">{category.name}</p>

                    <button
                      className="visit"
                      onClick={() =>
                        handleCategoryFromSidebar(category)
                      }
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="fromCategory">
              <button className="addB" onClick={handleAdd}>
                + ADD Category
              </button>
            </div>
          </div>
        )}

        {/* ================= SUBCATEGORY VIEW ================= */}
        {view === "subcategory" && selectedCategory && (
          <>
            <div className="subcategorylist">
              <div>
                <h2 className="category">
                  Category Name: {selectedCategory.name}
                </h2>
              </div>
              <div>
                <button className="addB" onClick={handleAddProduct} >
                  + ADD Product
                </button>
              </div>
            </div>
            <h3>Product List</h3>
            <div className="parentCat">
              {products
                .filter(
                  (product) =>
                    product?.category?._id ===
                    selectedCategory._id
                )
                .map((product) => (
                  <div className="CategoryData" key={product._id}>

                    <div className="action">
                      <div
                        className="editicon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <FaEdit />
                      </div>

                      <div
                        className="deleteicon"
                        onClick={() =>
                          handleDeleteProduct(product._id)
                        }
                      >
                        <MdDelete />
                      </div>
                    </div>
                    <div className="subdata">
                      <img
                        src={product.productimage}
                        alt={product.productname}
                      />
                    </div>
                    <p className="Maincategory">
                      {product.productname}
                    </p>
                    <button
                      className="visit"
                      onClick={() =>
                        handleProductClick(product)
                      }
                    >
                      View
                    </button>
                  </div>
                ))}

            </div>

          </>
        )}

        {/* ================= PRODUCT VIEW ================= */}
        {view === "product" && selectedProduct && (
          <>
            <h2>Product Details</h2>

            <div className="ProductData">
              <img
                src={selectedProduct.productimage}
                alt={selectedProduct.productname}
              />
              <h3>{selectedProduct.productname}</h3>
              <p className="price">
                Price: ₹{selectedProduct.productprice}
              </p>
              <p className="discription">
                {selectedProduct.productdiscription}
              </p>
              <div>
                <button className="View_btn"
                  onClick={() =>
                    handleProductDetails(selectedProduct)
                  }>
                  View Product
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= TABLE VIEW ================= */}
        {view === "table" && (
          <>
            <div className="addtable">
              <div>
                <h2>Tables</h2>
              </div>
              <div>
                <button className="addB" onClick={handleAddTable} >
                  + ADD Table
                </button>
              </div>
            </div>

            <div className="parentCat">

              {tables.map((table) => (
                <div className="CategoryData" key={table._id}>
                  <div className="action">
                    <div
                      className="editicon"
                      onClick={() => handleEditTable(table)}
                    >
                      <FaEdit />
                    </div>

                    <div
                      className="deleteicon"
                      onClick={() => handleDeleteTable(table._id)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                  <p>
                    <span className="tableD">Table:</span> {table.tableNumber}
                  </p>
                  <p>
                    <span className="tableD">Capacity:</span> {table.capacity}</p>
                  <p
                    style={{
                      color:
                        table.status === "available" ? "green" : "red",
                    }}
                  >
                    <span className="tableD">Status:</span> {table.status}
                  </p>
                </div>

              ))}
            </div>
          </>
        )}


        {/* ================= BILL VIEW ================= */}
        {view === "bill" && (
          <>
            <div className="addtable">
              <h2>Bills</h2>
              <div>
                <button className="addB" onClick={async () => {
                  await fetchTables();
                  setShowBillPopup(true);
                }} >
                  + ADD Bill
                </button>
              </div>
            </div>

            <div className="parentCat">
              {bills.map((bill, index) => (
                <div className="CategoryData" key={bill._id}>
                  <div className="action">
                    <div
                      className="editicon"
                      onClick={() => handleEditBill(bill)}
                    >
                      <FaEdit />
                    </div>


                    <div
                      className="deleteicon"
                      onClick={() => handleDeleteBill(bill._id)}
                    >
                      <MdDelete />
                    </div>


                  </div>

                  <p>
                    <strong>Bill No:</strong> #{index + 1}
                  </p>

                  <p>
                    <strong>Total:</strong> ₹{bill.grandTotal}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: bill.status === "closed" ? "red" : "green",
                      }}
                    >
                      {bill.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}



      </main>
    </div>
  );
};
