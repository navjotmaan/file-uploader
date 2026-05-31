import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./helpers/ContextApi";

const App = () => {
  const userId = useContext(UserContext);
      
  if (userId) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default App;