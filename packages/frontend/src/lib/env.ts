const BROWSER_ENV_VARS = ["ENABLED_TOOLS", "API_URL", "MICROSOFT_APP_ID"];

export const getBrowserEnv = () =>
  BROWSER_ENV_VARS.reduce((e, v) => ({ ...e, [v]: process.env[v] }), {});

export const env =
  typeof window !== "undefined"
    ? (window as any).__BITBLOQ_ENV__ || {}
    : process.env;

export default env;
