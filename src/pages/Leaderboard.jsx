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
    <table>
      <tr>
        <th>User</th>
        <th>Record</th>
        <th>Points Earned</th>
      </tr>
      {users.map((user) => (
        <tr>
          <td>{user.username}</td>
          <td>{user.all_time_record}</td>
          <td>{user.total_money_earned}</td>
        </tr>
      ))}
    </table>
  );
}
