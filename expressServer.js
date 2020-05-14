const express = require('express')
const app = express()
const path = require('path')
var request = require('request');
var mysql = require('mysql');

app.set('views', path.join(__dirname, 'views')); // ejs file location
app.set('view engine', 'ejs'); //select view templet engine

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'test123',
    database : 'fintech'
});

connection.connect();
app.get('/', function (req, res) {
    var title = "javascript"
    res.send('<html><h1>'+title+'</h1><h2>contents</h2></html>')
})

app.get('/ejs', function(req, res){
    res.render('test')
})

app.get('/test', function(req, res){
    res.send('Test')
})

app.get('/design', function(req, res){
    res.render('designTest');
})

//datasend Router add
app.get('/dataSend', function(req, res){
    res.render('dataSend');
})

app.post('/getTime', function(req, res){
    var nowTime = new Date();
    res.json(nowTime);
})

app.post('/getData', function(req, res){
    console.log(req.body);
    var userData = req.body.userInputData;
    console.log('userData = ', userData);
    res.json(userData + "!!!!!")
})

//------------------service start //
app.get('/signup', function(req, res){
    res.render('signup');
})

app.get('/authResult', function(req, res) {
    var authCode = req.query.code
    console.log(authCode);
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            code : authCode,
            client_id : 'D2Tqsa7sSmcDSEbncC711RznB1a4xBB1a4OhANyt',
            client_secret : 'grIUxNmeyZhdo8sxIy6p1bJ7g972h2xJjuW0DFt9',
            redirect_uri : 'http://localhost:3000/authResult',
            grant_type : 'authorization_code'
        }
    }
    request(option, function(err, response, body) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            let accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.render('resultChild', {data : accessRequestResult} )
        }
    })
    // accesstoken get request
})

app.post('/signup', function(req, res){
    //data req get db store
    let userName = req.body.userName
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword
    let userAccessToken = req.body.userAccessToken
    let userRefreshToken = req.body.userRefreshToken
    let userSeqNo = req.body.userSeqNo
    console.log(userName, userAccessToken, userSeqNo);
})


app.listen(3000)
