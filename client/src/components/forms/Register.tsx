import { Link } from "react-router-dom";
import { Signup } from "./Signup";

export const Register = () => {     
    return (   
        <div className="md:mx-auto mx-5 flex flex-col items-center">
            <p className="mt-20 mb-5 text-xl font-semibold">Create an account</p>
            <Signup />
            <p className="text-center mt-5">Already have an account? <Link to="/login" className="text-[#09a0d3] font-bold">Login</Link></p>
        </div>
    )
}