// src/services/apiService.js
const API_ENDPOINT = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';

export const fetchUserData = async (token) => {
  try {
    // Verify token format first
    if (!token || !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
        throw new Error('Invalid token format');
      }

    const query = `
      query GetUserStats {
        user {
          id
          login
          avatarUrl
          campus
          auditRatio
          public {
            firstName
            lastName
          }
          transactions_aggregate(where: {type: {_eq: "xp"}}) {
            aggregate {
              sum {
                amount
              }
            }
          }
          progresses_aggregate(where: {isDone: {_eq: true}}) {
            aggregate {
              count
            }
          }
        }
      }
    `;

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Debug: Log the full response
    console.log('API Response:', result);

    if (result.errors) {
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    if (!result.data || !result.data.user) {
      throw new Error('Invalid response structure: missing user data');
    }

    return result.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};