"use client"
import React, { useEffect, useRef } from 'react';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js'; // 引入 highlight.js
import 'highlight.js/styles/vs.css'; // 使用主题样式（可根据需要选择其他样式）

const mdContainingFencedCodeBlock = `
# 示例 Markdown

这是一个普通段落。

\`\`\`js
console.log("Hello, Highlight.js!");
\`\`\`

\`\`\`python
print("Hello, Python!")
\`\`\`
`;


interface SyntaxHighlightedCodeProps {
    children: React.ReactNode; // 子节点，可以是代码内容
    className?: string;        // className 属性，可能未定义
  }
  
  function SyntaxHighlightedCode({ children, className }: SyntaxHighlightedCodeProps) {
    const ref = React.useRef<HTMLElement>(null);
  
    React.useEffect(() => {
      if (ref.current && className?.startsWith('lang-')) {
        hljs.highlightElement(ref.current);
      }
    }, [className]);
  
    return (
      <code ref={ref} className={className}>
        {children}
      </code>
    );
  }

  export default function Home() {
    const markdownRef = useRef<HTMLDivElement>(null); // 引用 Markdown 渲染的容器
  
    useEffect(() => {
      if (markdownRef.current) {
        const codeBlocks = markdownRef.current.querySelectorAll('pre code'); // 查找所有代码块
        codeBlocks.forEach((block) => {
          hljs.highlightElement(block as HTMLElement); // 使用 highlight.js 对代码块高亮
        });
      }
    }, [markdownRef]);
  
    return (
      <div>
        <h1>Markdown with Highlight.js</h1>
        <div ref={markdownRef}>
          <Markdown>{process.env.NEXT_PUBLIC_SAMPLE ?? ''}</Markdown>
        </div>
      </div>
    );
  }