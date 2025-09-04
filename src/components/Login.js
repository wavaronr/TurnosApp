import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email);
    console.log(password);
    navigate('/Calendario', { replace: true });
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
