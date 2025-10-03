import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useQuery from "/../api/useQuery.js";
import { apiFetch } from "/../api/client.js";

export default function EditUser() {
  const { user, request, setUser } = useApi(); // 👈 pull user + request from context
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    favoriteTeam: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (user) {
        setFormData({
          username: user.username || "",
          email: user.email || "",
          favorite_team: user.favorite_team || "",
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to edit user:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const { data: team } = useQuery(
    user?.favorite_team ? `/teams/${user.favorite_team}` : null
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updates = await request("/users/me", {
        method: PUT,
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(`Error on handleSubmit: ${err}`);
    }
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
