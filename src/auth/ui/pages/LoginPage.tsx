import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../useCases/LoginUser";
import { UserService } from "../../UserService";

export function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const authService = new UserService();
    const loginUseCase = new LoginUser(authService);

    try {
      const user = await loginUseCase.execute();
      if (user) {
        navigate("/businesses");
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (e: any) {
      setError("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 bg-gray-50">
      {/*
        Tarjeta principal del formulario.
        Usa el fondo blanco, el radio de borde 'brand' y la sombra 'brand-md'.
      */}
      <div className="bg-white p-8 rounded-brand shadow-brand-md w-full max-w-md space-y-8">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-800">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-neutral-600">Bienvenido de nuevo</p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleLogin} noValidate>
          {/* Campo de Usuario */}
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Usuario
            </label>
            <input
              id="user"
              type="email" // Usamos type="email" para validación semántica
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Espacio para mensajes de error o éxito */}
          <div className="h-6 text-center">
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-brand font-semibold hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
