import axios from 'axios';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { url } from '../../Constants';
import './MainRequest.css';

function MainRequest({ mainReqId, status, profFile, studFile }) {
	const [acceptedSession, setAcceptedSession] = useState();

	const [file, setFile] = useState(0);

	const onDrop = useCallback((acceptedFiles) => {
		setFile(acceptedFiles.at(0));
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => onDrop(acceptedFiles, 1),
		multiple: false,
	});

	const handleDownload = () => {
		const downloadFile = async () => {
			try {
				const response = await axios
					.get(`${url}/mainrequest/downloadStudentFile/${mainReqId}`, {
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
			} catch (error) {}
		};

		downloadFile();
	};

	const handleUploadSigned = () => {
		const formData = new FormData();
		formData.append('file', file);

		axios
			.put(`${url}mainrequest/uploadProfessorFile/${mainReqId}`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			.catch((err) => {
				toast.error(err.response.data);
			});

		axios
			.put(
				`${url}/mainrequest/accept`,
				{ requestId: mainReqId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			)
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	const handleReject = () => {
		axios
			.put(
				`${url}/mainrequest/reject`,
				{ requestId: mainReqId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			)
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	return (
		<div className="mainreqContainer">
			<div>{mainReqId}</div>
			<div>{status}</div>
			<button onClick={handleDownload}>Download Request Paper</button>
			<div className="signedThesisDrop">
				<section>
					<div className="uploadArea" {...getRootProps()}>
						<input {...getInputProps()} />
						<span>Click or Drag here</span>
					</div>
				</section>
			</div>

			<button onClick={handleUploadSigned}>Send signed Paper</button>

			<button onClick={handleReject}>Reject Request Paper</button>
		</div>
	);
}

export default MainRequest;
