import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { BudgetProvider } from "../../context/BudgetContext";
import { ThemeProvider } from "../../context/ThemeContext";

/**
 * Composes all application-level providers in the correct dependency order.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BudgetProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </BudgetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
