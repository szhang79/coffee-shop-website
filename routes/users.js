import express from 'express';

const users = express.Router();

/**
 * GETs a list of all users
 * If a username is passed in as a query parameter, performs a regex "starts with" search
 */
users.get('/', async (req, res) => {
  try {
    let users;
    if (req.query.username) {
      users = await req.db.User.find().where('username').regex(`^${req.query.username}`);
    } else {
      users = await req.db.User.find();
    }

    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      error: 'Unable to retrieve users from the database'
    });
  }
});

/**
 * POSTs a new user to the database
 */
users.post('/', async (req, res) => {
  try {
    let oldUser = await req.db.User.findOne({username: req.body.username});
    if (oldUser === null) {
      const user = new req.db.User({
        username: req.body.username,
        bio: req.body.bio ?? "",
        img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        name: req.body.name ?? req.body.username,
        coffee_shop: null,
        drink: null,
        isActive: true,
      });
      await user.save();
    }
    res.json({status: 'success'});
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      error: 'Unable to save the user to the database'
    });
  }
});

/**
 * DELETEs a user from the database
 */
users.delete('/:id', async (req, res) => {
  try {
    await req.db.User.findByIdAndDelete(req.params.id);
    res.json({status: 'success'});
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      error: `Unable to delete ${req.params.id} from the database`
    });
  }
});

/**
 * PATCHs a user's information in the database
 */
users.patch('/', async (req, res) => {
  try {
    await req.db.User.findOneAndUpdate({username: req.query.username}, req.body);
    res.json({status: 'success'});
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      error: `Unable to update user in the database`
    });
  }
});

export default users;