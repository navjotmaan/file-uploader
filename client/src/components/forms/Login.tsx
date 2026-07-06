import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/ContextApi";

export const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.log('log in failed', err);
        }
    }
    return (
        <div className="mx-5 md:m-auto flex flex-col items-center">
            <p className="text-center mt-20 mb-5 text-xl font-semibold">Log in to your account</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm border border-[#dee2e6] px-5 py-10 bg-[#f8f9fa] rounded-lg shadow-md">
                <div className="flex flex-col">
                    <label htmlFor="email">Email </label>
                    <input id="email" type="email"
                        name="email"
                        value={formData.email}
                        required
                        onChange={handleChange} 
                        placeholder="john@example.com"
                        className="placeholder:text-gray-400 border rounded-lg px-2 py-[2px]" 
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Password </label>
                    <input id="password" type="password"
                        name="password"
                        value={formData.password}
                        required
                        onChange={handleChange} 
                        placeholder="••••••••"
                        className="placeholder:text-gray-400 border rounded-lg px-2 py-[2px]" 
                    />
                </div>

                <button type="submit" className="bg-[#09a0d3] text-white mt-5 cursor-pointer w-[40%] rounded-lg font-bold py-1 hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">Log in</button>
            </form>

            <p className="text-center mt-5">Don't have an account? <Link to="/register" className="text-[#09a0d3] font-bold">Register</Link></p>
        </div>
    )
};