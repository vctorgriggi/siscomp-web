import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import CircularIndeterminate from "../components/CircularIndeterminate";
import { validateUserToken } from "../services/authService";
import { APP_ROUTES } from "../constants/app-routes";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, isAdmin }) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await validateUserToken();
        setUser(data);
      } catch (error) {
        console.log("Error fetching user!");
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <CircularIndeterminate
        sx={{
          height: "100vh",
          alignItems: "center",
        }}
      />
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.public.sign_in} />;
  }

  if (isAdmin && !user.isAdmin) {
    return <Navigate to={APP_ROUTES.private.inicio} />;
  }

  return children;
}
