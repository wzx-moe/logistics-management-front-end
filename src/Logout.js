import {Alert, Button} from "reactstrap";
import {useNavigate} from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    return (
        <div className="container">
            {localStorage.clear()}
            <div className="justify-content-center p-5 text-center"><Alert color="warning"><h3>Logout Successful!</h3>
                <p></p>
                <Button
                    color="warning" outline onClick={() => navigate(-1)}>Back</Button></Alert></div>
        </div>)


}