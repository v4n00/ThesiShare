import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { header, url } from '../Constants.js';
import './Login.css';

function Login({ onLoginSuccess }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isProfessor, setIsProfessor] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const checkTokenAndRedirect = async () => {
			const storedToken = localStorage.getItem('token');

			if (storedToken) {
				try {
					axios
						.post('http://localhost:8080/api/validate-token', { token: localStorage.getItem('token') })
						.then((res) => {
							if (res.data.role == 'Professor') {
								onLoginSuccess();
								navigate('/home-prof');
							} else {
								onLoginSuccess();
								navigate('/home');
							}
						})
						.catch((err) => {
							toast.error(err.response.data);
						});
				} catch (error) {
					toast.error(error.response.data);
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
		axios
			.post(`${url}${routeLink}/login`, { email, password }, header)
			.then((res) => {
				onLoginSuccess();
				localStorage.setItem('token', res.data.token);
				if (isProfessor == false) navigate('/home');
				else navigate('/home-prof');
			})
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	return (
		<div className="loginPage">
			<div className="loginContainer">
				<div className="loginTitle">Login</div>
				<form className="loginForm" onSubmit={handleLogin}>
					<div className="switch-container">
						<label className="switch">
							<input type="checkbox" checked={isProfessor} onChange={handleToggle} />
							<span className="slider round"></span>
						</label>
						<span className="roleLabel">{isProfessor ? 'Professor' : 'Student'}</span>
					</div>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
					<button type="submit" className="loginBtn">
						Login
					</button>
					<button type="submit" className="loginBtn" onClick={() => navigate('/register')}>
						Go to register
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
