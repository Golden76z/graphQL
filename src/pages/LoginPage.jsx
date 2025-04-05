import React from 'react';
import LoginForm from '../elements/auth/loginForm';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-page-container">
        <h1>Zone01 Normandie</h1>
        <p>Welcome back! Please log in to access your profile and projects.</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;