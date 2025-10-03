import { useEffect, useState } from "react";
// import { RestaurantRounded } from "@mui/icons-material";
import BetCard from "../components/BetCard";
import { useApi } from "../api/ApiContext";

export default function Bets() {
  //   // A bet should contain:
  //   // Team wagered on, spread, amount
  //   // Game data (opponent, score, time remaining, etc.)
  const [betGames] = useState([]); // The game data for each bet, fetched from the gameId.
  const [bets, setBets] = useState([]); // The bet data itself, including amount wagered and userId.
  const request = useApi();

  useEffect(() => {
    async function loadBets() {
      try {
        const data = await request("/bets");
        setBets(data);
      } catch (err) {
        console.error("Error loading bets:", err);
      }
    }
    loadBets();
  }, [request]);

  return (
    <>
      <div>
        <h1>My Bets</h1>
        <div className="bets-section">
          {bets.length !== 0 && betGames.length !== 0 ? (
            <ul className="bets-list">
              {bets.map((bet) => (
                <li key={bet.id}>
                  {bet.amount} on {bet.favored_team} (odds: {bet.odds})
                </li>
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
