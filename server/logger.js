import { BACKEND_NAME } from './config.js';

const DEFAULT_SINK = (line) => {
  process.stdout.write(`${line}\n`);
};

const serializeEvent = (level, event) => JSON.stringify({
  timestamp: new Date().toISOString(),
  service: BACKEND_NAME,
  level,
  ...event,
});

export const createLogger = ({ sink = DEFAULT_SINK } = {}) => {
  const write = (level, event) => {
    sink(serializeEvent(level, event));
  };

  return {
    info: (event) => write('info', event),
    warn: (event) => write('warn', event),
    error: (event) => write('error', event),
  };
};
