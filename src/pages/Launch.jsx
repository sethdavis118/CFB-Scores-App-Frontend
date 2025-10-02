function Launch() {
  return (
    <div className="launch">
      <h1>College Football Betting Experience</h1>
      <p>
        {" "}
        Your ultimate destination for college football betting and live updates
      </p>
      <button
        className="launch-btn"
        onClick={() => alert("Getting Started...")}
      >
        Get Started
      </button>

      <div className="cards">
        <div className="card">
          <h3>Schedule</h3>
          <p>Football Schedules</p>
        </div>
        <div className="card">
          <h3>Betting</h3>
          <p>Weekly Bets on your favorite teams</p>
        </div>
        <div className="card">
          <h3>Rankings</h3>
          <p>See where you rank in this weeks leaderboard</p>
        </div>
      </div>
    </div>
  );
}

export default Launch;
