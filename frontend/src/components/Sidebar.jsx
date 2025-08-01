import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaBook, FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaCalendarPlus, FaFileUpload } from "react-icons/fa";
import "@styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.role;

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Metodología de Desarrollo</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon"/> Inicio
            </NavLink>
          </li>
          <li>
           <NavLink to="/informes">
            <FaBook className="icon"/> Informes
           </NavLink>
          </li>
          {userRole === "Presidente" && (
            <>
            <li>
              <NavLink to="/users">
                <FaUsers className="icon"/> Miembros
              </NavLink>
            </li>
            <li>
              <NavLink to="/agendarjuntapres">
                <FaCalendarPlus className="icon" /> Fechas Agendadas
              </NavLink>
            </li>
            </>
          )}
          {userRole === "Secretario" && (
            <>
              <li>
                <NavLink to="/agendar">
                  <FaCalendarPlus className="icon"/> Asamblea
                </NavLink>
              </li>
              <li>
                <NavLink to="/actas">
                  <FaFileUpload className="icon"/> Actas
                </NavLink>
              </li>
              <li>
              <NavLink to="/users">
                <FaUsers className="icon"/> Miembros
              </NavLink>
            </li>
            </>
          )}
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon"/> Perfil
            </NavLink>
          </li>
          <li style={{ height: "70%" }}/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon"/> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
