const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const Article = require('./models/article');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session=require('express-session')
const articles = require('./routes/articles');

//load view engine
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodekb');
const db = mongoose.connection;
// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//set up static folder

app.use(express.static(path.join(__dirname,'public')));
//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//home route
app.get("/",function(req,res){
  Article.find({}).then(function(articles,err){
    if(err)
    {
      console.log(err);
    }
    else {
      res.render('index',{
        title:"Acepirit.com",
        articles : articles
      });
    };

  });
});
//bring in route files
let article=require('./routes/articles');
app.use('/articles',article)
//start server
app.listen(8888,function(req,res){
  console.log('listning to the port');
});
