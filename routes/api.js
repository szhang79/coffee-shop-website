import express from 'express';

import users from './users.js';

var router = express.Router();

router.get('/getIdentity', async function(req, res, next) {
  let session = req.session;
  if (session.isAuthenticated) { // can check if it is authenticated (logged in)
    res.json({"status": "loggedin", "userInfo": session.account})
  } else {
    res.json({"status": "loggedout"});
  }
});

router.use('/users', users);

export default router;