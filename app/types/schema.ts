// types/schema.ts
export interface BlogPost {
    id: string;
    cover: string;
    title: string;
    tags: Array<{ name: string; color: string }>;
    description: string;
    date: string;
    slug: string;
}

export interface PostPage {
    post: BlogPost;
    html: string;
    markdown: { parent: string }; // 修改这里以匹配 notion-to-md 的返回类型
}

export interface FullBlogData {
    posts: PostPage[];
    tags: string[];
    totalPosts: number;
}