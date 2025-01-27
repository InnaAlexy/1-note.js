const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");

function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    const verifyResult = jwt.verify(token, JWT_SECRET);
    req.user = {
      email: verifyResult.email,
    };
    next(); //чтобы функция не застревала здесь, а продолжалась в контроллере
  } catch (e) {
    res.redirect("./login");
  }
}

module.exports = { auth };
