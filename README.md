# GraphQL School Profile Application

## Project Overview
A web application that retrieves and displays personal school information using GraphQL, featuring user authentication, data visualization, and a comprehensive profile dashboard.

## 🚀 Features
- User Authentication (Username/Email)
- GraphQL Data Retrieval
- Dynamic Profile Information
- SVG-based Statistics Graphs
- Responsive Design

## 🛠 Tech Stack
- React (with TypeScript)
- Vite
- Apollo GraphQL
- Tailwind CSS
- React Router
- Axios

## 📋 Prerequisites
- Node.js (v18+)
- npm (v9+)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/[your-username]/graphql-profile-project.git
cd graphql-profile-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```
VITE_GRAPHQL_ENDPOINT=https://((DOMAIN))/api/graphql-engine/v1/graphql
VITE_AUTH_ENDPOINT=https://((DOMAIN))/api/auth/signin
```

### 4. Run the Application
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Authentication
- Login with username or email
- JWT-based authentication
- Secure token storage
- Automatic logout mechanism

## 📊 Data Visualization
The application provides SVG-based graphs:
- XP Progression
- Project Completion Rates
- Audit Ratios
- Custom Statistical Insights

## 🧪 Testing
```bash
# Run tests
npm run test

# Run coverage
npm run test:coverage
```

## 📁 Project Structure
```
graphql-profile-project/
│
├── src/
│   ├── components/    # Reusable React components
│   ├── services/      # API and authentication services
│   ├── queries/       # GraphQL query definitions
│   ├── pages/         # Top-level page components
│   └── ...
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🎬 Deployment
Recommended platforms:
- Netlify
- Vercel
- GitHub Pages

### Deployment Steps
1. Build the project: `npm run build`
2. Deploy the `dist/` directory to your chosen platform

## 🐛 Troubleshooting
- Ensure all environment variables are correctly set
- Check network tab for GraphQL query issues
- Verify JWT token management

## 📞 Contact
Your Name - [your-email@example.com]
Project Link: https://github.com/[your-username]/graphql-profile-project

## 🙏 Acknowledgements
- GraphQL
- React
- Tailwind CSS
- Apollo Client
