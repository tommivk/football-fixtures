import redis from "./lib/redis";
import camelcaseKeys from "camelcase-keys";
import { Match, StandingsResult } from "./types";
import { supportedLeagueIds } from "./util";

const API_KEY = process.env.API_KEY ?? "";
const BASE_URL = "https://v3.football.api-sports.io";

const currentSeason = 2022;

export const fetchData = async (path: string, cacheTimeMinutes?: number) => {
  try {
    const cache = await redis.get(path);
    // await redis.flushall();
    // await redis.del(path);
    if (cache) {
      console.log("cached ", path);
      return JSON.parse(cache);
    }

    console.log("no cache ", path);

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("x-rapidapi-key", API_KEY);

    const response = await fetch(`${BASE_URL}${path}`, {
      headers: requestHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const json = await response.json();
    if (!(Array.isArray(json.errors) && json.errors.length === 0)) {
      throw json.errors;
    }

    const data = camelcaseKeys(json.response, { deep: true });

    cacheTimeMinutes !== undefined
      ? await redis.set(path, JSON.stringify(data), "EX", 60 * cacheTimeMinutes)
      : await redis.set(path, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTeams = async () => {
  try {
    const result = await Promise.all(
      supportedLeagueIds.map((id) =>
        fetchData(`/teams?league=${id}&season=${currentSeason}`, 43800)
      )
    );
    let allTeams = result.flatMap((r) => r);
    //remove duplicates
    allTeams = allTeams.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.team.id === value.team.id)
    );
    return allTeams;
  } catch (error) {
    throw error;
  }
};

export const getStandingsByLeagueId = async (leagueId: string) => {
  try {
    if (leagueId === "2") return []; // Ignore Champions League

    const result: StandingsResult[] = await fetchData(
      `/standings?league=${leagueId}&season=${currentSeason}`,
      24 * 60
    );
    const standings = result?.[0].league?.standings;
    if (!standings || standings.length === 0) {
      throw "Standings were undefined";
    }
    return standings[0];
  } catch (error) {
    throw error;
  }
};

export const getFixturesByLeagueId = async (leagueId: string) => {
  return (await fetchData(
    `/fixtures?season=${currentSeason}&league=${leagueId}&status=NS-1H-HT-2H-ET-BT-P`,
    360
  )) as Match[];
};

export const getFixturesByTeamId = async (teamId: string) => {
  return (await fetchData(
    `/fixtures?season=${currentSeason}&team=${teamId}&status=NS-1H-HT-2H-ET-BT-P`,
    5 * 60
  )) as Match[];
};
