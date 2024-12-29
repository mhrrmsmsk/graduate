import React, { useState, useContext, useEffect } from "react";
import { ThesisContext } from "../contexts/ThesisContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar"; // Navbar import edildi
import "./ThesisDashboard.css";

function ThesisDashboard() {
  const [searchTerm, setSearchTerm] = useState(""); // Arama kutusundaki kelime
  const { data } = useContext(ThesisContext); // Tüm veriler
  const [filteredData, setFilteredData] = useState(data); // Filtrelenmiş veriler

  // Arama kutusundaki değişiklikleri dinle ve filtreleme yap
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerTerm) ||
        `${item.author?.name || ""} ${item.author?.surname || ""}`
          .toLowerCase()
          .includes(lowerTerm) ||
        item.year.toString().includes(lowerTerm) ||
        item.type.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]); // Hem `searchTerm` hem `data` değişikliklerini dinle

  /* <Link to="/" className="btn-back">
          Go to Home
        </Link> 
  */
  return (
    <div className="App">
      {/* Navbar'ı burada ekleyin */}
      <h1  className="tbl-head">Graduate Thesis System</h1>
      <Navbar />

      <div className="app-container">
        {/* Dinamik arama kutusu */}
        <input
          className="input"
          placeholder="Search by title, author, year, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
      </div>

      <div className="list-container">
        <table className="list-table">
          <thead className="tbl-head">
            <tr>
              <th>Thesis No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody className="tbl-body">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr className="tbl-listed" key={item.thesisNo}>
                  <td>
                    <Link to={`/thesis/${item.thesisNo}`}>{item.thesisNo}</Link>
                  </td>
                  <td>{item.title}</td>
                  <td>
                    {item.author
                      ? `${item.author.name} ${item.author.surname}`
                      : "Unknown Author"}
                  </td>
                  <td>{item.year}</td>
                  <td>{item.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="non-listed" colSpan="5">
                  No results matching the search criteria were found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ThesisDashboard;
