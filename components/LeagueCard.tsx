import Link from "next/link";
import { League } from "../types";

type Props = {
  league: League;
  active: boolean;
};

const LeagueCard = ({ league, active }: Props) => {
  return (
    <Link
      prefetch={false}
      className={`card ${active ? "active" : ""}`}
      href={`/leagues/${league.id}`}
    >
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
