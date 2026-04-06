import clsx from 'clsx';

export default function ProgressBar({ progress, className }) {
  return (
    <div className={clsx("w-full bg-gray-200 rounded-full h-2.5", className)}>
      <div 
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      ></div>
    </div>
  );
}
