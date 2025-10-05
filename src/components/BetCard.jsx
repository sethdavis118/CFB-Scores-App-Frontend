import { useEffect, useState } from "react";
import {
  getTeam,
  editBetWinStatus,
  checkIsCompleted,
  deleteBet,
  updateUserScore,
  getBet,
} from "../api/ApiFunctions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function BetCard({ bet, betGame, token, setBets }) {
  console.log(betGame);
  const [awayTeam, setAwayTeam] = useState();
  const [homeTeam, setHomeTeam] = useState();
  const [betTeam, setBetTeam] = useState();
  const [isComplete, setIsComplete] = useState();
  // I'll need to create an edit that can change the completed in the database or add a field to the bets to know if it's complete.
  // If it is complete, set that somewhere so that the app can know to stop calling the api to check if it's complete.
  // Otherwise, at every load check if the specific games are complete.
  const [winStatus, setWinStatus] = useState(bet?.win_status);
  // const [favorite, setFavorite] = useState();
  const [homeTeamBet, setHomeTeamBet] = useState();

  async function setAwayTeamFunc() {
    const tempAwayTeam = await getTeam(betGame?.away_team_id, token);

    setAwayTeam(tempAwayTeam);
  }
  async function setHomeTeamFunc() {
    const tempHomeTeam = await getTeam(betGame?.home_team_id, token);
    setHomeTeam(tempHomeTeam);
  }

  async function deleteBetsFunc() {
    await deleteBet(bet.id, token, bet.amount);
    localStorage.removeItem(`hasPlacedBet-${betGame.game_id}`);
    setBets();
  }

  async function setWinAndPoints() {
    if (winStatus === true) {
      const tempBet = await getBet(bet?.id);
      if (!tempBet.win_status) {
        editBetWinStatus(bet?.id, token, winStatus);
        const sendAmount = bet?.amount;
        // This function will need to be tested;
        updateUserScore(sendAmount);
      } else {
        editBetWinStatus(bet?.id, token, winStatus);
      }
    }
    if (winStatus === false) {
      const tempBet = await getBet(bet?.id);
      if (!tempBet.winStatus) {
        editBetWinStatus(bet?.id, token, winStatus);
        const sendAmount = -bet?.amount;
        updateUserScore(sendAmount);
      } else {
        editBetWinStatus(bet?.id, token, winStatus);
      }
    }
    if (winStatus === null && betGame?.completed === true) {
      const sendAmount = 0;
      updateUserScore(sendAmount);
      console.log("The game pushed");
    }
  }
  // I think I did this logic right. Test it a lot to be sure.
  function decideWinStatus() {
    console.log(bet?.winStatus);
    console.log(betGame?.completed);
    if (!bet?.win_status && betGame?.completed === true) {
      console.log(homeTeamBet);
      // Check if the user won
      // How???
      if (bet.favored_team === bet.team_id) {
        // spread is correct
        if (homeTeamBet) {
          // The home team is the favorite and bet on.
          if (betGame?.away_points - betGame?.home_points < bet?.odds) {
            console.log("The home team is the favorite and covered");
            setWinStatus(true); // I think...
          }
          if (betGame?.away_points - betGame?.home_points > bet?.odds) {
            console.log("The home team is the favorite and did not cover");
            setWinStatus(false);
          }
          if (betGame?.away_points - betGame?.home_points === bet?.odds) {
            console.log("The home team is the favorite and pushed");
            setWinStatus(null);
          }
        } else {
          console.log("Inside this if-statement");
          // The away team is the favorite and bet on.
          if (betGame?.home_points - betGame?.away_points < bet?.odds) {
            console.log("The away team is the favorite and covered");
            setWinStatus(true);
          }
          if (betGame?.home_points - betGame?.away_points > bet?.odds) {
            console.log("The away team is the favorite and did not cover");
            setWinStatus(false);
          }
          if (betGame?.home_points - betGame?.away_points === bet?.odds) {
            console.log("The away team is the favorite and pushed");
            setWinStatus(null);
          }
        }
      } else if (bet.favored_team !== bet.team_id) {
        // spread needs to be changed
        if (homeTeamBet) {
          // The home team is the bet on team and the underdog.
          if (betGame?.away_points - betGame?.home_points < bet?.odds) {
            console.log("The home team is the favorite and covered");
            setWinStatus(true); // I think...
          }
          if (betGame?.away_points - betGame?.home_points > bet?.odds) {
            console.log("The home team is the favorite and did not cover");
            setWinStatus(false);
          }
          if (betGame?.away_points - betGame?.home_points === bet?.odds) {
            console.log("The home team is the favorite and pushed");
            setWinStatus(null);
          }
        } else {
          // The away team is the bet on team and the underdog.
          if (betGame?.home_points - betGame?.away_points < bet?.odds) {
            console.log("The away team is the favorite and covered");
            setWinStatus(true);
          }
          if (betGame?.home_points - betGame?.away_points > bet?.odds) {
            console.log("The away team is the favorite and did not cover");
            setWinStatus(false);
          }
          if (betGame?.home_points - betGame?.away_points === bet?.odds) {
            console.log("The away team is the favorite and pushed");
            setWinStatus(null);
          }
        }
      }

      setWinAndPoints();
    }
  }

  useEffect(() => {
    setAwayTeamFunc();
    setHomeTeamFunc();
  }, []);

  useEffect(() => {
    if (awayTeam?.team_id && bet.team_id) {
      console.log(bet?.team_id);
      console.log(awayTeam?.team_id);
      console.log(homeTeam?.team_id);
      if (bet?.team_id === awayTeam?.team_id) {
        setBetTeam(awayTeam);
        setHomeTeamBet(false);
        console.log("set hometeambet to false");
        console.log(homeTeamBet);
      } else if (bet?.team_id === homeTeam?.team_id) {
        setBetTeam(homeTeam);
        setHomeTeamBet(true);
        console.log("set hometeambet to true");
        console.log(homeTeamBet);
      }
      checkIsCompleted(token, betGame, isComplete, setIsComplete);
      decideWinStatus();
    }
  }, [homeTeam, awayTeam]);

  return (
    <div>
      {awayTeam && homeTeam && (
        <li key={bet.id} className="bet-items">
          <div className="bet-items-info">
            {bet.odds < 0 && (
              <div className="bet-items-game-info">
                <img
                  className="betcard-logo"
                  src={betTeam?.logos[0]}
                  alt={`${betTeam?.school}'s logo`}
                />
                <h3>
                  {betTeam?.school} {bet.odds}
                </h3>
                {betGame?.completed && <h4>Final</h4>}
              </div>
            )}
            {bet.odds > 0 && (
              <div className="bet-items-game-info">
                <img
                  className="betcard-logo"
                  src={betTeam?.logos[0]}
                  alt={`${betTeam?.school}'s logo`}
                />
                <h3>
                  {betTeam?.school} +{bet.odds}
                </h3>
                {betGame?.completed && <h4>Final</h4>}
              </div>
            )}
            {winStatus === true && <h3 color="green">✅ ${bet.amount}</h3>}
            {winStatus === false && <h3 color="red">❌ ${bet.amount}</h3>}
            {winStatus === null && betGame?.completed === true && (
              <h3>➖ ${bet.amount}</h3>
            )}
            {winStatus === null && betGame?.completed === false && (
              <h3>${bet.amount}</h3>
            )}
          </div>
          <h6 className="bet-game-info">
            {awayTeam.school} vs {homeTeam.school}
          </h6>
          <button
            onClick={() => {
              deleteBetsFunc();
            }}
            className="bet-delete-btn"
          >
            <DeleteOutlineIcon></DeleteOutlineIcon>
          </button>
        </li>
      )}
    </div>
  );
}
