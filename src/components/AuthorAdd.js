import React, { useState } from "react";
import axios from "axios";

function AuthorAdd({ onClose, onAdd }) {
  const [newAuthor, setNewAuthor] = useState({ name: "", surname: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/authors/add",
        newAuthor,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Author successfully added!");
      onAdd(response.data);
      onClose();
    } catch (err) {
      setError(err.message || "Error adding author.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Author</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newAuthor.name}
              onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Surname:</label>
            <input
              type="text"
              value={newAuthor.surname}
              onChange={(e) => setNewAuthor({ ...newAuthor, surname: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="form-button">
            Add
          </button>
          <button
            type="button"
            className="form-button cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthorAdd;
