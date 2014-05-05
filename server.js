
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.locals.basedir = __dirname+'/views';

// all environments
app.set('port', process.env.PORT || 7000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/addPost', routes.index);
app.get('/managePosts', routes.index);
app.get('/learnMyWords', routes.index);
app.get('/posts', routes.index);
app.get('/portfolio', routes.index);
app.get('/freelance', routes.index);
app.get('/gamer', routes.index);
app.get('/partials/:partial', routes.partial);
app.get('/post/:id', routes.index);
app.get('/editPost/:id', routes.index);
//
//
//// Routes
//app.get('/', routes.index);
//app.get('/partial/:name', routes.partial);
//
//// JSON API
////app.get('/api/name', api.name);
//
//// redirect all others to the index (HTML5 history)

//app.use(app.router);
//app.use(function(req, res) {
//    Use res.sendfile, as it streams instead of reading the file into memory.
//    res.sendfile(__dirname + '/views/index.jade');
//});

//app.get('/users', user.list);
//app.get('/*', routes.index);
//app.all('*', routes.notFound);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
