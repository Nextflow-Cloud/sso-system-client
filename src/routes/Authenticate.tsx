import { Navigate } from "react-router-dom";
import Authenticated from "../components/helpers/Authenticated";

const Authenticate = () => {
    return (
        <>
            <Authenticated>
                <Navigate to="/account" /> {/* sso.nextflow.cloud */}
            </Authenticated>
        </>
    );
};

export default Authenticate;
