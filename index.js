import { toggleModal, toggleCreateNew } from "./modal.js";

const contentSide = document.querySelector(".content-side");

const linkSide = document.querySelector(".link-side");
const menu = document.querySelector(".menu");

const modalContainer = document.querySelector(".add-modal-container");

const editModalContainer = document.querySelector(".edit-modal-section");
const editModalCloseBtn = document.querySelector(".edit-close-btn");
const editTitleInput = document.querySelector(".edit-to-do-input-1");
const editTextInput = document.querySelector(".edit-to-do-text");
const editDateInput = document.querySelector(".edit-date-input");
const editPriorityBtn = document.querySelector(".edit-priority-btn");
const editConfirmBtn = document.querySelector(".edit-confirm-btn");
const editCancelBtn = document.querySelector(".edit-cancel-btn");

// add modal stuff
const toDoInput = document.querySelector(".to-do-input-1");
const detailsToDo = document.querySelector(".to-do-text");
const dateVal = document.querySelector(".date-input");
const priorityBtn = document.querySelector(".priority-btn");
const addToDoBtn = document.querySelector(".create-new-to-do-btn");

// template elements
const templateTask = document.querySelector(".template-task");

const taskList = document.querySelector(".task");
const projectList = document.querySelector(".project-list");
const projectTitleInput = document.querySelector(
    ".modal-project-section-title-input"
);
const addProjectBtn = document.querySelector(".modal-project-section-btn");

const notesBtn = document.querySelector(".a-notes");
const createNotesBtn = document.querySelector(".create-note-btn");
const noteTitle = document.querySelector(".note-input");
const noteDetail = document.querySelector(".note-detail");

const array_local_key = "arrayLocalKey";
const list_selected = "selectedList";

const note_key = "noteKey";
const noteArray = JSON.parse(localStorage.getItem(note_key)) || [];

const arrayList = JSON.parse(localStorage.getItem(array_local_key)) || [];
let selectedListId = localStorage.getItem(list_selected);
let color = null;

toggleModal();
toggleCreateNew();
const selectTask = arrayList.find((task) => task.id === selectedListId);
renderProjectList();
renderTask(selectTask);

//

menu.addEventListener("click", (e) => {
    linkSide.classList.toggle("visible");
});

// dynamically selecting elements
contentSide.addEventListener("click", (e) => {
    const taskElement = e.target;

    if (taskElement.classList.contains("task-delete-btn")) {
        deleteTaskFunc(taskElement);
    }

    if (
        taskElement.classList.contains("delete-list-btn") ||
        taskElement.tagName.toLowerCase() === "span"
    ) {
        deleteListFunc(taskElement);
    }
    if (taskElement.classList.contains("task-edit-btn")) {
        editTaskFunc(taskElement);
    }
    if (taskElement.classList.contains("checkbox")) {
        checkboxFunc(taskElement);
    }
    if (taskElement.classList.contains("note-delete-btn")) {
        deleteNoteFunc(taskElement);
    }
});

function deleteNoteFunc(noteCard) {
    const noteId = noteCard.dataset.id;
    const selectedNote = noteArray.find((note) => note.id === noteId);
    const index = noteArray.indexOf(selectedNote);
    noteArray.splice(index, 1);
    renderNotes();
    save();
}

projectList.addEventListener("click", (e) => {
    const target = e.target;

    if (target.tagName.toLowerCase() === "a") {
        selectedListId = target.dataset.id;

        const selectedTask = arrayList.find(
            (task) => task.id === selectedListId
        );

        renderProjectList();
        renderTask(selectedTask);
        save();
    }
});

notesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    renderNotes();
    save();
});

createNotesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (noteTitle.value.trim() === "" || noteDetail.value.trim() === "") return;

    const theNote = createNote(noteTitle.value, noteDetail.value);
    noteArray.push(theNote);
    renderNotes();
    save();

    noteTitle.value = "";
    noteDetail.value = "";
    modalContainer.classList.add("hidden");
});

priorityBtn.addEventListener("click", (e) => {
    const priorityBtn = e.target;

    if (priorityBtn.classList.contains("low-btn")) {
        color = "green";
    }
    if (priorityBtn.classList.contains("medium-btn")) {
        color = "orange";
    }
    if (priorityBtn.classList.contains("high-btn")) {
        color = "red";
    }
});

editPriorityBtn.addEventListener("click", (e) => {
    const priorityBtn = e.target;

    if (priorityBtn.classList.contains("edit-low-btn")) {
        color = "green";
    }
    if (priorityBtn.classList.contains("edit-medium-btn")) {
        color = "orange";
    }
    if (priorityBtn.classList.contains("edit-high-btn")) {
        color = "red";
    }
});

editModalCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeEditModal();
});
editCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeEditModal();
});

editConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editConfirmFunc(e.target);
});

function checkboxFunc(taskElement) {
    const checkObject = arrayList.find((item) => item.id === selectedListId);
    const checkTask = checkObject.task.find(
        (item) => item.id === taskElement.dataset.id
    );
    const parentElement = taskElement.parentElement.parentElement;
    const nextSibling = taskElement.parentElement.nextElementSibling;

    if (taskElement.checked) {
        checkIncompleteTask(checkTask, taskElement.checked, checkObject);
        parentElement.classList.add("opac");
        nextSibling.style.pointerEvents = "none";
    } else {
        checkIncompleteTask(checkTask, taskElement.checked, checkObject);
        parentElement.classList.remove("opac");
        nextSibling.style.pointerEvents = "";
    }
}

// check number of remaining task in each project list when checkbox is checked
function checkIncompleteTask(object, trueOrFalse, checkObject) {
    object.complete = trueOrFalse;

    const incompleteTask = checkObject.task.filter(
        (item) => item.complete === false
    );

    const NumOfItems = document.querySelectorAll(".number-of-item");

    const NumOfItemsArray = Array.from(NumOfItems);
    const numberOfItemsArrayFiltered = NumOfItemsArray.filter(
        (item) => item.dataset.id === checkObject.id
    );
    const numberOfItemsInList = numberOfItemsArrayFiltered[0];

    numberOfItemsInList.innerHTML = incompleteTask.length;

    save();
}

function closeEditModal() {
    if (editConfirmBtn.dataset.id !== "") {
        editConfirmBtn.dataset.id = "";
    }

    editModalContainer.classList.add("hidden");
    editTitleInput.value = "";
    editTextInput.value = "";
    editDateInput.value = "";
    color = null;
}

function editConfirmFunc(btn) {
    const editTaskId = btn.dataset.id;
    const toEditTaskObject = arrayList.find(
        (item) => item.id === selectedListId
    );
    const toEditTask = toEditTaskObject.task.find(
        (item) => item.id === editTaskId
    );

    if (
        editTitleInput.value.trim() === "" ||
        editTextInput.value.trim() === "" ||
        editDateInput.value.trim() === ""
    )
        return;

    toEditTask.title = editTitleInput.value;
    toEditTask.detail = editTextInput.value;
    toEditTask.date = editDateInput.value;
    if (color !== null) toEditTask.color = color;

    renderProjectList();
    renderTask(toEditTaskObject);
    save();

    editTitleInput.value = "";
    editTextInput.value = "";
    editDateInput.value = "";
    editModalContainer.classList.add("hidden");
    btn.dataset.id = "";
}

function editTaskFunc(taskElement) {
    editModalContainer.classList.remove("hidden");

    const editTaskId = taskElement.dataset.id;
    const toEditTaskObject = arrayList.find(
        (item) => item.id === selectedListId
    );
    const toEditTask = toEditTaskObject.task.find(
        (item) => item.id === editTaskId
    );

    editConfirmBtn.dataset.id = editTaskId;

    editTitleInput.value = toEditTask.title;
    editTextInput.value = toEditTask.detail;
    editDateInput.value = toEditTask.date;
}

function deleteListFunc(taskElement) {
    const list = arrayList.find((list) => list.id === taskElement.dataset.id);
    const index = arrayList.indexOf(list);
    arrayList.splice(index, 1);
    renderProjectList();
    renderTask();
    save();
}

function deleteTaskFunc(taskElement) {
    const taskId = taskElement.dataset.id;
    const selectedObject = arrayList.find((item) => item.id === selectedListId);
    const taskSelect = selectedObject.task.find((task) => task.id === taskId);

    const index = selectedObject.task.indexOf(taskSelect);

    taskElement.parentElement.parentElement.remove();
    selectedObject.task.splice(index, 1);

    renderProjectList();
    renderTask(selectedObject);
    save();
}

addToDoBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const selectedTask = arrayList.find((task) => task.id === selectedListId);

    if (
        toDoInput.value.trim() === "" ||
        detailsToDo.value.trim() === "" ||
        dateVal.value.trim() === "" ||
        color == null
    ) {
        return;
    }
    if (selectedTask === undefined) return;

    const task = createTask(
        toDoInput.value,
        detailsToDo.value,
        dateVal.value,
        color
    );

    selectedTask.task.push(task);

    renderProjectList();
    renderTask(selectedTask);
    save();

    toDoInput.value = "";
    detailsToDo.value = "";
    dateVal.value = "";
    modalContainer.classList.add("hidden");
});

addProjectBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        projectTitleInput.value.trim() === "" ||
        projectTitleInput.value.trim() == null
    )
        return;

    const list = createList(projectTitleInput.value, "prototype");
    arrayList.push(list);
    projectTitleInput.value = "";

    renderProjectList();
    renderTask();
    save();

    modalContainer.classList.add("hidden");
});

function createList(projectTitle, category) {
    return {
        id: Date.now().toString(),
        title: projectTitle,
        category: category,
        task: [],
        complete: false,
    };
}

function createTask(titleInput, detailInput, dateInput) {
    return {
        id: Date.now().toString(),
        title: titleInput,
        detail: detailInput,
        date: dateInput,
        color: color,
        complete: false,
    };
}

function createNote(noteTitle, noteDetails) {
    return { id: Date.now().toString(), title: noteTitle, detail: noteDetails };
}

function save() {
    localStorage.setItem(array_local_key, JSON.stringify(arrayList));
    localStorage.setItem(list_selected, selectedListId);
    localStorage.setItem(note_key, JSON.stringify(noteArray));
}

function renderTask(selectedTask) {
    clearElement(contentSide);
    if (selectedListId == null) return;
    if (selectedTask === undefined) return;

    const divContainer = document.createElement("div");
    const div = document.createElement("div");
    const h1Element = document.createElement("h1");
    const deleteListBtn = document.createElement("button");
    const spanList = document.createElement("span");
    deleteListBtn.appendChild(spanList);
    divContainer.setAttribute("class", "div-container");
    spanList.setAttribute("class", "material-symbols-outlined");
    div.setAttribute("class", "content-side-top-div");
    deleteListBtn.setAttribute("class", "delete-list-btn");
    spanList.innerHTML = "close";
    spanList.dataset.id = selectedTask.id;
    deleteListBtn.dataset.id = selectedTask.id;
    h1Element.innerHTML = `${selectedTask.title}`;

    div.appendChild(h1Element);
    div.appendChild(deleteListBtn);
    divContainer.appendChild(div);
    contentSide.appendChild(divContainer);

    taskCreate(selectedTask.task, divContainer);
}

function renderProjectList() {
    clearElement(projectList);

    if (arrayList.length === 0) return;

    arrayList.forEach((item) => {
        const list = document.createElement("li");
        const link = document.createElement("a");
        const itemInList = document.createElement("span");
        itemInList.setAttribute("class", "number-of-item");

        link.innerHTML = item.title;
        itemInList.innerHTML = item.task.length;
        link.dataset.id = item.id;
        list.dataset.id = item.id;
        itemInList.dataset.id = item.id;

        if (selectedListId === item.id) {
            link.classList.add("active");
        }

        list.appendChild(link);
        list.appendChild(itemInList);
        projectList.appendChild(list);
    });
}

function renderNotes() {
    clearElement(contentSide);

    const noteContainer = document.createElement("div");
    const topH1 = document.createElement("h1");
    const noteCardsContainer = document.createElement("div");
    noteContainer.setAttribute("class", "note-container");
    noteCardsContainer.setAttribute("class", "note-cards-container");
    topH1.setAttribute("class", "top-h1");

    topH1.innerHTML = "Notes";

    noteContainer.appendChild(topH1);
    noteContainer.appendChild(noteCardsContainer);
    contentSide.appendChild(noteContainer);
    noteCreate(noteCardsContainer);
}

function taskCreate(array, divContainer) {
    array.forEach((element) => {
        const templateElement = document.importNode(templateTask.content, true);

        const taskDiv = templateElement.querySelector(".task");
        const checkbox = templateElement.querySelector(".checkbox");
        const pElement = templateElement.querySelector(".pElement");

        const dateInput = templateElement.querySelector(".date-input");
        const taskEditBtn = templateElement.querySelector(".task-edit-btn");
        const taskDeleteBtn = templateElement.querySelector(".task-delete-btn");

        taskDiv.style.borderColor = element.color;
        taskDiv.dataset.id = element.id;
        checkbox.dataset.id = element.id;
        pElement.dataset.id = element.id;
        taskEditBtn.dataset.id = element.id;
        taskDeleteBtn.dataset.id = element.id;
        dateInput.dataset.id = element.id;

        dateInput.innerHTML = element.date;
        pElement.innerHTML = element.title;

        divContainer.appendChild(templateElement);
    });
}

function noteCreate(noteCardsContainer) {
    noteArray.forEach((note) => {
        const noteCard = document.createElement("div");
        const noteH1 = document.createElement("h1");
        const notePa = document.createElement("p");
        const noteDeleteDiv = document.createElement("div");
        const noteDeleteBtn = document.createElement("button");

        noteCard.setAttribute("class", "note-card");
        noteH1.setAttribute("class", "note-h1");
        notePa.setAttribute("class", "note-pa");
        noteDeleteDiv.setAttribute("class", "note-delete-div");
        noteDeleteBtn.setAttribute("class", "note-delete-btn");

        noteH1.innerHTML = note.title;
        notePa.innerHTML = note.detail;
        noteDeleteBtn.innerHTML = "X";

        noteCard.dataset.id = note.id;
        noteH1.dataset.id = note.id;
        notePa.dataset.id = note.id;
        noteDeleteDiv.dataset.id = note.id;
        noteDeleteBtn.dataset.id = note.id;

        noteCard.appendChild(noteH1);
        noteCard.appendChild(notePa);
        noteCard.appendChild(noteDeleteDiv);
        noteDeleteDiv.appendChild(noteDeleteBtn);
        noteCardsContainer.appendChild(noteCard);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
