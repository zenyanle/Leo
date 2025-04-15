// app/blog/[slug]/page.tsx
import { FullBlogData } from "../../types/schema";
import NotionService from "../../service/notion-service";
import 'highlight.js/styles/github.css'; // 更换为 GitHub 代码高亮主题
import blogStyles from "../../styles/blog.module.css";
import sharedStyles from "../../styles/shared.module.css";
import Link from "next/link";
import siteConfig from "../../config/site-config";

// 生成静态页面参数
export async function generateStaticParams() {
  const notion = new NotionService();
  const { posts } = await notion.getAllBlogData();
  
  // 从所有文章数据中提取 slug
  return posts.map((post) => ({
    slug: post.post.slug,
  }));
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Next.js 15 中的页面组件参数类型
type PageProps = {
  params?: Promise<any>;
  searchParams?: Promise<any>;
};

// 使用 any 类型定义组件，避免类型检查错误
export default async function BlogPost({ params }: { params?: Promise<any> }) {
    // 确保我们能够获取到参数，无论是否为 Promise
    const resolvedParams = params instanceof Promise ? await params : params || {};
    // 类型断言确保我们可以访问 slug 属性
    const slug = 'slug' in resolvedParams ? resolvedParams.slug as string : '';
    
    const notion = new NotionService();
    const { posts } = await notion.getAllBlogData();
    
    // 找到对应的文章数据
    const post = posts.find(p => p.post.slug === slug);
    
    if (!post) {
        return <div className={blogStyles.notFound}>{siteConfig.notFoundText}</div>;
    }

    return (
      <div className={blogStyles.blogContainer}>
        {/* 导航栏 */}
        <header className={blogStyles.header}>
          <div className={blogStyles.headerContent}>
            <Link href="/" className={blogStyles.logo}>
              <h2>{siteConfig.siteName}</h2>
            </Link>
            <nav className={blogStyles.nav}>
              <Link href="/" className={blogStyles.navLink}>{siteConfig.nav.home}</Link>
              <Link href="/blog" className={blogStyles.navLink}>{siteConfig.nav.blog}</Link>
              <Link href={siteConfig.socialLinks.github} className={blogStyles.navLink} target="_blank">
                GitHub
              </Link>
            </nav>
          </div>
        </header>

        <main className={blogStyles.articleMain}>
          {/* 文章头部 */}
          <div className={blogStyles.articleHeader}>
            {post.post.cover && (
              <div className={blogStyles.articleCover}>
                <img src={post.post.cover} alt={post.post.title} />
              </div>
            )}
            
            <h1 className={blogStyles.articleTitle}>{post.post.title}</h1>
            
            <div className={blogStyles.articleMeta}>
              <time className={blogStyles.articleDate}>
                {formatDate(post.post.date)}
              </time>
              
              {post.post.tags.length > 0 && (
                <div className={blogStyles.articleTags}>
                  {post.post.tags.map(tag => (
                    <span 
                      key={tag.name} 
                      className={blogStyles.articleTag}
                      style={{ background: tag.color || '#f0f0f0' }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 文章内容 */}
          <div className={`${blogStyles.articleContent} ${sharedStyles.layout}`}>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
          
          {/* 文章底部 */}
          <div className={blogStyles.articleFooter}>
            <div className={blogStyles.articleNavigation}>
              <Link href="/blog" className={blogStyles.backToList}>
                ← {siteConfig.blog.backToList}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
}

// 强制静态生成
export const dynamic = "force-static";
export const revalidate = 3600; // 可选：重新验证时间（秒）