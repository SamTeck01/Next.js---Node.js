const express = require('express');
const app = express();
const PORT = 8080;

app.get('/api/home', (req, res) => {
    res.json({message: 'Hello world'})
});

app.listen(PORT, ()=>{
    
})