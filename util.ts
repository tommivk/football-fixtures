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

export const getUpcomingMatches = (matches: Match[]) => {
  const tomorrow = DateTime.now().plus({ days: 1 });

  return matches.filter((match) => {
    const date = DateTime.fromISO(match.fixture.date.toString());
    return date.startOf("day") > tomorrow.startOf("day");
  });
};

export const supportedLeagueIds = [2, 39, 78, 135, 140];
