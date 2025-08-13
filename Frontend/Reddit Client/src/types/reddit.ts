export interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  url: string;
  permalink: string;
  created_utc: number;
  num_comments: number;
  subreddit: string;
}

export interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

export interface SubredditLane {
  id: string;
  name: string;
  posts: RedditPost[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
} 