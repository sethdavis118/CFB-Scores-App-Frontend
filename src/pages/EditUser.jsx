import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        await fetchCredits(data.id, token);
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

  async function handleUpdate(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          favorite_team: user.favorite_team,
          favorite_conference: user.favorite_conference,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setMessage("User updated successfully");
      } else {
        setMessage(data.error || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("Network error while updating user");
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
        onClick={() => fetchCredits(user.id, localStorage.getItem("token"))}
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
