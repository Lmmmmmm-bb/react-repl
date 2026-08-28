import type { FC } from 'react';
import Button from '~/components/ui/Button';
import Clean from '~/icons/Clean';
import { resetPackageStore } from '~/stores/package';
import { resetVirtualFileStore } from '~/stores/virtual-file';

const Reset: FC = () => {
  const handleReset = () => {
    // eslint-disable-next-line no-alert
    if (confirm('Are you sure you want to reset playground. It can NOT be undone.')) {
      resetPackageStore();
      resetVirtualFileStore();
      import('~/monaco').then(({ resetMonaco }) => resetMonaco());
      history.replaceState({}, '', location.pathname);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      title="Reset to default"
      data-umami-event="Reset"
      onClick={handleReset}
    >
      <Clean className="size-5" />
    </Button>
  );
};

export default Reset;
