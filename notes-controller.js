const fs = require("fs/promises"); //по умолчанию fs не промис
const chalk = require("chalk");
const path = require("path");

const notePath = path.join(__dirname, "db.json"); //вместо прописывания вручную или относительного пути

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);
  await fs.writeFile(notePath, JSON.stringify(notes));
}

async function getNotes() {
  //   const bufferOfNotes = await fs.readFile(notePath); //вернет буфер
  //   const stringOfNotes = Buffer.from(bufferOfNotes).toString("utf-8"); //вернет строку
  //   или ниже:
  const stringOfNotes2 = await fs.readFile(notePath, { encoding: "utf-8" }); //вернет строку
  const notes = JSON.parse(stringOfNotes2); //вернет массив

  return Array.isArray(notes) ? notes : [];
}

async function deleteNote(id) {
  const notes = await getNotes();
  const updatedNotes = notes.filter((obj) => obj.id !== id);

  await fs.writeFile(notePath, JSON.stringify(updatedNotes));
  console.log(chalk.green.inverse("note deleted"));
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgCyan("List of notes"));

  notes.forEach((note) => {
    console.log(chalk.cyan(`${note.id} ${note.title}`));
  });
}

module.exports = {
  addNote,
  printNotes,
  deleteNote,
};
