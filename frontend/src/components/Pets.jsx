import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

function Pets() {
  const petsPerPage = 6;

  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    name: "",
    type: "",
    age: "",
    vaccination_date: "",
    notes: "",
    image: null,
  });

  const [editingPet, setEditingPet] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    age: "",
    vaccination_date: "",
    notes: "",
    image: null,
  });

  const [filters, setFilters] = useState({
    q: "",
    type: "",
    status: "",
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  const getReminder = (date) => {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vacDate = new Date(date);
    vacDate.setHours(0, 0, 0, 0);

    const diff = Math.ceil((vacDate - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: "Overdue ❌", color: "danger" };
    if (diff === 0) return { text: "Today ⚠️", color: "warning" };
    if (diff <= 3) return { text: "Upcoming 🔔", color: "info" };

    return null;
  };

  const loadPets = async (page = currentPage) => {
    try {
      const params = new URLSearchParams({
        page,
        limit: petsPerPage,
        q: filters.q,
        type: filters.type,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const res = await API.get(`/pets?${params.toString()}`);
      const petsData = res.data?.data || [];
      const total = res.data?.total || 0;

      setPets(petsData);
      setTotalPages(Math.max(1, Math.ceil(total / petsPerPage)));
    } catch (err) {
      console.log(err);
      toast.error("Failed to load pets ❌");
    }
  };

  useEffect(() => {
    loadPets(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    loadPets(1);
  }, [filters]);

  const resetAddForm = () => {
    setForm({
      name: "",
      type: "",
      age: "",
      vaccination_date: "",
      notes: "",
      image: null,
    });
  };

  const resetEditForm = () => {
    setEditForm({
      name: "",
      type: "",
      age: "",
      vaccination_date: "",
      notes: "",
      image: null,
    });
  };

  const startEdit = (pet) => {
    setEditingPet(Number(pet.id));
    setEditForm({
      name: pet.name || "",
      type: pet.type || "",
      age: pet.age || "",
      vaccination_date: pet.vaccination_date
        ? String(pet.vaccination_date).split("T")[0]
        : "",
      notes: pet.notes || "",
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingPet(null);
    resetEditForm();
  };

  const addPet = async () => {
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("type", form.type);
      data.append("age", form.age);
      data.append("vaccination_date", form.vaccination_date || "");
      data.append("notes", form.notes || "");

      if (form.image) {
        data.append("image", form.image);
      }

      await API.post("/pets", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Pet added successfully ✅");
      resetAddForm();
      loadPets(currentPage);
    } catch (err) {
      console.log(err);
      toast.error("Add pet failed ❌");
    }
  };

  const updatePet = async () => {
    try {
      const data = new FormData();
      data.append("name", editForm.name || "");
      data.append("type", editForm.type || "");
      data.append("age", editForm.age || "");
      data.append("vaccination_date", editForm.vaccination_date || "");
      data.append("notes", editForm.notes || "");

      if (editForm.image) {
        data.append("image", editForm.image);
      }

      await API.put(`/pets/${editingPet}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Pet updated successfully ✅");
      setEditingPet(null);
      resetEditForm();
      loadPets(currentPage);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data || "Update failed ❌");
    }
  };

  const deletePet = async (id) => {
    try {
      await API.delete(`/pets/${id}`);
      toast.success("Pet deleted successfully ✅");
      loadPets(currentPage);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data || "Delete failed ❌");
    }
  };

  const uniqueTypes = useMemo(() => {
    return [...new Set(pets.map((p) => p.type).filter(Boolean))];
  }, [pets]);

  return (
    <div>
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Add New Pet</h5>

        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={form.vaccination_date}
              onChange={(e) =>
                setForm({ ...form, vaccination_date: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
          </div>
        </div>

        <button className="btn btn-success mt-3" onClick={addPet}>
          Add Pet
        </button>
      </div>

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">Search / Filter / Sort</h5>

        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or notes"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="created_at">Latest Added</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="type">Type</option>
              <option value="vaccination_date">Vaccination Date</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters({ ...filters, sortOrder: e.target.value })
              }
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>

          <div className="col-md-1">
            <button
              className="btn btn-secondary w-100"
              onClick={() =>
                setFilters({
                  q: "",
                  type: "",
                  status: "",
                  sortBy: "created_at",
                  sortOrder: "DESC",
                })
              }
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {pets.map((p) => (
          <div className="col-md-4 mb-3 d-flex" key={p.id}>
            <div
              className="card shadow-sm p-3 position-relative w-100 d-flex flex-column"
              style={{ transition: "0.3s", minHeight: "100%" }}
            >
              <div className="dropdown position-absolute top-0 end-0 m-2">
                <button className="btn btn-light btn-sm" data-bs-toggle="dropdown">
                  ⋮
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => deletePet(p.id)}
                    >
                      Delete
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </li>
                </ul>
              </div>

              {Number(editingPet) === Number(p.id) ? (
                <>
                  <input
                    className="form-control mb-2 mt-4"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={editForm.vaccination_date}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        vaccination_date: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setEditForm({ ...editForm, image: e.target.files[0] })
                    }
                  />
                  <button className="btn btn-success btn-sm me-2 mt-2" onClick={updatePet}>
                    Save
                  </button>
                  <button className="btn btn-secondary btn-sm mt-2" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <div className="d-flex flex-column flex-grow-1">
                  <div
                    style={{
                      height: "180px",
                      width: "100%",
                      marginBottom: "12px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#f1f3f5",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        alt="pet"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center h-100 text-muted fw-semibold"
                      >
                        No Image 🐾
                      </div>
                    )}
                  </div>

                  <h5>{p.name}</h5>
                  <p><strong>Type:</strong> {p.type}</p>
                  <p><strong>Age:</strong> {p.age}</p>
                  <p>
                    <strong>Vaccination:</strong>{" "}
                    {p.vaccination_date
                      ? new Date(p.vaccination_date).toLocaleDateString("en-CA")
                      : "N/A"}
                  </p>
                  <p><strong>Notes:</strong> {p.notes || "No notes"}</p>

                  <div className="mt-auto">
                    {getReminder(p.vaccination_date) && (
                      <span className={`badge bg-${getReminder(p.vaccination_date).color} w-100 py-2`}>
                        {getReminder(p.vaccination_date).text}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {pets.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">No pets found</div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn btn-sm ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <p className="text-center text-muted mt-3">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}

export default Pets;