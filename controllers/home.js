module.exports = (app) => {
  var Usuario = app.models.usuario;

  var HomeController = {
    index: (req, res) => {
      res.render('home/index');
    },
    login: (req, res) => {
      var query = {email: req.body.usuario.email};
      Usuario.findOne(query)
             .select('nome email')
             .exec((erro, usuario) => {
               if(usuario){
                 req.session.usuario = usuario;
                 res.redirect('/contatos');
               } else {
                  Usuario.create(req.body.usuario, (erro, usuario) => {
                    if(erro) res.redirect('/');
                    else {
                      req.session.usuario = usuario;
                      res.redirect('/contatos');
                    }
                  });
               }
             });
    },
    logout: (req, res) => {
      req.session.destroy();
      res.redirect('/');
    }
  };

  return HomeController;
}
