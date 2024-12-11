// lib/notion/notionService.ts
import { Client } from "@notionhq/client";
import { BlogPost, PostPage, FullBlogData } from "../types/schema";
import { NotionToMarkdown } from "notion-to-md";
import { cache } from 'react';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/idea.css'; // 使用 VS 主题

export default class NotionService {
    private client: Client;
    private n2m: NotionToMarkdown;
    private database: string;

    constructor() {
        this.client = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN });
        this.n2m = new NotionToMarkdown({ notionClient: this.client });
        this.database = process.env.NEXT_PUBLIC_NOTION_BLOG_DATABASE_ID ?? '';
        //this.database = '';
    }

    // 使用 React cache 优化数据获取
    getAllBlogData = cache(async (): Promise<FullBlogData> => {
        if (!this.database) {
            console.log(this.database);
            throw new Error('Database ID is not configured');
        }

        const response = await this.client.databases.query({
            database_id: this.database,
            filter: {
                and: [
                    {
                        property: 'Published',
                        checkbox: {
                            equals: true
                        }
                    },
                    {
                        property: 'Name',
                        title: {
                            is_not_empty: true
                        }
                    }
                ]
            },
            sorts: [
                {
                    property: 'Updated',
                    direction: 'descending'
                }
            ]
        });

        // 用Set收集标签，避免重复
        const tagsSet = new Set<string>();

        // 并行处理所有页面
        const postsPromises = response.results.map(async (page) => {
            const post = NotionService.pageToPostTransformer(page);
            
            // 收集标签
            post.tags.forEach(tag => tagsSet.add(tag.name));
            
            // 获取 Markdown
            const mdBlocks = await this.n2m.pageToMarkdown(page.id);
            const markdown = this.n2m.toMarkdownString(mdBlocks);
            const html = this.toHtml(markdown.parent)
            
            return {
                post,
                markdown,
                html
            } as PostPage;
        });

        const posts = await Promise.all(postsPromises);

        return {
            posts,
            tags: Array.from(tagsSet),
            totalPosts: posts.length
        };
    });

    private static pageToPostTransformer(page: any): BlogPost {
        let cover = '';
        if (page.cover) {
            switch (page.cover.type) {
                case 'file':
                    cover = page.cover.file.url;
                    break;
                case 'external':
                    cover = page.cover.external.url;
                    break;
            }
        }

        const properties = page.properties;
        
        return {
            id: page.id,
            cover,
            title: properties.Name.title[0]?.plain_text ?? 'Untitled',
            tags: properties.Tags.multi_select ?? [],
            description: properties.Description.rich_text[0]?.plain_text ?? '',
            date: properties.Updated.last_edited_time,
            slug: properties.Slug.formula.string
        };
    }

    toHtml = (markdown: string) => {
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
        
        const str = marked.parse(markdown);
        return str;
    }}