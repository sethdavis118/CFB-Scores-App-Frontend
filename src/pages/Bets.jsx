import { useEffect, useState } from "react";
import useMutation from "../api/useMutation";
// import { RestaurantRounded } from "@mui/icons-material";
import BetCard from "../components/BetCard";

export default function Bets() {
  //   // A bet should contain:
  //   // Team wagered on, spread, amount
  //   // Game data (opponent, score, time remaining, etc.)
  const [betGames, setBetGames] = useState([]); // The game data for each bet, fetched from the gameId.
  const [bets, setBets] = useState([]); // The bet data itself, including amount wagered and userId.
  const [token] = useState(localStorage.getItem("token") || null);

  // const [amount, setAmount] = useState(50);

  useEffect(() => {
    // Fetching all the bets from the user.
    const getBets = async () => {
      const response = await fetch("http://localhost:3000/bets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setBets(result);
    };
    getBets();
  }, []);

  useEffect(() => {
    // Getting game info.
    async function getGame(id) {
      const response = await fetch(`http://localhost:3000/games/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
      return result;
    }

    async function getGames() {
      // Getting the game data for the bet-on games.
      if (!bets) {
        console.log("Bets is empty!");
        return;
      } else {
        let tempArray = [];
        for (const bet of bets) {
          const gameData = await getGame(bet.game_id);
          const game = gameData.rows[0];
          tempArray.push(game);
        }
        setBetGames(tempArray);
      }
    }

    getGames();
  }, [bets]);

  return (
    <>
      {betGames.length !== 0 && (
        <div>
          <h1>My Bets</h1>
          <div className="bets-section">
            {bets.length === 0 ? (
              <p>No Bets Placed!</p>
            ) : (
              <ul className="bets-list">
                {bets.map((bet, index) => (
                  <BetCard
                    key={bet.id}
                    bet={bet}
                    betGame={betGames[index]}
                    token={token}
                  ></BetCard>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
