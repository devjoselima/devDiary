// Elements
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");

function showNotes(){
    cleanNotes();
    getNotes().forEach((note) =>{
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    }); 
}

function cleanNotes(){
    notesContainer.replaceChildren([])
}

function addNote(){
    const notes = getNotes();


    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);
    noteInput.value = "";
}

function generateId(){
    return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed){
    const element = document.createElement("div")

    element.classList.add("note")

    const textarea = document.createElement("textarea")

    textarea.value = content

    textarea.placeholder = "Adicione algum texto..."

    element.appendChild(textarea)

    //Icon de fixar
    const pinIcon = document.createElement("i")
    
    pinIcon.classList.add(...["bi", "bi-pin"]);

    element.appendChild(pinIcon);

    //Icon de exlusão
    const deleteIcon = document.createElement("i")
    
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);

    element.appendChild(deleteIcon);

    //Icon de duplicar
    const duplicateIcon = document.createElement("i")
    
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

    element.appendChild(duplicateIcon);

    if(fixed) {
        element.classList.add("fixed")
    }

    element.querySelector(".bi-pin").addEventListener("click", () =>{
        toggleFixNote(id)
    })
    element.querySelector(".bi-x-lg").addEventListener("click", () =>{
        deleteNote(id, element);
    })

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () =>{
        copyNote(id);
    })

    return element;
}

function toggleFixNote(id){
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id === id) [0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotes();
}

function deleteNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    notesContainer.removeChild(element)
}

function copyNote(id){
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id === id) [0]

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notesContainer.appendChild(noteElement)

    notes.push(noteObject)
    saveNotes(notes)
}
//Local storage
function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1)

    return orderedNotes;
}

function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes));
}

addNoteBtn.addEventListener("click", () => addNote());

showNotes()