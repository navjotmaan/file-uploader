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
      <header className="flex justify-between align-center md:px-10 px-5 py-3">
        <span className="flex items-center gap-2">
        <img src={cloud} width={30} height={30} alt="cloud" />
        <p className="md:text-2xl text-xl font-bold">Vault</p>
      </span>

      <span className="flex items-center md:gap-5 gap-2">
        <Link to="/login" className="px-3 font-bold hover:text-[#0781ab] transform active:scale-95 transition-transform duration-100">Login</Link>
        <Link to="/register" className="border rounded-lg px-3 py-1 bg-[#09a0d3] text-white font-bold hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">Register</Link>
      </span>
      </header>
      <hr className="border-gray-300"></hr>

      <main className="md:flex justify-center gap-20 my-20 md:mx-0 mx-8">
        <div className="md:w-[50%]">
          <h1 className="md:text-5xl text-3xl md:leading-14 leading-10 font-pro">Upload, save, and share your files securely</h1>
          <p className="text-lg text-[#495057] mt-6">Experience cloud storage designed with privacy first. Access your data anytime, anywhere, on any device.</p>
          
          <Features />
        </div>
        <div className="hidden lg:block min-w-[400px]">
          <Signup />
        </div>
      </main>
    </div>
  );
}

export default App;