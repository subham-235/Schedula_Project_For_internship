import type {
  BookingStatus,
} from "@/types/booking";

const styles:
  Record<
    BookingStatus,
    string
  > = {
  pending:
    "bg-[#F7F4EF] text-[#D96B32] ring-[#F2C2A7]",

  confirmed:
    "bg-[#F7F4EF] text-[#C9362D] ring-[#F2C2A7]",

  completed:
    "bg-[#F7F4EF] text-[#D96B32] ring-[#F2C2A7]",

  cancelled:
    "bg-[#F7F4EF] text-[#C9362D] ring-[#F2C2A7]",

  missed:
    "bg-[#F7F4EF] text-[#746E68] ring-[#DDD7D0]",
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