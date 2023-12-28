import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { url } from '../Constants.js';
import MainRequest from '../PhasesProf/MainRequest/MainRequest';
import PreRequest from '../PhasesProf/PreRequest/PreRequest';
import Session from '../PhasesProf/Session/Session';
import './HomepageProf.css';

function HomepageProf({ onLoginSuccess }) {
	const [sessions, setSessions] = useState([]);
	const [preRequests, setPreRequests] = useState([]);
	const [mainRequest, setMainRequest] = useState({});
	const [sessionValues, setSessionValues] = useState([]);
	const [currentProfessorId, setCurrentProfessorId] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.post(`${url}validate-token`, {
					token: localStorage.getItem('token'),
				});
				setCurrentProfessorId(response.data.userId)

				axios
					.get(`http://localhost:8080/api/registration-session/${response.data.userId}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					})
					.then((sessionsRes) => {
						setSessions(sessionsRes.data);
					})
					.catch((err) => {
						toast.error(err.response.data);
					});
			} catch (err) {
				toast.error(err.response.data);
			}
		};

		fetchData();
	}, []);

	const handleSession = (clickedSessionId) => {
		axios
			.get(`http://localhost:8080/api/prerequest/${clickedSessionId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				setPreRequests(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	const handlePreRequest = (preRequestId, studentIdForPrereq, action, justification, status) => {
		//accept/reject students
		if (action === 'accept') {
			axios
				.put(
					'http://localhost:8080/api/prerequest/accept',
					{ id: preRequestId },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
				.then((res) => {})
				.catch((err) => {
					toast.error(err.response.data);
				});
		} else if (action === 'reject' && justification) {
			axios
				.put(
					'http://localhost:8080/api/prerequest/reject',
					{ requestId: preRequestId, justification: justification },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
				.then((res) => {})
				.catch((err) => {
					toast.error(err.response.data);
				});
		}

		//get Main request by student id if the student is accepted
		if (status == 'accepted') {
			axios
				.get(`${url}mainrequest/student/${studentIdForPrereq}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then((res) => {
					setMainRequest(res.data);
				})
				.catch((err) => {
					toast.error(err.response.data);
				});
		}
	};

	const openModalSession = () =>{
		const modalContainer = document.getElementById('modalContainer')
		const modal = document.getElementById('modalSession')
		modalContainer.style.display = 'block'
	}

	const closeModalSession = (e) =>{
		const modalContainer = document.getElementById('modalContainer')
		console.log(e.target.id)
		if(e.target.id!="modalSession" && e.target.id=="modalContainer")
		modalContainer.style.display = 'none'
	}

	const handleChange = (index, value)=>{
		setSessionValues((prevValues) => {
			const updatedValues = [...prevValues];
			updatedValues[index] = value;
			return updatedValues;
		});
	}

	const createSession = () =>{
		const startTimeUnix = Math.floor(new Date(sessionValues[1]).getTime() / 1000) * 1000;
		const endTimeUnix = Math.floor(new Date(sessionValues[2]).getTime() / 1000) * 1000;
		axios.post(`${url}registration-session/create`,
		{ 	professorId: currentProfessorId,
			startTime : startTimeUnix, 
			endTime : endTimeUnix, 
			maxStudents : sessionValues[0]
		},
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then((res)=>{
			toast.success(res.statusText)
		})
		.catch((err)=>{
			toast.error(err.response.data)
		})
	}

	return (
		<div className="homeContainer">
			<div id='modalContainer' onClick={closeModalSession}>
				<div id='modalSession'>
					<label htmlFor="maxStud">Max Students</label>
					<input type="number" name="maxStud" onChange={(e) => handleChange(0, e.target.value)} />
					<label htmlFor="startTime">Session Start</label>
					<input type="datetime-local" name="startTime" onChange={(e) => handleChange(1, e.target.value)} />
					<label htmlFor="endTime">Session End</label>
					<input type="datetime-local" name="endTime" onChange={(e) => handleChange(2, e.target.value)} />
					<button onClick={createSession}>Create Session</button>
				</div>
			</div>
			<div className="homeDetails">
				Welcome User
				<button className='createSessionBtn' onClick={openModalSession}>Create Session</button>
			</div>
			<div className="homeButtons">
				<div className="phaseProf">Select Session</div>
				<div className="phaseProf">Pre Requests</div>
				<div className="phaseProf">Main Requests</div>
			</div>
			<div className="homeProfPhases">
				<div className="homePhaseContainer" id="phaseSession">
					<div className="homePhaseContent">
						{sessions.map((session, index) => (
							<Session key={index} sessionId={session.sessionId} currentStudents={session.currentStudents} maxStudents={session.maxStudents} onClick={handleSession} />
						))}
					</div>
				</div>
				<div className="homePhaseContainer" id="phasePre">
					<div className="homePhaseContent">
						{preRequests.map((preRequest, index) => (
							<PreRequest key={index} status={preRequest.status} preRequestId={preRequest.preRequestId} studentId={preRequest.studentId} studentName={preRequest.Student.name} prereqTitle={preRequest.title} onClick={handlePreRequest} />
						))}
					</div>
				</div>
				<div className="homePhaseContainer" id="phaseMain">
					<div className="homePhaseContent">
						<MainRequest mainReqId={mainRequest.mainRequestId} status={mainRequest.status} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomepageProf;
