import React, { useState, useEffect } from "react";
import axios from "axios";
import ThesisAdd from "./ThesisAdd"; // Add Thesis bileşenini ekliyoruz.
import "../App.css";
import { useNavigate } from "react-router-dom";

function ThesisUpdateDelete() {
  const [theses, setTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [editThesis, setEditThesis] = useState(null); // Düzenlenecek tez için state
  const [authors, setAuthors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [languages] = useState(["English", "Turkish", "German", "French"]);
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu için state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddThesis, setShowAddThesis] = useState(false); // Add Thesis sayfasını açmak için
  const navigate = useNavigate(); // Yönlendirme için hook
  // Dropdown ve tez verilerini yükleme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authorsResponse = await axios.get(
          "http://localhost:8080/api/authors/getAll"
        );
        const universitiesResponse = await axios.get(
          "http://localhost:8080/api/universities/getAll"
        );
        const institutesResponse = await axios.get(
          "http://localhost:8080/api/institutes/getAll"
        );
        const thesesResponse = await axios.get(
          "http://localhost:8080/api/thesis/getAll"
        );

        setAuthors(authorsResponse.data);
        setUniversities(universitiesResponse.data);
        setInstitutes(institutesResponse.data);

        const thesisData = thesesResponse.data.data || [];
        setTheses(thesisData);
        setFilteredTheses(thesisData);
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const thesisSupervisorResponse = await axios.get(
          `http://localhost:8080/api/thesisSupervisors/get/${editThesis.thesisNo}`
        );

        // Get the supervisor associated with this thesis
        const supervisorResponseByID = await axios.get(
          `http://localhost:8080/api/supervisors/get/${thesisSupervisorResponse.data.supervisorID}`
        );

        // Fetch all supervisors to display in the select dropdown
        const supervisorResponse = await axios.get(
          `http://localhost:8080/api/supervisors/getAll`
        );

        // Check if the supervisor response is an array, otherwise set it as an array
        const supervisorData = Array.isArray(supervisorResponse.data) ? supervisorResponse.data : [supervisorResponse.data];

        // Set the supervisors list and the selected supervisor if available
        setSupervisors(supervisorData);
        if (thesisSupervisorResponse.data.supervisorID) {
          setEditThesis((prev) => ({
            ...prev,
            supervisor: {
              supervisorID: thesisSupervisorResponse.data.supervisorID,
              name: supervisorResponseByID.data.name,  // You can also add more details as needed
            },
          }));
        }
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editThesis]);


  // Tez silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/thesis/delete/${id}`);
      alert("Thesis successfully deleted!");
      const updatedTheses = theses.filter((thesis) => thesis.thesisNo !== id);
      setTheses(updatedTheses);
      setFilteredTheses(updatedTheses);
    } catch (err) {
      console.error("Error deleting thesis:", err.response?.data || err.message);
      alert("An error occurred while deleting the thesis.");
    }
  };

  // Tez güncelleme formunu aç
  const handleEdit = (thesis) => {
    setEditThesis({ ...thesis });
    const filtered = institutes.filter(
      (institute) =>
        institute.university.university_id ===
        parseInt(thesis.university.university_id)
    );
    setFilteredInstitutes(filtered);
  };

  // Güncelleme formunu kapat
  const handleClose = () => {
    setEditThesis(null);  // Formu sıfırlayarak kapatır
  };

  // Güncelleme işlemi
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Prepare the payload with the updated thesis data
      const payload = {
        ...editThesis,
        university: { university_id: parseInt(editThesis.university.university_id) },
        author: { authorID: parseInt(editThesis.author.authorID) },
        institute: { institute_id: parseInt(editThesis.institute.institute_id) },
      };
      const thesisPayload = {
        thesisNo: editThesis.thesisNo,
        supervisorID: parseInt(editThesis.supervisor.supervisorID),
      };

      // Send the update request to the server
      const response = await axios.put(
        `http://localhost:8080/api/thesis/update/${editThesis.thesisNo}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const thesisSupervisorResponse = await axios.put(
        `http://localhost:8080/api/thesisSupervisors/update/${editThesis.thesisNo}`, thesisPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      alert("Thesis successfully updated!");

      // Get the updated thesis list after the update
      const thesesResponse = await axios.get("http://localhost:8080/api/thesis/getAll");
      const thesisData = thesesResponse.data.data || [];

      // Replace the updated thesis in the list
      const updatedTheses = thesisData.map((thesis) =>
        thesis.thesisNo === response.data.thesisNo ? response.data : thesis
      );

      setTheses(updatedTheses);
      setFilteredTheses(updatedTheses);

    } catch (err) {
      console.error("Error updating thesis:", err.response?.data || err.message);
      alert("An error occurred while updating the thesis.");
    }
  };

  // Form değişikliklerini işleme
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Eğer 'supervisor' alanı güncelleniyorsa, supervisor'ı da güncelleyerek formu set et
    if (name === "supervisor") {
      setEditThesis((prevState) => ({
        ...prevState,
        supervisor: {
          supervisorID: value,  // Yeni supervisorID'yi al
        },
      }));
    } else {
      setEditThesis((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Arama sorgusunu işleme
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredTheses(theses);
    } else {
      const filtered = theses.filter((thesis) => {
        return (
          thesis.title.toLowerCase().includes(query) ||
          `${thesis.author.name} ${thesis.author.surname}`
            .toLowerCase()
            .includes(query) ||
          String(thesis.numberOfPages).includes(query) ||
          String(thesis.year).includes(query) ||
          thesis.language.toLowerCase().includes(query) ||
          thesis.university.name.toLowerCase().includes(query) ||
          thesis.institute.name.toLowerCase().includes(query) ||
          String(thesis.thesisNo).includes(query)
        );
      });
      setFilteredTheses(filtered);
    }
  };

  // Add Thesis butonuna tıklandığında
  const handleAddThesis = () => {
    setShowAddThesis(true);
  };

  // Manage Theses sayfasına geri dönmek için
  const handleBackToManage = () => {
    setShowAddThesis(false);
    axios.get("http://localhost:8080/api/thesis/getAll").then((response) => {
      const thesisData = response.data.data || [];
      setTheses(thesisData);
      setFilteredTheses(thesisData);
    });
  };

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        Go Back
      </button>

      {showAddThesis ? (
        <ThesisAdd onBack={handleBackToManage} />
      ) : (
        <>
          <div className="header">
            <h2 className="form-title">Manage Theses</h2>
            <button
              className="add-thesis-button"
              onClick={handleAddThesis}
            >
              Add Thesis
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by ID, Title, Author, Pages, Year, Language, University, or Institute"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <table className="thesis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Pages</th>
                <th>Year</th>
                <th>Language</th>
                <th>University</th>
                <th>Institute</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTheses.length > 0 ? (
                filteredTheses.map((thesis) => (
                  <tr key={thesis.thesisNo}>
                    <td>{thesis.thesisNo}</td>
                    <td>{thesis.title}</td>
                    <td>{`${thesis.author.name} ${thesis.author.surname}`}</td>
                    <td>{thesis.numberOfPages}</td>
                    <td>{thesis.year}</td>
                    <td>{thesis.language}</td>
                    <td>{thesis.university.name}</td>
                    <td>{thesis.institute.name}</td>
                    <td>
                      <button onClick={() => handleEdit(thesis)}>Update</button>
                      <button onClick={() => handleDelete(thesis.thesisNo)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No theses found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {editThesis && (
            <div className="modal">
              <div className="modal-content">
                <h2>Update Thesis</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={editThesis.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Abstract:</label>
                    <textarea
                      name="abstractText"
                      value={editThesis.abstractText}
                      onChange={handleChange}
                      style={{ resize: "both" }} // Genişletilebilir hale getirildi
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Year:</label>
                    <input
                      type="number"
                      name="year"
                      value={editThesis.year}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Pages:</label>
                    <input
                      type="number"
                      name="numberOfPages"
                      value={editThesis.numberOfPages}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Language:</label>
                    <select
                      name="language"
                      value={editThesis.language}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Language
                      </option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Submission Date:</label>
                    <input
                      type="date"
                      name="submissionDate"
                      value={editThesis.submissionDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>University:</label>
                    <select
                      name="university"
                      value={editThesis?.university?.university_id || ""}  // Safely access university_id, default to empty string if undefined
                      onChange={(e) => {
                        const selectedUniversityId = e.target.value;
                        handleChange(e);
                        const filtered = institutes.filter(
                          (institute) =>
                            institute.university.university_id === parseInt(selectedUniversityId)
                        );
                        setFilteredInstitutes(filtered);
                      }}
                    >
                      {universities?.map((uni) => (  // Optional chaining for universities array
                        <option key={uni.university_id} value={uni.university_id}>
                          {uni.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Institute:</label>
                    <select
                      name="institute"
                      value={editThesis?.institute?.institute_id || ""}  // Safely access institute_id, fallback to empty string if undefined
                      onChange={handleChange}
                    >
                      {filteredInstitutes?.map((institute) => (  // Optional chaining for filteredInstitutes array
                        <option
                          key={institute.institute_id}
                          value={institute.institute_id}
                        >
                          {institute.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Author:</label>
                    <select
                      name="author"
                      value={editThesis?.author?.authorID || ""} // Use optional chaining and fallback to empty string
                      onChange={handleChange}
                    >
                      {authors?.map((author) => (  // Safely map over authors using optional chaining
                        <option key={author.authorID} value={author.authorID}>
                          {`${author.name} ${author.surname}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Supervisor:</label>
                    <select
                      name="supervisor"  // supervisor alanını takip etmek için 'name' kullanılıyor
                      value={editThesis?.supervisor?.supervisorID || ""} // Eğer supervisor varsa, supervisorID'yi ata
                      onChange={handleChange}  // handleChange fonksiyonu ile seçilen değeri güncelle
                    >
                      {supervisors?.map((supervisor) => (
                        <option key={supervisor.supervisorID} value={supervisor.supervisorID}>
                          {`${supervisor.name} ${supervisor.surname}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="form-button">
                    Save
                  </button>
                  <button
                    type="button"
                    className="form-button cancel"
                    onClick={handleClose}
                  >
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

export default ThesisUpdateDelete;
