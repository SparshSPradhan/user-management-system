// import { Link } from 'react-router-dom';

// const NotFoundPage = () => (
//   <div style={{ textAlign: 'center', padding: '4rem' }}>
//     <h1>404</h1>
//     <p>Page not found.</p>
//     <Link to="/dashboard">Go home</Link>
//   </div>
// );

// export default NotFoundPage;



import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl font-bold text-brand-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-700 mb-2">Page not found</h1>
      <p className="text-slate-400 text-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;