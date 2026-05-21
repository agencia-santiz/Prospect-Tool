import fs from 'node:fs';
import path from 'node:path';
import { BACKEND_NAME } from '../server/config.js';

const DEFAULT_LOG_FILE_NAME = 'desktop.log';
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_ARCHIVE_COUNT = 3;

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeDetails = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (isPlainObject(value)) {
    return value;
  }

  return {
    value,
  };
};

const ensureDirectory = (directory) => {
  fs.mkdirSync(directory, { recursive: true });
};

const rotateLogFiles = (filePath, archiveCount) => {
  for (let index = archiveCount - 1; index >= 1; index -= 1) {
    const sourcePath = `${filePath}.${index}`;
    const targetPath = `${filePath}.${index + 1}`;

    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    try {
      fs.renameSync(sourcePath, targetPath);
    } catch {
      // Keep logging best-effort only.
    }
  }

  fs.renameSync(filePath, `${filePath}.1`);
};

const createFileSink = ({
  logDirectory,
  logFileName = DEFAULT_LOG_FILE_NAME,
  maxBytes = DEFAULT_MAX_BYTES,
  archiveCount = DEFAULT_ARCHIVE_COUNT,
}) => {
  const absoluteDirectory = path.resolve(logDirectory);
  const filePath = path.join(absoluteDirectory, logFileName);

  ensureDirectory(absoluteDirectory);

  const writeLine = (line) => {
    try {
      const entry = `${line}\n`;
      if (fs.existsSync(filePath)) {
        const currentSize = fs.statSync(filePath).size;
        const incomingSize = Buffer.byteLength(entry, 'utf8');

        if (currentSize + incomingSize > maxBytes) {
          rotateLogFiles(filePath, archiveCount);
        }
      }

      fs.appendFileSync(filePath, entry, 'utf8');
    } catch {
      // Best-effort logging should never break startup or shutdown.
    }
  };

  return {
    filePath,
    writeLine,
  };
};

const buildRecord = (level, service, component, firstArg, secondArg) => {
  const timestamp = new Date().toISOString();
  const baseRecord = {
    timestamp,
    service,
    component,
    level,
  };

  if (isPlainObject(firstArg)) {
    return {
      ...baseRecord,
      ...firstArg,
      component,
    };
  }

  const details = normalizeDetails(secondArg);

  return {
    ...baseRecord,
    event: 'desktop_log',
    message: firstArg === undefined ? '' : String(firstArg),
    ...(details === undefined ? {} : { details }),
  };
};

export const createDesktopLogger = ({
  logDirectory,
  logFileName = DEFAULT_LOG_FILE_NAME,
  maxBytes = DEFAULT_MAX_BYTES,
  archiveCount = DEFAULT_ARCHIVE_COUNT,
  service = BACKEND_NAME,
  mirrorToStdout = true,
} = {}) => {
  const sink = createFileSink({
    logDirectory,
    logFileName,
    maxBytes,
    archiveCount,
  });

  const write = (level, firstArg, secondArg) => {
    const component = isPlainObject(firstArg) ? 'backend' : 'desktop';
    const record = buildRecord(level, service, component, firstArg, secondArg);
    const line = JSON.stringify(record);

    if (mirrorToStdout) {
      process.stdout.write(`${line}\n`);
    }

    sink.writeLine(line);
  };

  return {
    filePath: sink.filePath,
    info: (firstArg, secondArg) => write('info', firstArg, secondArg),
    warn: (firstArg, secondArg) => write('warn', firstArg, secondArg),
    error: (firstArg, secondArg) => write('error', firstArg, secondArg),
  };
};
