const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require('fs');
const PORT = 8080;

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
app.use(cors());
app.use(express.json());

const readMessage = () => {
  try {
    
  } catch (error) {
    
  }
}


let products = {
    people: ['Proff', 'Awaal', 'Samad']
}
app.get('/', (req, res)=>{
    res.send('Hello from backend');
})

wss.on("connection", (ws) => {
    console.log('A client connected');

    ws.on("message", (message) => {
        console.log('Received:', message);
        ws.send('Server says: ' + message);
    });

    ws.on("close", () => console.log("A client disconnected"));
});

app.get('/api/home', (req, res) => {
    res.json(products)
});
app.post('/api/home', (req, res) => {
    const content = req.body.name;
    if (!content || typeof content !== 'string' ) {
        return res.status(400).json({error: 'Invalid Name Provided'})
    }
    products.people.push(content);
    res.json(products);
});
app.put('/api/home/:oldName', (req, res) => {
    const oldName = req.params.oldName;
    const newName = req.body.newName;
    
    const index = products.people.indexOf(oldName);
    if (index === -1) {
        return res.status(404).json({ error: 'Person not found!' });
    }
    if (!newName || typeof newName !== 'string') {
        return res.status(400).json({ error: 'Invalid New Name Provided' });
    }

    products.people[index] = newName;
    res.json(products);
});

app.delete('/api/home/:deleteName', (req, res) => {
    const deleteName = req.params.deleteName.toLowerCase();
    const filteredPeople = products.people.filter(person => person.toLowerCase() !== deleteName);

    if (filteredPeople.length === products.people.length) {
        return res.status(404).json({ error: "Person not found!" });
    }

    products.people = filteredPeople;
    res.json(products);
});


app.listen(PORT, ()=>{
    console.log('Server started on port ' + PORT);
});