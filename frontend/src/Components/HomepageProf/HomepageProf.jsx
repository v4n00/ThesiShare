import { useEffect, useState } from "react"
import "./HomepageProf.css"
import Session from "../PhasesProf/Session/Session";
import PreRequest from "../PhasesProf/PreRequest/PreRequest"
import MainRequest from "../PhasesProf/MainRequest/MainRequest";
import axios from "axios";
import { url, header } from "../Constants.js";

function HomepageProf({onLoginSuccess}){
    const [sessions, setSessions] = useState([]);
    const [preRequests, setPreRequests] = useState([]);
    const [mainRequest, setMainRequest] = useState({});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post(`${url}validate-token`, {
              token: localStorage.getItem("token"),
            });

            axios.get(`http://localhost:8080/api/registration-session/${response.data.userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((sessionsRes) => {
              setSessions(sessionsRes.data)
              console.log(sessionsRes)
            });
          } 
          catch (err) {
            console.error(err);
          }
        };
      
        fetchData();
      }, []);

    
    const handleSession = (clickedSessionId)=>{
        console.log(`Clicked on session with ID ${clickedSessionId}`);
        axios.get(`http://localhost:8080/api/prerequest/${clickedSessionId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res)=>{
            console.log(res)
            setPreRequests(res.data);
        })
    }

    const handlePreRequest = (preRequestId, studentIdForPrereq, action, justification, status) => {
        console.log(`Clicked on student with ID ${studentIdForPrereq}, Action: ${action}, prereqid: ${preRequestId}, justi ${justification}, status ${status}`);
        
        //accept/reject students
        if(action==="accept")
        {
            console.log("Acc", localStorage.getItem("token"), preRequestId)
            axios.put("http://localhost:8080/api/prerequest/accept", { id: preRequestId }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
            .then((res)=>{
                console.log(res);
            })
        }
        else if(action==="reject" && justification)
        {
            console.log("Rej", localStorage.getItem("token"), preRequestId)
            axios.put("http://localhost:8080/api/prerequest/reject", { requestId: preRequestId, justification: justification }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
            .then((res)=>{
                console.log(res);
            })
        }

        //get Main request by student id if the student is accepted
        if(status=='accepted')
        {
          axios.get(`${url}mainrequest/student/${studentIdForPrereq}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res)=>{
            console.log(res.data)
            setMainRequest(res.data);
          })
        }
    };
      

    return(
        <div className="homeContainer">
            <div className="homeDetails">
                Welcome User
            </div>
            <div className="homeButtons">
                <div className="phaseProf">
                    Select Session
                </div>
                <div className="phaseProf">
                    Pre Requests
                </div>
                <div className="phaseProf">
                    Main Requests
                </div>
            </div>
            <div className="homeProfPhases">
                <div className="homePhaseContainer" id="phaseSession">
                    <div className="homePhaseContent">
                        {sessions.map((session, index) => (
                            <Session
                            key={index}
                            sessionId={session.sessionId}
                            currentStudents={session.currentStudents}
                            maxStudents={session.maxStudents}
                            onClick={handleSession}
                            />
                        ))}
                    </div>
                </div>
                <div className="homePhaseContainer" id="phasePre">
                    <div className="homePhaseContent">
                        {preRequests.map((preRequest, index) =>(
                            <PreRequest
                            key={index}
                            status={preRequest.status}
                            preRequestId={preRequest.preRequestId}
                            studentId={preRequest.studentId}
                            studentName = {preRequest.Student.name}
                            prereqTitle={preRequest.title}
                            onClick={handlePreRequest}
                            />
                        ))}
                    </div>
                </div>
                <div className="homePhaseContainer" id="phaseMain">
                    <div className="homePhaseContent">
                          <MainRequest
                            mainReqId={mainRequest.mainRequestId}
                            status={mainRequest.status}
                          />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomepageProf