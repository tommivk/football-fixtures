import { DateTime } from "luxon";
import { Match } from "./types";

export const getTodaysMatches = (matches: Match[]) => {
  const today = DateTime.now();

  return matches.filter((match) =>
    DateTime.fromISO(match.fixture.date.toString()).hasSame(today, "day")
  );
};

export const getTomorrowsMatches = (matches: Match[]) => {
  const tomorrow = DateTime.now().plus({ days: 1 });

  return matches.filter((match) =>
    DateTime.fromISO(match.fixture.date.toString()).hasSame(tomorrow, "day")
  );
};
