const User = require("./models/User");
const bcrypt = require("bcrypt"); //npm i bcrypt шифрует пароли
const jwt = require("jsonwebtoken"); //npm i jsonwebtoken создает шифр для куки

const { JWT_SECRET } = require("./constants"); //создаем секрет для jwt

async function addUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10); //пароль и соль  жля создания хэша, не более 11
  await User.create({ email, password: passwordHash });
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User is not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password); //сравнивает пароль с захэшированным паролем

  if (!isPasswordCorrect) {
    throw new Error("Password is not correct");
  }

  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "30d" }); // 1-ый арг(payload)делаем обьект чтобы можно было потом довавить какие-то данные в шифрование, 2-ой секрет, 3-ий опции
  //expiresIn говорит сколько валиден jwt чтобы пользователь небыл залогинен всегда
}

module.exports = { addUser, loginUser };
