import { useState } from "react";
import "./PreRequest.css"

function PreRequest({preRequestId,studentId, studentName, prereqTitle, status, onClick }){
    const [justification, setJustification] = useState('');

    const handleClickSession = (action)=>{
        if(status=='accepted')
        document.getElementById('phaseMain').style.display = 'block'
        onClick(preRequestId, studentId, action, justification, status);
    }

    return(
        <div className="prereqContainer" style={{backgroundColor: status==="accepted" ? "green" : status==="rejected" ? "red" : "aqua"}} onClick={handleClickSession}>
            <div className="studentName">Student Name: {studentName}</div>
            <div className="prereqTitle">Thesis Title: {prereqTitle}</div>
            {status==="pending"?(
                <div className="pendingControls">
                    <div className="acceptanceButtons">
                        <div className="prereqAccept" onClick={() => handleClickSession("accept")}></div>
                        <div className="prereqReject" onClick={() => handleClickSession("reject")}></div>
                    </div>
                    <input className="prereqJustification"
                     value={justification}
                     onChange={(e) => setJustification(e.target.value)}
                    />
                </div>
            ):status==='accepted'?(
            <div></div>
            ):status==='rejected'?(
            <div></div>
            ):null}
        </div>
    )
}

export default PreRequest;