import './App.css';
import { useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, useNavigate, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Navigation from "./Components/Navigation/Navigation";
import Homepage from "./Components/Homepage/Homepage";
import Register from "./Components/Register/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navigation />}>
        
        <Route path="register" element={<Register/>} />
        <Route path="home" element={<ProtectedRoute component={Homepage} isLoggedIn={isLoggedIn} />} />
        <Route index element={<Login onLoginSuccess={onLoginSuccess}/>} />
        <Route path='login' element={<Login onLoginSuccess={onLoginSuccess}/>} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

const ProtectedRoute = ({ component: Component, isLoggedIn }) => {
  if (isLoggedIn) {
    return <Component />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App;