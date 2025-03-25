## Root Level Files
- `package.json`: Project dependencies, scripts, and configuration
- `README.md`: Project documentation, setup instructions, and overview
- `.gitignore`: Specify files/directories to be ignored by version control
- `tailwind.config.js`: Tailwind CSS configuration and customization

## `src/` Directory Structure

### `components/` Directory
- `Auth/LoginForm.js`: 
  - Contains the login page form 
  - Handles user authentication inputs
  - Manages login state and error handling

- `Auth/LogoutButton.js`:
  - Button component to log out the user
  - Clears authentication tokens
  - Redirects to login page

- `Profile/UserInfo.js`:
  - Displays basic user information
  - Fetches and renders user profile data from GraphQL

- `Profile/XPSection.js`:
  - Displays user's XP information
  - Shows XP earned, progress, and potentially XP breakdown

- `Graphs/XPOverTimeGraph.js`:
  - SVG-based graph showing XP progression
  - Visualizes XP earned across different time periods

### `services/` Directory
- `authService.js`:
  - Handles authentication logic
  - Manages login, logout, and token storage
  - Creates authentication headers for API requests

- `graphqlService.js`:
  - Configures Apollo Client
  - Sets up GraphQL endpoint connection
  - Manages authentication for GraphQL queries

### `queries/` Directory
- `userQueries.js`:
  - Defines GraphQL query schemas
  - Contains queries for fetching user data
  - Includes queries for profile, XP, progress, etc.

### `utils/` Directory
- `dataTransformers.js`:
  - Helper functions to transform GraphQL data
  - Processes and formats raw data for components
  - Handles data normalization and filtering

- `svgHelpers.js`:
  - Utility functions for SVG graph generation
  - Helps calculate graph dimensions and scales
  - Provides reusable SVG rendering logic

### `contexts/` Directory
- `AuthContext.js`:
  - Manages global authentication state
  - Provides authentication context to components
  - Handles user login/logout state across the app

### `hooks/` Directory
- `useAuth.js`:
  - Custom hook for authentication state
  - Provides login, logout, and user status functions
  - Simplifies authentication logic in components

- `useGraphQLQuery.js`:
  - Custom hook for managing GraphQL queries
  - Handles loading, error, and data states
  - Provides a consistent way to fetch GraphQL data

### `pages/` Directory
- `LoginPage.js`:
  - Full page component for user authentication
  - Contains login form and related UI elements
  - Handles authentication flow

- `ProfilePage.js`:
  - Main profile page layout
  - Composes user information and graph components
  - Fetches and displays comprehensive user data

- `DashboardPage.js`:
  - Optional dashboard with additional insights
  - Aggregates and displays various user statistics
  - Provides an overview of user's school performance

### `styles/` Directory
- `global.css`:
  - Global styling rules
  - Sets base styles for the entire application
  - Defines consistent design tokens

- `tailwind.css`:
  - Tailwind CSS imports and configuration
  - Defines custom Tailwind classes
  - Manages design system and responsive styles

### Testing
- `tests/` Directory:
  - Contains unit and integration tests
  - Tests authentication flows
  - Verifies GraphQL query functionality
  - Ensures component rendering and interactions