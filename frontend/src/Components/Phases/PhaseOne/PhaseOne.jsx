import { useEffect, useState } from "react";
import "./PhaseOne.css"
import axios from 'axios'
import {url} from "../../Constants"

function PhaseOne(){
    const [professors,setProfessors] = useState([]);
    const [selectedSession, setSelectedSession] = useState();
    const [studentId, setStudentId] = useState();
    const [title, setTitle] = useState();
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(()=>{
            const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const headers = {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            };

            //gets all sessions
            axios.get("http://localhost:8080/api/registration-session", headers)
            .then(res =>{
                console.log(res.data);
                setProfessors(res.data.map((professor) => professor));
            })
            .catch(err =>{
                console.log(err);
            })

            //gets the current student logged in
            axios.post("http://localhost:8080/api/validate-token", {token:localStorage.getItem("token")})
            .then(res =>{
                console.log(res.data)
                setStudentId(res.data.userId)

                axios.get(`${url}/prerequest/student/${res.data.userId}`, headers)
                .then((res)=>{
                    res.data.map((prereq)=>{
                        if(prereq.status==='accepted')
                        {
                            setIsAccepted(true);
                        }
                    })
                })
            })
        }

    },[])

    const handleSubmit = ()=>{
        console.log(selectedSession)

        const storedToken = localStorage.getItem("token");

        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        };

        const sessionId = parseInt(selectedSession);

        console.log(studentId, sessionId, title)

        axios.post("http://localhost:8080/api/prerequest", { studentId, sessionId, title }, headers)
        .then(()=>{

        });
        
    }

    return(
        <div>
            {isAccepted?
            <div>You were accepted! Upload the request for your teacher to evaluate</div>
            :
            <div className="phaseOneContainer">
                <div className="textPhaseOne">
                    <div>
                    Choose one or more professors from the list to propose for thesis guidance
                    </div>
                    <div>
                    Only one professor will be able to accept
                    </div>
                </div>
                <select className="dropdownTeachers" onChange={(e)=>{setSelectedSession(e.target.value); console.log(e.target.value)}}>
                    {professors.map((professor)=>(
                        <option key={professor.sessionId} value={professor.sessionId}>
                            {"Session " + professor.sessionId + " Professor " + professor.Professor.name}
                        </option>
                    ))}
                </select>
                <div className="textPhaseOne">Select a name for your Thesis</div>
                <input className="dropdownTeachers" type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <button className="submitBtn" onClick={handleSubmit}>
                        Submit Choice
                </button>
            </div>
            }
        </div>
    )
}

export default PhaseOne
