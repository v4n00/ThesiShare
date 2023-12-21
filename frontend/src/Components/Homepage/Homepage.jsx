import { useState } from "react"
import "./Homepage.css"
import PhaseOne from "../Phases/PhaseOne/PhaseOne";
import PhaseTwo from "../Phases/PhaseTwo/PhaseTwo";
import PhaseThree from "../Phases/PhaseThree/PhaseThree";

function Homepage({onLoginSuccess}){
    const [activePhase, setActivePhase] = useState();

    return(
        <div className="homeContainer">
            {/* Estetizat homeDetails */}
            <div className="homeDetails">
                Welcome User
            </div>
            {/* Estetizat homeButtons */}
            <div className="homeButtons">
                <div className="phaseOne phase" onClick={()=>{setActivePhase(1)}}>
                    Select Teacher
                </div>
                <div className="phaseTwo phase" onClick={()=>{setActivePhase(2)}}>
                    Upload Request
                </div>
                <div className="phaseThree phase" onClick={()=>{setActivePhase(3)}}>
                    Download Approved Request
                </div>
            </div>
            {/* Estetizat homePhases */}
            <div className="homePhases">
                {activePhase===1?(
                <PhaseOne/>
                ):activePhase===2?(
                <PhaseTwo/>
                ):activePhase===3?(
                <PhaseThree/>
                ):null}
            </div>
        </div>
    )
}

export default Homepage