import Link from "next/link";

const LeagueCard = ({ league }: any) => {
  return (
    <Link
      key={league.id}
      className="league-card"
      href={league.id === 0 ? "/favourites" : `/leagues/${league.id}`}
    >
      <img
        src={
          league.id === 0
            ? "https://upload.wikimedia.org/wikipedia/commons/9/99/Star_icon_stylized.svg"
            : `https://media.api-sports.io/football/leagues/${league.id}.png`
        }
        width={50}
        height={50}
      />
      <h4>{league.name}</h4>
    </Link>
  );
};

export default LeagueCard;
