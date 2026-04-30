// import { useEffect, useState } from "react";
// import API from "../api";
// import { toast } from "react-toastify";

// function ActivityLogs() {
//   const [logs, setLogs] = useState([]);

//   const loadLogs = async () => {
//     try {
//       const res = await API.get("/admin/activity-logs");
//       setLogs(res.data);
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load activity logs");
//     }
//   };

//   useEffect(() => {
//     loadLogs();
//   }, []);

//   return (
//     <div className="container py-4">
//       <div className="card shadow border-0 rounded-4">
//         <div className="card-body p-4">
//           <h3 className="fw-bold text-primary mb-3">📜 Activity Logs</h3>

//           <div className="table-responsive">
//             <table className="table table-bordered align-middle">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Action</th>
//                   <th>Module</th>
//                   <th>Details</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logs.map((log) => (
//                   <tr key={log.id}>
//                     <td>{log.user_name || "System"}</td>
//                     <td>{log.action}</td>
//                     <td>{log.module}</td>
//                     <td>{log.details}</td>
//                     <td>{new Date(log.created_at).toLocaleString()}</td>
//                   </tr>
//                 ))}

//                 {logs.length === 0 && (
//                   <tr>
//                     <td colSpan="5" className="text-center">
//                       No logs found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ActivityLogs;

// import { useEffect, useState } from "react";
// import API from "../api";
// import { toast } from "react-toastify";

// function ActivityLogs() {
//   const [logs, setLogs] = useState([]);

//   const [search, setSearch] = useState("");
//   const [moduleFilter, setModuleFilter] = useState("");

//   const filteredLogs = logs.filter((log) => {
//     const matchSearch =
//       log.action?.toLowerCase().includes(search.toLowerCase()) ||
//       log.details?.toLowerCase().includes(search.toLowerCase());

//     const matchModule =
//       !moduleFilter || log.module === moduleFilter;

//     return matchSearch && matchModule;
//   });

//   const loadLogs = async () => {
//     try {
//       const res = await API.get("/admin/activity-logs");
//       setLogs(res.data);
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load activity logs");
//     }
//   };

//   useEffect(() => {
//     loadLogs();
//   }, []);

//   useEffect(() => {
//     loadLogs();
//     const interval = setInterval(loadLogs, 10000); // every 10 sec
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="container py-4">
//       <div className="card shadow border-0 rounded-4">
//         <div className="card-body p-4">
//           <h3 className="fw-bold text-primary mb-3">📜 Activity Logs</h3>

//           <div
//             className="table-responsive"
//             style={{
//               maxHeight: "450px",
//               overflowY: "auto",
//               overflowX: "auto",
//               border: "1px solid #dee2e6",
//               borderRadius: "12px",
//             }}
//           >
//             <div className="row mb-3">
//               <div className="col-md-4">
//                 <input
//                   className="form-control"
//                   placeholder="Search (action / details)"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>

//               <div className="col-md-3">
//                 <select
//                   className="form-select"
//                   value={moduleFilter}
//                   onChange={(e) => setModuleFilter(e.target.value)}
//                 >
//                   <option value="">All Modules</option>
//                   <option value="AUTH">Auth</option>
//                   <option value="PETS">Pets</option>
//                   <option value="ADMIN">Admin</option>
//                 </select>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <small className="text-muted">
//                 Showing {filteredLogs.length} logs
//               </small>

//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={loadLogs}
//               >
//                 Refresh
//               </button>
//             </div>

//             <table className="table table-bordered align-middle mb-0">
//               <thead
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 2,
//                   background: "#f8f9fa",
//                 }}
//               >
//                 <tr>
//                   <th>User</th>
//                   <th>Action</th>
//                   <th>Module</th>
//                   <th>Details</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLogs.map((log) => (
//                   <tr key={log.id}>
//                     <td>{log.user_name || "System"}</td>
//                     {/* <td>{log.action}</td>
//                     <td>{log.module}</td> */}
//                     <td>
//                       <span className="badge bg-primary">{log.action}</span>
//                     </td>

//                     <td>
//                       <span className="badge bg-dark">{log.module}</span>
//                     </td>
//                     <td>{log.details}</td>
//                     <td>{new Date(log.created_at).toLocaleString("en-IN", {
//                       dateStyle: "medium",
//                       timeStyle: "short",
//                     })}</td>
//                   </tr>
//                 ))}

//                 {logs.length === 0 && (
//                   <tr>
//                     <td colSpan="5" className="text-center">
//                       No logs found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ActivityLogs;

import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // const loadLogs = async () => {
  //   try {
  //     const res = await API.get("/admin/activity-logs");
  //     setLogs(res.data || []);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Failed to load activity logs");
  //   }
  // };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/activity-logs");
      setLogs(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const getActionBadgeClass = (action = "") => {
    const upperAction = action.toUpperCase();

    if (upperAction.includes("DELETE")) return "bg-danger";
    if (upperAction.includes("ADD") || upperAction.includes("REGISTER")) return "bg-success";
    if (upperAction.includes("UPDATE") || upperAction.includes("CHANGE")) return "bg-warning text-dark";
    if (upperAction.includes("LOGIN")) return "bg-primary";
    return "bg-secondary";
  };

  const getModuleBadgeClass = (module = "") => {
    const upperModule = module.toUpperCase();

    if (upperModule === "AUTH") return "bg-dark";
    if (upperModule === "PETS") return "bg-success";
    if (upperModule === "ADMIN") return "bg-warning text-dark";
    return "bg-secondary";
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = search.toLowerCase();

      const matchSearch =
        (log.user_name || "system").toLowerCase().includes(searchText) ||
        (log.action || "").toLowerCase().includes(searchText) ||
        (log.details || "").toLowerCase().includes(searchText);

      const matchModule = !moduleFilter || log.module === moduleFilter;

      return matchSearch && matchModule;
    });
  }, [logs, search, moduleFilter]);

  const totalLogs = logs.length;
  const authLogs = logs.filter((log) => log.module === "AUTH").length;
  const petLogs = logs.filter((log) => log.module === "PETS").length;
  const adminLogs = logs.filter((log) => log.module === "ADMIN").length;
  

  const navigate = useNavigate();

  return (
     <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
    <Navbar title="📜 Activity Logs" theme="dark" />
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-primary mb-1">📜 Activity Logs</h3>
          <p className="text-muted mb-0">
            Monitor recent system actions performed by users and admin.
          </p>
        
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={loadLogs}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Refreshing...
              </>
            ) : (
              "🔄 Refresh"
            )}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Total Logs</p>
              <h3 className="fw-bold mb-0">{totalLogs}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Auth Logs</p>
              <h3 className="fw-bold text-dark mb-0">{authLogs}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Pet Logs</p>
              <h3 className="fw-bold text-success mb-0">{petLogs}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Admin Logs</p>
              <h3 className="fw-bold text-warning mb-0">{adminLogs}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="row g-3 mb-3">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Search by user, action or details"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="">All Modules</option>
                <option value="AUTH">Auth</option>
                <option value="PETS">Pets</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="col-md-2">
              {/* <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setModuleFilter("");
                }}
              >
                Clear
              </button> */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setModuleFilter("");
                }}
                disabled={loading}
              >
                Clear
              </button>
            </div>

            <div className="col-md-2 d-flex align-items-center">
              <small className="text-muted">
                Showing {filteredLogs.length} logs
              </small>
            </div>
          </div>

          <div
            className="table-responsive"
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "12px",
            }}
          >
            <table className="table table-hover align-middle mb-0">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  background: "#f8f9fa",
                }}
              >
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Details</th>
                  <th>Created At</th>
                </tr>
              </thead>

              {/* <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="fw-semibold">{log.user_name || "System"}</td>

                      <td>
                        <span className={`badge ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${getModuleBadgeClass(log.module)}`}>
                          {log.module}
                        </span>
                      </td>

                      <td style={{ minWidth: "260px" }}>
                        {log.details || "No details"}
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="text-muted">
                        <div className="fs-4 mb-2">📭</div>
                        <div className="fw-semibold">No activity logs found</div>
                        <small>Try changing search or filter.</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody> */}

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <div className="mt-2 text-muted">Loading logs...</div>
                    </td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="fw-semibold">{log.user_name || "System"}</td>
                      <td>
                        <span className={`badge ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getModuleBadgeClass(log.module)}`}>
                          {log.module}
                        </span>
                      </td>
                      <td style={{ minWidth: "260px" }}>{log.details || "No details"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="text-muted">
                        <div className="fs-4 mb-2">📭</div>
                        <div className="fw-semibold">No activity logs found</div>
                        <small>Try changing search or filter.</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ActivityLogs;