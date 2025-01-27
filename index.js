const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParcer = require("cookie-parser"); //npm i cookie-parcer
const {
  addNote,
  getNotes,
  deleteNote,
  editNote,
} = require("./notes-controller");
const { addUser, loginUser } = require("./user-controller");
const { auth } = require("./middlewares/auth");

////config//////

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParcer());

/////////LOGIN//////////

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "ExpressApp",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "ExpressApp",
      error: e.message,
    });
  }
});

///////////////REGISTER//////////

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "ExpressApp",
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      // 11000 это код ошибки емаил уже существует
      res.render("register", {
        title: "ExpressApp",
        error: "Email is already registered",
      });

      return;
    }
    res.render("register", {
      title: "ExpressApp",
      error: e.message,
    });
  }
});

/////////LOGOUT///////////

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }); //httpOnly только для запросов, виден браузеру, клиент его не увидит

  res.redirect("/login");
});

//////////MAIN/////////////////

app.use(auth); //используем только после логина и регистрации

app.get("/", async (req, res) => {
  res.render("index", {
    title: "ExpressApp",
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Creation error", e);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await deleteNote(req.params.id, req.user.email);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const owner = req.user.email;
  try {
    await editNote(id, title, owner);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

///////app//////////

mongoose
  .connect(
    "mongodb+srv://lifeinnaalex:332257315Aa@cluster0.nglar.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`server has been started on port ${port}`);
    });
  });
