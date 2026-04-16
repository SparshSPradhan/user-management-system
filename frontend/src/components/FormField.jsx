const FormField = ({ label, error, children }) => (
    <div className="space-y-1.5">
      {label && <label className="label">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
  
  export default FormField;