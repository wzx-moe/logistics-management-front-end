import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login.js"
import Customer from "./Customer";
import Logout from "./Logout";
import Driver from "./Driver";
import Warehouse from "./Warehouse";
import CustomerService from "./CustomerService";
import Chat from "./Chat";
import Manager from "./Manager";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/customer" element={<Customer/>}/>
                <Route path="/driver" element={<Driver/>}/>
                <Route path="/warehouse" element={<Warehouse/>}/>
                <Route path="/customer-service" element={<CustomerService/>}/>
                <Route path="/manager" element={<Manager/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
