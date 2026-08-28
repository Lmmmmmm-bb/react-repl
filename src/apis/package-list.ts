import type { Package } from '~/stores/package';
import { NPM_BASE_URL } from './config';

interface NpmObjects {
  package: Package;
}

interface NpmSearchPackageResponse {
  objects?: NpmObjects[];
  total?: number;
}

export interface PackageSearchResult {
  packages: Package[];
  total: number;
}

interface PackageSearchOptions {
  from?: number;
  signal?: AbortSignal;
  size?: number;
}

interface PackageSearchCacheEntry {
  expiresAt: number;
  result: PackageSearchResult;
}

export const PACKAGE_SEARCH_PAGE_SIZE = 20;

const PACKAGE_SEARCH_CACHE_TTL = 5 * 60 * 1000;
const PACKAGE_SEARCH_CACHE_LIMIT = 30;
const packageSearchCache = new Map<string, PackageSearchCacheEntry>();

const setCachedResult = (key: string, result: PackageSearchResult) => {
  if (packageSearchCache.size >= PACKAGE_SEARCH_CACHE_LIMIT) {
    const firstKey = packageSearchCache.keys().next().value;
    firstKey && packageSearchCache.delete(firstKey);
  }
  packageSearchCache.set(key, {
    expiresAt: Date.now() + PACKAGE_SEARCH_CACHE_TTL,
    result,
  });
};

export const fetchPackageList = async (
  packageName: string,
  {
    from = 0,
    signal,
    size = PACKAGE_SEARCH_PAGE_SIZE,
  }: PackageSearchOptions = {},
) => {
  const normalizedPackageName = packageName.trim();
  const cacheKey = `${normalizedPackageName.toLowerCase()}:${from}:${size}`;
  const cached = packageSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const searchParams = new URLSearchParams({
    from: String(from),
    size: String(size),
    text: normalizedPackageName,
  });
  const response = await fetch(`${NPM_BASE_URL}/-/v1/search?${searchParams}`, { signal });
  if (!response.ok) {
    throw new Error(`npm search failed with status ${response.status}.`);
  }
  const json: NpmSearchPackageResponse = await response.json();

  const objects = json.objects || [];
  const packages = objects
    .map(o => o.package)
    .sort((a, b) => Number(b.name === normalizedPackageName) - Number(a.name === normalizedPackageName));
  const result = {
    packages,
    total: json.total ?? packages.length,
  };
  setCachedResult(cacheKey, result);
  return result;
};
