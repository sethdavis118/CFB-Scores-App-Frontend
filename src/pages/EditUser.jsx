import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";
import { apiFetch } from "../api/client.js";

export default function EditUser() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`EditUser Mounted`);
    async function fetchUser() {
      try {
        setLoading(true);
        apiFetch("/api/users/me").then((data) => setUser(data));
      } catch (err) {
        console.error("Failed to edit user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function fetchCredits(userId) {
    try {
      setRefreshing(true);
      const creditsData = await apiFetch(`/credits/${userId}/raw`);
      setCredits(creditsData.credits);
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
    navigate("/api/login");
  };

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const data = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          favorite_team: user.favorite_team,
          favorite_conference: user.favorite_conference,
        }),
      });
      setUser(data);
      setMessage("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage(err.message || "Failed to update user");
    }
  }

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <section className="account-page not-logged-in">
        <h1 className="account-title">Account</h1>
        <p>You are not logged in.</p>
        <div className="account-buttons">
          <button onClick={() => navigate("/register")} className="login-btn">
            Register
          </button>
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="account-page">
      <h1 className="account-title">Account Page</h1>
      <section className="account-summary">
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Favorite Team: {team?.school || "None selected"}</p>
        <p>
          Favorite Conference: {user.favorite_conference || "None selected"}
        </p>
        <p>Current Credits: {credits !== null ? credits : "Loading..."}</p>
      </section>

      <form className="account-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Favorite Team ID:</label>
          <input
            type="number"
            value={user.favorite_team || ""}
            onChange={(e) =>
              setUser({ ...user, favorite_team: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div className="form-group">
          <label>Favorite Conference:</label>
          <input
            type="text"
            value={user.favorite_conference || ""}
            onChange={(e) =>
              setUser({ ...user, favorite_conference: e.target.value })
            }
          />
        </div>
        <button type="submit" className="sports-btn">
          Update Account
        </button>
      </form>

      {message && <p>{message}</p>}

      <button
        onClick={() => fetchCredits(user.id)}
        disabled={refreshing}
        className="sports-btn"
      >
        {refreshing ? "Refreshing..." : "Refresh Credits"}
      </button>

      <button onClick={handleLogout} className="sports-btn">
        Logout
      </button>
    </section>
  );
}
