if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for this command.`);
  }
  return value;
}
