import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BudgetProvider } from "./context/BudgetContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";

import { AddTransactionModal } from "./components/modals/AddTransactionModal";
import { PrivateRoute } from "./components/navigations/PrivateRoute";
import { AdminRoute } from "./components/navigations/AdminRoute";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Panel — outside main layout, admin-only */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />

      {/* Upgrade / Payment page — authenticated users only, outside main layout */}
      <Route path="/upgrade" element={
        <PrivateRoute>
          <PaymentPage />
        </PrivateRoute>
      } />

      {/* Main app layout */}
      <Route path="/*" element={
        <PrivateRoute>
          <Layout onAddTransaction={() => setIsModalOpen(true)}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions onAddClick={() => setIsModalOpen(true)} />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </BudgetProvider>
    </AuthProvider>
  );
}
