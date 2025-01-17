const yargs = require("yargs");
const pkg = require("./package.json");
const { addNote, printNotes, deleteNote } = require("./notes-controller");

yargs.version(pkg.version); //вместо прямого указания номера версии
// yargs.version("1.0.0"); //можно менять версии

yargs.command({
  //чтобы вызвать: node index add --title=HELLO
  command: "add",
  describe: "Add new note to list",
  builder: {
    //так как нужен параметр для выполнения команды
    title: {
      type: "string",
      describe: "note title",
      demandOption: true, //обязателен ли этот параметр
    },
  },
  handler({ title }) {
    //извлечен из объекта options
    addNote(title);
  },
});

yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    printNotes();
  },
});

yargs.command({
  command: "delete",
  describe: "delete note by ID",
  builder: {
    id: {
      type: "string",
      describe: "id of note",
      demandOption: true,
    },
  },
  handler({ id }) {
    deleteNote(id);
  },
});

yargs.parse(); //чтобы добавить команды
