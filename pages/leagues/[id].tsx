import { GetServerSideProps } from "next/types";
import { fetchData } from "../../api";
import MatchDetails from "../../components/MatchDetails";
import { DateTime } from "luxon";
import { Match } from "../../types";

type Props = {
  matches: Match[];
  matchesToday: Match[];
  matchesTomorrow: Match[];
};

const League = ({ matches, matchesToday, matchesTomorrow }: Props) => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.query;

    const currentSeason = "2022";

    const matches: Match[] = await fetchData(
      `/fixtures?season=${currentSeason}&league=${id}&status=NS-1H-HT-2H-ET-BT-P`,
      360
    );

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
