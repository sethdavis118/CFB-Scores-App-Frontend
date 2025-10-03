import { useEffect, useState } from "react";
import useQuery from "../api/useQuery";
import { placeBet } from "../api/ApiFunctions";
import Alert from "@mui/material/Alert";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Scorecard({ game, user }) {
  console.log(game);
  const { data: home_team_data } = useQuery(
    `/teams/team_id/${game.homeTeam.id}`
  );
  // For historical games, use game.home_team_id and update the data below accordingly.
  const { data: away_team_data } = useQuery(
    `/teams/team_id/${game.awayTeam.id}`
  );
  const [appears, setAppears] = useState(false);
  const [startDate, setStartDate] = useState();
  const [homeName, setHomeName] = useState();
  const [awayName, setAwayName] = useState();
  const [homeAbbreviation, setHomeAbbreviation] = useState();
  const [awayAbbreviation, setAwayAbbreviation] = useState();
  const [homeColor, setHomeColor] = useState();
  const [awayColor, setAwayColor] = useState();
  const [homeLogo, setHomeLogo] = useState();
  const [awayLogo, setAwayLogo] = useState();
  const [spread, setSpread] = useState();
  const [betSpread, setBetSpread] = useState();
  const [favoredTeam, setFavoredTeam] = useState();

  const [gameId] = useState(game.id);
  // const [userId] = useState(user.id);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [homeTeamPoints, setHomeTeamPoints] = useState();
  const [awayTeamPoints, setAwayTeamPoints] = useState();
  const [status, setStatus] = useState();
  const [period, setPeriod] = useState();
  const [quarterStr, setQuarterStr] = useState();
  const [clock, setClock] = useState();

  const [showPopup, setShowPopup] = useState(false);
  const [betTeam, setBetTeam] = useState();
  const [betInfo, setBetInfo] = useState();
  const [amount, setAmount] = useState(50);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCanceledAlert, setShowCanceledAlert] = useState(false);
  const [error, setError] = useState();
  const [hasPlacedBet, setHasPlacedBet] = useState(
    () => JSON.parse(localStorage.getItem(`hasPlacedBet-${game.id}`)) || false
  );

  useEffect(() => {
    if (
      home_team_data &&
      away_team_data &&
      Object.keys(home_team_data).length > 0 &&
      Object.keys(away_team_data).length > 0
    ) {
      // setStartDate(Date(game.start_date));
      setHomeName(home_team_data.school);
      setAwayName(away_team_data.school);
      setHomeAbbreviation(home_team_data.abbreviation);
      setAwayAbbreviation(away_team_data.abbreviation);
      setHomeColor(home_team_data.color);
      setAwayColor(away_team_data.color);
      setHomeLogo(home_team_data.logos[0]);
      setAwayLogo(away_team_data.logos[0]);
      if (game.betting.spread < 0) {
        setSpread(game.betting.spread);
        setFavoredTeam(home_team_data);
      } else if (game.betting.spread > 0) {
        setSpread(-game.betting.spread);
        setFavoredTeam(away_team_data);
      }

      setHomeTeamPoints(game.homeTeam.points);
      setAwayTeamPoints(game.awayTeam.points);
      setStatus(game.status);
      setPeriod(game.period);
      if (game.period === 1) {
        setQuarterStr("1st");
      } else if (game.period === 2) {
        setQuarterStr("2nd");
      } else if (game.period === 3) {
        setQuarterStr("3rd");
      } else if (game.period === 4) {
        setQuarterStr("4th");
      }
      setClock(game.clock);

      setAppears(true);
    }
  }, [home_team_data, away_team_data]);

  function showBetInformation(selectedTeam) {
    // console.log(selectedTeam);
    if (favoredTeam.id === selectedTeam.id) {
      setBetInfo(`Bet ${selectedTeam.school} at ${spread}`);
      setBetSpread(spread);
    } else if (favoredTeam.id !== selectedTeam.id) {
      const underdogSpread = Math.abs(spread);
      setBetInfo(`Bet ${selectedTeam.school} at +${underdogSpread}`);
      setBetSpread(underdogSpread);
    }
  }

  function updateHasPlacedBet(value) {
    setHasPlacedBet(value);
    localStorage.setItem(`hasPlacedBet-${game.id}`, JSON.stringify(value));
  }

  function displayAlert(isSuccess) {
    if (isSuccess) {
      setShowSuccessAlert(true);
      setShowPopup(false);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 4000);
      //closes popup once bet is placed
      updateHasPlacedBet(betTeam.school);
    } else {
      setShowPopup(false);
      setShowCanceledAlert(true);
      setTimeout(() => {
        setShowCanceledAlert(false);
      }, 4000);
    }
  }

  return (
    <div>
      {appears && (
        <li className="scorecard">
          <div className="scorecard-data">
            <div className="scorecard-away-points-data">
              <div className="scorecard-logo-name">
                <img
                  src={awayLogo}
                  alt={`${awayName}'s Logo`}
                  className="scorecard-logo"
                />
                <h4 style={{ color: awayColor }}>{awayName}</h4>
              </div>
              {status === "in_progress" && <h3>{awayTeamPoints}</h3>}
              {status === "completed" && <h3>{awayTeamPoints}</h3>}
            </div>
            <div className="scorecard-details">
              {/* <p>Time goes here</p> */}
              {status === "in_progress" && (
                <p>
                  {quarterStr} {clock}
                </p>
              )}
              {status === "completed" && <p>Final</p>}
              <h5>
                {favoredTeam.abbreviation} {spread}
              </h5>
            </div>
            <div className="scorecard-home-points-data">
              <div className="scorecard-logo-name">
                <img
                  src={homeLogo}
                  alt={`${homeName}'s Logo`}
                  className="scorecard-logo"
                />
                <h4 style={{ color: homeColor }}>{homeName}</h4>
              </div>
              {status === "in_progress" && <h3>{homeTeamPoints}</h3>}
              {status === "completed" && <h3>{homeTeamPoints}</h3>}
            </div>
          </div>
          <div className="scorecard-interaction">
            {/* the button is visible if all conditions are met, and go away once any condition changes */}
            {status === "completed" ||
              status === "in_progress" ||
              typeof hasPlacedBet === "string" ||
              !user || (
                <button
                  onClick={() => {
                    setShowPopup(!showPopup);
                    setBetTeam(away_team_data);
                    // console.log(favoredTeam, away_team_data.abbreviation);
                    showBetInformation(away_team_data);
                  }}
                  className="scorecard-bet-btn"
                  style={{ background: awayColor }}
                >
                  Bet {awayAbbreviation}
                </button>
              )}
            {status === "completed" ||
              status === "in_progress" ||
              typeof hasPlacedBet === "string" ||
              !user || (
                <button
                  onClick={() => {
                    setShowPopup(!showPopup);
                    setBetTeam(home_team_data);
                    // console.log(favoredTeam, home_team_data.abbreviation);
                    showBetInformation(home_team_data);
                  }}
                  className="scorecard-bet-btn"
                  style={{ background: homeColor }}
                >
                  Bet {homeAbbreviation}
                </button>
              )}
          </div>
          {hasPlacedBet && <p>You picked {hasPlacedBet}</p>}
          {!user && <p>Log in to place a bet!</p>}
          {showPopup && (
            <div className="scorecard-bet-section">
              <h2 className="scorecard-bet-heading">Your Pick:</h2>
              <img
                src={betTeam.logos[0]}
                alt={`${betTeam}'s logo`}
                className="bet-team-img"
              ></img>
              <h4>{betInfo}</h4>
              <label>
                Wager Amount:{" "}
                <select
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                >
                  {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    )
                  )}
                </select>
              </label>
              <div className="scorecared-bet-buttons">
                <button
                  onClick={() => displayAlert(false)}
                  className="scorecard-cancel-bet-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    placeBet(
                      betTeam,
                      favoredTeam,
                      gameId,
                      amount,
                      betSpread,
                      setError,
                      token
                    );
                    // Add actual logic and make sure the bet was successful before showing the alert.
                    displayAlert(true);
                  }}
                  className="scorecard-place-bet-btn"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {showSuccessAlert && <Alert severity="success">Bet placed.</Alert>}
          {showCanceledAlert && (
            <Alert icon={<CancelIcon fontSize="inherit" />} severity="error">
              Bet canceled.
            </Alert>
          )}
          {/* <div className="scorecard-clock">
            <h4 className="scorecard-clock-item">{isFinal}</h4>
            <p className="scorecard-clock-item">{time}</p>
          </div>
          <p>{game.game?.betTeam}</p>
          <p>{game.game?.betLine}</p> */}
        </li>
      )}
    </div>
  );
}
