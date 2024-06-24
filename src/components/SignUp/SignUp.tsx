import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  function register(e:any) {
    e.preventDefault();
    if (copyPassword !== password) {
      setError("Passwords didn't match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
      })
      .catch((error) => console.log(error));
  }
  return (

    <div className="wrapper">
            
            <div className="main">
                    <div className="container">
                        
                        <div className="main_txtregis">
                        Sign Up
                        </div>
                       <div className="main_blockregistr">
                            <form  className="form_input"  onSubmit={register}>
                                    <h2>Create an account</h2>
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
                                    <input className="forregist"
                                    placeholder="Please enter your password again"
                                    value={copyPassword}
                                    onChange={(e) => setCopyPassword(e.target.value)}
                                    type="password"
                                    />
                                    <button className="main_button">Create</button>
                                    {error ? <p style={{ color: "red" }}>{error}</p> : ""}
                                </form>
                            
                            
                            <div className="main_txt">
                            Already have an account?<Link className="txt_update" to="/sign-in">Sign In</Link>
                            </div>
                            
                            
                            
                            
                            
                        </div>
                        
                        
                    </div>
                </div>
            
            


        </div>
    


      
    
  );
};

export default SignUp;