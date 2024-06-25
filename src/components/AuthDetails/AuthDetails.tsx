import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import './AuthDetails.css';

const AuthDetails: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  function userSignOut() {
    signOut(auth)
      .then(() => console.log('success'))
      .catch((e) => console.log(e));
  }

  return (
    <div className="account">
      {authUser ? (
        <>
          <div className="account_title">ACCOUNT</div>
          <div className="account_profile">PROFILE</div>
          <div className="account_info">
            <div className="info_email">
              Email
              <div className="block_email">
                <div className="email_props">{authUser.email}</div>
              </div>
            </div>
          </div>
          <button onClick={userSignOut} className="logout_button">
            LogOut
          </button>
        </>
      ) : (
        <div className="not-logged-in">
          <p>You are not logged in. Please log in to access your account.</p>
          <button className="login_button">
            <Link className="auth_link" to="/sign-in">
              Sign In
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthDetails;
