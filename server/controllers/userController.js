/* eslint-disable no-restricted-syntax */
const bcrypt = require('bcrypt');
const db = require('../models/plantModel');

const saltRounds = 10;

const userController = {};

//  >>  OLD FORMAT FROM ROOM TO GROW  <<
userController.verifyExisting = (req, res, next) => {
  const { username, password } = req.body;
  console.log('username: ', username);
  // can also do a WHERE check and if rows.length <1
  const queryStringCheck = 'SELECT username FROM users';
  db.query(queryStringCheck)
    .then((response) => response.rows)
    .then((rows) => {
      for (const user of rows) {
        if (user.username === username) {
          return res.status(200).json({ message: 'usernameInUse' });
        }
      }
      return next();
    })
    .catch((err) => console.log('Problem verifying user! ERROR: ', err));
};

userController.encryptPswd = (req, res, next) => {
  const { username, password } = req.body;
  // console.log("Made it to encryption")
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const values = [username, hash];
    console.log(values);
    const queryString = `INSERT INTO users(username, password)
    VALUES ('${username}', '${hash}')`;

    db.query(queryString, [username, hash])
      .then(() => console.log('=================== Account Creation Successful ======================'))
      .then(() => next())
      // eslint-disable-next-line no-shadow
      .catch((err) => next({
        log: err,
        err: '================== userController.encryptPswd failed to add to database =====================',
      }));
  });
};

// //  >>  LOGIN CONTROLLER  <<
userController.logIn = (req, res, next) => {
  // console.log('userController.logIn', req.body);
  const { username, password } = req.body;
  console.log('username: ', username);
  // can also do a WHERE check and if rows.length <1
  const queryStringCheck = 'SELECT username FROM users';
  db.query(queryStringCheck)
    .then((response) => response.rows)
    .then((rows) => {
      if (rows.includes(req.body.username)) {
        return res.status(200).json({ message: 'usernameInUse' });
      }
      return next();
    })
    .catch((err) => console.log('Problem verifying user! ERROR: ', err));
};

// //  >>  ADDED FROM NFVOTE  <<
// userController.logIn = (req, res, next) => {
//   // console.log('userController.logIn', req.body);
//   const { username, password } = req.body;

//   // bcrypt.hash(password, saltRounds, (err, hash) => {

//   // }

//   const qValues = [
//     req.body.password,
//   ]
//   console.log(qValues)
//   const qString = `SELECT users, hash FROM users WHERE hash = $1`;

//   db.query(qString, qValues, (err, data) => {
//     if (err) {
//       return next({
//         log: err,
//         err: 'ERROR: userController.logIn failed to query a user in the database'
//       })
//     }
//     // console.log('THIS IS NOW A CALLBACK',data.rows[0]);
//     // const passwordCheck = userAuth.CHECK(req.body.password,data.rows[0].hash);
//     const passwordCheck = data.rows[0];
//     // console.log('passwordCheck after login:', passwordCheck);

//     if (passwordCheck) return next();
//     else return res.status(200).json({logIn: false})
//   })
// }

//  >>  ADDED FROM NFVOTE  <<
// userController.signUp = (req, res, next) => {
//   // console.log('userController.signUp:',req.body)
//   const qValues = [
//     req.body.email,
//     req.body.password,
//     req.body.lastName,
//     req.body.firstName
//   ]

//   const qString =
//     `INSERT INTO users_crypt (email, hash, lastname, firstname)
//     VALUES ($1, crypt($2 ,gen_salt('bf')), $3, $4)`;

//   db.query(qString, qValues)
//     .then(data => {
//       // console.log('userController.signUp USER ADDED:',data);
//       res.locals.newUser = data.rows[0];
//     })
//     .then(next)
//     .catch(err => next({
//       log: err,
//       err: 'ERROR: userController.signUp FAILED TO CREATE USER'
//     }))
// }

//  >>  OLD FORMAT FROM ROOM TO GROW  <<
// tbd endpoint
// userController.post =
//   ("/login",
//   (req, res) => {
//     bcrypt.hash =
//       (req.body.password,
//       saltRounds,
//       (err, hash) => {
//         db.users.create({
//           username: req.body.username,
//           password: hash,
//         });
//       });
//   });

module.exports = userController;
