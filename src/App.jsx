import React, { lazy, Suspense } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link 
} from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import CreatAccount from "./pages/Login/CreatAccount";
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ResidentList = lazy(() => import("./pages/Residents/ResidentList"));
const ResidentDetails = lazy(() => import("./pages/Residents/ResidentDetails"));
const AddResident = lazy(() => import("./pages/Residents/AddResident")); // Add this line
const VacantRooms = lazy(() => import("./pages/Rooms/VacantRooms"));
const AllocateRoom = lazy(() => import("./pages/Rooms/AllocateRoom"));
const Login = lazy(() => import("./pages/Login/Login"));
const RoomsList = lazy(() => import("./pages/Rooms/RoomsList"));
const RoomManagement = lazy(() => import("./pages/Rooms/RoomManagment"));
const OccupancyReport = lazy(() => import("./pages/Reports/OccupancyReport"));
const MaintenanceReport = lazy(() => import("./pages/Reports/MaintenanceReport"));
const FinancialReport = lazy(() => import("./pages/Reports/FinancialReport"));

// Loading Fallback Component
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// Not Found Component
function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="container">
          {/* Suspense provides a fallback while components are loading */}
          <Suspense fallback={<LoadingFallback />}>
            <NavBar/>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/creatAccount" element={<CreatAccount/>}/>
              <Route path="/residents/list" element={<ResidentList />} />
              <Route path="/rooms/list" element={<RoomsList />} />
              <Route path="/residents/add" element={<AddResident />} /> {/* Add this line */}
              <Route path="/rooms/vacant" element={<VacantRooms />} />
              <Route path="/residents/:residentId" element={<ResidentDetails />} />
              <Route path="/rooms/manage" element={<RoomManagement />} />
              <Route path="/rooms/allocate/:roomNumber" element={<AllocateRoom />} />
              <Route path="/reports/occupancy" element={<OccupancyReport/>} />
              <Route path="/reports/maintenance" element={<MaintenanceReport/>} />
              <Route path="/reports/financial" element={<FinancialReport/>} />
              {/* Catch-all route for undefined paths */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;