import { RedditResponse, SubredditLane } from '../types/reddit';

const REDDIT_JSON_URL = 'https://www.reddit.com/r/{subreddit}.json';

export const fetchSubredditPosts = async (subredditName: string): Promise<RedditResponse> => {
  const url = REDDIT_JSON_URL.replace('{subreddit}', subredditName);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch posts from r/${subredditName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateSubreddit = async (subredditName: string): Promise<boolean> => {
  try {
    const response = await fetchSubredditPosts(subredditName);
    return response.data.children.length > 0;
  } catch {
    return false;
  }
};

// Local storage utilities
const LANES_STORAGE_KEY = 'reddit-client-lanes';

export const saveLanesToStorage = (lanes: SubredditLane[]): void => {
  try {
    localStorage.setItem(LANES_STORAGE_KEY, JSON.stringify(lanes));
  } catch (error) {
    console.error('Failed to save lanes to localStorage:', error);
  }
};

export const loadLanesFromStorage = (): SubredditLane[] => {
  try {
    const stored = localStorage.getItem(LANES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load lanes from localStorage:', error);
    return [];
  }
}; 