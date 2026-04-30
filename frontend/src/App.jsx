// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login.jsx";
// import Register from "./components/Register.jsx";
// import Dashboard from "./components/Dashboard.jsx";
// import AdminDashboard from "./components/AdminDashboard.jsx";
// import Profile from "./components/Profile.jsx";
// import { ToastContainer } from "react-toastify";

// function PrivateRoute({ children }) {
//   const userId = localStorage.getItem("userId");
//   return userId ? children : <Navigate to="/" replace />;
// }

// function AdminRoute({ children }) {
//   const userId = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");

//   if (!userId) return <Navigate to="/" replace />;
//   if (role !== "admin") return <Navigate to="/dashboard" replace />;

//   return children;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <Profile />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminDashboard />
//             </AdminRoute>
//           }
//         />
//       </Routes>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Profile from "./components/Profile.jsx";
import Notifications from "./components/Notifications.jsx";
import ActivityLogs from "./components/ActivityLogs.jsx";
import { ToastContainer } from "react-toastify";

function PrivateRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/activity-logs"
          element={
            <AdminRoute>
              <ActivityLogs />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;