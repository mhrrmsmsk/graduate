import React, { useState, useEffect } from "react";
import axios from "axios";
import ThesisUpdateDelete from "./ThesisUpdateDelete"; // ThesisUpdateDelete bileşeni import edilir
import "../App.css";

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ThesisAdd() {
  const [newThesis, setNewThesis] = useState({
    title: "",
    abstractText: "",
    year: "",
    type: "",
    numberOfPages: "",
    language: "",
    submissionDate: "",
    university: "",
    author: "",
    institute: "",
  });

  const [newThesisSupervisor, setNewThesisSupervisor] = useState({
    thesisNo: "",
    supervisors: "",
    is_co_supervisor: false,
  });
  const [newThesisKeyword, setNewThesisKeyword] = useState({
    thesisNo: "",
    keywords: "",
  });

  const [newThesisSubjectTopics, setNewSubjectTopics] = useState({
    thesisNo:"",
    subjects:""
  })

  const [authors, setAuthors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [languages] = useState(["English", "Turkish", "German", "French"]);
  const [types] = useState([
    "Master",
    "Doctorate",
    "Specialization in Medicine",
    "Proficiency in Art",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManageTheses, setShowManageTheses] = useState(false); // Yönetim ekranını gösterme durumu

  // Dropdown verilerini yükleme
  useEffect(() => {
    const fetchDropdownData = async () => {
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


        setAuthors(authorsResponse.data);
        setUniversities(universitiesResponse.data);
        setInstitutes(institutesResponse.data);
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSupervisorData = async () => {
      try {
        setLoading(true)
        const supervisorResponse = await axios.get("http://localhost:8080/api/supervisors/getAll");
        setSupervisors(supervisorResponse.data)
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchKeywordData = async () => {
      try {
        setLoading(true);
        const keywordResponse = await axios.get("http://localhost:8080/api/keywords/getAll");

        console.log("API Response: ", keywordResponse.data); // API yanıtını konsola yazdırıyoruz

        if (Array.isArray(keywordResponse.data)) {
          setKeywords(keywordResponse.data);  // keywords state'ini güncelliyoruz
        } else {
          console.error("Expected an array of keywords, but received:", keywordResponse.data);
          setKeywords([]);  // Eğer veri yanlış formatta ise, boş dizi atanır
        }
      } catch (err) {
        console.error("Error fetching keywords:", err);
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        const subjectResponse = await axios.get("http://localhost:8080/api/subjectTopics/getAll");
        setSubjects(subjectResponse.data);
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };


    fetchSubjectData();
    fetchKeywordData();
    fetchDropdownData();
    fetchSupervisorData();
  }, []);



  // Üniversite seçildiğinde bağlı enstitüleri filtrele
  const handleUniversityChange = (e) => {
    const selectedUniversityId = e.target.value;
    setNewThesis((prevState) => ({
      ...prevState,
      university: selectedUniversityId,
      institute: "", // Enstitü seçim alanını sıfırla
    }));

    // Enstitüleri filtrele
    const filtered = institutes.filter(
      (institute) =>
        institute.university.university_id === parseInt(selectedUniversityId)
    );
    setFilteredInstitutes(filtered);
  };

  // Tez ekleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare thesis data payload
      const payload = {
        title: newThesis.title,
        abstractText: newThesis.abstractText,
        year: parseInt(newThesis.year),
        type: newThesis.type,
        numberOfPages: parseInt(newThesis.numberOfPages),
        language: newThesis.language,
        submissionDate: newThesis.submissionDate,
        university: { university_id: parseInt(newThesis.university) },
        author: { authorID: parseInt(newThesis.author) },
        institute: { institute_id: parseInt(newThesis.institute) },
      };

      // Send request to create thesis and get thesisNo
      const thesisResponse = await axios.post("http://localhost:8080/api/thesis/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Get the thesisNo from the created thesis response
      const thesisNo = thesisResponse.data.thesisNo;
      console.log(thesisResponse); // Debug log to check the thesisNo


      await wait(1000);
      // Prepare thesis supervisor payload
      const thesisSupervisorPayload = {
        thesisNo: thesisNo, // thesisNo from the created thesis
        supervisorID: parseInt(newThesisSupervisor.supervisors), // supervisorID now correctly passed
        is_co_supervisor: newThesisSupervisor.is_co_supervisor, // false by default
      };

      console.log(thesisSupervisorPayload);  // Debug log to check the supervisor payload
      // Send request to add thesis supervisor
      await axios.post("http://localhost:8080/api/thesisSupervisors/add", thesisSupervisorPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await wait(1000);
      const thesisKeywordPayload = {
        thesisNo:thesisNo,
        keyword_id: parseInt(newThesisKeyword.keywords)
      }
      await axios.post("http://localhost:8080/api/thesisKeywords/add",thesisKeywordPayload,{
        headers: {
          "Content-Type": "application/json",
        }
      });

      await wait(1000);
      const thesiSubjectTopicsPayload = {
        thesisNo:thesisNo,
        subject_id: parseInt(newThesisSubjectTopics.subjects)
      }
      await axios.post("http://localhost:8080/api/thesisSubjectTopics/add",thesiSubjectTopicsPayload,{
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      alert("Thesis and supervisor successfully added!");

      // Reset form state
      setNewThesis({
        title: "",
        abstractText: "",
        year: "",
        type: "",
        numberOfPages: "",
        language: "",
        submissionDate: "",
        university: "",
        author: "",
        institute: "",
      });

      setNewThesisSupervisor({
        thesisNo: "",
        supervisors: "",
        is_co_supervisor: false,
      });

      setNewThesisKeyword({
        thesisNo: "",
        keywords: "",
      });

      setNewSubjectTopics({
        thesisNo:"",
        subjects:""
      })

    } catch (err) {
      console.error("Error adding thesis:", err.response?.data || err.message);
      alert("An error occurred while adding the thesis.");
    }
  };

  const handleKeywordChange = (e) => {
    const selectedKeywordID = e.target.value;  // Seçilen keyword ID'sini alıyoruz
    setNewThesisKeyword((prevState) => ({
      ...prevState,
      keywords: selectedKeywordID,  // Seçilen keyword ID'sini 'keywords' state'ine ekliyoruz
    }));
  };
  const handleSubjectChange = (e) => {
    const selectedSubjectID = e.target.value;  // Seçilen keyword ID'sini alıyoruz
    setNewSubjectTopics((prevState) => ({
      ...prevState,
      subjects: selectedSubjectID,  // Seçilen keyword ID'sini 'keywords' state'ine ekliyoruz
    }));
  };
  // Form değişikliklerini işleme
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Diğer tezle ilgili verileri güncelle
    setNewThesis((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };

  return (
    <div className="form-container">


      {/* Manage Theses ekranını göster */}
      {showManageTheses && <ThesisUpdateDelete />}

      {!showManageTheses && (
        <>
          <h2 className="form-title">Add Thesis</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newThesis.title}
                onChange={handleChange}
                placeholder="Enter Title"
                required
              />
            </div>
            <div className="form-group">
              <label>Abstract:</label>
              <textarea
                name="abstractText"
                value={newThesis.abstractText}
                onChange={handleChange}
                placeholder="Enter Abstract"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Year:</label>
              <input
                type="number"
                name="year"
                value={newThesis.year}
                onChange={handleChange}
                placeholder="Enter Year"
                required
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={newThesis.type}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Number of Pages:</label>
              <input
                type="number"
                name="numberOfPages"
                value={newThesis.numberOfPages}
                onChange={handleChange}
                placeholder="Enter Number of Pages"
                required
              />
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={newThesis.language}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Language
                </option>
                {languages.map((language, index) => (
                  <option key={index} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Submission Date:</label>
              <input
                type="date"
                name="submissionDate"
                value={newThesis.submissionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <select
                name="author"
                value={newThesis.author}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Author
                </option>
                {authors.map((author) => (
                  <option key={author.authorID} value={author.authorID}>
                    {author.name} {author.surname}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>University:</label>
              <select
                name="university"
                value={newThesis.university}
                onChange={handleUniversityChange}
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
            <div className="form-group">
              <label>Institute:</label>
              <select
                name="institute"
                value={newThesis.institute}
                onChange={handleChange}
                required
                disabled={!newThesis.university} // Üniversite seçilmeden enstitü seçimi yapılamaz
              >
                <option value="" disabled>
                  Select Institute
                </option>
                {filteredInstitutes.map((institute) => (
                  <option key={institute.institute_id} value={institute.institute_id}>
                    {institute.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Supervisor Selection */}
            <div className="form-group">
              <label>Supervisor:</label>
              <select
                name="supervisors"
                value={newThesisSupervisor.supervisors}
                onChange={(e) => setNewThesisSupervisor((prevState) => ({
                  ...prevState,
                  supervisors: e.target.value,
                }))}
                required
              >
                <option value="" disabled>
                  Select Supervisor
                </option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.supervisorID} value={supervisor.supervisorID}>
                    {supervisor.name} {supervisor.surname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Keywords:</label>
              <select
                name="keywords"
                value={newThesisKeyword.keywords}  // Seçili keyword ID'sini value olarak gönderiyoruz
                onChange={handleKeywordChange} // Seçim değiştiğinde handleKeywordChange fonksiyonu çalışacak
                required
              >
                <option value="" disabled>Select Keyword</option>
                {Array.isArray(keywords) ? (
                  keywords.map((keyword) => (
                    <option key={keyword.keyword_id} value={keyword.keyword_id}>
                      {keyword.keyword}
                    </option>
                  ))
                ) : (
                  <option>No keywords available</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Subjects:</label>
              <select
                name="subjects"
                value={newThesisSubjectTopics.subjects}  // Seçili keyword ID'sini value olarak gönderiyoruz
                onChange={handleSubjectChange} // Seçim değiştiğinde handleKeywordChange fonksiyonu çalışacak
                required
              >
                <option value="" disabled>Select Subjects</option>
                {Array.isArray(subjects) ? (
                  subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.name}
                    </option>
                  ))
                ) : (
                  <option>No Subject available</option>
                )}
              </select>
            </div>

            <button type="submit" className="form-button">
              Add Thesis
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default ThesisAdd;
