import { GetServerSideProps } from "next/types";
import { fetchData } from "../../api";
import { Match } from "../../types";
import MatchList from "../../components/MatchList";
import { getTodaysMatches, getTomorrowsMatches } from "../../util";

type Props = {
  matches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
};

const League = ({ matches, matchesToday, matchesTomorrow }: Props) => {
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
    const { id } = context.query;

    const currentSeason = "2022";

    const matches: Match[] = await fetchData(
      `/fixtures?season=${currentSeason}&league=${id}&status=NS-1H-HT-2H-ET-BT-P`,
      360
    );

    matches.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);

    const matchesToday = getTodaysMatches(matches);
    const matchesTomorrow = getTomorrowsMatches(matches);

    return {
      props: {
        matches,
        matchesToday,
        matchesTomorrow,
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
