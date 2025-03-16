const express = require('express');
const app = express();
const cors = require('cors');
const { name } = require('ejs');
const PORT = 8080;

app.use(cors());
app.use(express.json());

let products = {
    people: ['Proff', 'Awaal', 'Samad']
}

app.get('/api/home', (req, res) => {
    res.json(products)
});
app.post('/api/home', (req, res) => {
    const content = req.body.name;
    products.people.push(content);
    res.json(products);
})
app.delete('/api/home/:deleteName', (req, res)=>{
    const deleteName = req.params.deleteName;
    products.people = products.people.filter(person => {
        return person !== deleteName
    })
    res.json(products);
})

app.listen(PORT, ()=>{
    console.log('Server started on port ' + PORT);
})