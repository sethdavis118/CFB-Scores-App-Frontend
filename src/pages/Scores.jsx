import Scorecard from "../components/Scorecard";
import { useState, useEffect } from "react";
import useQuery from "../api/useQuery";

export default function Scores() {
  const [liveGames, setLiveGames] = useState();
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
    fetchLiveGames();
  }, []);
  // const { data: games, loading, error } = useQuery("/games");
  // To show past games, use the above query and map "games" instead of futureGames.
  // const { data: game } = useQuery("/games/1");
  // const { data: futureGames } = useQuery("/upcoming");
  // if (loading || !liveGames) return <p>Loading...</p>;
  // if (error) return <p>Sorry! {error}</p>;

  // console.log(liveGames);

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
