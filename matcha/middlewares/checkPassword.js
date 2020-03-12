function validatePassword(password) {
	let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
	return re.test(password);
}

module.exports = function(req, res, next) {	
	let error = undefined;

	let oldpassword = req.body.password;
	let newpassword = req.body.newpassword;
	let newpassword1 = req.body.newpassword1;

	if (oldpassword.trim() == "" || newpassword.trim() == "" || newpassword1.trim() == "") {
		error = "all fields are required for updating your password!";
	}
	else if (oldpassword  === newpassword) {
		error = "it's not a new password";
	} else if (newpassword != newpassword1) {
		error = "your new password does not match!";
	} else if (oldpassword  === newpassword1) {
		error = "your new password is not the same in both fields!";
	} else if (!validatePassword(newpassword)) {
		error = "your new password does not meet the valid criteria"
	} else if (!validatePassword(newpassword1)) {
		error = "your new password does not meet the valid criteria"
} 	 		  
	res.locals.error = error;
	next();
};
