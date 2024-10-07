import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CategoriasDeProdutos from "./pages/CategoriasDeProdutos";
import RequisicoesDeCompras from "./pages/RequisicoesDeCompras";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import Fornecedores from "./pages/Fornecedores";
import Usuarios from "./pages/Usuarios";
import Contatos from "./pages/Contatos";
import Produtos from "./pages/Produtos";
import Inicio from "./pages/Inicio";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />

          {/* private routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/requisicoes-de-compras"
            element={
              <PrivateRoute>
                <RequisicoesDeCompras />
              </PrivateRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }
          />
          <Route
            path="/categorias-de-produtos"
            element={
              <PrivateRoute>
                <CategoriasDeProdutos />
              </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores"
            element={
              <PrivateRoute>
                <Fornecedores />
              </PrivateRoute>
            }
          />
          <Route
            path="/contatos"
            element={
              <PrivateRoute>
                <Contatos />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute isAdmin>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* fallback route */}
          <Route path="*" element={<Inicio />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
