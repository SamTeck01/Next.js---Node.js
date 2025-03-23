const WebSocket = require('ws');

const server = new WebSocket.Server({port: 8080});

server.on('connection', socket=>{

    console.log('Client connected');
    socket.send('Something')

    socket.on('message', data=>{
        server.clients.forEach(client=>{
            console.log(`Received: ${data}`);
            client.send(`Roger that! ${data}`);
        })
    })
    socket.on('close', ()=>{
        console.log('Client disconnected');
    })
    socket.on('error', (err)=>{
        console.log('Error: ', err);
    })
})