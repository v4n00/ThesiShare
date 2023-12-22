import "./Session.css"

function Session({sessionId, currentStudents, maxStudents, onClick }){

    const handleClickSession = ()=>{
        document.getElementById('phaseMain').style.display = 'none'
        document.getElementById('phasePre').style.display = 'block'
        onClick(sessionId);
    }

    return(
        <div className="sessionContainer" onClick={handleClickSession}>
            <div className="sessionId">Session Id: {sessionId}</div>
            <div className="currentStudents">Current Students: {currentStudents}</div>
            <div className="maxStudents">Maximum Students: {maxStudents}</div>
        </div>
    )
}

export default Session;