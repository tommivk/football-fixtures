export interface Match {
  fixture: Fixture;
  league?: League;
  teams?: Teams;
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
export interface Teams {
  home: Team;
  away: Team;
}

export interface Team {
  id?: number;
  name?: string;
  logo?: string;
  winner?: boolean | null;
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
