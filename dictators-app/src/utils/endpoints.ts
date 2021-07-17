export const ORIGIN_URL = 'http://localhost:3000';
export const CREATE_USER_URL = 'http://localhost:8000/api/user/create';
export const AUTH_USER_URL = 'http://localhost:8000/api/user/authenticate';

export const reqOptions = (body: any) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: ORIGIN_URL,
  },
  body: JSON.stringify(body),
});
