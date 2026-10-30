export default function Spinner({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-300" role="status" aria-live="polite">
      <span
        className="h-6 w-6 rounded-full border-2 border-slate-600 border-t-red-500 motion-safe:animate-spin"
        aria-hidden="true"
      ></span>
      <span>{label}</span>
    </div>
  );
}
