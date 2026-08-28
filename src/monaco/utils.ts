import * as monaco from 'monaco-editor';
import { resetCoreLib } from './core-lib';
import { resetExtraLib } from './extra-lib';
import { resetModels } from './model';

interface LibRegistration {
  content: string;
  id: symbol;
}

interface LibRegistrationEntry {
  registrations: LibRegistration[];
}

interface LibFile {
  content: string;
  path: string;
}

const libRegistrationEntries = new Map<string, LibRegistrationEntry>();

const applyLibRegistrations = (changedPaths: Iterable<string>) => {
  for (const path of changedPaths) {
    monaco.editor.getModel(monaco.Uri.parse(path))?.dispose();
  }

  const libs = [...libRegistrationEntries.entries()].flatMap(([path, entry]) => {
    const registration = entry.registrations[entry.registrations.length - 1];
    return registration ? [{ content: registration.content, filePath: path }] : [];
  });

  monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs);
  monaco.languages.typescript.javascriptDefaults.setExtraLibs(libs);
};

export const registerLibs = (files: LibFile[]) => {
  const registrationId = Symbol('lib-bundle');
  const filesByPath = new Map(files.map(file => [file.path, file]));
  const registeredPaths = new Set(filesByPath.keys());

  for (const file of filesByPath.values()) {
    const entry = libRegistrationEntries.get(file.path) || { registrations: [] };
    entry.registrations.push({ content: file.content, id: registrationId });
    libRegistrationEntries.set(file.path, entry);
  }
  registeredPaths.size && applyLibRegistrations(registeredPaths);

  let isDisposed = false;

  return () => {
    if (isDisposed) {
      return;
    }
    isDisposed = true;

    for (const path of registeredPaths) {
      const entry = libRegistrationEntries.get(path);
      if (!entry) {
        continue;
      }

      entry.registrations = entry.registrations
        .filter(item => item.id !== registrationId);
      if (!entry.registrations.length) {
        libRegistrationEntries.delete(path);
      }
    }
    registeredPaths.size && applyLibRegistrations(registeredPaths);
  };
};

export const registerLib = (content: string, path: string) => (
  registerLibs([{ content, path }])
);

export const resetMonaco = async () => {
  resetModels();
  await Promise.all([resetCoreLib(), resetExtraLib()]);
};
