const WebSocket = require('ws');

const server = new WebSocket.Server({port: 8080});

server.on('connection', socket=>{
    socket.on('open', ()=> console.log('Connection Established'));
    socket.send('Something');
    socket.on('message', data=>{
        server.clients.forEach(client=>{
            console.log(`Received: ${data}`)
            client.send(`Roger That: ${data}`)
        });
    });
    socket.on('close', ()=>console.log('Connection Closed'));
    socket.on('error', (err)=>console.log('Error: ', err));
})