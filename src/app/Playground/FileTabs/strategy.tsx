import type { ReactNode } from 'react';
import type { FileExtensionType } from '~/virtual-file';
import Css from '~/icons/Css';
import JavaScript from '~/icons/JavaScript';
import Json from '~/icons/Json';
import ReactIcon from '~/icons/React';
import TypeScript from '~/icons/TypeScript';

export const virtualFileExtIconStrategy: Record<FileExtensionType, ReactNode> = {
  css: <Css className="size-[13px] text-[#0288d1]" />,
  json: <Json className="size-[13px] text-[#F2C24F]" />,
  js: <JavaScript className="size-[14px] text-[#F7DF1E]" />,
  jsx: <ReactIcon className="size-4 text-[#54B9D1]" />,
  ts: <TypeScript className="size-[14px] text-brand" />,
  tsx: <ReactIcon className="size-4 text-brand" />,
};
