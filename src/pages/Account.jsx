import { useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";

export default function Account() {
  const request = useApi();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await request("/users/me");
        setUser(me);
      } catch (err) {
        console.error("Error fetching user in Account:", err);
      }
    }
    loadUser();
  }, [request]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Account</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Favorite Team: {user.favorite_team}</p>
    </div>
  );
}
