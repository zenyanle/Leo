import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/idea.css'; // 使用 VS 主题
import blogStyles from "../styles/blog.module.css";
import sharedStyles from "../styles/shared.module.css";


export const dynamic = "force-static"; // 强制静态生成
export const revalidate = 3600; // 可选:重新验证时间(秒)


export default function Home() {
  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
  
  const str = marked.parse(process.env.NEXT_PUBLIC_SAMPLE ?? '');

  return (
    <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
    <div dangerouslySetInnerHTML={{ __html: str }} />
    </div>
  )
}