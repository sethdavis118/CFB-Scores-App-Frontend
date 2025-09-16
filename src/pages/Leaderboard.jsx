import Leadercard from "../components/Leadercard";

export default function Leaderboard() {
  const user1 = {
    username: "VolsFan1",
    all_time_record: "10-3",
    total_money_earned: 5249,
  };
  const user2 = {
    username: "O-H-I-O_Champs",
    all_time_record: "14-2",
    total_money_earned: 3013,
  };
  const user3 = {
    username: "BullDawg22",
    all_time_record: "15-0",
    total_money_earned: 7000,
  };
  const user4 = {
    username: "BigBlue",
    all_time_record: "15-0",
    total_money_earned: 1500,
  };
  const user5 = {
    username: "AnchorDownClown",
    all_time_record: "6-6",
    total_money_earned: 500,
  };

  const users = [user1, user2, user3, user4, user5];
  return (
    <ul>
      <li className="leadercard leadercard-header">
        <h4>User</h4>
        <h4>Record</h4>
        <h4>Points Earned</h4>
      </li>
      {users.map((user) => (
        <Leadercard key={user.username} user={user} />
      ))}
    </ul>
  );
}
