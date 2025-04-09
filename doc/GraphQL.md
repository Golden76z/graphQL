# What is GraphQL?

**GraphQL** is a query language for APIs and a runtime for executing those queries with your existing data. It was developed by Facebook in 2012 and released publicly in 2015.

Unlike REST, where you have to access multiple endpoints to get different data, GraphQL allows clients to request exactly what they need from a **single endpoint**.

---

## Key Concepts

### 1. Query Language

GraphQL uses its own syntax to let the client specify:

- What data they want
- How they want it structured

Example:

```graphql
query {
  user(id: "1") {
    name
    email
  }
}
```

This will return only the `name` and `email` of the user with ID `1`.

---

### 2. Single Endpoint

In REST, you might access multiple endpoints:


In GraphQL, you can fetch all of this in one query.

---

### 3. Strongly Typed Schema

GraphQL APIs are organized in terms of types and fields, not endpoints. A **schema** defines what queries are allowed and what types of data are available.

Example schema:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  user(id: ID!): User
}
```

---

## Benefits of GraphQL

- 🚀 **Efficient data fetching**: Get only what you need
- 📦 **Reduces over-fetching and under-fetching**
- 🔄 **Real-time updates** with subscriptions
- 🧪 **Introspective**: You can query the schema itself for documentation

---

## Downsides of GraphQL

- ⚙️ More complex to implement on the backend than REST
- 🧠 Caching is harder compared to REST
- 🔒 May expose too much data if not carefully secured

---

## When to Use GraphQL

✅ You need flexible data fetching  
✅ You have complex relational data  
✅ You want to minimize frontend-backend communication

---

## When REST Might Be Better

✅ You need simple, cacheable, and predictable endpoints  
✅ You are dealing with file uploads or simple CRUD resources  

---

## Summary

GraphQL is a powerful alternative to REST that gives clients more control over data fetching. It's especially useful for complex applications with lots of interrelated data.

> **TL;DR**: GraphQL lets clients ask for exactly the data they need from a single endpoint, using a strongly typed schema.
