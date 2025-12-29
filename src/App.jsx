import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BudgetProvider, useBudget } from "./context/BudgetContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
// import { Modal } from "./components/ui/Modal";
// import { Input } from "./components/ui/Input";
// import { Button } from "./components/ui/Button";

// Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import { AddTransactionModal } from "./components/modals/AddTransactionModal";
import { PrivateRoute } from "./components/navigations/PrivateRoute";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
