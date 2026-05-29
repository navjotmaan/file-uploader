import { useEffect, useState } from "react";
import api from "./components/api";
import { Dashboard } from "./components/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/me')
    .then(response => {
      setUser(response.data.user);
      console.log(response.data)
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <Dashboard />
      ) : (
        <h1>Please log in to use the file uploader.</h1>
      )}
    </div>
  );
}

export default App;