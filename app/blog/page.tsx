import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/idea.css'; // 使用 VS 主题
import blogStyles from "../styles/blog.module.css";
import sharedStyles from "../styles/shared.module.css";
import NotionService from "../service/notion-service";
import Link from "next/link";
import { useState } from "react";
import siteConfig from "../config/site-config";

export const dynamic = "force-static"; // 强制静态生成
export const revalidate = 3600; // 可选:重新验证时间(秒)

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

export default async function BlogPage() {
  // 数据获取
  const notion = new NotionService();
  const { posts, tags } = await notion.getAllBlogData();

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
        <div className={blogStyles.pageTitle}>
          <h1>{siteConfig.blog.title}</h1>
          <p className={blogStyles.subtitle}>{siteConfig.blog.subtitle}</p>
        </div>

        {/* 标签筛选区 */}
        <div className={blogStyles.tagContainer}>
          {tags.map(tag => (
            <Link 
              href={`/blog?tag=${tag}`} 
              key={tag}
              className={blogStyles.tagLink}
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* 文章列表 */}
        <div className={blogStyles.postsGrid}>
          {posts.length === 0 ? (
            <p className={blogStyles.noPosts}>{siteConfig.noPostsText}</p>
          ) : (
            posts.map((page) => (
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
                        {page.post.tags.map(tag => (
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
                  <h2 className={blogStyles.postCardTitle}>
                    <Link href={`/blog/${page.post.slug}`}>
                      {page.post.title}
                    </Link>
                  </h2>
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
      </main>
    </div>
  );
}