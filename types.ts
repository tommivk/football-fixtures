export interface Match {
  fixture: Fixture;
  league?: League;
  teams?: MatchTeams;
  goals?: Goals;
  score?: Score;
}

export interface Fixture {
  id: number;
  referee?: null | string;
  timezone?: string;
  date: Date;
  timestamp: number;
  periods?: Periods;
  venue?: Venue;
  status?: Status;
}

export interface Periods {
  first?: number | null;
  second?: number | null;
}

export interface Status {
  long?: string;
  short?: string;
  elapsed?: number | null;
}

export interface Venue {
  id?: number;
  name?: string;
  city?: string;
}

export interface Goals {
  home?: number | null;
  away?: number | null;
}
export interface MatchTeams {
  home: Team;
  away: Team;
}

export interface Teams {
  team: Team;
  venue?: Venue;
}

export interface Team {
  id: number;
  name: string;
  code?: null | string;
  country?: string;
  founded?: number | null;
  national?: boolean;
  logo?: string;
}

export interface League {
  id?: number;
  name?: string;
  country?: string;
  logo?: string;
  flag?: string;
  season?: number;
  round?: string;
  standings?: Array<Standing[]>;
}

export interface Score {
  halftime?: Goals;
  fulltime?: Goals;
  extratime?: Goals;
  penalty?: Goals;
}

export interface Venue {
  id?: number;
  name?: string;
  address?: null | string;
  city?: string;
  capacity?: number;
  surface?: string;
  image?: string;
}

export interface StandingsResult {
  league: League;
}

export interface Standing {
  rank?: number;
  team?: Team;
  points?: number;
  goalsDiff?: number;
  group?: string;
  form?: string;
  status?: Status;
  description?: null | string;
  all?: StandingStats;
  home?: StandingStats;
  away?: StandingStats;
  update?: Date;
}

export interface StandingStats {
  played?: number;
  win?: number;
  draw?: number;
  lose?: number;
  goals?: StandingGoals;
}

export interface StandingGoals {
  for?: number;
  against?: number;
}
