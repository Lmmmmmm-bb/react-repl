import type { AnchorHTMLAttributes, FC, PropsWithChildren } from 'react';
import type { Package } from '~/stores/package';
import Bug from '~/icons/Bug';
import GitHub from '~/icons/GitHub';
import Link from '~/icons/Link';
import Npm from '~/icons/Npm';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
const ExternalLink: FC<PropsWithChildren<ExternalLinkProps>> = ({ children, ...props }) => (
  <a
    {...props}
    target="_blank"
    rel="noreferrer"
    className="transition-opacity opacity-40 hover:opacity-80"
  >
    {children}
  </a>
);

interface PackageLinkProps {
  npmPackage: Package;
}

const PackageLink: FC<PackageLinkProps> = ({ npmPackage }) => (
  <div className="flex gap-2">
    {npmPackage.links.homepage && (
      <ExternalLink
        title={`Open ${npmPackage.name} homepage`}
        href={npmPackage.links.homepage}
      >
        <Link className="size-5" />
      </ExternalLink>
    )}

    {npmPackage.links.npm && (
      <ExternalLink title="Open in npm" href={npmPackage.links.npm}>
        <Npm className="size-5" />
      </ExternalLink>
    )}

    {npmPackage.links.repository && (
      <ExternalLink title="Open in GitHub" href={npmPackage.links.repository}>
        <GitHub className="size-5" />
      </ExternalLink>
    )}

    {npmPackage.links.bugs && (
      <ExternalLink title="Report issue" href={npmPackage.links.bugs}>
        <Bug className="size-5" />
      </ExternalLink>
    )}
  </div>
);

export default PackageLink;
