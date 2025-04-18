import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
});

export interface Post {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  type: string;
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: any;
}

export interface Landing extends Post {
  acf: {
    [key: string]: any;
  };
}

export const fetchPosts = async (type: string = 'posts', params: object = {}) => {
  try {
    const { data } = await api.get(`/wp/v2/${type}`, {
      params: {
        _embed: true,
        per_page: 50,
        ...params,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchPost = async (slug: string, type: string = 'posts') => {
  try {
    const { data } = await api.get(`/wp/v2/${type}`, {
      params: {
        slug,
        _embed: true,
      },
    });
    return data[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const fetchLanding = async (slug: string) => {
  return fetchPost(slug, 'landings');
};

export const fetchProject = async (slug: string) => {
  return fetchPost(slug, 'projects');
}; 