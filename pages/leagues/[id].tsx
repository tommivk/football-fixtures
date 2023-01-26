import { GetServerSideProps } from "next/types";
import { fetchData } from "../../api";
import { Match } from "../../types";
import MatchList from "../../components/MatchList";
import {
  getTodaysMatches,
  getTomorrowsMatches,
  getUpcomingMatches,
} from "../../util";

type Props = {
  upcomingMatches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
};

const League = ({ upcomingMatches, matchesToday, matchesTomorrow }: Props) => {
  return (
    <MatchList
      matches={upcomingMatches}
      matchesToday={matchesToday}
      matchesTomorrow={matchesTomorrow}
    />
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

    return {
      props: {
        matchesToday,
        matchesTomorrow,
        upcomingMatches,
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
