import { useEffect, useState } from "react"
import "./HomepageProf.css"
import Session from "../PhasesProf/Session/Session";
import PreRequest from "../PhasesProf/PreRequest/PreRequest"
import axios from "axios";

function HomepageProf({onLoginSuccess}){
    const [sessions, setSessions] = useState([]);
    const [preRequests, setPreRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post("http://localhost:8080/api/validate-token", {
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

    const handlePreRequest = (studentIdForPrereq, action) => {
        console.log(`Clicked on prereq with ID ${studentIdForPrereq}, Action: ${action}`);
        
        //accept/reject students

        //get Main request by student id if the student is accepted
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

                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomepageProf