import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Stilinizi dahil edin

function Navbar() {
  return (
    <nav className="navbar">
        Click To Manage(Add/Update/Delete)
      <div className="navbar-links">
         
        <Link to="/add" className="navbar-item">Author Panel</Link>
        <Link to="/author" className="navbar-item">Authors</Link>
        <Link to="/university" className="navbar-item">Universities</Link>
        <Link to="/institute" className="navbar-item">Institutes</Link>
        <Link to="/supervisor" className="navbar-item">Supervisors</Link>
        <Link to="/subtop" className="navbar-item">Topics</Link>
        <Link to="/keyword" className="navbar-item">Keywords</Link>
      </div>
    </nav>
  );
}

export default Navbar;
