export default function QuantitySelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        className="w-8 h-8 rounded-full border border-neutral-300"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </button>
      <span className="min-w-6 text-center">{value}</span>
      <button
        className="w-8 h-8 rounded-full border border-neutral-300"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
