import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import MapWithTab from './components/MapWithTab/MapWithTab';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import AuthDetails from './components/AuthDetails/AuthDetails';
import { auth } from './firebase';
import { User } from 'firebase/auth';
import {
  ROOT_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  AUTH_PATH,
  MAP_PATH,
} from './routes';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path={ROOT_PATH}
            element={
              user ? <Navigate to={MAP_PATH} /> : <Navigate to={SIGN_IN_PATH} />
            }
          />
          <Route path={SIGN_IN_PATH} element={<SignIn />} />
          <Route path={SIGN_UP_PATH} element={<SignUp />} />
          <Route path={AUTH_PATH} element={<AuthDetails />} />
          <Route path={MAP_PATH} element={<MapWithTab />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
