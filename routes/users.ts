var express = require('express');
var router = express.Router();

import { UserConnectionType } from '../types/userConnection';
const UserConnection = require('../models/userConnections');
const UserProfile = require('../models/userProfiles');

const newUserConnection : UserConnectionType = new UserConnection({
  email: String,
  password: String,
  token: String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }
});

const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req: any, res: any) => {
  if (!checkBody(req.body, ['email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  UserConnection.findOne({ email: req.body.email }).then((data: any) => {
    if (data === null) {

      // 1ère étape : créer un userProfile
      const newUserProfile = new UserProfile({
        username: req.body.username,
        profilePicture: '' //AJOUTER UNE PHOTO PAR DEFAUT
      })
      newUserProfile.save().then( (data: any) => {
        console.log(data)
        const userProfileID = data._id;
        //Récupération de l'ID du UserProfile qui vient d'être créé

        //2ème étape : créer un userConnection
        const newUserConnection = new UserConnection({
          email: req.body.email,
          password: req.body.password,
          token: '', //AJOUTER CREATION TOKEN
          profile: userProfileID 
        })
      })

      
    } else {
        res.json({ result: false, error: 'User already exists '});
      }
  });
});

  // Check if the user has not already been registered
  /*User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});*/

// router.post('/signin', (req, res) => {
//   if (!checkBody(req.body, ['username', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }

//   User.findOne({ username: req.body.username }).then(data => {
//     if (data && bcrypt.compareSync(req.body.password, data.password)) {
//       res.json({ result: true, token: data.token });
//     } else {
//       res.json({ result: false, error: 'User not found or wrong password' });
//     }
//   });
// });



module.exports = router;
