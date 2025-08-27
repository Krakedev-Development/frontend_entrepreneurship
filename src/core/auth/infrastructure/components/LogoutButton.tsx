import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

export function LogoutButton() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-neutral-600">
        Bienvenido, {user?.nombreCompleto}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-brand transition-colors"
        title="Cerrar sesión"
      >
        <FaSignOutAlt />
        Cerrar Sesión
      </button>
    </div>
  );
}
