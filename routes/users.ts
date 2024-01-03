var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { UserConnectionType } from '../types/userConnection';
import { UserProfileType } from '../types/userProfile';
import { FrameType } from '../types/frame';
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
      const newUserProfile = new UserProfile({ 
        username,
        profilePicture: '../assets/image-profil.jpg',
        rollsList: []
      })
      newUserProfile.save().then( (data: UserProfileType) => {

        //Récupération de l'ID du UserProfile qui vient d'être créé
        const userProfileID = data._id;
        // commentaire pour créer une modif -> à enlever

        //2ème étape : créer un userConnection
        const newUserConnection = new UserConnection({ 
          email,
          password: hash,
          token: uid2(32),
          profile: userProfileID 
        })
        newUserConnection.save().then( (data: UserConnectionType) => {
          console.log(data)

          UserProfile.findOne({_id: userProfileID}).populate('rollsList')
          .then((userdata: UserProfileType) => {
            
            res.json({ result : true, _id: userProfileID, username: userdata.username, token: data.token, rolls: userdata.rollsList })
          })

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
    
  UserConnection.findOne({ email }).populate('profile').then((dataConnection: UserConnectionType | null) => {
    if (dataConnection && bcrypt.compareSync(password, dataConnection.password)) {

      UserProfile.findOne({ _id: dataConnection.profile._id}).populate('rollsList').populate('framesList').then((dataProfile: UserProfileType | null) => {
        dataProfile ? 
          res.json({ 
            result : true, 
            _id: dataProfile._id, 
            username: dataProfile.username, 
            token: dataConnection.token, 
            rolls: dataProfile.rollsList,
            frames: dataProfile.framesList
          }) : 
            res.json({ result: false });
      })

    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})


// route GET
router.get('/:username', (req: Request, res: Response) => {
    
  UserProfile.findOne({ username: req.params.username }).populate('framesList').populate('cameras').populate('rollsList').then((dataProfile: UserProfileType | null) => {
    if (dataProfile !== null) {
      res.json({ result: true, user: dataProfile, rolls: dataProfile.rollsList, cameras: dataProfile.cameras, frames: dataProfile.framesList})
    }
    else {
      res.json({ result: false })
    }
  })
})


// route GET search frames shared par username
router.get('/search/:username', (req: Request, res: Response) => {
    
  UserProfile.findOne({ username: req.params.username }).populate('framesList').populate('cameras').populate('rollsList').then((dataProfile: UserProfileType | null) => {
    if (dataProfile !== null) {
      let framesShared = dataProfile.framesList?.filter((frame: FrameType) => frame.shared === true);
      res.json({ result: true, user: dataProfile, framesShared})
    }
    else {
      res.json({ result: false })
    }
  })
})


// route GET pour trouver un user à partir d'une frame
router.get('/find/:frameId', (req: Request, res: Response) => {
  
  const objectId = new mongoose.Types.ObjectId(req.params.frameId)

  UserProfile.findOne({ framesList: objectId }).then((dataProfile: UserProfileType | null) => {
    if (dataProfile !== null) {
      res.json({ result: true, user: dataProfile })
    }
    else {
      res.json({ result: false })
    }
  })
})


module.exports = router;