import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapWithTab from './components/MapWithTab/MapWithTab';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import AuthDetails from './components/AuthDetails/AuthDetails';
import { auth } from './firebase';
import { User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/map" /> : <Navigate to="/sign-in" />}
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/auth" element={<AuthDetails />} />
          <Route path="/map" element={<MapWithTab />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
