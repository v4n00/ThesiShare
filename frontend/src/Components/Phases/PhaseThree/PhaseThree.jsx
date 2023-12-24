import { useEffect, useState } from "react"
import "./PhaseThree.css"
import {url} from '../../Constants'
import axios from "axios"

function PhaseThree(){
    const [currentMainRequest, setCurrentMainRequest] = useState();

    useEffect(()=>{
      const fetchData = async () => {
        try {
          const response = await axios.post(`${url}validate-token`, {
            token: localStorage.getItem("token"),
          });

          axios.get(`${url}mainrequest/student/${response.data.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((mainRequest) => {
            setCurrentMainRequest(mainRequest.data)
          })
          .catch((err)=>{
            console.log(err)
          });
        } 
        catch (err) {
          console.error(err);
        }
      };
    
      fetchData();
    },[])

    const handleDownload = () =>{
        const downloadFile = async () => {
            try {
              const response = await axios.get(`${url}/mainrequest/downloadProfessorFile/${currentMainRequest.mainRequestId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob',
              });
      
              console.log(response);
              const blob = new Blob([response.data]);
      
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
      
              downloadLink.download = 'student-request.pdf';
      
              document.body.appendChild(downloadLink);
              downloadLink.click();
      
              document.body.removeChild(downloadLink);
            } catch (error) {
              console.error('Error downloading file:', error);
            }
          };
      
          downloadFile();
    }

    return(
        <div className="phaseThreeContainer">
            {
            (currentMainRequest && currentMainRequest?.status == "accepted")?
            <button onClick={handleDownload}>Download signed Request</button>
            :
            <div>You didnt send any request or the professor didnt accept it.</div>
            }
        </div>
    )
}

export default PhaseThree