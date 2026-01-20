import React from 'react'
import "../styles/css/Forget.css"

export const Forget = () => {
  return (
    <div className="image">
          <div>
            <div id="forgetP">
              <h2 className='forget'>Forget Password</h2> 
              <form action>
                <label htmlFor="email" />
                <input type="text" placeholder="Email" /> 
                <label htmlFor="password" />
                <input type="password" placeholder="New Password" />
                 <label htmlFor="password" />
                <input type="password" placeholder="Confirm Password" />
              </form>
              
              <button id='ForgetB'>
                Submit
              </button>
        
              </div>
            </div>
          </div>
  )
}
