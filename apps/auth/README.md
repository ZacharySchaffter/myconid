# Authentication Microservice

REST API for the endpoints /register, /login and /validate

**Communication Contract**

## 1) How to request data

The microservice is a REST API that should be run locally. It is configured to run on `http://localhost:3000` but the port can be changed.

### **POST /register**

Registers a new user and returns an authentication token

### **Example Request**

```js
const response = await fetch("http://localhost:3000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "bob", password: "bob123" }),
});
```

### **POST /Login**

If valid credentials are given and user exists, session info is returned

### **Example Request**

```js
const response = await fetch("http://localhost:3000/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "bob", password: "bob123" }),
});
```

### **POST /validate**

Returns session infor when valid session exists

### **Example Request**

```js
const response = await fetch("http://localhost:3000/validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "abcd1234" }),
});
```

## 2) How to receive data

All in JSON format

### \*\*/REGISTER responses

Error reponse 409

```
{
  error_code: "account_exists",
  error: "an account with this username already exists"
}
```

Error response 422

```
{
  error_code: "weak_password",
  error: "password must be at least 8 characters"
}
```

Success response 200

```
{
  "user_id": 1,
  "username": "alice",
  "token": "5qd3j9igebs",
  "expires_at": "2025-08-04T19:27:39.770Z"
}
```

### **/Login Responses**

Error response 401

```
{
  error_code: "invalid_credentials",
  error: "username or password is incorrect"
}
```

Error response 401

```
{
  error_code: "invalid_credentials",
  error: "username or password is incorrect"
}
```

Success response 200

```
{
  "user_id": 1,
  "username": "alice",
  "token": "bdtkpv2ac8h",
  "expires_at": "2025-08-04T19:30:26.905Z"
}
```

### **/Validate Responses**

Error response 401

```
{
  error: "invalid or expired token",
  error_code: "invalid_session"
}
```

Success response 200

```
{
  "user_id": 1,
  "username": "alice",
  "token": "bdtkpv2ac8h",
  "expires_at": "2025-08-04T19:30:26.905Z"
}
```
