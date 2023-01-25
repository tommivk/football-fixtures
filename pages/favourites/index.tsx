import { DateTime } from "luxon";
import { GetServerSideProps } from "next/types";
import nookies from "nookies";
import { fetchData } from "../../api";
import MatchList from "../../components/MatchList";
import { Match } from "../../types";

type Props = {
  matches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
  favouriteTeamIds: string[];
};

const Favourites = ({
  matches,
  matchesToday,
  matchesTomorrow,
  favouriteTeamIds,
}: Props) => {
  // const setFavourites = (favourites: number[]) => {
  //   nookies.set(null, "favouriteTeamIds", favourites.toString(), {
  //     maxAge: 365 * 24 * 60 * 60,
  //     path: "/",
  //   });
  // };

  if (favouriteTeamIds.length === 0) {
    return (
      <div>
        <h1 className="text-center">No favourite teams added</h1>
      </div>
    );
  }

  return (
    <MatchList
      matches={matches}
      matchesToday={matchesToday}
      matchesTomorrow={matchesTomorrow}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const currentSeason = 2022;

    const cookies = nookies.get(context);
    const favouriteTeamIds = cookies.favouriteTeamIds?.split(",") ?? [];

    const result: Array<Match[]> = await Promise.all(
      favouriteTeamIds.map((teamId) =>
        fetchData(`/fixtures?season=${currentSeason}&team=${teamId}`)
      )
    );
    const matches: Array<Match> = result.flatMap((r) => r);

    matches.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);

    const today = DateTime.now();
    const tomorrow = today.plus({ days: 1 });

    const matchesToday = matches.filter((match) =>
      DateTime.fromISO(match.fixture.date.toString()).hasSame(today, "day")
    );
    const matchesTomorrow = matches.filter((match) =>
      DateTime.fromISO(match.fixture.date.toString()).hasSame(tomorrow, "day")
    );

    return {
      props: {
        matches,
        matchesToday,
        matchesTomorrow,
        favouriteTeamIds,
      },
    };
  } catch (error) {
    return { redirect: { destination: "/error", permanent: false } };
  }
};

export default Favourites;
