var app = require('../app'),
    request = require('supertest')(app);

describe('No controller contatos', () => {

  describe('o usuario não logado', () => {
    it('deve ir para rota / ao fazer GET /contatos', function(done){
      request.get('/contatos')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para rota / ao fazer GET /contato/1', function(done){
      request.get('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para rota / ao fazer GET /contato/1/editar', function(done){
      request.get('/contato/1/editar')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para rota / ao fazer POST /contato', function(done){
      request.post('/contato')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para rota / ao fazer DELETE /contato/1', function(done){
      request.delete('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para rota / ao fazer PUT /contato/1', function(done){
      request.put('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

  });

  describe('o usuario logado', () => {
    var login = {usuario: {nome: "Teste", email: "teste@teste"}},
        contato = {contato: {nome: "Teste", email: "teste@teste"}},
        cookie;

    // Função executada depois de qualquer teste
    beforeEach((done) => {
      request.post('/entrar').send(login).end((err, res) => {
        cookie = res.headers['set-cookie'];
        done();
      })
    });

    it('deve retornar status 200 em GET /contatos', (done) => {
      var req = request.get('/contatos');
      req.cookies = cookie;
      req.end((err, res) => {
        res.status.should.eql(200);
        done();
      })
    });

    it('deve ir para a rota /contatos em POST /contato', (done) => {
      var req = request.post('/contato');
      req.cookies = cookie;
      req.send(contato).end((err, res) => {
        res.headers.location.should.eql('/contatos');
        done();
      })
    });

  });

}); // Fim describe('No controller contato')
