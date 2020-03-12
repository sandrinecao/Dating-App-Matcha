function convertHtmlToText(passHtmlBlock)
{
   str = str.toString();
  return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, 'ReplaceIfYouWantOtherWiseKeepItEmpty');
}

var checkTags = function (arr) {
	for (var i = 0; i < arr.length; i++) {
		if (/^#[a-za-z]+$/.test(arr[i]) == false) {
			return (false);
		}
	}
	return (true);
}

function checkAge(age) {
	if (/^[0-9]+$/.test(age) == false) {
		return (false);
	} else if (parseInt(age) < 18 || parseInt(age) > 100 || age == undefined) {
		return (false);
	}
	return (true);
}

module.exports = function (req, res, next) {
	let error = undefined;

	let gender = req.body.gender;
	let first = req.body.firstName;
	let last = req.body.lastName;
	let age = req.body.age;
	let email = req.body.email;
	let sexPref = req.body.sexpref;
	let bio = req.body.bio;
	let tags = req.body.tags.split(',');
	let newpassword = req.body.newpassword;
	let newpassword1 = req.body.newpassword1;

	if (gender.trim() == "" || first.trim() == "" || last.trim() == "" || age.trim() == "" | email.trim() == "" || sexPref.trim() == "" || bio.trim() == "") {
		error = "all fields are required!";
	} else if (gender != "Man" && gender != "Woman" && sexPref != "Heterosexual" && sexPref != "Homosexual" && sexPref != "Bisexual") {
		error = "an error occured, please fix this before submitting the form!";
	} else if (/\s/.test(gender) || /\s/.test(first) || /\s/.test(last) || /\s/.test(email) || /\s/.test(sexPref)) {
		error = 'no space characters are allowed.';
	} else if (checkTags(tags) == false) {
		error = "there is a problem in your tags, please fix it before resubmitting the form.";
	} else if (tags.length < 1 || tags.length > 12) {
		error = "the number of tags is incorrect. At least 1 and maximum 12.";
	} else if (checkAge(age) == false) {
		error = "Your age seems incorrect, please check it before submit";
	}
	res.locals.error = error;
	next();
};
