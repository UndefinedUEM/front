export type UserData = {
  name: string;
  email: string;
  password: string;
};

export type ScoutData = {
  name: string;
  id: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type PresenceList = {
  id: number;
  createdAt: string;
  confirmedScouts: ScoutData[];
};

export type LoginResponse = {
  user: User;
  access_token: string;
};
