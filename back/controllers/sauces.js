const Sauce = require("../models/sauceModel");
const fs = require("fs");
const validator = require('validator');
const { error } = require("console");

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

function onlySpaces(str) {
    return str.trim().length === 0;
}

exports.createSauce = (req, res, next) => {
    let checkedSave = true;
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    let arrayValues = Object.values(sauceObject);
    for(value in arrayValues) {
        if(onlySpaces(arrayValues[value].toString()) || validator.contains(arrayValues[value].toString(), '$') || validator.contains(arrayValues[value].toString(), '=')) {
            console.log('La saisie suivante est invalide: ' + arrayValues[value]);
            checkedSave = false;
        };
    };
    
    if(checkedSave) {
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        if (sauce.heat < 0 || sauce.heat > 10) {
            sauce.heat = 0;
            console.log("valeur heat invalide, heat initialisé");
        };
        sauce.save()
            .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))
            .catch(error => res.status(400).json({ error }));
    };
};

exports.modifySauce = (req, res, next) => {
    let checkedSave = true;
    if(req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) throw err;
                });
            })
            .catch(error => res.status(400).json({ error }));
    }
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    let arrayValues = Object.values(sauceObject);
    for(value in arrayValues) {
        if(validator.contains(arrayValues[value].toString(), '$') || validator.contains(arrayValues[value].toString(), '=')) {
            console.log('La saisie suivante est invalide: ' + arrayValues[value]);
            checkedSave = false;
        };
    };
    if(checkedSave) {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
            .catch(error => res.status(400).json({ error }));
    } else {
        res.status(401).json({ error: 'Présence de caractères non autorisés'});
    };
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json("unauthorized request");
            } else {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res
                            .status(200)
                            .json({ message: "Sauce supprimée avec succès !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            let valeurVote;
            let votant = req.body.userId;
            let like = sauce.usersLiked;
            let unlike = sauce.usersDisliked;
            let bon = like.includes(votant);
            let mauvais = unlike.includes(votant);
            if (bon === true) {
                valeurVote = 1;
            } else if (mauvais === true) {
                valeurVote = -1;
            } else {
                valeurVote = 0;
            }
            if (valeurVote === 0 && req.body.like === 1) {
                sauce.likes += 1;
                sauce.usersLiked.push(votant);
            } else if (valeurVote === 1 && req.body.like === 0) {
                sauce.likes -= 1;
                const nouveauUsersLiked = like.filter((f) => f != votant);
                sauce.usersLiked = nouveauUsersLiked;
            } else if (valeurVote === -1 && req.body.like === 0) {
                sauce.dislikes -= 1;
                const nouveauUsersDisliked = unlike.filter((f) => f != votant);
                sauce.usersDisliked = nouveauUsersDisliked;
            } else if (valeurVote === 0 && req.body.like === -1) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(votant);
            } else {
                console.log("tentavive de vote illégal");
            }
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked,
                }
            )
                .then(() => res.status(201).json({ message: "Vous venez de voter" }))
                .catch((error) => {
                    if (error) {
                        console.log(error);
                    }
                });
        })
        .catch((error) => res.status(404).json({ error }));
};