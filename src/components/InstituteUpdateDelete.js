import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function InstituteUpdateDelete() {
  const [institutes, setInstitutes] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [editInstitute, setEditInstitute] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddInstitute, setShowAddInstitute] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const universitiesResponse = await axios.get(
          "http://localhost:8080/api/universities/getAll"
        );
        setUniversities(universitiesResponse.data);

        const institutesResponse = await axios.get(
          "http://localhost:8080/api/institutes/getAll"
        );
        setInstitutes(institutesResponse.data);
        setFilteredInstitutes(institutesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Arama fonksiyonu
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredInstitutes(institutes);
    } else {
      const filtered = institutes.filter(
        (institute) =>
          institute.name.toLowerCase().includes(query) ||
          institute.university.name.toLowerCase().includes(query)
      );
      setFilteredInstitutes(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/institutes/delete/${id}`);
      alert("Institute deleted successfully!");
      const updatedInstitutes = institutes.filter(
        (inst) => inst.institute_id !== id
      );
      setInstitutes(updatedInstitutes);
      setFilteredInstitutes(updatedInstitutes);
    } catch (error) {
      console.error("Error deleting institute:", error);
      alert("An error occurred while deleting the institute.");
    }
  };

  const handleEdit = (institute) => {
    setEditInstitute({
      ...institute,
      university_id: institute.university.university_id, // Only university_id, not name
      university_name: institute.university.name, // Keep university name to show it in the form
    });
  };

  const handleClose = () => {
    setEditInstitute(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Payload: Send both university_id and university name
      const selectedUniversity = universities.find(
        (uni) => uni.university_id === parseInt(editInstitute.university_id)
      );

      const payload = {
        name: editInstitute.name,
        university: {
          university_id: selectedUniversity.university_id, // Send only university_id
          name: selectedUniversity.name, // Send university_name
        },
      };

      await axios.put(
        `http://localhost:8080/api/institutes/update/${editInstitute.institute_id}`,
        payload
      );
      alert("Institute updated successfully!");

      const response = await axios.get("http://localhost:8080/api/institutes/getAll");
      setInstitutes(response.data);
      setFilteredInstitutes(response.data);
      setEditInstitute(null);
    } catch (error) {
      console.error("Error updating institute:", error);
      alert("An error occurred while updating the institute.");
    }
  };

  const handleAdd = () => {
    setShowAddInstitute(true);
  };

  const handleBackToManage = () => {
    setShowAddInstitute(false);
  };

  const handleAddInstitute = (newInstitute) => {
    setInstitutes((prev) => [...prev, newInstitute]);
    setFilteredInstitutes((prev) => [...prev, newInstitute]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInstitute((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>
      {showAddInstitute ? (
        <InstituteAdd
          onBack={handleBackToManage}
          onAddInstitute={handleAddInstitute}
          universities={universities}
        />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Institutes</h2>
            <button className="add-thesis-button" onClick={handleAdd}>
              Add Institute
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by Institute or University Name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>University</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutes.length > 0 ? (
                filteredInstitutes.map((institute) => (
                  <tr key={institute.institute_id}>
                    <td>{institute.institute_id}</td>
                    <td>{institute.name}</td>
                    <td>{institute.university.name}</td>
                    <td>
                      <button onClick={() => handleEdit(institute)}>Update</button>
                      <button onClick={() => handleDelete(institute.institute_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No institutes found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editInstitute && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update Institute</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editInstitute.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>University:</label>
                    <select
                      name="university_id"
                      value={editInstitute.university_id}
                      onChange={(e) => {
                        const selectedUniversityId = e.target.value;
                        setEditInstitute((prev) => ({
                          ...prev,
                          university_id: parseInt(selectedUniversityId),
                        }));
                      }}
                    >
                      {universities.map((uni) => (
                        <option
                          key={uni.university_id}
                          value={uni.university_id}
                        >
                          {uni.name}
                        </option>
                      ))}
                    </select>
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

function InstituteAdd({ onBack, onAddInstitute, universities }) {
  const [newInstitute, setNewInstitute] = useState({
    name: "",
    university_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstitute((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/institutes/add",
        {
          name: newInstitute.name,
          university: { university_id: parseInt(newInstitute.university_id) },
        }
      );
      alert("Institute added successfully!");
      onAddInstitute(response.data); // Yeni enstitüyü tabloya ekle
      onBack();
    } catch (error) {
      console.error("Error adding institute:", error);
      alert("An error occurred while adding the institute.");
    }
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        Go Back
      </button>
      <h2 className="form-title">Add Institute</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newInstitute.name}
            onChange={handleChange}
            placeholder="Enter Institute Name"
            required
          />
        </div>
        <div className="form-group">
          <label>University:</label>
          <select
            name="university_id"
            value={newInstitute.university_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select University
            </option>
            {universities.map((uni) => (
              <option key={uni.university_id} value={uni.university_id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="form-button">
          Add Institute
        </button>
      </form>
    </div>
  );
}

export default InstituteUpdateDelete;
