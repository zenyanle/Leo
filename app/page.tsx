// app/page.tsx
import { FullBlogData } from "./types/schema";
import NotionService from "./service/notion-service";
import blogStyles from "./styles/blog.module.css";
import sharedStyles from "./styles/shared.module.css";
import Link from "next/link";

// Helper function for string truncation
function truncateString(input: string, length: number = 40): string {
  if (input.length <= length) {
    return input;
  }
  return input.slice(0, length) + "...";
}

function htmlToPreviewText(html: string, maxLength = 200): string {
  // 先移除所有HTML标签
  const text = html.replace(/<[^>]*>/g, ' ')
    // 移除多余空格
    .replace(/\s+/g, ' ')
    // 解码HTML实体
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
  
  // 截取指定长度
  return text.length > maxLength 
    ? text.slice(0, maxLength) + '...'
    : text;
}

// 添加 generateStaticParams 实现 SSG
export const dynamic = "force-static"; // 强制静态生成
export const revalidate = 3600; // 可选:重新验证时间(秒)

// 使用 async 组件进行数据获取
export default async function BlogPage() {
  // 数据获取移到组件内部
  const notion = new NotionService();
  const globalPostsData: FullBlogData = await notion.getAllBlogData();
  const { posts } = globalPostsData;

  return (
    <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
      <h1>My Notion Blog</h1>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((page) => (
          <div className={blogStyles.postPreview} key={page.post.slug}>
            <h3>
              <span className={blogStyles.titleContainer}>
                <Link href={`/blog/${page.post.slug}`}>
                  {page.post.title}
                </Link>
              </span>
            </h3>
            <div className="authors">By: Hugo</div>
            <div className="posted">Posted: {page.post.date}</div>
            <p>{htmlToPreviewText(page.html, 100)}</p>
          </div>
        ))
      )}
    </div>
  );
}