export const ORIGIN_URL = 'https://kool-kids-klan.github.io/';
export const BACKEND_URL = 'dictators-django.herokuapp.com';
// TODO config file
// export const ORIGIN_URL = 'http://localhost';
// export const BACKEND_URL = `${window.location.hostname}:8000`;
export const CREATE_USER_URL = `https://${BACKEND_URL}/api/user/create`;
export const LEADERBOARD_URL = `https://${BACKEND_URL}/api/leaderboard`;
export const AUTH_USER_URL = `https://${BACKEND_URL}/api/user/authenticate`;

export const reqOptions = (body: any) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: ORIGIN_URL,
  },
  body: JSON.stringify(body),
});
