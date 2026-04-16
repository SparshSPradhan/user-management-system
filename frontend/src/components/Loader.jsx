// const Loader = () => (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <div className="spinner" />
//     </div>
//   );
  
//   export default Loader;

const Loader = ({ fullscreen = true }) => {
  if (fullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading…</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;