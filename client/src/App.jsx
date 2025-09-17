import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/Header";
import AuthManager from "./components/AuthManager";
import AdminPage from "./pages/AdminPage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";

const HomePage = () => <div>This is the Public Home Page</div>;
const DashboardPage = () => {
  const { user } = useUser();
  return <div>Hello, {user.firstName}! This is your protected dashboard.</div>;
};

function App() {
  return (
    <div>
      <AuthManager />
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />

          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
