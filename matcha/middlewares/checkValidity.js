var User = require('../models/user');

// Check for email format
function checkEmail(email)  
{  
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
  if(email.match(mailformat))  
    return true;  
  else  
    return false;
}

// Check for password format
function checkPassword(p){
    var upper = /[A-Z]/;
    var lower = /[a-z]/; 
    var number = /[0-9]/;
    var special = /[#$!%@^`&*()+=\-\[\]\';,.\/{}|":<>?~\\\\]/;

    var iUpper = 0;
    var iLower = 0;
    var iNums = 0;
    var iSpecials = 0;
    for (var i = 0, len = p.length; i < len; i++) {
        if(upper.test(p[i]))
            iUpper++;
        else if(lower.test(p[i]))
            iLower++;
        else if(number.test(p[i]))
            iNums++;
        else if(special.test(p[i]))
            iSpecials++;
    }
    if (iUpper == 0 || iLower == 0 || iNums == 0 || iSpecials == 0) {
      return false;
    }
    return true;
}

// Middleware to check the validy of the format fields when registering
module.exports = function(req, res, next) {
   let error = undefined,
   first = req.body.firstName,
   last = req.body.lastName,
   username = req.body.username,
   email = req.body.email,
   password = req.body.password,
   tokenmail = req.body.tokenmail;
   
   /* DECOMMENTER LE BLOC DE VERIF PASSWORD A LA FIN */


// if (first.trim() == "" || last.trim() == "" || username.trim() == "" || username.trim() == "" || email.trim() == "" || password.trim() == "" || tokenmail.trim() == "") {
//             error = 'All fields are required.'
// }
//           } else if (password != tokenmail) {
//             error = 'The passwords do not match.';
//           }
          // } else if (password.length < 8) {
          //   error = 'Your password is too short, must contains 8 caract. minimum.';
          // } else if (checkEmail(email) == false) {
          //   error = 'Your email adress is invalid, please check its format.'
          // } else if (checkPassword(password) == false) {
          //   error = `<strong>Your password must contain at least:</strong>\n
          // //   <ul style="text-align: left;">
          // //     <li>8 characteres minimum</li>
          // //     <li>one uppercase letter</li>
          // //     <li>one lower case letter</li>
          // //     <li>one number</li>
          // //     <li>one special character</li>
          // //   </ul>`;
          // }
  res.locals.error = error;
  next();
}