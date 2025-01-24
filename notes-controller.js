const Note = require("./models/Note");

async function addNote(title) {
  await Note.create({ title });

  console.log("Note was aded!");
}

async function getNotes() {
  const notes = await Note.find();

  return notes;
}

async function deleteNote(id) {
  await Note.deleteOne({ _id: id });

  console.log("note deleted id:", id);
}

async function editNote(id, title) {
  await Note.updateOne({ _id: id }, { title }); //1-где обновить, 2-что изменить

  console.log("note was updated id:", id);
}

module.exports = {
  addNote,
  getNotes,
  deleteNote,
  editNote,
};
