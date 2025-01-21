const fs = require("fs/promises"); //по умолчанию fs не промис
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
  console.log("note deleted");
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgCyan("List of notes"));

  notes.forEach((note) => {
    console.log(`${note.id} ${note.title}`);
  });
}

async function editNote(id, title) {
  const notes = await getNotes();
  notes.forEach((note, index) => {
    if (note.id === id) notes.splice(index, 1, { title, id });
  });

  await fs.writeFile(notePath, JSON.stringify(notes));
}

module.exports = {
  addNote,
  getNotes,
  deleteNote,
  editNote,
};
