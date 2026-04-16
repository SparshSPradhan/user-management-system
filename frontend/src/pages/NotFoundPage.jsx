import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <h1>404</h1>
    <p>Page not found.</p>
    <Link to="/dashboard">Go home</Link>
  </div>
);

export default NotFoundPage;