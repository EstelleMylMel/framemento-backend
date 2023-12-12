"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
const UserConnection = require('../models/userConnections');
const UserProfile = require('../models/userProfiles');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
router.get('/test', (req, res) => {
    res.json({ result: 'test' });
});
// route permettant l'inscription
router.post('/signup', (req, res) => {
    if (!checkBody(req.body, ['email', 'username', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }
    // S'assurer que l'utilisateur n'existe pas déjà avec son mail
    UserConnection.findOne({ email: req.body.email }).then((data) => {
        // Si l'utilisateur n'existe pas, on crée son compte
        if (data === null) {
            // Hachage du mdp
            const hash = bcrypt.hashSync(req.body.password, 10);
            // 1ère étape : créer un userProfile
            const newUserProfile = new UserProfile({
                username: req.body.username,
                profilePicture: '' //AJOUTER UNE PHOTO PAR DEFAUT
            });
            newUserProfile.save().then((data) => {
                console.log(data);
                //Récupération de l'ID du UserProfile qui vient d'être créé
                const userProfileID = data._id;
                //2ème étape : créer un userConnection
                const newUserConnection = new UserConnection({
                    email: req.body.email,
                    password: hash,
                    token: uid2(32),
                    profile: userProfileID
                });
                newUserConnection.save().then((data) => {
                    console.log(data);
                    res.json({ result: true });
                });
            });
        }
        else {
            res.json({ result: false, error: 'User already exists ' });
        }
    });
});
// route permettant la connexion
router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['email', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
    }
    UserConnection.findOne({ email: req.body.email }).then((data) => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ result: true, token: data.token });
        }
        else {
            res.json({ result: false, error: 'User not found or wrong password' });
        }
    });
});
module.exports = router;
