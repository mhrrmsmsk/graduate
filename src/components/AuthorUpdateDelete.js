import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthorAdd from "./AuthorAdd";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AuthorUpdateDelete() {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [editAuthor, setEditAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({ name: "", surname: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Tüm yazarları yükleme
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/authors/getAll");
        setAuthors(response.data);
        setFilteredAuthors(response.data);
      } catch (err) {
        setError(err.message || "Error fetching authors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  // Yazar arama işlemi
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(
        (author) =>
          author.name.toLowerCase().includes(query) ||
          author.surname.toLowerCase().includes(query)
      );
      setFilteredAuthors(filtered);
    }
  };

  // Yazar ekleme formunu aç/kapat
  const [showAddAuthor, setShowAddAuthor] = useState(false);

  // Yazar silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/authors/delete/${id}`);
      alert("Author successfully deleted!");
      setAuthors(authors.filter((author) => author.authorID !== id));
      setFilteredAuthors(filteredAuthors.filter((author) => author.authorID !== id));
    } catch (err) {
      console.error("Error deleting author:", err.response?.data || err.message);
      alert("An error occurred while deleting the author.");
    }
  };

  // Yazar düzenleme formunu aç
  const handleEdit = (author) => {
    setEditAuthor(author);
  };

  // Güncelleme işlemi
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/authors/update/${editAuthor.authorID}`,
        editAuthor
      );
      alert("Author successfully updated!");
      setAuthors(
        authors.map((author) =>
          author.authorID === editAuthor.authorID ? response.data : author
        )
      );
      setFilteredAuthors(
        filteredAuthors.map((author) =>
          author.authorID === editAuthor.authorID ? response.data : author
        )
      );
      setEditAuthor(null);
    } catch (err) {
      console.error("Error updating author:", err.response?.data || err.message);
      alert("An error occurred while updating the author.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      <h2 className="form-title">Manage Authors</h2>
      <button className="add-thesis-button" onClick={() => setShowAddAuthor(true)}>
        Add Author
      </button>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Name or Surname"
          className="search-bar"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <table className="thesis-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map((author) => (
              <tr key={author.authorID}>
                <td>{author.authorID}</td>
                <td>{author.name}</td>
                <td>{author.surname}</td>
                <td>
                  <button onClick={() => handleEdit(author)}>Update</button>
                  
                  <button onClick={() => handleDelete(author.authorID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No authors found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editAuthor && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Author</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editAuthor.name}
                  onChange={(e) =>
                    setEditAuthor({ ...editAuthor, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Surname:</label>
                <input
                  type="text"
                  value={editAuthor.surname}
                  onChange={(e) =>
                    setEditAuthor({ ...editAuthor, surname: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="form-button">
                Save
              </button>
              <button
                type="button"
                className="form-button cancel"
                onClick={() => setEditAuthor(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddAuthor && (
        <AuthorAdd
          onClose={() => setShowAddAuthor(false)}
          onAdd={(newAuthor) => setAuthors([...authors, newAuthor])}
        />
      )}
    </div>
  );
}

export default AuthorUpdateDelete;
