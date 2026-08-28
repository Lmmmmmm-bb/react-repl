import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPackageList, PACKAGE_SEARCH_PAGE_SIZE } from '~/apis/package-list';
import Button from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import Loading from '~/icons/Loading';
import Search from '~/icons/Search';
import { cn } from '~/utils/cn';
import PackagePreview from '../PackagePreview';
import {
  resetPackageSearch,
  setPackageSearchResult,
  usePackageSearchStore,
} from './store';

type SearchStatus = 'idle' | 'loading' | 'loading-more' | 'success' | 'error';

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_DELAY = 400;

const Install: FC = () => {
  const { packages, query, total } = usePackageSearchStore();

  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const searchControllerRef = useRef<AbortController | null>(null);

  const searchPackages = useCallback(async (
    packageName: string,
    from = 0,
    append = false,
  ) => {
    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;
    setErrorMessage('');
    setStatus(append ? 'loading-more' : 'loading');

    try {
      const result = await fetchPackageList(packageName, {
        from,
        signal: controller.signal,
        size: PACKAGE_SEARCH_PAGE_SIZE,
      });
      if (controller.signal.aborted) {
        return;
      }
      setPackageSearchResult({ ...result, append, query: packageName });
      setStatus('success');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setErrorMessage(error instanceof Error ? error.message : 'Unable to search npm packages.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const nextQuery = inputValue.trim();

    if (nextQuery.length < MIN_SEARCH_LENGTH) {
      return;
    }

    const timeout = setTimeout(
      () => searchPackages(nextQuery),
      SEARCH_DEBOUNCE_DELAY,
    );

    return () => {
      clearTimeout(timeout);
      searchControllerRef.current?.abort();
    };
  }, [inputValue, searchPackages]);

  useEffect(() => () => {
    searchControllerRef.current?.abort();
    resetPackageSearch();
  }, []);

  const handleLoadMore = () => {
    if (status === 'success' && query) {
      searchPackages(query, packages.length, true);
    }
  };

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nextQuery = value.trim();
    searchControllerRef.current?.abort();
    setInputValue(value);

    if (nextQuery.length < MIN_SEARCH_LENGTH) {
      resetPackageSearch();
      setErrorMessage('');
      setStatus('idle');
    } else if (usePackageSearchStore.getState().query !== nextQuery) {
      resetPackageSearch();
      setStatus('loading');
    }
  };

  const isSearching = status === 'loading';
  const hasMore = packages.length < total;

  return (
    <div className="h-full pb-4 flex flex-col overflow-hidden">
      <div className="h-16 lg:h-20 px-4 flex shrink-0 items-center">
        <div className="relative w-full">
          <Label htmlFor="search-package">
            {isSearching
              ? <Loading className="size-4 absolute left-2.5 top-2.5 opacity-80 animate-spin" />
              : <Search className="size-4 absolute left-2.5 top-2.5 opacity-80" />}
          </Label>
          <Input
            id="search-package"
            className="w-full pl-8"
            placeholder="Search package from npm..."
            value={inputValue}
            onChange={handleInputValueChange}
          />
        </div>
      </div>

      <div className="px-4 overflow-auto scrollbar-hidden" aria-live="polite">
        {status === 'idle' && (
          <p className="py-8 text-center text-sm opacity-50">
            Type at least two characters to search npm.
          </p>
        )}

        {isSearching && (
          <p className="py-8 text-center text-sm opacity-50" role="status">
            Searching npm…
          </p>
        )}

        {status === 'error' && (
          <div className="py-8 flex flex-col items-center gap-3 text-sm">
            <p className="text-destructive">{errorMessage}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => searchPackages(inputValue.trim())}
            >
              Retry
            </Button>
          </div>
        )}

        {status === 'success' && packages.length === 0 && (
          <p className="py-8 text-center text-sm opacity-50">
            No packages found.
          </p>
        )}

        {packages.length > 0 && (
          <div
            className={cn(
              ['grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-2', 'lg:gap-4'],
            )}
          >
            {packages.map(item => (
              <PackagePreview key={item.name} npmPackage={item} />
            ))}
          </div>
        )}

        {hasMore && status !== 'loading' && status !== 'error' && (
          <div className="py-4 flex justify-center">
            <Button
              size="sm"
              variant="outline"
              disabled={status === 'loading-more'}
              onClick={handleLoadMore}
            >
              {status === 'loading-more' && <Loading className="mr-2 size-4 animate-spin" />}
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Install;
