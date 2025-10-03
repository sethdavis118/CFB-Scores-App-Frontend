import { NavLink } from "react-router";

export default function Navbar() {
  const token = localStorage.getItem("token");

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

      {token ? (
        <NavLink to="/account/edit" className="navbar-link">
          Edit User
        </NavLink>
      ) : (
        <NavLink to="/register" className="navbar-link">
          Register
        </NavLink>
      )}
    </div>
  );
}
