# Reddit Client - Multi-Lane

A modern, responsive Reddit client built with React and TypeScript that allows users to view multiple subreddits in separate, customizable lanes.

## Features

- **Multi-Lane Layout**: View multiple subreddits simultaneously in a responsive grid layout
- **Dynamic Subreddit Addition**: Add new subreddit lanes by entering subreddit names
- **Real-time Data**: Fetch posts from Reddit's JSON API with automatic validation
- **Lane Management**: Refresh posts or delete lanes with intuitive controls
- **Persistent Storage**: Lanes are automatically saved to localStorage and restored on reload
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, Reddit-inspired design with smooth animations

## Screenshots

The application features a column-based layout where each column represents a different subreddit, similar to the wireframe design with:
- Subreddit lanes showing posts with upvote counts, titles, and authors
- Lane management menus (refresh/delete options)
- Add new lane functionality with a floating action button
- Responsive grid layout that adapts to screen size

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (Grid, Flexbox, CSS Variables)
- **API**: Reddit JSON API (`https://www.reddit.com/r/{subreddit}.json`)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage for persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reddit-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage

### Adding Subreddits

1. Click the "+" button in the top-right corner
2. Enter the subreddit name (e.g., "learnprogramming", "javascript")
3. Click "Add Subreddit" to create a new lane

### Managing Lanes

- **Refresh**: Click the "⋮" menu in any lane header and select "Refresh" to fetch latest posts
- **Delete**: Click the "⋮" menu and select "Delete" to remove a lane
- **Posts**: Click on any post to open it in Reddit

### Features

- **Automatic Validation**: Subreddits are validated before adding
- **Error Handling**: Graceful error handling for invalid subreddits or API issues
- **Loading States**: Visual feedback during data fetching
- **Responsive Layout**: Automatically adjusts to different screen sizes
- **Persistent Storage**: Your custom lanes are saved and restored automatically

## API Integration

The application integrates with Reddit's public JSON API:

- **Endpoint**: `https://www.reddit.com/r/{subreddit}.json`
- **Data**: Posts with titles, authors, scores, timestamps, and comment counts
- **Rate Limiting**: Respects Reddit's API limits
- **Error Handling**: Graceful fallbacks for API failures

## Project Structure

```
src/
├── components/          # React components
│   ├── SubredditLane.tsx
│   ├── PostItem.tsx
│   └── AddLaneButton.tsx
├── types/              # TypeScript type definitions
│   └── reddit.ts
├── utils/              # Utility functions
│   └── api.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── *.css               # Component stylesheets
```

## Customization

### Styling

The application uses CSS modules and custom CSS properties for easy theming:
- Modify color schemes in component CSS files
- Adjust spacing and typography in `App.css`
- Customize animations and transitions

### Adding Features

- **New Post Types**: Extend the `RedditPost` interface in `types/reddit.ts`
- **Additional Actions**: Add new menu items in `SubredditLane.tsx`
- **Enhanced UI**: Modify component stylesheets for visual improvements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Reddit for providing the public JSON API
- React team for the excellent framework
- Vite team for the fast build tool 