import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function SubjectTopicUpdateDelete() {
  const [subjectTopics, setSubjectTopics] = useState([]);
  const [filteredSubjectTopics, setFilteredSubjectTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSubjectTopic, setEditSubjectTopic] = useState(null);
  const [showAddSubjectTopic, setShowAddSubjectTopic] = useState(false);
  const navigate = useNavigate();

  // Fetch all subject topics from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/subjectTopics/getAll");
        setSubjectTopics(response.data);
        setFilteredSubjectTopics(response.data);
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
      setFilteredSubjectTopics(subjectTopics);
    } else {
      const filtered = subjectTopics.filter(
        (subjectTopic) =>
          subjectTopic.name.toLowerCase().includes(query)
      );
      setFilteredSubjectTopics(filtered);
    }
  };

  // Delete subject topic
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/subjectTopics/delete/${id}`);
      alert("Subject Topic deleted successfully!");
      const updatedSubjectTopics = subjectTopics.filter(
        (topic) => topic.subject_id !== id
      );
      setSubjectTopics(updatedSubjectTopics);
      setFilteredSubjectTopics(updatedSubjectTopics);
    } catch (error) {
      console.error("Error deleting subject topic:", error);
      alert("An error occurred while deleting the subject topic.");
    }
  };

  // Edit subject topic
  const handleEdit = (subjectTopic) => {
    setEditSubjectTopic({
      ...subjectTopic,
      subject_id: subjectTopic.subject_id, // Ensure subject_id is included
    });
  };

  // Close the modal
  const handleClose = () => {
    setEditSubjectTopic(null);
  };

  // Update subject topic
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editSubjectTopic.name,
      };

      await axios.put(
        `http://localhost:8080/api/subjectTopics/update/${editSubjectTopic.subject_id}`,
        payload
      );
      alert("Subject Topic updated successfully!");

      const response = await axios.get("http://localhost:8080/api/subjectTopics/getAll");
      setSubjectTopics(response.data);
      setFilteredSubjectTopics(response.data);
      setEditSubjectTopic(null);
    } catch (error) {
      console.error("Error updating subject topic:", error);
      alert("An error occurred while updating the subject topic.");
    }
  };

  // Add subject topic
  const handleAdd = () => {
    setShowAddSubjectTopic(true);
  };

  // Go back to manage subject topics
  const handleBackToManage = () => {
    setShowAddSubjectTopic(false);
  };

  const handleAddSubjectTopic = (newSubjectTopic) => {
    setSubjectTopics((prev) => [...prev, newSubjectTopic]);
    setFilteredSubjectTopics((prev) => [...prev, newSubjectTopic]);
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      {showAddSubjectTopic ? (
        <SubjectTopicAdd
          onBack={handleBackToManage}
          onAddSubjectTopic={handleAddSubjectTopic}
        />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Subject Topics</h2>
            <button className="add-thesis-button" onClick={handleAdd}>
              Add Subject Topic
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by Subject Topic Name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th> {/* Make sure the ID column is present */}
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjectTopics.length > 0 ? (
                filteredSubjectTopics.map((subjectTopic) => (
                  <tr key={subjectTopic.subject_id}>
                    <td>{subjectTopic.subject_id}</td> {/* Show the ID here */}
                    <td>{subjectTopic.name}</td>
                    <td>
                      <button onClick={() => handleEdit(subjectTopic)}>Update</button>
                      <button onClick={() => handleDelete(subjectTopic.subject_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No subject topics found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editSubjectTopic && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update Subject Topic</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editSubjectTopic.name}
                      onChange={(e) => setEditSubjectTopic({ ...editSubjectTopic, name: e.target.value })}
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

function SubjectTopicAdd({ onBack, onAddSubjectTopic }) {
  const [newSubjectTopic, setNewSubjectTopic] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubjectTopic((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/subjectTopics/add",
        newSubjectTopic
      );
      alert("Subject Topic added successfully!");
      onAddSubjectTopic(response.data); // Add new subject topic to the table
      onBack();
    } catch (error) {
      console.error("Error adding subject topic:", error);
      alert("An error occurred while adding the subject topic.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        Go Back
      </button>
      <h2 className="form-title">Add Subject Topic</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newSubjectTopic.name}
            onChange={handleChange}
            placeholder="Enter Subject Topic Name"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Add Subject Topic
        </button>
      </form>
    </div>
  );
}

export default SubjectTopicUpdateDelete;
