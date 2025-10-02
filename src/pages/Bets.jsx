import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { getBets } from "../api/ApiFunctions";
// import { RestaurantRounded } from "@mui/icons-material";
import BetCard from "../components/BetCard";

export default function Bets() {
  //   // A bet should contain:
  //   // Team wagered on, spread, amount
  //   // Game data (opponent, score, time remaining, etc.)
  const [betGames] = useState([]); // The game data for each bet, fetched from the gameId.
  const [bets, setBets] = useState([]); // The bet data itself, including amount wagered and userId.
  const [token] = useState(localStorage.getItem("token") || null);

  // const [amount, setAmount] = useState(50);

  async function setBetsFunc() {
    const tempBets = await getBets(token);
    console.log(tempBets);
    setBets(tempBets);
  }

  useEffect(() => {
    async function loadBets() {
      try {
        const data = await apiFetch("/bets"); // automatically adds token + base URL
        setBets(data);
      } catch (err) {
        console.error("Failed to load bets:", err);
      }
    }
    loadBets();
  }, []);

  return (
    <>
      <section>
        <h1>My Bets</h1>
        <section className="bets-section">
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
        </section>
      </section>
    </>
  );
}
