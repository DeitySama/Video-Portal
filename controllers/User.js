const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    password2,
    role
  } = req.body;

  console.log(req.body);
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ message: "Kindly fill in the required fields" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.json({
      success: false,
      message: errors,
    });
  } else {
    await User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ message: `Email is already in use.` });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;

            //Save user
            newUser
              .save()
              .then((user) => {
                const { email, name } = user;
                res.json({ sucess: true, user: { email, name } });
              })
              .catch((err) => {
                res.json({
                  success: false,
                  message: err.message,
                });
              });
          });
        });
      }
    });
  }
};

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {

        if (isMatch) {
          const payload = { name: user.name, email: user.email, _id: user._id };
            const token = accessToken(payload);
            const exp =new Date();
            const userObj = { payload, token};
            res.cookie("JWT_REFRESH", genRefresh(payload), {
              expires: new Date(Date.now() + 604800),
              httpOnly: true
            });
            res.render("admin", { userObj });
        }
        else{
          req.flash("error_msg", "Wrong Password");
          res.redirect('/videotube/admin');
        }
      });
    } else {
      req.flash("error_msg","User does not exist");
      res.redirect('/videotube/admin');
    }
  });
};

exports.refresh = (req, res, next) => {
  const refreshCookie = req.headers.cookie;
  if (refreshCookie) {
    const refreshToken = extractToken(refreshCookie, "=");
    if(refreshToken[1] !== null ){
      jwt.verify(
        refreshToken[1],
        process.env.JWT_REFRESH_SECRET,
        async (err, authData) => {
          if (err) {
            console.log(err);
          } else {
            const user = await User.findById(authData.user);
  
            if (user) {
              const payload = {
                name: user.name,
                email: user.email,
                _id: user._id,
              };
              const token = accessToken(payload);
              res.json({
                success: true,
                user: payload,
                token: token,
              });
            }
          }
        }
      );
    }
    else{
      res.json({
        success:false
      })
    }
  }
};

exports.logout = (req, res, next) => {

  req.flash("success_msg","Logged Out");
    res.cookie("JWT_REFRESH", "Logged Out", {
      expires: new Date(Date.now() + 604800),
      httpOnly: true,
    });
  res.redirect('/videotube/admin');
};

const accessToken = (payload) => {
  const token = jwt.sign({ user: payload._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

const genRefresh = (payload) => {
  const token = jwt.sign(
    { user: payload._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
  return token;
};

const extractToken = (str, splitAt) => {
  let token = str.split(splitAt);
  return token;
};
