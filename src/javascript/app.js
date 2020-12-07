import '../scss/main.scss';
import 'bootstrap';
import JsonBox from './jsonbox';
import View from './view';

/**
 * Get a new jsonbox URL before you demo.
 * Second parameter is name of collection. I decided to store all my notes under the "notes" collection.
 */
const store = new JsonBox('your jsonbox url here', 'notes');

// Register handlers with the view instance
const view = new View();
view.registerOnEditNoteHandler(openNote);
view.registerOnNoteRemoveHandler(removeNote);
view.registerOnNoteSaveHandler(saveNote);

// Load & display all the notes when first arriving
loadNotes();

// Main application functions which call upon jsonbox and the view to accomplish the task
async function saveNote(data, noteId) {
    let note = null;

    if (!noteId) {
        note = await store.add(data);
    } else {
        await store.update(noteId, data);
        note = await store.ofId(noteId);
    }

    view.hideNoteDialog();
    view.renderNote(note);
}

async function openNote(noteId) {
    const note = await store.ofId(noteId);
    view.showNoteDialog(note);
}

async function removeNote(noteId) {
    await store.delete(noteId);
    view.removeNote(noteId);
}

async function loadNotes() {
    const notes = await store.all();
    view.renderNoteList(notes);
}