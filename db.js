import mongoose from 'mongoose';

const uri = `mongodb+srv://root:${process.env.db_pass}@cluster0.jspq4.mongodb.net`;
dbConnect().catch(e => console.log(e));

let db = {};

async function dbConnect() {
  await mongoose.connect(uri);

  const userSchema = new mongoose.Schema({
    username: String,
    bio: String,
    img: String,
    name: String,
    friends: {type: Array, default: []},
    friendRequests: {type: Array, default: []},
    created_at: {type: Date, default: Date.now},
    coffee_shop: String,
    drink: String,
    isActive: Boolean,
    lastActive: {type: Date, default: Date.now}
  });

  db.User = mongoose.model('User', userSchema);
}

export default db;