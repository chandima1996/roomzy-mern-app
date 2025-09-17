import { Routes, Route, useNavigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/Header";
import AuthManager from "./components/AuthManager";

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
        </Routes>
      </main>
    </div>
  );
}

export default App;
