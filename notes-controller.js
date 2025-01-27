const Note = require("./models/Note");

async function addNote(title, owner) {
  await Note.create({ title, owner });

  console.log("Note was aded!");
}

async function getNotes() {
  const notes = await Note.find();

  return notes;
}

async function deleteNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });

  if (result.matchedCount === 0) {
    throw new Error("No note to dalete");
  }

  console.log("note deleted id:", id);
}

async function editNote(id, title, owner) {
  const result = await Note.updateOne({ _id: id, owner }, { title }); //1-где обновить, 2-что изменить

  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }
  console.log("note was updated id:", id);
}

module.exports = {
  addNote,
  getNotes,
  deleteNote,
  editNote,
};
