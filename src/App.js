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
import PackageDetail from "./PackangDetail";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/customer/:name" element={<Customer/>}/>
                <Route path="/driver/:name" element={<Driver/>}/>
                <Route path="/warehouse/:name" element={<Warehouse/>}/>
                <Route path="/customer-service/:name" element={<CustomerService/>}/>
                <Route path="/manager/:name" element={<Manager/>}/>
                <Route path="/package-detail" element={<PackageDetail/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
