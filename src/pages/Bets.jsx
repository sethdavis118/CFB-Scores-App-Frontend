import { useEffect, useState } from "react";
import useMutation from "../api/useMutation";
import { RestaurantRounded } from "@mui/icons-material";

export default function Bets() {
  //   // A bet should contain:
  //   // Team wagered on, spread, amount
  //   // Game data (opponent, score, time remaining, etc.)
  const [betGames, setBetGames] = useState([]);
  const [exampleBets, setExampleBets] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // Pseudocode:
  // const {
  //   mutate,
  //   data: exampleBets,
  //   loading,
  //   error,
  // } = useMutation("GET", "/bets"); // This will get all bets made by a user with the given id.

  // End of pseudocode.
  const [games] = useState([
    {
      id: 1,
      home: "Tennessee",
      away: "Georgia",
      spread: "-3.5",
    },
    {
      id: 2,
      home: "Notre Dame",
      away: "Texas A&M",
      spread: "-1.5",
    },
    {
      id: 3,
      home: "LSU",
      away: "Florida",
      spread: "-7.5",
    },
  ]);

  const [bets, setBets] = useState([]);
  const [amount, setAmount] = useState(50);

  const placeBet = (gameId, team) => {
    const game = games.find((g) => g.id === gameId);
    const newBet = {
      gameId,
      team,
      amount,
      spread: game.spread,
      matchup: `${game.away} @ ${game.home}`,
    };
    setBets([...bets, newBet]);
  };

  useEffect(() => {
    const getBets = async () => {
      const response = await fetch("http://localhost:3000/bets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log(result);
      setExampleBets(result);
    };
    getBets();
    placeBet(1, "Tennessee");

    async function getGame(id) {
      const response = await fetch(`http://localhost:3000/games/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_SCOREBOARD_BEARER_TOKEN
          }`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
      return result;
    }
    console.log(exampleBets);
    if (!exampleBets) {
      return;
    } else {
      for (let bet of exampleBets) {
        console.log(bet.game_id);
        const game = getGame(bet.game_id);
        setBetGames([...games, game]);
      }
    }
  }, []);
  console.log(betGames);

  console.log(exampleBets);
  return (
    <>
      <h1>My Bets</h1>
      <div className="bets-section">
        {bets.length === 0 ? (
          <p>No Bets Placed!</p>
        ) : (
          <ul className="bets-list">
            {betGames.map(
              (
                bet //Change this to betGames.map and it should work.
              ) => (
                <li key={bet.gameId} className="bet-items">
                  <div className="bet-items-info">
                    <h3>
                      {bet.team} {bet.spread}
                    </h3>
                    <h3>${bet.amount}</h3>
                  </div>
                  <h6 className="bet-game-info">{bet.matchup}</h6>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </>
  );
}
