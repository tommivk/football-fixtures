import LeagueCard from "./LeagueCard";

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
  { name: "Favourites", id: 0 },
];

const LeagueCards = () => {
  return (
    <div className="competitions">
      {leagues.map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  );
};

export default LeagueCards;
