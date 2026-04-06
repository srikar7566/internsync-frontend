import clsx from 'clsx';

export function Card({ children, className }) {
  return (
    <div className={clsx("bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx("px-6 py-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx("p-6", className)}>
      {children}
    </div>
  );
}
