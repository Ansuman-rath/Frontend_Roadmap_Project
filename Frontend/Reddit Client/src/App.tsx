import React, { useState, useEffect } from 'react';
import { SubredditLane } from './types/reddit';
import { fetchSubredditPosts, saveLanesToStorage, loadLanesFromStorage } from './utils/api';
import SubredditLaneComponent from './components/SubredditLane';
import AddLaneButton from './components/AddLaneButton';
import './App.css';

function App() {
  const [lanes, setLanes] = useState<SubredditLane[]>([]);
  const [showAddLane, setShowAddLane] = useState(false);

  // Load saved lanes on component mount
  useEffect(() => {
    const savedLanes = loadLanesFromStorage();
    if (savedLanes.length > 0) {
      setLanes(savedLanes);
    }
  }, []);

  // Save lanes to localStorage whenever they change
  useEffect(() => {
    saveLanesToStorage(lanes);
  }, [lanes]);

  const addSubredditLane = async (subredditName: string) => {
    const normalizedName = subredditName.toLowerCase().trim();
    
    // Check if lane already exists
    if (lanes.some(lane => lane.name === normalizedName)) {
      throw new Error(`Subreddit r/${normalizedName} is already added`);
    }

    const newLane: SubredditLane = {
      id: Date.now().toString(),
      name: normalizedName,
      posts: [],
      loading: true,
      error: null,
      lastUpdated: Date.now()
    };

    setLanes(prev => [...prev, newLane]);

    try {
      const response = await fetchSubredditPosts(normalizedName);
      const posts = response.data.children.map(child => child.data);
      
      setLanes(prev => prev.map(lane => 
        lane.id === newLane.id 
          ? { ...lane, posts, loading: false, lastUpdated: Date.now() }
          : lane
      ));
    } catch (error) {
      setLanes(prev => prev.map(lane => 
        lane.id === newLane.id 
          ? { ...lane, error: error instanceof Error ? error.message : 'Failed to fetch posts', loading: false }
          : lane
      ));
    }
  };

  const refreshLane = async (laneId: string) => {
    setLanes(prev => prev.map(lane => 
      lane.id === laneId ? { ...lane, loading: true, error: null } : lane
    ));

    const lane = lanes.find(l => l.id === laneId);
    if (!lane) return;

    try {
      const response = await fetchSubredditPosts(lane.name);
      const posts = response.data.children.map(child => child.data);
      
      setLanes(prev => prev.map(l => 
        l.id === laneId 
          ? { ...l, posts, loading: false, lastUpdated: Date.now() }
          : l
      ));
    } catch (error) {
      setLanes(prev => prev.map(l => 
        l.id === laneId 
          ? { ...l, error: error instanceof Error ? error.message : 'Failed to fetch posts', loading: false }
          : l
      ));
    }
  };

  const deleteLane = (laneId: string) => {
    setLanes(prev => prev.filter(lane => lane.id !== laneId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Reddit Client</h1>
        <p>Multi-lane subreddit viewer</p>
      </header>
      
      <main className="app-main">
        <div className="lanes-container">
          {lanes.map(lane => (
            <SubredditLaneComponent
              key={lane.id}
              lane={lane}
              onRefresh={() => refreshLane(lane.id)}
              onDelete={() => deleteLane(lane.id)}
            />
          ))}
          
          <AddLaneButton
            show={showAddLane}
            onToggle={() => setShowAddLane(!showAddLane)}
            onAdd={addSubredditLane}
          />
        </div>
      </main>
    </div>
  );
}

export default App; 