export const consoleWithTime = (message: string) =>
  console.log(`[${new Date().toISOString()}] ${message}`);
