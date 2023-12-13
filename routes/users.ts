var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { UserConnectionType } from '../types/userConnection';
import { UserProfileType } from '../types/userProfile';
const UserConnection = require('../models/userConnections');
const UserProfile = require('../models/userProfiles');

const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// route permettant l'inscription
router.post('/signup', (req: Request, res: Response) => {
  if (!checkBody(req.body, ['email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  console.log('coucou')

  const { email, username, password } = req.body;
  // EQUIVALENT A :
  // const email = req.body.email;
  // const username = req.body.username;
  // const password = req.body.password;

  // S'assurer que l'utilisateur n'existe pas déjà avec son mail
  UserConnection.findOne({ email }).then((data: UserConnectionType | null) => {
      
      // Si l'utilisateur n'existe pas, on crée son compte
      if (data === null) {
      
      // Hachage du mdp
      const hash = bcrypt.hashSync(password, 10)
      
      // 1ère étape : créer un userProfile
      const newUserProfile = new UserProfile({ // FAUT IL TYPER ?? PB AVEC .SAVE
        username,
        profilePicture: '../assets/image-profil.jpg'
      })
      newUserProfile.save().then( (data: UserProfileType) => {

        //Récupération de l'ID du UserProfile qui vient d'être créé
        const userProfileID = data._id;
        // commentaire pour créer une modif -> à enlever

        //2ème étape : créer un userConnection
        const newUserConnection = new UserConnection({ // FAUT IL TYPER ?? PB AVEC .SAVE
          email,
          password: hash,
          token: uid2(32),
          profile: userProfileID 
        })
        newUserConnection.save().then( (data: UserConnectionType) => {
          console.log(data)
          res.json({ result : true, username: data.profile.username, token: data.token, rolls: data.profile.rollsList })
        })   
      })
    } else {
        res.json({ result: false, error: 'User already exists '});
      }
  });
});

// route permettant la connexion
router.post('/signin', (req: Request,res: Response) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
  }

  const { email, password } = req.body;
    // EQUIVALENT A :
    //const email = req.body.email;
    //const password = req.body.password;
    
  UserConnection.findOne({ email }).populate('profile').populate('rollsList').then((data: UserConnectionType | null) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result : true, username: data.profile.username, token: data.token, rolls: data.rollsList});
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})



module.exports = router;
