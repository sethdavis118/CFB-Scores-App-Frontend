import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="/" className="navbar-link">
        Scores
      </NavLink>
      <NavLink to="/bets" className="navbar-link">
        Bets
      </NavLink>
      <NavLink to="/leaderboard" className="navbar-link">
        Leaderboard
      </NavLink>
      <NavLink to="/account" className="navbar-link">
        Account
      </NavLink>
    </div>
  );
}
