const StatCard = ({ label, value, color = 'brand' }) => {
    const colors = {
      brand:   'from-brand-500 to-brand-600',
      teal:    'from-teal-500 to-teal-600',
      amber:   'from-amber-400 to-amber-500',
      rose:    'from-rose-500 to-rose-600',
    };
    return (
      <div className="card p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-xl font-bold">{String(value).charAt(0)}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
        </div>
      </div>
    );
  };
  
  export default StatCard;