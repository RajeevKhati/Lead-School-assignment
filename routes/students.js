var express = require("express");
var router = express.Router();
var Student = require("../models/student");

router.get("/", function(req, res){
	res.redirect("/students/1");
});

//Index Route
router.get("/students", function(req, res){
	Student.find({}, function(err, students){
		if(err){
			console.log(err);
		}else{
			// res.render("students/index", {students: students});
			res.redirect("/students/1");
		}
	})
});

//Paginated Route
router.get("/students/:page", function(req, res){
	var perPage = 8;
    var page = req.params.page || 1;

    Student
        .find({})
        .skip((page-1) * perPage)
        .limit(perPage)
        .exec(function(err, students) {
            Student.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('students/index', {
                    students: students,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
            });
        });
	});
});

//New Route
router.get("/student/new", isLoggedIn, function(req, res){
	res.render("students/new");
});

//Post Route
router.post("/students", isLoggedIn, calculateAge, function(req, res){
	Student.create(req.body.student, function(err, newStudent){
		if(err){
			res.render("new");
		}else{
			res.redirect("/students");
		}
	})
});

//Edit Route
router.get("/students/:id/edit", isLoggedIn, function(req, res){
	Student.findById(req.params.id, function(err, foundStudent){
		if(err){
			res.redirect("/students");
		}else{
			res.render("students/edit", {student: foundStudent});
		}
	});
});

//Update Route
router.put("/students/:id", calculateAge, function(req, res){
	Student.findByIdAndUpdate(req.params.id, req.body.student, function(err, updatedStudent){
		if(err){
			res.redirect("/students");
		}else{
			res.redirect("/students");
		}
	});
});

//Delete Route
router.delete("/students/:id", isLoggedIn, function(req, res){
	Student.findByIdAndRemove(req.params.id, function(err){
			res.redirect("back");
	})
})

//middleware
function calculateAge(req, res, next){
	var today = new Date();
	var birthDay = new Date(req.body.dateOfBirth);
	var age = today.getFullYear() - birthDay.getFullYear();
	var m = today.getMonth() - birthDay.getMonth();
	if(m<0 || (m==0 && today.getDate()< birthDay.getDate())){
		age--;
	}
	req.body.student.age = age.toString();
	req.body.student.dateOfBirth = req.body.dateOfBirth;
	next();
}

//middleware to check authentication
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	};
	res.redirect("/login");
}

module.exports = router;