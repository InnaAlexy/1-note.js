document.addEventListener("click", (event) => {
  const id = event.target.dataset.id;

  if (event.target.dataset.type === "remove") {
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  } else if (event.target.dataset.type === "edit") {
    const newTitle = prompt("Введите новое название");

    if (newTitle) {
      edit(id, newTitle).then(() => {
        const curLi = event.target.closest("li");

        curLi.innerHTML = `${newTitle}<div>
              <button
                class="btn btn-primary"
                data-type="edit"
                data-id="<%=notes[i].id%>"
              >
                Редактировать
              </button>

              <button
                class="btn btn-danger"
                data-type="remove"
                data-id="<%=notes[i].id%>"
              >
                &times;
              </button>
            </div>`;
      });
    } else {
      return;
    }
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

async function edit(id, title) {
  await fetch(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
}
