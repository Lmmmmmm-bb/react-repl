import { JSDELIVR_BASE_URL } from './config';

interface PackageVersionResponse {
  tags: Record<string, string>;
  versions: string[];
}

export const fetchPackageVersionList = async (packageName: string) => {
  const response = await fetch(`${JSDELIVR_BASE_URL}/v1/package/npm/${packageName}`);
  const json: PackageVersionResponse = await response.json();
  return json;
};
