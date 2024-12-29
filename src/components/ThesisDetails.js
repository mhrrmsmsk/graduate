import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ThesisContext } from "../contexts/ThesisContext";
import { Link } from "react-router-dom";
import '../App.css';

function ThesisDetails() {
  const { id } = useParams(); // Dinamik parametreyi al
  const { data } = useContext(ThesisContext);

  console.log("Tez Numarası (URL'den gelen id):", id); // Konsola yazdır
  console.log("Thesis Data (Context'ten gelen data):", data);

  // Veri tiplerini uyumlu hale getir
  const thesis = data.find((item) => String(item.thesisNo) === String(id));

  console.log("Bulunan Thesis:", thesis);

  if (!thesis) {
    return <div>Thesis not found!</div>; // Eğer tez bulunamazsa hata mesajı
  }

  return (
    <div className="thesis-details-container" >
       <h2>Thesis Details</h2>
      <h2>{thesis.title || "No Title Available"}</h2>
      <p><strong>Abstract:</strong> {thesis.abstractText || "No Abstract Available"}</p>
      <p><strong>Author:</strong> 
        {thesis.author 
          ? `${thesis.author.name || "Unknown"} ${thesis.author.surname || "Author"}`
          : "Unknown Author"}
      </p>
      <p><strong>Year:</strong> {thesis.year || "Unknown Year"}</p>
      <p><strong>University:</strong> {thesis.university?.name || "Unknown University"}</p>
      <p><strong>Institute:</strong> {thesis.institute?.name || "Unknown Institute"}</p>
      <p><strong>Number of Pages:</strong> {thesis.numberOfPages || "Unknown"}</p>
      <p><strong>Submission Date:</strong> {thesis.submissionDate || "Unknown Date"}</p>
      <p><strong>Keywords:</strong> 
        {thesis.keywords?.length 
          ? thesis.keywords.map((kw) => kw.keyword).join(", ") 
          : "No Keywords Available"}
      </p>
      <p><strong>Subject Topics:</strong> 
        {thesis.subjectTopics?.length 
          ? thesis.subjectTopics.map((st) => st.name).join(", ") 
          : "No Subject Topics Available"}
      </p>
      <Link to="/dashboard" className="btn-back">Back to Dashboard</Link>
    </div>
  );
}

export default ThesisDetails;