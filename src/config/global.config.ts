export const PORT = 'PORT';
export const OPENROUTER_REQUEST_URL = 'OPENROUTER_REQUEST_URL';

export default () => ({
  [PORT]: process.env[PORT] || 3003,
  [OPENROUTER_REQUEST_URL]: process.env[OPENROUTER_REQUEST_URL] || 'https://openrouter.ai/api/v1/models',
});
