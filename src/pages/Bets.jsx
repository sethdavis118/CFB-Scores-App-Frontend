import { useEffect, useState } from "react";
import { getBets, getGames } from "../api/ApiFunctions";
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

  async function setBetsFunc() {
    const tempBets = await getBets(token);
    console.log(tempBets);
    setBets(tempBets);
  }

  useEffect(() => {
    // Fetching all the bets from the user.
    setBetsFunc();
  }, []);

  useEffect(() => {
    getGames(bets, setBetGames, token);
  }, [bets]);

  return (
    <>
      <div>
        <h1>My Bets</h1>
        <div className="bets-section">
          {bets.length !== 0 && betGames.length !== 0 ? (
            <ul className="bets-list">
              {bets.map((bet, index) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  betGame={betGames[index]}
                  token={token}
                  setBets={setBetsFunc}
                ></BetCard>
              ))}
            </ul>
          ) : (
            <p>No Bets Placed!</p>
          )}
        </div>
      </div>
    </>
  );
}
