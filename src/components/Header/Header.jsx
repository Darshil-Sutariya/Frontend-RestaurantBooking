import React, { useEffect, useState } from "react";
import "../../styles/css/Home/Home.css";
import { FaBars, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { viewBill } from "../../api/bill";

export const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartQty, setCartQty] = useState(0);

  // const loadCartQty = async () => {
  //   const res = await viewBill();
  //   const bill = res?.data?.data?.find(b => b.status === "open");

  //   const total = bill
  //     ? bill.items.reduce((sum, i) => sum + i.quantity, 0)
  //     : 0;

  //   setCartQty(total);
  // };

const loadCartQty = async () => {
  const token = localStorage.getItem("token");
  
  // 🛑 Exit early if there is no token
  if (!token) {
    setCartQty(0);
    return;
  }

  try {
    const res = await viewBill();
    const bill = res?.data?.data?.find(b => b.status === "open");
    const total = bill ? bill.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    setCartQty(total);
  } catch (error) {
    console.error("Failed to load cart quantity", error);
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");
  
  if (token) {
    loadCartQty();
    const interval = setInterval(() => {
      loadCartQty();
    }, 1000);

    return () => clearInterval(interval);
  } else {
    setCartQty(0);
  }
}, [location.pathname]); // Runs when page changes or on mount
  // 🔥 Page change par cart reload
//  useEffect(() => {
//   loadCartQty();

  // const interval = setInterval(() => {
  //   loadCartQty();
  // }, 1000); // 1 second

//   return () => clearInterval(interval);
// }, []);


  const firstName = localStorage.getItem("firstname");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstname");
    localStorage.removeItem("bookedCapacity");
    localStorage.removeItem("bookedTableId");
    localStorage.removeItem("tableBooked");
    navigate("/");
  };

  const handlecart = () => navigate("/cart");
  const isHomePage = location.pathname === "/";

  return (
    <div className="header">
      {isHomePage && (
        <div className="menu">
          <FaBars
            className="menu-icon"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      )}

      <div className={`logo ${!isHomePage ? "logo-margin" : ""}`}>
        <Link className="logolink" to="/">MyApp</Link>
      </div>

      <div className="profile">
        <FaUserCircle className="profile-icon" />

        {firstName ? (
          <>
            <p>Welcome, {firstName}!</p>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

            <div className="cart-wrapper" onClick={handlecart}>
              <FaShoppingCart className="carticon" />
              {cartQty > 0 && (
                <span className="cart-badge">{cartQty}</span>
              )}
            </div>
          </>
        ) : (
          <p>
            <Link className="log" to="/signin">LogIn</Link>
          </p>
        )}
      </div>
    </div>
  );
};
