// app/page.tsx
import { FullBlogData } from "./types/schema";
import NotionService from "./service/notion-service";
import blogStyles from "./styles/blog.module.css";
import sharedStyles from "./styles/shared.module.css";
import Link from "next/link";

// Helper function for string truncation
function truncateString(input: string, length: number = 20): string {
  if (input.length <= length) {
    return input;
  }
  return input.slice(0, length) + "...";
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
            <p>{truncateString(page.markdown.parent)}</p>
          </div>
        ))
      )}
    </div>
  );
}