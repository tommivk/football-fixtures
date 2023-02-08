import FavouriteCard from "./FavouriteCard";
import LeagueCard from "./LeagueCard";
import { useRouter } from "next/router";

const leagues = [
  {
    name: "Premier League",
    id: 39,
  },
  { name: "La Liga", id: 140 },
  { name: "Bundesliga", id: 78 },
  { name: "Serie A", id: 135 },
  {
    name: "UEFA Champions League",
    id: 2,
  },
];

const LeagueCards = () => {
  const router = useRouter();
  const path =
    router.asPath === "/favourites"
      ? "favourites"
      : router.asPath.replace("/leagues/", "");

  return (
    <div className="competitions">
      {leagues.map((league) => (
        <LeagueCard
          key={league.id}
          league={league}
          active={Number(path) === league.id}
        />
      ))}
      <FavouriteCard active={path === "favourites"} />
    </div>
  );
};

export default LeagueCards;
