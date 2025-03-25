# GraphQL Profile Project Roadmap

## Project Overview
Create a personal profile web application that retrieves and displays school-related information using GraphQL, with a focus on data visualization and user authentication.

## 1. Project Setup
- [ ] Choose a frontend framework (React, Vue, Angular, etc.)
- [ ] Set up project development environment
- [ ] Initialize version control (Git)
- [ ] Plan project folder structure

## 2. Authentication Module
### Login Page Requirements
- [ ] Create login page with two authentication methods:
  * Username + password
  * Email + password
- [ ] Implement Basic authentication
- [ ] Add base64 encoding for credentials
- [ ] Handle authentication errors
- [ ] Implement logout functionality
- [ ] Store JWT token securely (localStorage/sessionStorage)

### Authentication Flow
- [ ] Send POST request to signin endpoint (https://((DOMAIN))/api/auth/signin)
- [ ] Validate and store received JWT
- [ ] Handle authentication errors with user-friendly messages

## 3. GraphQL Integration
### API Connection
- [ ] Set up GraphQL client (Apollo Client, fetch, etc.)
- [ ] Configure Bearer authentication with JWT
- [ ] Implement error handling for GraphQL queries

### Data Querying
- [ ] Create queries for:
  * User information
  * XP transactions
  * Project progress
  * Audit information
- [ ] Implement different query types:
  * Simple queries
  * Nested queries
  * Queries with arguments

## 4. Profile Page Design
### Required Information Sections
Select and display at least three user information types:
- [ ] Basic user identification
- [ ] XP amount
- [ ] Grades
- [ ] Audits
- [ ] Skills

### Statistics Section
- [ ] Create at least two different SVG-based graphs
- [ ] Possible graph types:
  * XP earned over time
  * XP earned by project
  * Audit ratio
  * Project PASS/FAIL ratio
  * Piscine stats
  * Exercise attempts

### Graph Implementation Requirements
- [ ] Use pure SVG for graph rendering
- [ ] Implement interactive/animated graph elements
- [ ] Ensure responsive design
- [ ] Follow UI/UX best practices

## 5. Additional Features (Optional)
- [ ] Implement dark/light mode
- [ ] Add more advanced data visualizations
- [ ] Create smooth transitions/animations
- [ ] Implement error boundaries
- [ ] Add loading states

## 6. Deployment
- [ ] Choose hosting platform (GitHub Pages, Netlify, Vercel)
- [ ] Set up continuous deployment
- [ ] Configure domain (optional)
- [ ] Ensure application is publicly accessible

## 7. Testing
- [ ] Unit testing for components
- [ ] Integration testing for GraphQL queries
- [ ] Authentication flow testing
- [ ] Responsive design testing
- [ ] Cross-browser compatibility check

## 8. Documentation
- [ ] README.md with:
  * Project description
  * Setup instructions
  * Authentication guide
  * Deployment details
- [ ] Inline code comments
- [ ] API query documentation

## Technical Constraints
- Must use GraphQL endpoint: https://((DOMAIN))/api/graphql-engine/v1/graphql
- Authentication via: https://((DOMAIN))/api/auth/signin
- Use JWT for API access
- Implement SVG-based statistics graphs

## Evaluation Criteria
- Correct implementation of GraphQL queries
- Authentication functionality
- Quality of data visualization
- UI/UX design
- Code quality and organization
- Successful deployment

## Recommended Technology Stack
- Frontend Framework: React
- GraphQL Client: Apollo Client
- Authentication: JWT
- Styling: Tailwind CSS / styled-components
- Deployment: Netlify / Vercel / GitHub Pages

## Potential Challenges
- JWT management
- Complex GraphQL querying
- SVG graph creation
- Handling authentication errors
- Responsive design

## Estimated Timeline
- Project Setup: 1-2 days
- Authentication Module: 2-3 days
- GraphQL Integration: 3-4 days
- Profile Page Design: 3-4 days
- Graph Implementation: 2-3 days
- Testing & Deployment: 2-3 days

**Total Estimated Time: 2-3 weeks**