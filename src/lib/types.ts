// lib/types.ts

// -------------------- Common Types --------------------
export interface UrlInfo {
  url_slug: string;
  url_title?: string;
  canonical?: string;
  url_index?: number;
}

export interface Media {
  full_path: string;
  alt_text?: string | null;
}

export interface Meta {
  meta_title: string;
  meta_description: string;
}

export interface BreadcrumbItem {
  slug: string;
  title: string;
}

// -------------------- Generic Types --------------------
export interface GenericAuthor {
  name: string;
  urlinfo: UrlInfo;
}

export interface GenericContent {
  title: string;
  published_at: string;
  updated_at: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
  authors: GenericAuthor[];
}

// -------------------- Article Types --------------------
export interface ChildItem {
  id: number;
  page_title: string;
  page_description: string;
  urlinfo: UrlInfo;
}

export interface ArticleContent {
  page_title: string;
  page_description: string;
  urlinfo: UrlInfo;
  banner: Media | null;
  children: ChildItem[];
}

export interface ArticlePageData {
  page_type: 'article';
  content: ArticleContent;
  breadcrumbs: BreadcrumbItem[] | null;
  [key: string]: any;
}

// -------------------- Category Types --------------------
export interface CategoryContent extends GenericContent {
  description: string;
  children: any[];
  packages: any[];
  blogs: any[];
  banner: Media; // mandatory
}

export interface CategoryPageData {
  page_type: 'category';
  content: CategoryContent;
  breadcrumbs: BreadcrumbItem[][];
  [key: string]: any;
}

// -------------------- Package Types --------------------
export interface PackagePageData {
  page_type: 'package';
  content: GenericContent;
  [key: string]: any;
}

// -------------------- Blog Types --------------------
export interface BlogAuthor {
  name: string;
  description: string;
  avatar?: Media | null;
  urlinfo: UrlInfo;
}

export interface BlogContentData {
  title: string;
  abstract: string;
  blog_date: string;
  btag: string[];
  authors: BlogAuthor[];
  banner?: Media;
  published_at: string;
  updated_at: string;
  meta: Meta;
  urlinfo: UrlInfo;
}

export interface BlogPageData {
  page_type: 'blog';
  content: BlogContentData;
  tocHtml: string;
  updatedHtml: string;
  block_count: number;
  previous_blog?: any;
  next_blog?: any;
  [key: string]: any;
}

// -------------------- Union Type for All Pages --------------------
export type PageData =
  | ArticlePageData
  | CategoryPageData
  | PackagePageData
  | BlogPageData;
