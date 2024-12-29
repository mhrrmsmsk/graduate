import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function KeywordUpdateDelete() {
  const [keywords, setKeywords] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editKeyword, setEditKeyword] = useState(null);
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const navigate = useNavigate();

  // Fetch all keywords from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/keywords/getAll");
        setKeywords(response.data);
        setFilteredKeywords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Search function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredKeywords(keywords);
    } else {
      const filtered = keywords.filter(
        (keyword) => keyword.keyword.toLowerCase().includes(query)
      );
      setFilteredKeywords(filtered);
    }
  };

  // Delete keyword
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/keywords/delete/${id}`);
      alert("Keyword deleted successfully!");
      const updatedKeywords = keywords.filter(
        (keyword) => keyword.keyword_id !== id
      );
      setKeywords(updatedKeywords);
      setFilteredKeywords(updatedKeywords);
    } catch (error) {
      console.error("Error deleting keyword:", error);
      alert("An error occurred while deleting the keyword.");
    }
  };

  // Edit keyword
  const handleEdit = (keyword) => {
    setEditKeyword({
      ...keyword,
      keyword_id: keyword.keyword_id, // Ensure keyword_id is included
    });
  };

  // Close the modal
  const handleClose = () => {
    setEditKeyword(null);
  };

  // Update keyword
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        keyword: editKeyword.keyword,
      };

      await axios.put(
        `http://localhost:8080/api/keywords/update/${editKeyword.keyword_id}`,
        payload
      );
      alert("Keyword updated successfully!");

      const response = await axios.get("http://localhost:8080/api/keywords/getAll");
      setKeywords(response.data);
      setFilteredKeywords(response.data);
      setEditKeyword(null);
    } catch (error) {
      console.error("Error updating keyword:", error);
      alert("An error occurred while updating the keyword.");
    }
  };

  // Add keyword
  const handleAdd = () => {
    setShowAddKeyword(true);
  };

  // Go back to manage keywords
  const handleBackToManage = () => {
    setShowAddKeyword(false);
  };

  const handleAddKeyword = (newKeyword) => {
    setKeywords((prev) => [...prev, newKeyword]);
    setFilteredKeywords((prev) => [...prev, newKeyword]);
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      {showAddKeyword ? (
        <KeywordAdd
          onBack={handleBackToManage}
          onAddKeyword={handleAddKeyword}
        />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Keywords</h2>
            <button className="add-thesis-button" onClick={handleAdd}>
              Add Keyword
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by Keyword"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th> {/* Make sure the ID column is present */}
                <th>Keyword</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((keyword) => (
                  <tr key={keyword.keyword_id}>
                    <td>{keyword.keyword_id}</td> {/* Show the ID here */}
                    <td>{keyword.keyword}</td>
                    <td>
                      <button onClick={() => handleEdit(keyword)}>Update</button>
                      <button onClick={() => handleDelete(keyword.keyword_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No keywords found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editKeyword && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update Keyword</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Keyword:</label>
                    <input
                      type="text"
                      name="keyword"
                      value={editKeyword.keyword}
                      onChange={(e) => setEditKeyword({ ...editKeyword, keyword: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="form-button">
                    Save
                  </button>
                  <button type="button" className="form-button cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function KeywordAdd({ onBack, onAddKeyword }) {
  const [newKeyword, setNewKeyword] = useState({
    keyword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewKeyword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/keywords/add",
        newKeyword
      );
      alert("Keyword added successfully!");
      onAddKeyword(response.data); // Add new keyword to the table
      onBack();
    } catch (error) {
      console.error("Error adding keyword:", error);
      alert("An error occurred while adding the keyword.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        Go Back
      </button>
      <h2 className="form-title">Add Keyword</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Keyword:</label>
          <input
            type="text"
            name="keyword"
            value={newKeyword.keyword}
            onChange={handleChange}
            placeholder="Enter Keyword"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Add Keyword
        </button>
      </form>
    </div>
  );
}

export default KeywordUpdateDelete;
