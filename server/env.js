import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ENV_FILES = ['.env.local', '.env'];

const parseEnvFile = (content) => {
  const parsed = {};
  const lines = String(content || '').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
};

export const loadBackendEnvironment = async ({ cwd = process.cwd(), baseEnv = process.env } = {}) => {
  const mergedEnv = { ...baseEnv };

  for (const fileName of ENV_FILES) {
    const filePath = join(cwd, fileName);

    try {
      const content = await readFile(filePath, 'utf8');
      const parsed = parseEnvFile(content);

      for (const [key, value] of Object.entries(parsed)) {
        if (mergedEnv[key] === undefined) {
          mergedEnv[key] = value;
        }
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return mergedEnv;
};
