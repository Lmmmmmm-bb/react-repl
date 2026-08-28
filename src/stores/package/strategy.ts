export const packageRenameStrategy: Record<string, string> = {
  'react-dom': 'react-dom/client',
};

export const packagePathStrategy: Record<string, string> = {
  'react-dom/client': '/client',
};

export const packageQueryStrategy: Record<string, string> = {
  antd: '?bundle&external=react,react-dom,react-dom/client',
};
