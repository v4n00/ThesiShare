import "./Navigation.css"
import { Outlet } from "react-router-dom"

function Navigation(){
    return(
        <>
            <div className="navContainer">
                
            </div>
            <div className='outlet'>
                <Outlet/>
            </div>
        </>
    )
}

export default Navigation