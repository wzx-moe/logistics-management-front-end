import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login.js"
import Customer from "./Customer";
import Logout from "./Logout";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/customer" element={<Customer/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
