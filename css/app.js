const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const socketIO = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),  // Insira o caminho para sua chave privada
  cert: fs.readFileSync('path/to/certificate.pem'),  // Insira o caminho para seu certificado
};

const server = https.createServer(options, app);
const io = socketIO(server);

app.use(cookieParser());
app.use(session({ secret: 'Secret key' }));

const staticfolder = express.static(__dirname + '/estilos');
app.use(staticfolder);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('/check', function (req, res) {
  res.send(' ' + req.sessionID);
});

io.on('connection', function (socket) {
  socket.emit('newmsg', { msg: 'Conectado' });
  socket.on('newmsg', function (data) {
    console.log(data.msg);
    socket.broadcast.emit('newmsg', { msg: data.msg, uid: data.uid });
  });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
