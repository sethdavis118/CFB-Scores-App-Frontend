import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading account:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, 
  []);
  const { data: team } = useQuery(
    user?.favorite_team ? `/teams/${user.favorite_team}` : null
  );
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  if (loading) return <p>Loading...</p>;
  
  if (!user) {
    return (
    <div className="account-page not-logged-in">
      <h1>Account</h1>
      <p>You are not logged in.</p>
      <div className="account-buttons">
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

  return (
    <div className= "account-page">
      <h1>Account Page</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Favorite Team: {team?.school || "None selected"}</p>
      <p>Favorite Conference: {user.favorite_conference || "None selected"}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
