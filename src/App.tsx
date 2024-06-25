import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapWithTab from './components/MapWithTab/MapWithTab';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import AuthDetails from './components/AuthDetails/AuthDetails';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
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
