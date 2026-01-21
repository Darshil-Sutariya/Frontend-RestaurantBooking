import React, { useState } from "react";
import "../../styles/css/Home/Home.css";
import { FaTable, FaAngleDown } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";
import { IoReceipt } from "react-icons/io5";

export const Sidebar = ({
  collapsed,
  categories = [],
  products = [],
  onCategorySelect,
  onProductSelect,
  onTableSelect,
  onBillSelect,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showTables] = useState(false);


  // 🔥 Toggle main category menu
  const toggleCategories = () => {
    if (showCategories) {
      setActiveCategory(null);
      setActiveProduct(null);
      onCategorySelect(null);
    }
    setShowCategories(!showCategories);
  };

  // 🔥 Category click
  const handleCategoryClick = (category) => {
    if (activeCategory === category._id) {
      setActiveCategory(null);
      setActiveProduct(null);
      onCategorySelect(null);
    } else {
      setActiveCategory(category._id);
      setActiveProduct(null);
      onCategorySelect(category);
    }
  };

  // 🔥 Product click
  const handleProductClick = (product) => {
    setActiveProduct(product._id);
    onProductSelect(product);
  };

  const capitalize = (text) =>
    text
      ?.split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");



  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <ul>
        {/* MAIN CATEGORY HEADER */}
        <li
          className={`category-header ${showCategories ? "active" : ""}`}
          onClick={toggleCategories}
        >
          <FaTable />
          {!collapsed && <span>Categories</span>}
          {!collapsed && (
            <FaAngleDown className={showCategories ? "rotate" : ""} />
          )}
        </li>

        {/* CATEGORY LIST */}
        {showCategories && (
          <div className="data">
            {categories.map((category) => (
              <div key={category._id}>
                <div
                  className={`categoryList ${activeCategory === category._id ? "active" : ""
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <p>{capitalize(category.name)}</p>
                  <FaAngleDown
                    className={
                      activeCategory === category._id ? "rotate" : ""
                    }
                  />
                </div>

                {/* PRODUCT LIST */}
                {activeCategory === category._id && (
                  <div className="product-dropdown">
                    {products
                      .filter(
                        (product) =>
                          product?.category?._id === category._id
                      )
                      .map((product) => (
                        <p
                          key={product._id}
                          className={`productList ${activeProduct === product._id ? "active" : ""
                            }`}
                          onClick={() =>
                            handleProductClick(product)
                          }
                        >
                          ~ {capitalize(product.productname)}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}


        <li
          className={`category-header ${showTables ? "active" : ""}`}
          onClick={() => onTableSelect()}
        >

          <MdTableRestaurant className="tableicon" />
          {!collapsed && (
            <span> Tables</span>
          )}
        </li>

        <li
          className="category-header"
          onClick={() => onBillSelect()}
        >
          <IoReceipt className="tableicon" />
          {!collapsed && <span> Bills</span>}
        </li>


      </ul>
    </aside>
  );
};
