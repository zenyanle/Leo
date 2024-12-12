// app/blog/[slug]/page.tsx
import { FullBlogData } from "../../types/schema";
import NotionService from "../../service/notion-service";
import 'highlight.js/styles/vs.css';
import blogStyles from "../../styles/blog.module.css";
import sharedStyles from "../../styles/shared.module.css";
import { pages } from "next/dist/build/templates/app-page";


// 生成静态页面参数
// @ts-ignore
export async function generateStaticParams() {
  const notion = new NotionService();
  const { posts } = await notion.getAllBlogData();
  
  // 从所有文章数据中提取 slug
  return posts.map((post) => ({
    slug: post.post.slug,
  }));
}

// 页面组件
// @ts-ignore
export default async function BlogPost({ params }: { params: any }) {
    const notion = new NotionService();
    const { posts } = await notion.getAllBlogData();
    
    // 找到对应的文章数据
    const post = posts.find(p => p.post.slug === params.slug);
    
    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        )

    
}

// 强制静态生成
export const dynamic = "force-static";
export const revalidate = 3600; // 可选：重新验证时间（秒）