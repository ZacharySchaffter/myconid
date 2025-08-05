import express from "express";

const PORT = 3005;
const ONE_DAY = 24 * 60 * 60 * 1000;
const app = express();

app.use(express.json());

//Users table: key = user_id
let users = {};

//Sessions table: key = token
let sessions = {};

let userIdCount = 1;

function generateToken() {
  return Math.random().toString(36).substring(2);
}

function isStrongPassword(password) {
  return password.length >= 8;
}

//REGISTER new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  //for demonstration
  console.log("REGISTER CALLED");

  //check if user already exists, return user object or undefined
  const existingUser = Object.values(users).find(
    (u) => u.username === username
  );
  if (existingUser) {
    return res.status(409).json({
      error_code: "account_exists",
      error: "an account with this username already exists",
    });
  }

  //check if password is valid
  if (!isStrongPassword(password)) {
    return res.status(422).json({
      error_code: "weak_password",
      error: "password must be at least 8 characters",
    });
  }

  //if valid credentials given, create and store new user
  const user_id = userIdCount++;
  users[user_id] = { username, password };

  //create and store new token
  const token = generateToken();
  const expires_at = new Date(Date.now() + ONE_DAY);
  sessions[token] = { user_id, expires_at };

  //respond with user session info
  res.status(200).json({
    user_id,
    username,
    token,
    expires_at,
  });
});

//LOGIN existing user
app.post("/login", (req, res) => {
  console.log("LOGIN CALLED");

  const { username, password } = req.body;

  //Find user by username received in request
  const userEntry = Object.entries(users).find(
    ([id, u]) => u.username === username
  );

  //If no user found, invalid credentials
  if (!userEntry) {
    return res.status(401).json({
      error_code: "invalid_credentials",
      error: "username or password is incorrect",
    });
  }

  //destructure array returned by object.entries(users).find
  //user is in the form { username: 'myUsername', password: 'password123' }
  const [user_id, user] = userEntry;

  //if provided password does not match user password, invalid credentials
  if (user.password !== password) {
    return res.status(401).json({
      error_code: "invalid_credentials",
      error: "username or password is incorrect",
    });
  }

  //Create a new session token
  const token = generateToken();
  const expires_at = new Date(Date.now() + ONE_DAY);

  //Store session in the sessions hashmap
  sessions[token] = { user_id: Number(user_id), expires_at };

  //Respond with user session info
  res.status(200).json({
    user_id: Number(user_id),
    username: user.username,
    token,
    expires_at,
  });
});

//VALIDATE session
app.post("/validate", (req, res) => {
  console.log("VALIDATE CALLED");

  const { token } = req.body;
  const session = sessions[token];

  //if session does not exist or token is expires, invlaid session
  if (!session || session.expires_at < new Date()) {
    return res.status(401).json({
      error: "invalid or expired token",
      error_code: "invalid_session",
    });
  }

  //if valid session respond with session info
  const user = users[session.user_id];

  res.status(200).json({
    user_id: session.user_id,
    username: user.username,
    token,
    expires_at: session.expires_at,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
