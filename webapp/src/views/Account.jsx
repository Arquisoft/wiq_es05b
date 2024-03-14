import {Fragment} from "react";
import ProtectedComponent from "./components/ProtectedComponent";

export default function Account() {
    return (
        <Fragment>
            <ProtectedComponent />
        </Fragment>
    )
}