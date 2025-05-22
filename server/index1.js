const express = require('express');
const WebSocket = require('ws');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');
const { hash } = require('crypto');
const { message } = require('statuses');
const PORT = 8080;

const http = require('http').createServer(app);
const server = new WebSocket.Server({server: http});
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const readMessage = () => {
  try {
    let data = fs.readFileSync('messages.json', 'utf8')
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading file:', error);
  }
}
console.log(readMessage());
const addMessage = (newMessage) => {
  try {
    const messages = readMessage();
    messages.push(newMessage);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2), 'utf8');
    console.log('Message Saved Successfully');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

app.get('/', (req, res)=>{
    res.send('Hello from backend');
})

server.on("connection", (socket) => {
    console.log('A client connected');

    socket.on("message", (message) => {
        console.log('Received:', message.toString());
        const newMessage = {
            id: Date.now(),
            text: message.toString(),
            sender: 'Client',
            timestamp: new Date().toISOString(),
        };
        addMessage(newMessage);
        socket.send('Server says: ' + message.toString());
    });

    socket.on("close", () => console.log("A client disconnected"));
});

app.get('/messages', (req, res) => {
    res.json(readMessage())
});


const JWT_SECRET = 'your-secret-token';

const generateToken = (user) => {
  return jwt.sign(
    {id: user.id, username: user.username},
    JWT_SECRET,
    {expiresIn: '1h'}
  )
}

app.post('/signup', async (req, res)=>{
    let { username, password } = req.body;

    fs.readFile(path.join(__dirname, 'users.json'), async (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Could not read users file' });
      }
        let users = data ? JSON.parse(data) : [];

        if (users.find(user => user.username === username )) {
          return res.status(400).json({error: 'Username already exists'})  
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
          id: users.length + 1,
          username,
          password: hashedPassword
        }
        users.push(newUser)

        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (err)=>{
          if (err) {
            return res.status(500).json({error: 'Couldn\'t save new user'});
          }

          const token = generateToken(newUser);
          res.status(201).json({message: 'User Created Successfully', token});
        });
    });
  });
  
  app.post('/signin', async (req, res)=>{
    let {username, password} = req.body;

    fs.readFile('users.json', async (err, data)=>{
      if (err) {
        res.status(500).json({error: 'Could not read users file' });
      }

      let users = data ? JSON.parse(data) : [];

      const user = users.find(user=> user.username === username );

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({error: 'Invalid credentials'})
      }

      const token = generateToken(user);
      res.status(200).json({message: 'Login successful', token})
    })
  })

  http.listen(PORT, ()=>{
      console.log('Server started on port ' + PORT);
  });
  

/*// JWT secret key
const JWT_SECRET = 'your-secret-key';  // Replace with a strong secret in production

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {id: user.id, username: user.username },
    JWT_SECRET,
    {expiresIn: '1h'}
  )
};

// Sign Up Route - For user registration
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Read users from the .json file
  fs.readFile(path.join(__dirname, 'users.json'), async (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read users file' });
    }

    let users = data ? JSON.parse(data) : [];

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user and add to users array
    const newUser = { id: users.length + 1, username, password: hashedPassword };

    // Add new user to the array
    users.push(newUser);

    // Write updated users back to the .json file
    fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not save new user' });
      }

      // Generate token and respond
      const token = generateToken(newUser);
      res.status(201).json({ message: 'User created successfully', token });
    });
  });
});


// Sign In Route - For logging in
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  // Read users from the .json file
  fs.readFile(path.join(__dirname, 'users.json'), async (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read users file' });
    }

    let users = data ? JSON.parse(data) : [];

    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Respond with token
    res.status(200).json({ message: 'Login successful', token });
  });
});


// Example of a protected route
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    res.status(200).json({ message: 'Access granted', user });
  });
});*/
