
/*
 * GET home page.
 */

var title = exports.title = { title: 'James Brinkerhoff | th3brink', logo: 'James Brinkerhoff' };

exports.index = function(req, res){
  res.render('index.jade', title);
};

exports.partial = function (req, res) {
  res.render('partials/' + req.params['partial'], title);
};

