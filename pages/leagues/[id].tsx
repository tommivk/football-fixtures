import { GetStaticProps } from "next/types";
import { getFixturesByLeagueId, getStandingsByLeagueId } from "../../api";
import { Match, Standing } from "../../types";
import MatchList from "../../components/MatchList";
import {
  getTodaysMatches,
  getTomorrowsMatches,
  getUpcomingMatches,
  supportedLeagueIds,
} from "../../util";
import { useState } from "react";
import Button from "../../components/Button";
import { ParsedUrlQuery } from "querystring";

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

export const getStaticPaths = () => {
  const paths = supportedLeagueIds.map((leagueId) => ({
    params: {
      id: leagueId.toString(),
    },
  }));
  return { paths, fallback: false };
};

type ContextParams = {
  id: string;
} & ParsedUrlQuery;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { id } = context.params as ContextParams;

    const matches = await getFixturesByLeagueId(id);

    matches.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);

    const matchesToday = getTodaysMatches(matches);
    const matchesTomorrow = getTomorrowsMatches(matches);
    const upcomingMatches = getUpcomingMatches(matches);

    const standings = await getStandingsByLeagueId(id);

    return {
      props: {
        matchesToday,
        matchesTomorrow,
        upcomingMatches,
        standings,
        key: id,
      },
      revalidate: 10,
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
