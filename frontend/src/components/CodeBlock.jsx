// components/CodeBlock.jsx

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, code }) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} wrapLines={true}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;