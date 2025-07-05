import { TrashIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

function App() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["notes"], (result) => {
        setNotes(result.notes || []);
      });
    }
  }, []);

  const saveNote = () => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteText.trim(),
      date: new Date().toLocaleDateString(),
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["notes"], (result) => {
        const updateNotes = [newNote, ...(result.notes || [])];
        chrome.storage.sync.set({ notes: updateNotes }, () => {
          setNoteText("");
          setNotes(updateNotes);
        });
      });
    }
  };
  const deleteNote = (id) => {
    chrome.storage.sync.get(["notes"], (result) => {
      const filtered = (result.notes || []).filter((n) => n.id !== id);
      chrome.storage.sync.set({ notes: filtered }, () => setNotes(filtered));
    });
  };

  return (
    <div className="min-w-[400px] p-2 space-y-2 bg-gray-50 text-gray-900 shadow-sm overflow-y-auto">
      <h1 className="text-lg font-bold text-center my-4">Quick Notes</h1>
      <input
        type="text"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Type your note..."
        className="block w-full p-2 text-gray-900 border border-gray-900 rounded-xl bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
      />
      <button
        type="button"
        onClick={saveNote}
        disabled={!noteText.trim()}
        className={`w-full py-2 text-sm font-medium rounded-xl text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 my-2 focus:ring-purple-300 transition duration-300 ${
          !noteText.trim() ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Save Note
      </button>
      <hr className="text-gray-200 my-4" />

      {notes.length === 0 ? (
        <p className="text-center text-gray-500 my-2 italic text-sm">
          No notes found.
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white px-5 py-3 border-l-4 border-purple-700 rounded-xl relative shadow-sm"
            >
              <p className="text-md break-words my-2">{note.text}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {note.date || "No date"}
              </span>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-1 right-1 ring-red-600 hover:text-purple-500 cursor-pointer transition duration-200 "
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;