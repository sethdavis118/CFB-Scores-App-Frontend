import { useEffect, useState } from "react";
import useMutation from "../api/useMutation";

export default function BetCard({ bet, betGame, token }) {
  console.log(bet);
  console.log(betGame);
  console.log(betGame.away_team_id);
  console.log(betGame.home_team_id);
  const [awayTeam, setAwayTeam] = useState();
  const [homeTeam, setHomeTeam] = useState();
  const [betTeam, setBetTeam] = useState();

  async function getTeam(id) {
    const response = await fetch(`http://localhost:3000/teams/team_id/${id}`, {
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

  async function setAwayTeamFunc() {
    const tempAwayTeam = await getTeam(betGame.away_team_id);

    setAwayTeam(tempAwayTeam);
  }

  async function setHomeTeamFunc() {
    const tempHomeTeam = await getTeam(betGame.home_team_id);
    setHomeTeam(tempHomeTeam);
  }

  useEffect(() => {
    setAwayTeamFunc();
    setHomeTeamFunc();
  }, []);

  useEffect(() => {
    if (bet.team_id === awayTeam?.id) {
      setBetTeam(awayTeam);
    } else if (bet.team_id === homeTeam?.id) {
      setBetTeam(homeTeam);
    } else {
      console.log("The if statement isn't working");
    }
  }, [awayTeam, homeTeam]);

  async function deleteBet(id) {
    const response = await fetch(`http://localhost:3000/bets/delete/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
    console.log(result);

    return result;
  }

  console.log(awayTeam);
  console.log(homeTeam);
  console.log(betTeam);

  return (
    <div>
      {awayTeam && homeTeam && (
        <li key={bet.id} className="bet-items">
          <div className="bet-items-info">
            {bet.odds < 0 && (
              <>
                <img
                  className="betcard-logo"
                  src={betTeam?.logos[0]}
                  alt={`${betTeam?.school}'s logo`}
                />
                <h3>
                  {betTeam?.school} {bet.odds}
                </h3>
              </>
            )}
            {bet.odds > 0 && (
              <>
                <img
                  className="betcard-logo"
                  src={betTeam?.logos[0]}
                  alt={`${betTeam?.school}'s logo`}
                />
                <h3>
                  {betTeam?.school} +{bet.odds}
                </h3>
              </>
            )}
            <h3>${bet.amount}</h3>
          </div>
          <h6 className="bet-game-info">
            {awayTeam.school} vs {homeTeam.school}
          </h6>
          <button onClick={() => deleteBet(bet.id)}>Delete bet</button>
        </li>
      )}
    </div>
  );
}
