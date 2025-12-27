let notes=[]
let noteId = null

function loadNotes() {
    const savedNotes = localStorage.getItem('Effisienstick!')
    return savedNotes ? JSON.parse(savedNotes) :[]
}

function saveNote(event) {
    event.preventDefault()

    const title = document.getElementById('note-title').value.trim()
    const content = document.getElementById('note-content').value.trim()

    if (editingNoteId) {

        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
    }
    else {
    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    })
    }

    closeNoteDialog()
    saveNotes()
    renderNotes()
}

function generateId(){
    return Date.now().toString()
}

function saveNotes() {
    localStorage.setItem('Effisienstick!', JSON.stringify(notes))
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}

function renderNotes() {
    const notesContainer = document.getElementById('note-container')

    if(notes.length === 0) {
        // show notes on the screen
        notesContainer.innerHTML =`
        <div class="empty-state">
        <h2>No Notes yet</h2>
        <p>Create Notes Here</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Note </button
        </div>`

        return
    }

    notesContainer.innerHTML = notes.map(note =>`
        <div class="note-card">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
        </div>
        </div>
        `).join('')
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('note-dialog');
    const titleinput = document.getElementById('note-title');
    const contentinput = document.getElementById('note-content');

    if(noteId) {
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById('dialog-title').textContent = 'Edit Note'
        titleinput.value = noteToEdit.title
        contentinput.value =noteToEdit.content
    }
    else {
        editingNoteId = null
        document.getElementById('dialog-title').textContent = 'Add new Note'
        titleinput.value = ''
        contentinput.value = ''
    }

    dialog.showModal()
    titleinput.focus()
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light') 
    document.getElementById('theme-toggle-btn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme')
        document.getElementById("theme-toggle-btn").textContent = '☀️'
    }
}

function closeNoteDialog() {
    const close = document.getElementById('note-dialog').close()
}

document.addEventListener('DOMContentLoaded', function() {
    applyStoredTheme()
    notes = loadNotes()
    renderNotes()

    document.getElementById('note-form').addEventListener('submit', saveNote)
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme)

    document.getElementById('note-dialog').addEventListener('click', function(event) {
        if(event.target === this) {
            closeNoteDialog()
        }
    })
})