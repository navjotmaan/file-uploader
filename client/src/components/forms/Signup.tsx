import { useState } from "react";
import api from "../api";

export const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const response = await api.post('/register', {email, password});
            console.log('User created', response.data);
        } catch (err) {
            console.log('Registeration failed');
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

            <button type="submit" className="bg-blue-400">Register</button>
        </form>
    )
}