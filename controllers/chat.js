module.exports = (app) => {
  var ChatController = {
    index: (req, res) => {
      var params = { sala: req.query.sala };
      res.render('chat/index', params);
    }
  };

  return ChatController;
}
