import React, { useState } from 'react';
import '../styles/css/Signup.css';
import { signupUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    city: "",
    hotelname: "",
    address: "",
    email: "",
    phonenumber: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // handle signup submit
  const handleSignup = async (e) => {
    e.preventDefault();

    // simple validation
    for (let key in formData) {
      if (!formData[key]) {
        alert("All fields are required");
        return;
      }
    }

    try {
      setLoading(true);

      const res = await signupUser(formData);

      if (res.data.success) {
        alert("Registration successful");
        navigate("/signin");
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image">
      <div>
        <div id="register">
          <h2>REGISTER</h2>

          <form onSubmit={handleSignup}>
            <div className='form'>

              <div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="FirstName"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="middlename"
                  placeholder="MiddleName"
                  value={formData.middlename}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="LastName"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="hotelname"
                  placeholder="HotelName"
                  value={formData.hotelname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phonenumber"
                  placeholder="PhoneNumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button id="submit" type="submit" disabled={loading}>
              {loading ? "Creating..." : "SignUp"}
            </button>

            <p id='already'>
              already have account?
              <span>
                <a id='reg' href="/signin"> Signin</a>
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};
