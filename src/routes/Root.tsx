import { Navigate } from "react-router-dom";
import Authenticated from "../components/helpers/Authenticated";

const Root = () => {
    return (
        <>
            <Authenticated>
                <Navigate to="/account" /> {/* sso.nextflow.cloud */}
            </Authenticated>
        </>
    );
};

export default Root;
