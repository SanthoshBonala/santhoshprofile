var path = require("path")
var express = require("express")
var logger = require("morgan")
var bodyParser = require("body-parser") // simplifies access to request body
var app = express()  // make express app
var http = require('http').Server(app)  // inject app into the server

// 1 set up the view engine
// 2 manage our entries
// 3 set up the logger
// 4 handle valid GET requests
// 5 handle valid POST request
// 6 respond with 404 if a bad URI is requested
app.use(express.static(__dirname + '/Assets'))
// Listen for an application request on port 8081
// 1 set up the view engine
// var cons = require('consolidate')
// , exphbs  = require('express3-handlebars')
// , hbs = exphbs.create({defaultLayout: 'About.html'});

app.set('views', __dirname + '/Assets');

// assign the swig engine to .html files
// app.engine('ejs', cons.ejs);
// app.engine('html', hbs.engine);

// set .html as the default extension
app.set('view engine', 'ejs');
// app.set("views", path.resolve(__dirname, "Views")) // path to views
// app.set("view engine", "html") // specify our view engine

// 2 create an array to manage our entries
var entries = []
app.locals.entries = entries // now entries can be accessed in .ejs files

// 3 set up an http request logger to log every request automagically
app.use(logger("dev"))     // app.use() establishes middleware functions
app.use(bodyParser.urlencoded({ extended: false }))
// 4 handle http GET requests (default & /new-entry)
app.get("/guestbook", function (request, response) {
    response.render("index")
  })
  app.get("/new-entry", function (request, response) {
    response.render("new-entry")
  })
  app.get("/", function (request, response) {
    response.sendFile(__dirname+"/Assets/About.html")
  })
  app.get("/about", function (request, response) {
    response.sendFile(__dirname+"/Assets/About.html")
  })
  app.get("/contact", function (request, response) {
    response.sendFile(__dirname+"/Assets/Contact.html")
  })
  app.get("/vowels", function (request, response) {
    response.sendFile(__dirname+"/Assets/Vowels.html")
  })
  // 5 handle an http POST request to the new-entry URI 
  
  app.post("/contact",function(request, response){
  var api_key = 'key-9e2c8ebe3fd0519a4f09acc76b09b1f6';
  var domain = 'sandboxd2b428a282d742799ffa23ce72aed1cc.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
   
  var data = {
    from: 'Vowels App User <postmaster@sandboxd2b428a282d742799ffa23ce72aed1cc.mailgun.org>',
    to: 'santhubonala@gmail.com',
    subject:request.body.Name +"Sent you a message",
    html: "<b style='color:blue'>Name: </b>"+request.body.Name+"<br>"+"<b style='color:green'> Comment: </b>"+request.body.Question+"<br>reply him :"+"<b style='color:red'>"+request.body.Email+"</b>"
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    if(!error){
      response.sendFile(__dirname+"/Assets/Contact.html")
    }else{response.send("error")}
  })
  
  })

app.post("/new-entry", function (request, response) {
    if (!request.body.title || !request.body.body) {
      response.status(400).send("Entries must have a title and a body.")
      return
    }
    entries.push({  // store it
      title: request.body.title,
      content: request.body.body,
      published: new Date()
    })
   // console.log('data here:'+request.body.title);
   console.log(entries)
    response.redirect("/guestbook")  // where to go next? Let's go to the home page :)
   })
// if we get a 404 status, render our 404.ejs view
app.use(function (request, response) {
    response.status(404).render("404")
  })
  
  // Listen for an application request on port 8081 & notify the developer
  http.listen(8081, function () {
   console.log('Guestbook app listening on http://127.0.0.1:8081/')
  })