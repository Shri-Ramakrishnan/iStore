export default function EmptyState({ title, subtitle }) {
  return (
    <div className="py-16 text-center text-neutral-500">
      <h3 className="text-lg text-neutral-800 font-semibold">{title}</h3>
      <p className="mt-2">{subtitle}</p>
    </div>
  );
}
