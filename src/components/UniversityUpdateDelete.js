import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function UniversityUpdateDelete() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [editUniversity, setEditUniversity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/universities/getAll");
        setUniversities(response.data);
        setFilteredUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((university) =>
        university.name.toLowerCase().includes(query)
      );
      setFilteredUniversities(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/universities/delete/${id}`);
      alert("University deleted successfully!");
      const updatedUniversities = universities.filter((uni) => uni.university_id !== id);
      setUniversities(updatedUniversities);
      setFilteredUniversities(updatedUniversities);
    } catch (error) {
      console.error("Error deleting university:", error);
      alert("An error occurred while deleting the university.");
    }
  };

  const handleEdit = (university) => {
    setEditUniversity({ ...university });
  };

  const handleClose = () => {
    setEditUniversity(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/universities/update/${editUniversity.university_id}`,
        editUniversity
      );
      alert("University updated successfully!");

      const response = await axios.get("http://localhost:8080/api/universities/getAll");
      setUniversities(response.data);
      setFilteredUniversities(response.data);
      setEditUniversity(null);
    } catch (error) {
      console.error("Error updating university:", error);
      alert("An error occurred while updating the university.");
    }
  };

  const handleAdd = () => {
    setShowAddUniversity(true);
  };

  const handleBackToManage = () => {
    setShowAddUniversity(false);
  };

  const handleAddUniversity = (newUniversity) => {
    setUniversities((prev) => [...prev, newUniversity]);
    setFilteredUniversities((prev) => [...prev, newUniversity]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUniversity((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      {showAddUniversity ? (
        <UniversityAdd onBack={handleBackToManage} onAddUniversity={handleAddUniversity} />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Universities</h2>
            <button className="add-thesis-button" onClick={handleAdd}>
              Add University
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by University Name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((university) => (
                  <tr key={university.university_id}>
                    <td>{university.university_id}</td>
                    <td>{university.name}</td>
                    <td>
                      <button onClick={() => handleEdit(university)}>Update</button>
                      <button onClick={() => handleDelete(university.university_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No universities found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editUniversity && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update University</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editUniversity.name}
                      onChange={handleChange}
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

function UniversityAdd({ onBack, onAddUniversity }) {
  const [newUniversity, setNewUniversity] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUniversity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/universities/add", newUniversity);
      alert("University added successfully!");
      onAddUniversity(response.data); // Yeni üniversiteyi tabloya ekle
      onBack();
    } catch (error) {
      console.error("Error adding university:", error);
      alert("An error occurred while adding the university.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        Go Back
      </button>
      <h2 className="form-title">Add University</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newUniversity.name}
            onChange={handleChange}
            placeholder="Enter University Name"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Add University
        </button>
      </form>
    </div>
  );
}

export default UniversityUpdateDelete;
