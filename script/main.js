const notes = document.querySelector(".notes");
const createBtn = notes.querySelector(".create-note");

createBtn.addEventListener("click", () => addNote());

getAllNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.text, note.creationDate);
    createBtn.after(noteElement);
});

function getAllNotes() {
    // Fetch if you have one, or create empty JSON data.
    return JSON.parse(localStorage.getItem("onote-notes") || "[]");
}

function saveAllNotes(allNotes) {
    localStorage.setItem("onote-notes", JSON.stringify(allNotes));
}

function createNoteElement(id, text, creationDate) {
    // Create a div and give it a class of note. Add a textarea inside the div you created.
    const element = document.createElement("div");
    element.classList.add("note");

    const trashcan = document.createElement("button");
    trashcan.classList.add("note-delete");
    trashcan.innerHTML = "<i class='bx bx-trash'></i>";

    const textarea = document.createElement("textarea");
    textarea.classList.add("note-text");

    const crtddate = document.createElement("div");
    crtddate.classList.add("note-creationdate");

    element.appendChild(trashcan);
    element.appendChild(textarea);
    element.appendChild(crtddate);

    textarea.value = text;
    textarea.placeholder = getRandomPlaceholder()

    crtddate.innerHTML = "Crtd Date: " + creationDate.toLocaleString("tr-TR");


    textarea.addEventListener("change", () => {
        updateNote(id, textarea.value);
    })

    trashcan.addEventListener("click", () => {
        let modalBg = document.createElement("div");
        modalBg.classList.add("modal-bg");
        modalBg.innerHTML = `
            <div class="modal">
                <box-icon class="modal-mark" color="white" name='question-mark'></box-icon>
                <div class="modal-center">Are you sure you want to delete this note? This action cannot be undone.</div>
                <div class="modal-footer">
                    <button class="modal-yes" type="button">Yes</button>
                    <button class="modal-no" type="button">No</button>
                </div>
            </div>
        `
        document.body.appendChild(modalBg);

        const modalYes = document.querySelector(".modal-yes");
        const modalNo = document.querySelector(".modal-no");

        modalYes.addEventListener("click", () => {
            deleteNote(id, element);
            modalBg.remove();
        })

        modalNo.addEventListener("click", () => {
            modalBg.remove();
        })
    });

    return element;
}

function addNote() {
    // Retrieve the previous data and append it to the end of this data.
    const allNotes = getAllNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        text: "",
        creationDate: new Date()
        // TODO: Date of update information will be added.
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.text, noteObject.creationDate);
    createBtn.after(noteElement);

    // Append the new note to the end of existing notes.
    allNotes.push(noteObject);
    saveAllNotes(allNotes);
}

function updateNote(id, newText) {
    const allNotes = getAllNotes();
    const findNote = allNotes.filter(note => note.id === id)[0];

    findNote.text = newText;
    saveAllNotes(allNotes);
}

function deleteNote(id, element) {
    const allNotes = getAllNotes().filter(note => note.id !== id);
    saveAllNotes(allNotes);
    notes.removeChild(element);
}

function getRandomPlaceholder() {
    const placeholders = [
        "What did you do today?",
        "What would you like to tell me?",
        "Let's write something.",
        "How was your day?",
        "What would you like to write about today?"
    ];
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
}