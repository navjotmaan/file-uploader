import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./helpers/ContextApi";
import cloud from '../assets/cloud.png';
import { Signup } from "./forms/Signup";
import { Features } from './helpers/Features';

const App = () => {
  const { userId } = useContext(UserContext);
      
  if (userId) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div>
      <header className="flex justify-between align-center px-10 py-3">
        <span className="flex items-center gap-2">
        <img src={cloud} width={30} height={30} alt="cloud" />
        <p className="text-2xl font-bold">Vault</p>
      </span>

      <span className="flex items-center gap-5">
        <Link to="/login" className="px-3 font-bold">Login</Link>
        <Link to="/register" className="border rounded-lg px-3 py-1 bg-[#09a0d3] text-white font-bold">Register</Link>
      </span>
      </header>
      <hr className="border-gray-300"></hr>

      <main className="flex justify-center gap-20 my-20">
        <div className="w-[50%]">
          <h1 className="text-5xl leading-14 font-pro">Upload, save, and share your files securely</h1>
          <p className="text-lg text-[#495057] mt-6">Experience cloud storage designed with privacy first. Access your data anytime, anywhere, on any device.</p>
          
          <Features />
        </div>
        <Signup />
      </main>
    </div>
  );
}

export default App;