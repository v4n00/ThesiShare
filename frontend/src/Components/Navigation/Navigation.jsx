import "./Navigation.css"
import { Outlet, useNavigate } from "react-router-dom"

function Navigation(){
    const navigate = useNavigate();
    return(
        <>
            <div className="navContainer">
                <div className="navTitle">
                    ThesiShare
                </div>
                <div className="navButtons">
                    <div className="logout" onClick={()=>{navigate("/login")}}>
                        Logout
                    </div>
                </div>
            </div>
            <div className='outlet'>
                <Outlet/>
            </div>
        </>
    )
}

export default Navigation