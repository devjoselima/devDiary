// Elements
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#exports-notes");
const note = document.querySelector(".note");



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


// Criar uma nova nota
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



// Gerar id aleatorio da nota
function generateId(){
    return Math.floor(Math.random() * 5000);
}



// Criar a nota na tela do usuario
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




// Fixar nota
function toggleFixNote(id){
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id === id) [0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotes();
}

// Procurar nota
function searchNotes(search){
    const searchResults = getNotes().filter((note) => 
        note.content.includes(search)
    )

    if(search !== ""){
        cleanNotes()

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content);
            notesContainer.appendChild(noteElement);
        });


        return;
    }

    cleanNotes();
    showNotes();
}


// Deletar nota
function deleteNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    notesContainer.removeChild(element)
}



// Duplicar nota
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


//Exportar CSV
function exportData(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ]
    .map((e) => e.join(","))
    .join("\n");

    const element = document.createElement("a")
    element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString);
    element.target = "_blank";
    element.download = "export.csv";
    element.click();
}


//Local storage
function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1)

    return orderedNotes;
}




// Salvar as notas
function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes));
}


//EVENTOS

//Adiciona nota ao clicar
addNoteBtn.addEventListener("click", () => addNote());


//Adiciona a nota com Enter
noteInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        addNote();
    }
});

//Procurar nota pelo input
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    searchNotes(search);
});

exportBtn.addEventListener("click", () => {
    exportData();
});

showNotes()