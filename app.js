var express    = require("express"),
      app        = express(),
      mongoose   = require("mongoose"),
      bodyParser = require("body-parser"),
      Student    = require("./models/student"),
      methodOverride = require("method-override");

//including routes
var studentRoutes = require("./routes/students");

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

app.listen(port, function(){
	console.log("Server Started..");
});