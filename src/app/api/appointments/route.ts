import { appointments } from "@/lib/mock-data/appointments";

export async function GET() {
  return Response.json({
    data: appointments,
    meta: { total: appointments.length },
  });
}
