import { Link } from "react-router-dom";

export const Error = () => {
    return (
        <div>
            <p>OOPS! this route doesn't exist</p>
            <p>Go back to <Link to="/">home page</Link></p>
        </div>
    )
};