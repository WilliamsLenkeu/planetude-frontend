const API_URL = 'https://plan-etude.koyeb.app';

type RequestOpts = RequestInit & { retry?: number };

async function request(path: string, opts: RequestOpts = {}) {
  const token = localStorage.getItem('token');

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw { status: res.status, data };
  }

  return data;
}

export default request;
