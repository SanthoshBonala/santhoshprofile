let path = require("path")
let express = require("express")
let logger = require("morgan")
let bodyParser = require("body-parser") // simplifies access to request body
let app = express()  // make express app
let http = require('http').Server(app)  // inject app into the server
const { Client } = require('pg');

let cors = require('cors')

app.use(cors())

app.use(express.static(__dirname + '/Assets'))

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.use(logger("dev"))     // app.use() establishes middleware functions
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/guestbook", function (request, response) {

  const client = new Client({
    connectionString: 'postgres://kyoqcrbynjipef:d6d3e16a6e428c319c390d95263995053e4035929d404211c02d7b86fc494842@ec2-107-22-174-187.compute-1.amazonaws.com:5432/d2t63uqip9g3gg'

  });
  client.connect();
  client.query('select * from test_table order by published', function (err, result) {
    if (err) { console.error(err); response.send("Error " + err); } else {

      response.render("index", {
        entries: result.rows
      })
    }
  });

})
app.get("/new-entry", function (request, response) {
  response.render("new-entry")
})
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/About.html")
})
app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/views/About.html")
})
app.get("/contact", function (request, response) {
  response.render("Contact")
})
app.get("/vowels", function (request, response) {
  response.sendFile(__dirname + "/views/Vowels.html")
})
app.post("/contact", function (request, response) {
  var api_key = 'key-9e2c8ebe3fd0519a4f09acc76b09b1f6';
  var domain = 'sandboxd2b428a282d742799ffa23ce72aed1cc.mailgun.org';
  var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

  var data = {
    from: 'Vowels App User <postmaster@sandboxd2b428a282d742799ffa23ce72aed1cc.mailgun.org>',
    to: 'santhubonala@gmail.com',
    subject: request.body.Name + " Sent you a message",
    html: "<b style='color:blue'>Name: </b>" + request.body.Name + "<br>" + "<b style='color:green'> Comment: </b>" + request.body.Question + "<br>reply him :" + "<b style='color:red'>" + request.body.Email + "</b>"
  };

  mailgun.messages().send(data, function (error, body) {
    if (!error) {
      response.send({
        show: true,
        message: "Mail sent",
        messagebody: "success"
      })
    } else {
      response.send({
        show: true,
        message: "Mail Not sent",
        messagebody: "Failure! Please try again"
      })
    }
  })

})

app.post("/new-entry", function (request, response) {
  if (!request.body.title || !request.body.body) {
    response.status(400).send("Entries must have a title and a body.")
  }
  // entries.push({  // store it
  //   title: request.body.title,
  //   content: request.body.body,
  //   published: new Date()
  // })
  const client = new Client({
    connectionString: 'postgres://kyoqcrbynjipef:d6d3e16a6e428c319c390d95263995053e4035929d404211c02d7b86fc494842@ec2-107-22-174-187.compute-1.amazonaws.com:5432/d2t63uqip9g3gg'
  });
  client.connect();
  client.query('INSERT INTO test_table(title,content,published) values($1,$2,$3)', [request.body.title, request.body.body, new Date()], function (err, result) {
    if (err) { console.error(err); response.send("Error " + err); }
  });
  response.redirect("/guestbook")  // where to go next? Let's go to the home page :)
})
// if we get a 404 status, render our 404.ejs view
app.use(function (request, response) {
  response.status(404).render("404")
})

// Listen for an application request on port 8081 & notify the developer
http.listen(process.env.PORT || 8081, function () {
  console.log('Guestbook app listening on http://127.0.0.1:8081/')
})