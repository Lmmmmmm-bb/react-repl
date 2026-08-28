import type { FC } from 'react';
import Container from '~/components/Container';
import FormatIcon from '~/icons/Format';
import { formatActiveFile } from './format-active-file';

const { Action } = Container;

const Format: FC = () => (
  <Action
    title="[⌥⇧F] Format Code"
    data-umami-event="Format"
    onClick={() => formatActiveFile()}
  >
    <FormatIcon className="size-5" />
  </Action>
);

export default Format;
