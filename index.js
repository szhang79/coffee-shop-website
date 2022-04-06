import express from 'express';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { dirname } from 'path';
import msIdExpress from 'microsoft-identity-express';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import api from './routes/api.js';
import db from './db.js';

const appSettings = { // THIS IS FOR msIdEXPRESS!!!! LECTURE 11
  appCredentials: {
    clientId: "a5209c29-e388-403d-aedb-a94d98601261",
    tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "OFU7Q~w_l63zd4JNliGyws6672OvZTy.KMdoT"
  },
  authRoutes: {
      redirect: "https://coffee-shop-info441.azurewebsites.net/redirect",
      error: "/error", // the wrapper will redirect to this route in case of any error.
      unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
  }
};
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "OFU7Q~w_l63zd4JNliGyws6672OvZTy.KMdoT",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) { // takes db library from import, and sticks connection onto the param req.db
  req.db = db;
  next();
});
app.use("/api", api);

app.get('/signin',
  msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
  msid.signOut({postLogoutRedirect: '/'})
)

app.get("/error", (req, res) => {
  res.status(500).json({
    status: "error",
    error: "There was an error completing your request"
  });
});

app.get("/unauthorized", (req, res) => {
  res.status(401).json({
    status: "error",
    error: "Permission denied to access this resource"
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;