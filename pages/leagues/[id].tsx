import { GetServerSideProps } from "next/types";
import { fetchData, getStandings } from "../../api";
import { Match, Standing } from "../../types";
import MatchList from "../../components/MatchList";
import {
  getTodaysMatches,
  getTomorrowsMatches,
  getUpcomingMatches,
} from "../../util";
import { useState } from "react";
import Button from "../../components/Button";

type Props = {
  upcomingMatches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
  standings: Standing[];
};

const League = ({
  upcomingMatches,
  matchesToday,
  matchesTomorrow,
  standings,
}: Props) => {
  const [page, setPage] = useState<number>(0);

  return (
    <>
      {standings.length !== 0 && (
        <div className="btn-nav">
          <Button size="md" onClick={() => setPage(0)} active={page === 0}>
            Fixtures
          </Button>
          <Button size="md" onClick={() => setPage(1)} active={page === 1}>
            League Standings
          </Button>
        </div>
      )}

      {page === 0 && (
        <MatchList
          matchesToday={matchesToday}
          matchesTomorrow={matchesTomorrow}
          upcomingMatches={upcomingMatches}
        />
      )}
      {page === 1 && (
        <div className="standings-container">
          <table className="standings-table">
            <tbody>
              <tr>
                <th>Rank</th>
                <th></th>
                <th className="team-name">Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>P</th>
              </tr>
              {standings.map((standing) => (
                <tr key={standing.rank}>
                  <td>{standing.rank}</td>
                  <td id="standings-logo">
                    <img src={standing.team?.logo} height={20} width={20} />
                  </td>
                  <td>{standing.team?.name}</td>
                  <td>{standing.all?.played}</td>
                  <td>{standing.all?.win}</td>
                  <td>{standing.all?.draw}</td>
                  <td>{standing.all?.lose}</td>
                  <td>{standing.goalsDiff}</td>
                  <td>{standing.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.query;

    const currentSeason = "2022";

    const matches: Match[] = await fetchData(
      `/fixtures?season=${currentSeason}&league=${id}&status=NS-1H-HT-2H-ET-BT-P`,
      360
    );

    matches.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);

    const matchesToday = getTodaysMatches(matches);
    const matchesTomorrow = getTomorrowsMatches(matches);
    const upcomingMatches = getUpcomingMatches(matches);

    const standings = await getStandings(id as string);

    return {
      props: {
        matchesToday,
        matchesTomorrow,
        upcomingMatches,
        standings,
        key: id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};
export default League;
