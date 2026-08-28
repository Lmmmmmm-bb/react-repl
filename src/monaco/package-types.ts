import type { CorePackage } from '~/stores/package';
import { setupTypeAcquisition } from '@typescript/ata';

interface PackageTypeFile {
  content: string;
  path: string;
}

export interface PackageTypeBundle {
  fallback: boolean;
  files: PackageTypeFile[];
}

const DECLARATION_FILE_REGEX = /\.d\.(?:ts|mts|cts)$/;
const ATA_FETCH_CONCURRENCY = 24;
const ATA_FETCH_RETRIES = 2;
const packageTypeCache = new Map<string, Promise<PackageTypeBundle>>();
const ataRequestQueue: Array<() => void> = [];
let activeAtaRequests = 0;
let typescriptPromise: Promise<typeof import('typescript')> | null = null;

const loadTypeScript = () => {
  if (!typescriptPromise) {
    typescriptPromise = import('typescript');
  }
  return typescriptPromise;
};

const normalizeAtaPath = (path: string) => {
  const absolutePath = path.startsWith('/') ? path : `/${path}`;
  return `file://${absolutePath}`;
};

const createFallbackFile = (packageName: string): PackageTypeFile => ({
  content: `declare module '${packageName}';\ndeclare module '${packageName}/*';`,
  path: `file:///node_modules/@types/${packageName.replace(/^@/, '').replace(/\//g, '__')}__fallback/index.d.ts`,
});

const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

const acquireAtaRequestSlot = () => new Promise<void>((resolve) => {
  if (activeAtaRequests < ATA_FETCH_CONCURRENCY) {
    activeAtaRequests += 1;
    resolve();
    return;
  }
  ataRequestQueue.push(resolve);
});

const releaseAtaRequestSlot = () => {
  const nextRequest = ataRequestQueue.shift();
  if (nextRequest) {
    nextRequest();
    return;
  }
  activeAtaRequests -= 1;
};

const createAtaFetcher = (packageName: string): typeof fetch => async (input, init) => {
  await acquireAtaRequestSlot();
  try {
    for (let attempt = 0; attempt <= ATA_FETCH_RETRIES; attempt += 1) {
      try {
        const response = await fetch(input, init);
        const isRetryable = response.status === 429 || response.status >= 500;
        if (!isRetryable || attempt === ATA_FETCH_RETRIES) {
          return response;
        }
        await response.body?.cancel();
      } catch (error) {
        if (attempt === ATA_FETCH_RETRIES) {
          console.warn(`[ATA] Failed to fetch types for ${packageName}:`, error);
          return new Response(null, { status: 503, statusText: 'Type acquisition failed' });
        }
      }
      await wait(250 * 2 ** attempt);
    }

    return new Response(null, { status: 503, statusText: 'Type acquisition failed' });
  } finally {
    releaseAtaRequestSlot();
  }
};

const acquirePackageTypes = async (lib: CorePackage): Promise<PackageTypeBundle> => {
  const typescript = await loadTypeScript();
  const files = new Map<string, PackageTypeFile>();
  const acquireTypes = setupTypeAcquisition({
    projectName: 'React REPL',
    typescript,
    fetcher: createAtaFetcher(lib.name),
    logger: {
      log: () => undefined,
      error: (...args) => console.warn('[ATA]', ...args),
      groupCollapsed: () => undefined,
      groupEnd: () => undefined,
    },
    delegate: {
      receivedFile: (content, path) => {
        const normalizedPath = normalizeAtaPath(path);
        files.set(normalizedPath, { content, path: normalizedPath });
      },
      errorMessage: (message, error) => {
        console.warn(`[ATA] ${message}`, error);
      },
    },
  });

  await acquireTypes(`import ${JSON.stringify(lib.name)}; // types: ${lib.version}`);

  const acquiredFiles = [...files.values()];
  const hasDeclarations = acquiredFiles
    .some(file => DECLARATION_FILE_REGEX.test(file.path));

  return {
    fallback: !hasDeclarations,
    files: hasDeclarations
      ? acquiredFiles
      : [...acquiredFiles, createFallbackFile(lib.name)],
  };
};

export const loadPackageTypes = (lib: CorePackage) => {
  const cacheKey = `${lib.name}@${lib.version}`;
  let bundle = packageTypeCache.get(cacheKey);
  if (!bundle) {
    bundle = acquirePackageTypes(lib).catch((error) => {
      packageTypeCache.delete(cacheKey);
      throw error;
    });
    packageTypeCache.set(cacheKey, bundle);
  }
  return bundle;
};
