export default function PageHeader({
  title,
  subtitle,
  action,
  logo,
  className = "",
}) {
  return (
    <div className={`px-5 pt-6 pb-4 ${className}`}>
      <div className="flex items-center justify-between">

        {/* LEFT SIDE (LOGO + TEXT) */}
        <div className="flex items-center gap-3">
          
          {logo && (
            <img
              src={logo}
              alt="logo"
              className="w-10 h-15 object-contain"
            />
          )}

          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
                    Smart<span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-transparent bg-clip-text">
                    Stock
                    </span>
             </h1>

            {subtitle && (
              <p className="text-s text-blue-900 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE ACTION */}
        {action && <div>{action}</div>}

      </div>
    </div>
  );
}