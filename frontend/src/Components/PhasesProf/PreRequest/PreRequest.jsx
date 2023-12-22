import "./PreRequest.css"

function PreRequest({studentId, studentName, prereqTitle, onClick }){

    const handleClickSession = (action)=>{
        document.getElementById('phaseMain').style.display = 'block'
        onClick(studentId, action);
    }

    return(
        <div className="prereqContainer" onClick={handleClickSession}>
            <div className="studentName">Student Name: {studentName}</div>
            <div className="prereqTitle">Thesis Title: {prereqTitle}</div>
            <div className="acceptanceButtons">
                <div className="prereqAccept" onClick={() => handleClickSession("accept")}></div>
                <div className="prereqReject" onClick={() => handleClickSession("reject")}></div>
            </div>
            <input className="prereqJustification"></input>
            <button>Submit</button>
        </div>
    )
}

export default PreRequest;