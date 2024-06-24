import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function logIn(e:any) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setPassword("");
        window.location.href = `/map`
      })
        .catch((error) => {
            console.log(error);
            setError("SORRY, COULDN'T FIND YOUR ACCOUNT")
      });
  }
  return (
    <div>
        <div className="wrapper">
            
            <div className="container">
                <div className="signform">
                   
                    <div className="signform_signin">
                        Sign In

                    </div>

                    <div className="signform_form">
                        <div className="form_input">
                            <input className="forregist"
                                placeholder="Please enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                            />
                            <input className="forregist"
                                placeholder="Please enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                            
                        </div>
                            
                        <div className="form_forgot">
                            Forgot password?

                        </div>
                        <button className="form_button" onClick={logIn}>Login</button>
                        {error ? <p style={{ color: "red" }}>{error}</p> : ""}
                        <div className="form_accout">
                                Don’t have an account? 
                                <Link className="accout_link" to="/sign-up">Sign Up</Link>
                                

                        </div>


                    </div>
                    
                </div>

            </div>
            


        </div>
      {/* <form>
        <h2>Log in</h2>
        <input
          placeholder="Please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          placeholder="Please enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button onClick={logIn}>Login</button>
        {error ? <p style={{ color: "red" }}>{error}</p> : ""}
      </form> */}
    </div>
  );
};

export default SignIn;