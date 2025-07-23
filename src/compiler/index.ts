import type { CorePackage, Package } from '~/stores/package';
import type { VirtualFile } from '~/virtual-file';
import * as esbuild from 'esbuild-wasm';
import { initializeEsbuild } from './esbuild';
import { createVirtualFilePlugin } from './plugins';
import { ensureReactImport } from './transforms';

export const transform = async (
  file: VirtualFile,
  files: Record<string, VirtualFile>,
  packages: (CorePackage | Package)[] = [],
) => {
  await initializeEsbuild();

  // Create external list with package names and their sub-paths
  const external = packages.flatMap(pkg => [pkg.name, `${pkg.name}/*`]);

  try {
    const result = await esbuild.build({
      external,
      bundle: true,
      write: false,
      target: 'es2020',
      format: 'esm',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      stdin: {
        contents: ensureReactImport(file.code),
        loader: file.filename.endsWith('.tsx') ? 'tsx' : file.filename.endsWith('.ts') ? 'ts' : 'jsx',
      },
      plugins: [createVirtualFilePlugin(files)],
    });

    return result.outputFiles[0].text;
  } catch (error) {
    console.error('ESBuild transform error:', error);
    throw error;
  }
};
