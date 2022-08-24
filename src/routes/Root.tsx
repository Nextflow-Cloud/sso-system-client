import { Navigate } from "react-router-dom";
import Authenticated from "../components/helpers/Authenticated";

const Root = () => {
    return (
        <>
            <Authenticated>
                <Navigate to="/account" />
            </Authenticated>
        </>
    );
};

export default Root;
