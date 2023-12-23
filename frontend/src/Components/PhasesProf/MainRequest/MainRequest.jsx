import "./MainRequest.css"

function MainRequest({mainReqId, status, profFile, studFile}){
    return(
        <div className="mainreqContainer">
            <div>
                {mainReqId}
            </div>
            <div>
                {status}
            </div>
        </div>
    )
}

export default MainRequest;