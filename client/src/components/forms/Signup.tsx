import { useState } from "react";
import api from "../api";

export const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, password } = formData;

        try {
            const response = await api.post('/register', {name, email, password});
            console.log('User created', response.data);
        } catch (err) {
            console.log('Registeration failed');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 border border-[#dee2e6] bg-[#f8f9fa] px-5 py-10 rounded-lg shadow-md">
            <div className="flex flex-col">
                <label htmlFor="name">Name </label>
                <input id="name" type="text"
                    name="name"
                    value={formData.name}
                    required
                    onChange={handleChange} 
                    placeholder="John Doe"
                    className="placeholder:text-gray-400 border rounded-lg px-2 py-[2px]" 
                />
            </div>

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

            <button type="submit" className="bg-[#09a0d3] text-white mt-5 cursor-pointer w-[40%] rounded-lg font-bold py-1">Register</button>
        </form>
    )
}