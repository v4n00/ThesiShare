import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { url } from '../../Constants';
import './PhaseThree.css';

function PhaseThree() {
	const [currentMainRequest, setCurrentMainRequest] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios
				.post(`${url}validate-token`, {
					token: localStorage.getItem('token'),
				})
				.catch((err) => {
					toast.error(err.response.data);
				});

			axios
				.get(`${url}mainrequest/student/${response.data.userId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then((mainRequest) => {
					setCurrentMainRequest(mainRequest.data);
				})
				.catch((err) => {});
		};

		fetchData();
	}, []);

	const handleDownload = () => {
		const downloadFile = async () => {
			try {
				const response = await axios
					.get(`${url}/mainrequest/downloadProfessorFile/${currentMainRequest.mainRequestId}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						responseType: 'blob',
					})
					.catch((err) => {
						toast.error(err.response.data);
					});

				const blob = new Blob([response.data]);

				const downloadLink = document.createElement('a');
				downloadLink.href = window.URL.createObjectURL(blob);

				downloadLink.download = 'student-request.pdf';

				document.body.appendChild(downloadLink);
				downloadLink.click();

				document.body.removeChild(downloadLink);
			} catch (error) {
				toast.error(error.message);
			}
		};

		downloadFile();
	};

	return <div className="phaseThreeContainer">{currentMainRequest && currentMainRequest?.status == 'accepted' ? <button onClick={handleDownload}>Download signed Request</button> : <div>You didnt send any request or the professor didnt accept it.</div>}</div>;
}

export default PhaseThree;
