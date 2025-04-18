export interface WPBase {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt?: {
    rendered: string;
    protected: boolean;
  };
  modified: string;
  link: string;
}

export interface Post extends WPBase {
  type: 'post';
  categories: number[];
  tags: number[];
  featured_media: number;
}

export interface Page extends WPBase {
  type: 'page';
  template: string;
  parent: number;
}

export interface CustomPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  slug: string;
  type: string;
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: any;
  acf?: {
    [key: string]: any;
  };
} 