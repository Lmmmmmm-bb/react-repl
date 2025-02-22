import type { Package } from '~/stores/package';
import { create } from 'zustand';

interface PackageStore {
  packages: Package[];
}

export const usePackageStore = create<PackageStore>(() => ({ packages: [] }));

export const setPackages = (packages: Package[]) => usePackageStore.setState({ packages });
