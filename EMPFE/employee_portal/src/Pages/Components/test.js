// Example with fetch
fetch("http://localhost:8081/api/test", {
  method: "GET",
  credentials: "include", // Important for cookies/auth
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYWxhamlAaW…TcxfQ.M-dDz1B2DoHzVJZAg0b8ZB0WY4FHREhPbrhThnvav6k", // If using
  },
});
