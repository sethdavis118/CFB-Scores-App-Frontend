import { useState, useEffect } from "react";
//import { useNavigate } from "react-router";
import useQuery from "../api/useQuery.js";
//import { apiFetch } from "/../api/client.js";
import { useApi } from "../api/ApiContext.js";

export default function EditUser() {
  const { user, request, setUser } = useApi(); // 👈 pull user + request from context
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    favoriteTeam: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [credits, setCredits] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        favorite_team: user.favorite_team || "",
        favorite_conference: user.favorite_conference || "",
      });
      setCredits(user.credits || 0);
      setLoading(false);
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const { data: team } = useQuery(
    user?.favorite_team ? `/teams/${user.favorite_team}` : null
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updatedUser = await request("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setUser(updatedUser);
      setMessage("Accont updated");
    } catch (err) {
      console.error(`Error on handleSubmit: ${err}`);
      setMessage("Update failed");
    }
  }

  async function handleRefreshCredits() {
    if (!user) return;
    setRefreshing(true);

    try {
      const res = await request(`users/${user.id}/credits`, { method: "GET" });
      if (res && typeof res.credits === "number") {
        setCredits(res.credits);
      }
    } catch (err) {
      console.error(`Error refreshing credits: ${err}`);
    } finally {
      setRefreshing(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out successfuly");
  }

  if (!user) return <p>You have to be logged in to edit your profile!</p>;
  if (loading) return <p>Loading...</p>;

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

      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Favorite Team ID:</label>
          <input
            type="number"
            value={user.favorite_team || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Favorite Conference:</label>
          <input
            type="text"
            value={user.favorite_conference || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="sports-btn">
          Update Account
        </button>
      </form>

      <button
        onClick={handleRefreshCredits}
        disabled={refreshing}
        className="sports-btn"
      >
        {refreshing ? "Refreshing..." : "Refresh Credits"}
      </button>

      <button onClick={handleLogout} className="sports-btn">
        Logout
      </button>
      {message && <p>{message}</p>}
    </section>
  );
}
