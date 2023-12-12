import './App.css';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Login from "./Components/Login/Login"
import Navigation from "./Components/Navigation/Navigation"
import Homepage from "./Components/Homepage/Homepage"

const routes = createRoutesFromElements(
  <>
    <Route path='/' element={<Navigation/>}>
      <Route path="/home" element={<Homepage/>} />
      <Route path="/login" element={<Login/>}/>
    </Route>
  </>
)

const router = createBrowserRouter(routes)

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
