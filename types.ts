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
