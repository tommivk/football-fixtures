import { GetServerSideProps } from "next/types";
import nookies from "nookies";
import { useMemo, useState } from "react";
import { getAllTeams, getFixturesByTeamId } from "../../api";
import MatchList from "../../components/MatchList";
import { Match, Teams } from "../../types";
import {
  getTodaysMatches,
  getTomorrowsMatches,
  getUpcomingMatches,
} from "../../util";
import Router from "next/router";
import Button from "../../components/Button";

type Props = {
  upcomingMatches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
  favouriteTeamIds: string[];
  allTeams: Teams[];
};

const Favourites = ({
  upcomingMatches,
  matchesToday,
  matchesTomorrow,
  favouriteTeamIds,
  allTeams,
}: Props) => {
  const [searchResult, setSearchResult] = useState<Teams[]>(allTeams);
  const [search, setSearch] = useState("");
  const [teamIds, setTeamIds] = useState(favouriteTeamIds);
  const [page, setPage] = useState(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    const res = allTeams.filter((t) =>
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
    () => allTeams.filter((t) => teamIds.includes(t.team.id.toString())),
    [teamIds, allTeams]
  );

  const handleNavigateFixtures = async () => {
    if (JSON.stringify(teamIds) !== JSON.stringify(favouriteTeamIds)) {
      await Router.replace(Router.asPath);
    }
    setPage(0);
  };

  return (
    <>
      <div className="btn-nav">
        <Button size="md" onClick={handleNavigateFixtures} active={page === 0}>
          Fixtures
        </Button>
        <Button size="md" onClick={() => setPage(1)} active={page === 1}>
          Favourites
        </Button>
        <Button size="md" onClick={() => setPage(2)} active={page === 2}>
          Search teams
        </Button>
      </div>

      {page === 0 && (
        <>
          {favouriteTeams.length === 0 ? (
            <h2 className="info-text">No favourite teams added</h2>
          ) : (
            <MatchList
              matchesToday={matchesToday}
              matchesTomorrow={matchesTomorrow}
              upcomingMatches={upcomingMatches}
            />
          )}
        </>
      )}

      {page === 1 && (
        <>
          {favouriteTeams.length === 0 ? (
            <h2 className="info-text">No favourite teams added</h2>
          ) : (
            <table className="fav-table">
              <tbody>
                {favouriteTeams.map(({ team }) => (
                  <tr key={team.id}>
                    <td>
                      <img src={team.logo} height={30} width={30} />
                    </td>
                    <td>{team.name} </td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => handleRemoveFavourite(team.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            autoFocus
          />
          <div className="fav-search-result">
            <table>
              <tbody>
                {searchResult.map(({ team }) => (
                  <tr key={team.id}>
                    <td>
                      <img src={team.logo} height={30} width={30} />
                    </td>
                    <td>{team.name}</td>
                    <td>
                      {teamIds.includes(team.id.toString()) ? (
                        <Button
                          size="sm"
                          onClick={() => handleRemoveFavourite(team.id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddFavourite(team.id)}
                        >
                          Add to favourites
                        </Button>
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
    const cookies = nookies.get(context);
    const favouriteTeamIds = cookies.favouriteTeamIds?.split(",") ?? [];

    const result: Array<Match[]> = await Promise.all(
      favouriteTeamIds.map((teamId) => getFixturesByTeamId(teamId))
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

    const allTeams: Teams[] = await getAllTeams();
    allTeams.sort((a, b) => a.team.name.localeCompare(b.team.name));

    return {
      props: {
        matchesToday,
        matchesTomorrow,
        upcomingMatches,
        favouriteTeamIds,
        allTeams,
      },
    };
  } catch (error) {
    console.log(error);
    return { redirect: { destination: "/error", permanent: false } };
  }
};

export default Favourites;
