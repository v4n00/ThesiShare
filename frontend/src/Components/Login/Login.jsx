import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from 'axios';
import { url, header } from "../Constants.js";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // TO DO check the Token

          onLoginSuccess();
          navigate("/home");
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    checkTokenAndRedirect();
  }, [onLoginSuccess, navigate]);
  
  const handleToggle = () => {
    setIsProfessor(!isProfessor);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    let routeLink = isProfessor === true ? 'professor' : 'student';
    axios.post(`${url}${routeLink}/login`, { email, password }, header)
      .then((res) => {
        console.log(res.data.token);
        onLoginSuccess();
        localStorage.setItem("token", res.data.token);
        navigate('/home');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <div className="loginTitle">Login</div>
        <form className="loginForm" onSubmit={handleLogin}>
        <div className="switch-container">
      <label className="switch">
        <input 
          type="checkbox" 
          checked={isProfessor} 
          onChange={handleToggle} 
        />
        <span className="slider round"></span>
      </label>
      <span className="roleLabel">
        {isProfessor ? 'Professor' : 'Student'}
      </span>
    </div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="loginBtn">
            Login
          </button>
          <button type="submit" className="loginBtn" onClick={()=>navigate("/register")}>
            Go to register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
