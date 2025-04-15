// app/page.tsx
import { FullBlogData, BuildData } from "./types/schema";
import NotionService from "./service/notion-service";
import blogStyles from "./styles/blog.module.css";
import sharedStyles from "./styles/shared.module.css";
import Link from "next/link";
import siteConfig from "./config/site-config";

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

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 添加 generateStaticParams 实现 SSG
export const dynamic = "force-static"; // 强制静态生成
export const revalidate = 3600; // 可选:重新验证时间(秒)

// 使用 async 组件进行数据获取
export default async function HomePage() {
  // 数据获取移到组件内部
  const notion = new NotionService();
  const globalPostsData: FullBlogData = await notion.getAllBlogData();
  const { posts, tags } = globalPostsData;
  
  // 只获取最新的4篇文章
  const recentPosts = posts.slice(0, 4);

  return (
    <div className={blogStyles.blogContainer}>
      {/* 导航栏 */}
      <header className={blogStyles.header}>
        <div className={blogStyles.headerContent}>
          <Link href="/" className={blogStyles.logo}>
            <h2>{siteConfig.siteName}</h2>
          </Link>
          <nav className={blogStyles.nav}>
            <Link href="/" className={blogStyles.navLink}>首页</Link>
            <Link href="/blog" className={blogStyles.navLink}>博客</Link>
            <Link href={siteConfig.socialLinks.github} className={blogStyles.navLink} target="_blank">
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      <main className={blogStyles.main}>
        {/* 主页英雄区域 */}
        <div className={blogStyles.hero}>
          <h1 className={blogStyles.heroTitle}>{siteConfig.hero.title}</h1>
          <p className={blogStyles.heroSubtitle}>{siteConfig.hero.subtitle}</p>
          <div className={blogStyles.heroCta}>
            <Link href="/blog" className={blogStyles.primaryButton}>
              {siteConfig.hero.buttonText}
            </Link>
          </div>
        </div>

        {/* 最新文章区域 */}
        <section className={blogStyles.homeSection}>
          <div className={blogStyles.sectionHeader}>
            <h2>{siteConfig.sections.recentPosts.title}</h2>
            <Link href="/blog" className={blogStyles.viewAll}>{siteConfig.sections.recentPosts.viewAllText}</Link>
          </div>
          
          <div className={blogStyles.postsGrid}>
            {recentPosts.length === 0 ? (
              <p className={blogStyles.noPosts}>{siteConfig.noPostsText}</p>
            ) : (
              recentPosts.map((page) => (
                <article className={blogStyles.postCard} key={page.post.slug}>
                  {page.post.cover && (
                    <div className={blogStyles.postCardImageWrapper}>
                      <img 
                        src={page.post.cover} 
                        alt={page.post.title} 
                        className={blogStyles.postCardImage}
                      />
                    </div>
                  )}
                  <div className={blogStyles.postCardContent}>
                    <div className={blogStyles.postCardMeta}>
                      <span className={blogStyles.postCardDate}>
                        {formatDate(page.post.date)}
                      </span>
                      {page.post.tags.length > 0 && (
                        <div className={blogStyles.postCardTags}>
                          {page.post.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag.name} 
                              className={blogStyles.postCardTag}
                              style={{ background: tag.color || '#f0f0f0' }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className={blogStyles.postCardTitle}>
                      <Link href={`/blog/${page.post.slug}`}>
                        {page.post.title}
                      </Link>
                    </h3>
                    <p className={blogStyles.postCardExcerpt}>
                      {page.post.description || htmlToPreviewText(page.html, 120)}
                    </p>
                    <Link href={`/blog/${page.post.slug}`} className={blogStyles.readMoreLink}>
                      {siteConfig.readMoreText}
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}