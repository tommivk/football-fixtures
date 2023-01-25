import Link from "next/link";
import { Match } from "../types";

type Props = {
  match: Match;
  fullDate?: boolean;
};

const MatchDetails = ({ match, fullDate = true }: Props) => {
  return (
    <Link href={`/matches/${match.fixture?.id}`} className="match">
      <h3>
        {match.teams?.home?.name} - {match.teams?.away?.name}
      </h3>
      <div className="match-info">
        <div className="match-team-logo">
          <img src={match.teams?.home?.logo} />
        </div>
        <div className="match-center">
          {match.score?.fulltime?.home !== null &&
            match.score?.fulltime?.away !== null && (
              <h2 className="match-goals">
                <span>{match.goals?.home}</span> -{" "}
                <span>{match.goals?.away}</span>
              </h2>
            )}
          <div className="match-bottom">
            <p className="match-date">
              {fullDate
                ? new Date(match.fixture.date).toLocaleString()
                : new Date(match.fixture.date).toLocaleTimeString()}
            </p>
            <p className="match-league">{match.league?.name}</p>
          </div>
        </div>
        <div className="match-team-logo">
          <img src={match.teams?.away?.logo} />
        </div>
      </div>
    </Link>
  );
};

export default MatchDetails;
