import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null); //creates audio element

  useEffect(() => {
    //plays when mounted and throws an error if stopped
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay stopped:", error);
      });
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const res = await fetch("https://sideline-api.onrender.com/users/me", {
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
    //pauses when not mounted
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  async function fetchCredits(userId, token) {
    try {
      setRefreshing(true);
      const creditsRes = await fetch(
        `https://sideline-api.onrender.com/credits/${userId}/raw`,
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
      <div>
        {/* auto plays when going to the page */}
        {/* <audio ref={audioRef} src="/drumroll.mp3" autoPlay /> */}
        <h1>Account</h1> <p>You are not logged in.</p>
        <button onClick={() => navigate("/register")} className="login-btn">
          {" "}
          Register{" "}
        </button>
        <button onClick={() => navigate("/login")} className="login-btn">
          {" "}
          Login{" "}
        </button>{" "}
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}
