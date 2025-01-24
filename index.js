const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const {
  addNote,
  getNotes,
  deleteNote,
  editNote,
} = require("./notes-controller");

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.render("index", {
    title: "ExpressApp",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Creation error", e);
    res.render("index", {
      title: "ExpressApp",
      notes: await getNotes(),
      created: false,
      error: true,
    });
  }
});

app.delete("/:id", async (req, res) => {
  await deleteNote(req.params.id);
  res.render("index", {
    title: "ExpressApp",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  await editNote(id, title);
  res.render("index", {
    title: "ExpressApp",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

mongoose
  .connect(
    "mongodb+srv://lifeinnaalex:332257315Aa@cluster0.nglar.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`server has been started on port ${port}`);
    });
  });
