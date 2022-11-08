// appel des modules et modeles
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
var passwordSchema = require("../models/passwordModel");
const validator = require("validator");
require("dotenv").config();

// gestion inscription
exports.signup = (req, res, next) => {
  const valideEmail = validator.isEmail(req.body.email);
  const validePassword = passwordSchema.validate(req.body.password);
  if (valideEmail === true && validePassword === true) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user.save(function (error) {
          if (error) {
            return res.status(400).json({ error });
          } else {
            res.status(201).json({ message: "Utilisateur créé !" })
          }
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    console.log("Email ou mot de passe incorrect");
    console.log("(not = caratère invalide) manquant au mot de passe: " + passwordSchema.validate(req.body.password, { list: true }));
  }
};

// gestion login
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error });
      }
      bcrypt.compare(req.body.password, user.password, function (error, result) {
        if (error) {
          return res.status(500).json({ error });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user._id
            },
            process.env.TOKEN_SECRET_ALEATOIRE,
            {
              expiresIn: process.env.TOKEN_TEMP
            }
          );
          res.status(201).json({
            message: "Authentification réussie !",
            token: token,
            userId: user._id
          });
        } else {
          return res.status(401).json({ error });
        };
      });
    }
    )
};