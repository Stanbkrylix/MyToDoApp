function openAddModal(button, modalContainer) {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        modalContainer.classList.remove("hidden");
    });
}

function closeAddModal(button, modalContainer) {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        modalContainer.classList.add("hidden");
    });
}

function toggleModal() {
    const openModalBtn = document.querySelector(".add-btn");
    const closeModalBtn = document.querySelector(".modal-close-link");
    const modalContainer = document.querySelector(".add-modal-container");

    modalContainer.classList.add("hidden");

    openAddModal(openModalBtn, modalContainer);
    closeAddModal(closeModalBtn, modalContainer);
}

function toggleCreateNew() {
    const modalToDoLink = document.querySelector(".modal-todo-link");
    const modalProjectLink = document.querySelector(".modal-project-link");
    const modalNoteLink = document.querySelector(".modal-note-link");

    const modalToDoSection = document.querySelector(".modal-to-do-section");
    const modalProjectSection = document.querySelector(
        ".modal-project-section"
    );
    const modalNoteSection = document.querySelector(".modal-note-section");

    modalToDoSection.classList.remove("hidden");
    modalProjectSection.classList.add("hidden");
    modalNoteSection.classList.add("hidden");

    modalToDoLink.addEventListener("click", (e) => {
        const target = e.target;
        if (modalToDoSection.classList.contains("hidden")) {
            modalToDoSection.classList.remove("hidden");
            modalProjectSection.classList.add("hidden");
            modalNoteSection.classList.add("hidden");
        }
    });

    modalProjectLink.addEventListener("click", (e) => {
        const target = e.target;
        if (modalProjectSection.classList.contains("hidden")) {
            modalProjectSection.classList.remove("hidden");
            modalToDoSection.classList.add("hidden");
            modalNoteSection.classList.add("hidden");
        }
    });

    modalNoteLink.addEventListener("click", (e) => {
        const target = e.target;
        if (modalNoteSection.classList.contains("hidden")) {
            modalNoteSection.classList.remove("hidden");
            modalToDoSection.classList.add("hidden");
            modalProjectSection.classList.add("hidden");
        }
    });
}
export { toggleModal, toggleCreateNew };
