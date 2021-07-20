// export const ORIGIN_URL = 'http://localhost:3000';
const apiPrefix = `${window.location.hostname}:8000`;
export const CREATE_USER_URL = `http://${apiPrefix}/api/user/create`;
export const LEADERBOARD_URL = `http://${apiPrefix}/api/leaderboard`;
export const AUTH_USER_URL = `http://${apiPrefix}/api/user/authenticate`;

export const reqOptions = (body: any) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: window.location.host,
  },
  body: JSON.stringify(body),
});
