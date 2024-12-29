import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function SupervisorUpdateDelete() {
  const [supervisors, setSupervisors] = useState([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSupervisor, setEditSupervisor] = useState(null);
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const navigate = useNavigate();

  // Get all supervisors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supervisorsResponse = await axios.get(
          "http://localhost:8080/api/supervisors/getAll"
        );
        setSupervisors(supervisorsResponse.data);
        setFilteredSupervisors(supervisorsResponse.data);
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
      setFilteredSupervisors(supervisors);
    } else {
      const filtered = supervisors.filter(
        (supervisor) =>
          supervisor.name.toLowerCase().includes(query) ||
          supervisor.surname.toLowerCase().includes(query)
      );
      setFilteredSupervisors(filtered);
    }
  };

  // Delete supervisor
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/supervisors/delete/${id}`);
      alert("Supervisor deleted successfully!");
      const updatedSupervisors = supervisors.filter(
        (supervisor) => supervisor.supervisorID !== id
      );
      setSupervisors(updatedSupervisors);
      setFilteredSupervisors(updatedSupervisors);
    } catch (error) {
      console.error("Error deleting supervisor:", error);
      alert("An error occurred while deleting the supervisor.");
    }
  };

  // Edit supervisor
  const handleEdit = (supervisor) => {
    setEditSupervisor({
      ...supervisor,
      supervisorID: supervisor.supervisorID, // Ensure supervisorID is included
    });
  };

  // Close the modal
  const handleClose = () => {
    setEditSupervisor(null);
  };

  // Update supervisor
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editSupervisor.name,
        surname: editSupervisor.surname,
      };

      // Ensure supervisorID is part of the payload
      await axios.put(
        `http://localhost:8080/api/supervisors/update/${editSupervisor.supervisorID}`,
        payload
      );
      alert("Supervisor updated successfully!");

      const response = await axios.get("http://localhost:8080/api/supervisors/getAll");
      setSupervisors(response.data);
      setFilteredSupervisors(response.data);
      setEditSupervisor(null);
    } catch (error) {
      console.error("Error updating supervisor:", error);
      alert("An error occurred while updating the supervisor.");
    }
  };

  // Add supervisor
  const handleAdd = () => {
    setShowAddSupervisor(true);
  };

  // Go back to manage supervisors
  const handleBackToManage = () => {
    setShowAddSupervisor(false);
  };

  const handleAddSupervisor = (newSupervisor) => {
    setSupervisors((prev) => [...prev, newSupervisor]);
    setFilteredSupervisors((prev) => [...prev, newSupervisor]);
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      {showAddSupervisor ? (
        <SupervisorAdd
          onBack={handleBackToManage}
          onAddSupervisor={handleAddSupervisor}
        />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Supervisors</h2>
            <button className="add-thesis-button" onClick={handleAdd}>
              Add Supervisor
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by Supervisor Name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th> {/* Add Supervisor ID */}
                <th>Name</th>
                <th>Surname</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSupervisors.length > 0 ? (
                filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.supervisorID}>
                    <td>{supervisor.supervisorID}</td> {/* Display Supervisor ID */}
                    <td>{supervisor.name}</td>
                    <td>{supervisor.surname}</td>
                    <td>
                      <button onClick={() => handleEdit(supervisor)}>Update</button>
                      <button onClick={() => handleDelete(supervisor.supervisorID)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No supervisors found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editSupervisor && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update Supervisor</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editSupervisor.name}
                      onChange={(e) => setEditSupervisor({ ...editSupervisor, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Surname:</label>
                    <input
                      type="text"
                      name="surname"
                      value={editSupervisor.surname}
                      onChange={(e) => setEditSupervisor({ ...editSupervisor, surname: e.target.value })}
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

function SupervisorAdd({ onBack, onAddSupervisor }) {
  const [newSupervisor, setNewSupervisor] = useState({
    name: "",
    surname: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupervisor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/supervisors/add",
        newSupervisor
      );
      alert("Supervisor added successfully!");
      onAddSupervisor(response.data); // Add new supervisor to the table
      onBack();
    } catch (error) {
      console.error("Error adding supervisor:", error);
      alert("An error occurred while adding the supervisor.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        Go Back
      </button>
      <h2 className="form-title">Add Supervisor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newSupervisor.name}
            onChange={handleChange}
            placeholder="Enter Supervisor Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={newSupervisor.surname}
            onChange={handleChange}
            placeholder="Enter Supervisor Surname"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Add Supervisor
        </button>
      </form>
    </div>
  );
}

export default SupervisorUpdateDelete;
