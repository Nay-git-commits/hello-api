import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';

export default function RequireAuth({ children }) {
  const { user } = useContext(UserContext) ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user || !user.isLoggedIn) return null;
  return children;
}
