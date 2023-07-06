import loader, { Monaco } from '@monaco-editor/loader';
export type { Monaco } from '@monaco-editor/loader';
import type { editor } from 'monaco-editor';
import { editorService } from '../editorService';
import { useEffect, useState } from 'react';

let monaco: Promise<Monaco>;

export async function getMonaco() {
  if (!monaco) {
    monaco = loader.init().then(monaco => {
      for (const plugin of editorService.getLanguagePlugins()) {
        plugin.init(monaco);
      }
      return monaco;
    });
  }

  return monaco;
}

export function useMonaco(): Monaco | null {
  const [monaco, setMonaco] = useState<Monaco | null>(null);

  useEffect(() => {
    getMonaco().then(monaco => setMonaco(monaco));
  }, []);

  return monaco;
}

export async function monacoDefineTheme(themeData: editor.IStandaloneThemeData) {
  if (typeof window === 'undefined') {
    // do nothing on server-side
    return;
  }

  const monaco = await getMonaco();
  monaco.editor.defineTheme('editorTheme', themeData);
}
