import $ from 'jquery';

export default class View {
    constructor() {
        // Get DOM references
        this.noteModal = document.querySelector('#noteModal');
        this.noteForm = noteModal.querySelector('form');
        this.noteContainer = document.querySelector('#noteContainer');

        // Set up event handlers, need to bind to this so handlers have correct scope
        this.noteContainer.addEventListener('click', this.onNoteClick.bind(this));
        this.noteForm.addEventListener('submit', this.onNoteFormSubmit.bind(this));

        // A little jquery to clear the note form when the modal is hidden
        $(this.noteModal).on('hide.bs.modal', () => this.noteForm.reset());
    }

    registerOnEditNoteHandler(handler) {
        this.onEditNoteHandler = handler;
    }

    registerOnNoteSaveHandler(handler) {
        this.onNoteSaveHandler = handler;
    }

    registerOnNoteRemoveHandler(handler) {
        this.onNoteRemoveHandler = handler;
    }

    // Remove note from the DOM
    removeNote(noteId) {
        const noteNode = this.noteContainer.querySelector(`div[data-note-id="${noteId}"`);

        if (noteNode) {
            noteNode.parentElement.remove();
        }
    }

    // Show modal dialog with note populated (or empty if no note)
    showNoteDialog(note) {
        if (note) {
            this.noteForm.noteId.value = note._id;
            this.noteForm.noteTitle.value = note.title;
            this.noteForm.noteContent.value = note.content;
        }

        // jquery to show dialog
        $(this.noteModal).modal('show');
    }

    // Hides note dialog
    hideNoteDialog() {
        $(this.noteModal).modal('hide');
    }

    // Clear the screen and display the notes
    renderNoteList(notes) {
        this.noteContainer.innerHTML = '';

        for (let note of notes) {
            this.noteContainer.append(this.createNoteNode(note));
        }
    }

    // Append a new note to the DOM or replace an existing note
    renderNote(note) {
        const noteNode = this.createNoteNode(note);
        const existingNode = this.noteContainer.querySelector(`div[data-note-id="${note._id}"]`);

        existingNode ? existingNode.parentElement.replaceWith(nodeNode) : this.noteContainer.prepend(noteNode);
    }

    createNoteNode(note) {
        const noteNode = document.createElement('div');

        noteNode.className = 'col col-sm-2 col-md-4 pb-4';
        noteNode.innerHTML = `
            <div data-note-id="${note._id}" class="note bg-postit-yellow shadow m-3">
                <div class="note-header d-flex justify-content-between">
                    <h2 class="note-title">${note.title}</h2>
                   <button type="button" class="btn btn-delete">&times;</button>
                </div>
                <div class="note-content">${note.content}</div>
                <div class="controls">
                   <button type="button" class="btn btn-edit">edit</button>
                </div>
            </div>`;

        return noteNode;
    }

    onNoteClick(event) {
        const noteNode = event.target.closest('.note');

        // We are note sure where the note was clicked at this point, have to investigate
        if (event.target.matches('.btn-delete')) {
            this.onNoteRemoveHandler(noteNode.dataset.noteId);
        } else if (event.target.matches('.btn-edit')) {
            this.onEditNoteHandler(noteNode.dataset.noteId);
        }
    }

    onNoteFormSubmit(event) {
        event.preventDefault();

        // Prepare the data for the registered handler
        const data = {
            title: this.noteForm.noteTitle.value,
            content: this.noteForm.noteContent.value
        };

        this.onNoteSaveHandler(data, this.noteForm.dataset.noteId);
    }
}