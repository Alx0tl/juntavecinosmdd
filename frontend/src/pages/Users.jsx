import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [users, search]);

  return (
    <div className="users-page">
      <h2>Miembros de la Junta de vecinos</h2>
      <div style={{ marginBottom: "1em", display: "flex", gap: "1em" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.rut}</td>
                <td>
                  <button className="edit" onClick={() => handleEditUser(user.id, user)}>Editar</button>
                  <button className="delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
