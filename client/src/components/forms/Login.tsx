import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { email, password } = formData;

            const response = await api.post('/login', {email, password});
            console.log('User logged in', response.data);
            navigate('/');
        } catch (err) {
            console.log('log in failed', err);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email: </label>
            <input id="email" type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange} 
                className="border" />

            <label htmlFor="password">Password: </label>
            <input id="password" type="password"
                name="password"
                value={formData.password}
                required
                onChange={handleChange} 
                className="border" />

            <button type="submit" className="bg-blue-400">Log in</button>
        </form>
    )
};