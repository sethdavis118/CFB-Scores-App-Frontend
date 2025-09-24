import Scorecard from "../components/Scorecard";
import { useState, useEffect } from "react";
// import useQuery from "../api/useQuery";

export default function Scores() {
  const [liveGames, setLiveGames] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetchLiveGames() {
      const response = await fetch(
        "https://api.collegefootballdata.com/scoreboard?classification=fbs",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SCOREBOARD_BEARER_TOKEN
            }`,
          },
        }
      );
      // console.log(response);
      const isJson = /json/.test(response.headers.get("Content-Type"));
      const result = isJson ? await response.json() : undefined;
      if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
      // console.log(result);
      setLiveGames(result);
      return result;
    }
    // async function fetchUser() {
    //   const token = localStorage.getItem("token");
    //   try {
    //     const res = await fetch("http://localhost:3000/users/me", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     if (!res.ok) throw new Error("Failed to fetch user");
    //     const data = await res.json();
    //     setUser(data);
    //   } catch (err) {
    //     console.error("Error loading account:", err);
    //   }
    // }

    fetchLiveGames();
    // fetchUser();
  }, []);

  // const { data: games, loading, error } = useQuery("/games");
  // To show past games, use the above query and map "games" instead of futureGames.
  // const { data: game } = useQuery("/games/1");
  // const { data: futureGames } = useQuery("/upcoming");
  // if (loading || !liveGames) return <p>Loading...</p>;
  // if (error) return <p>Sorry! {error}</p>;

  // console.log(liveGames);

  console.log(user);
  return (
    <>
      <h1 className="scores-header">Scores</h1>
      <ul>
        {liveGames?.map((game) => (
          <Scorecard game={game} key={game.id} />
        ))}
      </ul>
    </>
  );
}
