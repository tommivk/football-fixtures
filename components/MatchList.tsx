import { Match } from "../types";
import MatchDetails from "./MatchDetails";

type Props = {
  matches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
};

const MatchList = ({ matches, matchesToday, matchesTomorrow }: Props) => {
  return (
    <div>
      <h1 className="text-center">Today</h1>
      {matchesToday.map((match) => (
        <MatchDetails key={match.fixture.id} match={match} fullDate={false} />
      ))}
      {matchesToday.length === 0 && <p className="text-center">No fixtures</p>}

      <h1 className="text-center">Tomorrow</h1>
      {matchesTomorrow.map((match) => (
        <MatchDetails key={match.fixture.id} match={match} fullDate={false} />
      ))}
      {matchesTomorrow.length === 0 && (
        <p className="text-center">No fixtures</p>
      )}

      <h1 className="text-center">Upcoming</h1>
      {matches.map((match) => (
        <MatchDetails key={match.fixture.id} match={match} />
      ))}
      {matches.length === 0 && <p className="text-center">No fixtures</p>}
    </div>
  );
};

export default MatchList;
