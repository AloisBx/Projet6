var passwordValidator = require('password-validator');
var passwordPattern = new passwordValidator();

passwordPattern
.has().lowercase()
.has().uppercase(1)
.has().digits(1)                           
.is().min(8)                                   
.is().max(20)                                                                
.has().symbols(1)
.is().not(/[\]()[{}<>@]/)                              
.has().not().spaces()

module.exports = passwordPattern;