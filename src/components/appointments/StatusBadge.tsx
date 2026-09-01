import type {
  BookingStatus,
} from "@/types/booking";

const styles:
  Record<
    BookingStatus,
    string
  > = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-200",

  confirmed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  completed:
    "bg-blue-50 text-blue-700 ring-blue-200",

  cancelled:
    "bg-red-50 text-red-700 ring-red-200",

  missed:
    "bg-stone-100 text-stone-600 ring-stone-200",
};

export default function StatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}