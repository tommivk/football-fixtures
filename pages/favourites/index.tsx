import { GetServerSideProps } from "next/types";
import nookies from "nookies";
import { useMemo, useState } from "react";
import { fetchData, getAllTeams } from "../../api";
import MatchList from "../../components/MatchList";
import { Match, Teams } from "../../types";
import {
  getTodaysMatches,
  getTomorrowsMatches,
  getUpcomingMatches,
} from "../../util";
import Router from "next/router";

type Props = {
  upcomingMatches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
  favouriteTeamIds: string[];
  teams: Teams[];
};

const Favourites = ({
  upcomingMatches,
  matchesToday,
  matchesTomorrow,
  favouriteTeamIds,
  teams,
}: Props) => {
  const [searchResult, setSearchResult] = useState<Teams[]>([]);
  const [search, setSearch] = useState("");
  const [teamIds, setTeamIds] = useState(favouriteTeamIds);
  const [page, setPage] = useState(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    const res = teams.filter((t) =>
      t.team.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResult(res);
  };

  const handleAddFavourite = (teamId: number) => {
    const cookies = nookies.get(null, "favouriteTeamIds");
    const favouriteTeamIds = cookies.favouriteTeamIds?.split(",") ?? [];
    favouriteTeamIds.push(teamId.toString());
    nookies.set(null, "favouriteTeamIds", favouriteTeamIds.toString(), {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
    setTeamIds(favouriteTeamIds);
  };

  const handleRemoveFavourite = (teamId: number) => {
    const cookies = nookies.get(null, "favouriteTeamIds");
    const favouriteTeamIds = cookies.favouriteTeamIds?.split(",") ?? [];
    const newFavourites = favouriteTeamIds.filter(
      (id) => id !== teamId.toString()
    );
    nookies.set(null, "favouriteTeamIds", newFavourites.toString(), {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
    setTeamIds(newFavourites);
  };

  const favouriteTeams = useMemo(
    () => teams.filter((t) => teamIds.includes(t.team.id.toString())),
    [teamIds, teams]
  );

  const handleNavigateFixtures = () => {
    if (JSON.stringify(teamIds) !== JSON.stringify(favouriteTeamIds)) {
      return Router.reload();
    }
    setPage(0);
  };

  return (
    <>
      <div className="fav-nav">
        <button onClick={handleNavigateFixtures}>Fixtures</button>
        <button onClick={() => setPage(1)}>Favourites</button>
        <button onClick={() => setPage(2)}>Search teams</button>
      </div>

      {page === 0 && (
        <MatchList
          matches={upcomingMatches}
          matchesToday={matchesToday}
          matchesTomorrow={matchesTomorrow}
        />
      )}

      {page === 1 && (
        <>
          <table className="fav-table">
            <tbody>
              {favouriteTeams.map(({ team }) => (
                <tr key={team.id}>
                  <td>{team.name} </td>
                  <td>
                    <button
                      className="btn-small"
                      onClick={() => handleRemoveFavourite(team.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {favouriteTeams.length === 0 && (
            <h2 className="text-center">No favourite teams added</h2>
          )}
        </>
      )}

      {page === 2 && (
        <div className="fav-search">
          <input
            onChange={handleSearch}
            type="text"
            value={search}
            placeholder={"Team name"}
          />
          <div className="fav-search-result">
            <table>
              <tbody>
                {searchResult.map(({ team }) => (
                  <tr>
                    <td>{team.name}</td>
                    <td>
                      {teamIds.includes(team.id.toString()) ? (
                        <button
                          className="btn-small"
                          onClick={() => handleRemoveFavourite(team.id)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="btn-small"
                          onClick={() => handleAddFavourite(team.id)}
                        >
                          Add to favourites
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {searchResult.length == 0 && !!search && (
                  <tr>
                    <td>No teams found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const currentSeason = 2022;

    const cookies = nookies.get(context);
    const favouriteTeamIds = cookies.favouriteTeamIds?.split(",") ?? [];

    const result: Array<Match[]> = await Promise.all(
      favouriteTeamIds.map((teamId) =>
        fetchData(
          `/fixtures?season=${currentSeason}&team=${teamId}&status=NS-1H-HT-2H-ET-BT-P`,
          5 * 60
        )
      )
    );

    let matches: Array<Match> = result.flatMap((r) => r);
    matches.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);
    matches = matches.filter(
      (value, index, self) =>
        index === self.findIndex((m) => m.fixture.id === value.fixture.id)
    );

    const matchesToday = getTodaysMatches(matches);
    const matchesTomorrow = getTomorrowsMatches(matches);
    const upcomingMatches = getUpcomingMatches(matches);

    const teams: Teams[] = await getAllTeams();

    return {
      props: {
        matchesToday,
        matchesTomorrow,
        upcomingMatches,
        favouriteTeamIds,
        teams,
      },
    };
  } catch (error) {
    console.log(error);
    return { redirect: { destination: "/error", permanent: false } };
  }
};

export default Favourites;
