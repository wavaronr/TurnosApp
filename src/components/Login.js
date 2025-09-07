import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Home', { replace: true });
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === 'wavaron@rbm.com.co' && password === 'a1s2d3') {
      const token = 'fake-jwt-token-for-dev'; // Fictitious token
      localStorage.setItem('token', token);
      localStorage.setItem('profile', 'ADM');
      localStorage.setItem('email', email);
      navigate('/Home', { replace: true });
    } else if (email === 'jperez@rbm.com.co' && password === 'a1s2d3') {
      const token = 'fake-jwt-token-for-dev-opr-2'; // Fictitious token for Juan Perez
      localStorage.setItem('token', token);
      localStorage.setItem('profile', 'OPR');
      localStorage.setItem('email', email);
      navigate('/Home', { replace: true });
    } else if (email === 'operador@rbm.com.co' && password === 'password') {
      const token = 'fake-jwt-token-for-dev-opr'; // Fictitious token
      localStorage.setItem('token', token);
      localStorage.setItem('profile', 'OPR');
      localStorage.setItem('email', email);
      navigate('/Home', { replace: true });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={submitHandler}>
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
