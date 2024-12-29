import React from "react";
import { ThesisProvider } from "./contexts/ThesisContext";
import ThesisAdd from "./components/ThesisAdd";
import AuthorUpdateDelete from "./components/AuthorUpdateDelete";
import ThesisDashboard from "./components/ThesisDashboard";
import ThesisDetails from "./components/ThesisDetails";
import ThesisUpdateDelete from "./components/ThesisUpdateDelete";
import UniversityUpdateDelete from "./components/UniversityUpdateDelete";
import InstituteUpdateDelete from "./components/InstituteUpdateDelete";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SupervisorUpdateDelete from "./components/SupervisorUpdateDelete";
import SubjectTopicUpdateDelete from "./components/SubjectTopicUpdateDelete";
import KeywordUpdateDelete from "./components/KeywordUpdateDelete";

function App() {
  return (
    <ThesisProvider>
      <Router>
        <Routes>
          {/* Ana Sayfa: Direkt Dashboard açılacak */}
          <Route path="/" element={<ThesisDashboard />} />

          {/* Diğer rotalar */}
          <Route path="/dashboard" element={<ThesisDashboard />} />
          <Route path="/add" element={<ThesisUpdateDelete />} />
          <Route path="/thesis/:id" element={<ThesisDetails />} />
          <Route path="/author" element={<AuthorUpdateDelete />} />
          <Route path="/university" element={<UniversityUpdateDelete />} />
          <Route path="/institute" element={<InstituteUpdateDelete />} />
          <Route path="/supervisor" element={<SupervisorUpdateDelete />} />
          <Route path="/subtop" element={<SubjectTopicUpdateDelete />} />
          <Route path="/keyword" element={<KeywordUpdateDelete />} />
        </Routes>
      </Router>
    </ThesisProvider>
  );
}

export default App;
