import React, { useState } from 'react';
import '../styles/css/Login.css';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrphonenumber: "",
    password: ""
  });

  const [formError, setFormError] = useState("");


  const [errors, setErrors] = useState({
  emailOrphonenumber: "",
  password: ""
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });

  setErrors({
    ...errors,
    [name]: validateField(name, value)
  });
};


  const validateField = (name, value) => {
  let error = "";

  if (!value.trim()) {
    if (name === "emailOrphonenumber") {
      error = "Email or phone number must not be blank";
    }
    if (name === "password") {
      error = "Password must not be blank";
    }
  }

  return error;
};


const handleBlur = (e) => {
  const { name, value } = e.target;

  setErrors({
    ...errors,
    [name]: validateField(name, value)
  });
};



const handleLogin = async (e) => {
  e.preventDefault();
  setFormError(""); 

  const newErrors = {
    emailOrphonenumber: validateField(
      "emailOrphonenumber",
      formData.emailOrphonenumber
    ),
    password: validateField(
      "password",
      formData.password
    )
  };

  setErrors(newErrors);

  if (newErrors.emailOrphonenumber || newErrors.password) {
    return; 
  }

  try {
    setLoading(true);

    const isEmail = formData.emailOrphonenumber.includes('@'); // Check if it's an email

    const res = await loginUser({
      email: isEmail ? formData.emailOrphonenumber : null,
      phonenumber: isEmail ? null : formData.emailOrphonenumber,
      password: formData.password
    });

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("firstname", res.data.firstname); // Save first name
      navigate("/");  // Redirect to homepage or dashboard
    } else {
      setFormError(res.data.message || "Invalid email/phone or password");
    }

  } catch (error) {
    setFormError(error.response?.data?.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="image">
      <div>
        <div id="login">
          <h2>LOGIN</h2> 

          <form onSubmit={handleLogin}>

            <input
              type="text"
              name="emailOrphonenumber"
              placeholder="Email or Phonenumber"
              value={formData.emailOrphonenumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.emailOrphonenumber ? "input-error" : ""}
            /> 

            {errors.emailOrphonenumber && (
              <p className="error-text">{errors.emailOrphonenumber}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password ? "input-error" : ""}
            />

            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}

            <button id='LoginB' type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {formError && (
            <p className="error-text center-error">{formError}</p>
            )}

          </form>
           
          <a href="/forget">
            <p id="forget">Forget Password?</p> 
          </a>

          <p id="or">OR</p> 

          <div id="logo">
            <a href="https://www.google.com">
              <FcGoogle className='google' />
            </a>

            <a href="https://www.facebook.com">
              <FaFacebook className='facebook' />
            </a>

            <a href="https://www.twitter.com">
              <AiFillTwitterCircle className='twitter' /> 
            </a>

            <p className='dont'>don't have account?
              <span>
                <a id='reg' href="/signup"> SignUp</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div> 
  );
};
