import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";
import { apiFetch } from "../api/client.js";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await fetch(apiFetch("/users/me"));
        setUser(data);

        //fetch credits
        const creditsData = await apiFetch(`/credits/${data.id}/raw`);
        setCredits(creditsData.credits);
      } catch (err) {
        console.error("Error loading account:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function fetchCredits(userId, token) {
    try {
      setRefreshing(true);
      const creditsRes = await fetch(
        `http://localhost:3000/api/credits/${userId}/raw`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (creditsRes.ok) {
        const creditsData = await creditsRes.json();
        setCredits(creditsData.credits);
      }
    } catch (err) {
      console.error("Error fetching credits:", err);
    } finally {
      setRefreshing(false);
    }
  }

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
      <>
        <section>
          <h1>Account</h1> <p>You are not logged in.</p>
          <button onClick={() => navigate("/register")} className="login-btn">
            Register
          </button>
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        </section>
      </>
    );
  }

  return (
    <section>
      <h1>Account Page</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Favorite Team: {team?.school || "None selected"}</p>
      <p>Favorite Conference: {user.favorite_conference || "None selected"}</p>
      <p>Current Credits: {credits !== null ? credits : "Loading..."}</p>

      <button
        onClick={() => fetchCredits(user.id, localStorage.getItem("token"))}
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "Refresh Credits"}
      </button>

      <br />
      <button onClick={handleLogout}>Logout</button>
    </section>
  );
}
