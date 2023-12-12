import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

function Login(){

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleLogin = ()=>{
        //axios testing in backend if the user exists
        navigate("/home")
    }

    return(
        <div className="loginPage">
      <div className="loginContainer">
        <div className="loginTitle">Login</div>
        <form className="loginForm">
          <label for="fname">Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
          <label for="fname">Parola</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginBtn" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </div>
    )
}

export default Login