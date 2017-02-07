var express = require('express'),
    load = require('express-load'),
    error = require('./middleware/error'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    mongoose = require('mongoose'),
    redisAdapter = require('socket.io-redis'),
    RedisStore = require('connect-redis')(expressSession);

const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = cookieParser(SECRET);
//var MemoryStore = require('session-memory-store')(expressSession);
var store = new RedisStore({prefix: KEY});

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(expressSession({
	secret: SECRET,
  name: KEY,
	resave: false,
	saveUninitialized: false,
  store: store
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride()); // Podemos atualizar uma mesma rota entre métodos HTTP (Fazendo uma sobreescritas dessa rota)
app.use(express.static(__dirname + '/public'));

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

app.use(error.notFound);
app.use(error.serverError);

var server = app.listen(3000, () => {
  console.log("Ntalk no Ar!");
});

var io = require('socket.io').listen(server);

io.adapter(redisAdapter());
// Utilizando o Express no Socket.io.
// Habilitar que o Socket.IO seja habilitado para ler e manipular objetos de uma sessão do Express
io.use((socket, next) => {
  var data = socket.request;
  cookie(data, {}, (err) => {
    var sessionID = data.signedCookies[KEY];
    store.get(sessionID, (err, session) => {
      if(err || !session) return next(new Error('not authorized'));
      else {
          socket.handshake.session = session;
          return next();
      }
    })
  });
});

//Jogando o servidor junto com o socket para o load()
load('sockets')
  .into(io);

module.exports = app;
