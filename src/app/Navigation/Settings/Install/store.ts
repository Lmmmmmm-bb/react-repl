import type { Package } from '~/stores/package';
import { create } from 'zustand';

interface PackageStore {
  packages: Package[];
  query: string;
  total: number;
}

interface SetPackageSearchResultOptions {
  append?: boolean;
  packages: Package[];
  query: string;
  total: number;
}

export const usePackageSearchStore = create<PackageStore>(() => ({
  packages: [],
  query: '',
  total: 0,
}));

export const setPackageSearchResult = ({
  append = false,
  packages,
  query,
  total,
}: SetPackageSearchResultOptions) => {
  usePackageSearchStore.setState((state) => {
    if (!append || state.query !== query) {
      return { packages, query, total };
    }

    const mergedPackages = new Map(
      [...state.packages, ...packages].map(item => [item.name, item]),
    );
    return { packages: [...mergedPackages.values()], query, total };
  });
};

export const resetPackageSearch = () => usePackageSearchStore.setState({
  packages: [],
  query: '',
  total: 0,
});
