var express = require('express');
var router = express.Router();

import UserConnectionType from '../types/userConnection'
const UserConnection = require('../models/userConnections')

const newUserConnection : UserConnectionType = new UserConnection({
  email: String,
  password: String,
  token: String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }

})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
