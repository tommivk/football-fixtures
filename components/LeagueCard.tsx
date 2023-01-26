import Link from "next/link";

const LeagueCard = ({ league }: any) => {
  return (
    <Link className="card" href={`/leagues/${league.id}`}>
      <img
        src={`https://media.api-sports.io/football/leagues/${league.id}.png`}
        width={50}
        height={50}
      />
      <h4>{league.name}</h4>
    </Link>
  );
};

export default LeagueCard;
