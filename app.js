var express    = require("express"),
      app        = express(),
      mongoose   = require("mongoose"),
      bodyParser = require("body-parser"),
      Student    = require("./models/student"),
      methodOverride = require("method-override");

//PassportJS variables for authentication purpose
var passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");


//including routes
var studentRoutes = require("./routes/students");
    authRoutes = require("./routes/auth");

var port = 3000;
var url = "mongodb://localhost:27017/leadSchoolDB";

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	// useCreatIndex: true
});

//when rendering templates you don't have to put '.ejs' extension
app.set("view engine", "ejs");
//this will enable public directory to be default for basic stylesheets and JS code
app.use(express.static("public"));
//to catch 'post' data coming from requests
app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Quick brown fox jumps over the lazy dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that will run for every route
//this will enable it to be available in every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

// Student.create({
// 	name: "berozgaar",
// 	school: "vidyavihar",
// 	class: "10",
// 	division: "C",
// 	status: "Active",
// }, function(err, newStudent){
// 	if(err)
// 		console.log(err);
// 	else
// 		console.log(newStudent);
// });

app.use(studentRoutes);
app.use(authRoutes);

app.listen(port, function(){
	console.log("Server Started..");
});