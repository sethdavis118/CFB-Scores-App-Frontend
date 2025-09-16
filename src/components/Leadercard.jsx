export default function Leadercard(user) {
  const { username, all_time_record, total_money_earned } = user.user;
  return (
    <li className="leadercard">
      <h4>{username}</h4>
      <p>{all_time_record}</p>
      <h4>{total_money_earned}</h4>
    </li>
  );
}
