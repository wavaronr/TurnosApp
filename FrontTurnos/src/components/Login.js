import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react'; // 1. Importar useContext
import { ProfileContext } from '../context/ProfileContext'; // 2. Importar el contexto
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(ProfileContext); // 3. Obtener la función login del contexto
  const [error, setError] = useState('');

  useEffect(() => {
    // Esta lógica de redirección se podría mover a un componente PrivateRoute más robusto,
    // pero por ahora está bien aquí.
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Home', { replace: true });
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    let userProfile = null;
    let token = null;

    if (email === 'wavaron@rbm.com.co' && password === 'a1s2d3') {
      token = 'fake-jwt-token-for-dev';
      userProfile = { role: 'ADM', email: email };
    } else if (email === 'jperez@rbm.com.co' && password === 'a1s2d3') {
      token = 'fake-jwt-token-for-dev-opr-2';
      userProfile = { role: 'OPR', email: email };
    } else if (email === 'operador@rbm.com.co' && password === 'password') {
      token = 'fake-jwt-token-for-dev-opr';
      userProfile = { role: 'OPR', email: email };
    }

    if (userProfile && token) {
      // 4. Usar la función login del contexto
      login(userProfile, token);
      navigate('/Home', { replace: true });
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={submitHandler}>
          {error && (
            <div className="error-message">
                <div className="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Usuario</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              required
            />
          </div>
          <button className="btn-login" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
