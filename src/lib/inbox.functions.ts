import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  experience: z.string().trim().min(1).max(120),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  visitTime: z.string().trim().min(1).max(20),
  party: z.string().trim().min(1).max(20),
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(5).max(120),
  notes: z.string().trim().max(2000).optional(),
});

const enquirySchema = z.object({
  product: z.string().trim().min(1).max(200),
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(5).max(120),
  message: z.string().trim().max(2000).optional(),
});

async function publicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Owner inbox = the email saved in the dashboard's shop details, so there is one source of truth. */
async function ownerInbox(client: Awaited<ReturnType<typeof publicClient>>) {
  const { parseShopDetails } = await import("@/lib/shop-details");
  const { data } = await client.from("site_sections").select("contact_details").eq("id", "contact").maybeSingle();
  const email = parseShopDetails(data?.contact_details).email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

async function notifyOwner(
  client: Awaited<ReturnType<typeof publicClient>>,
  template: "booking-notification" | "enquiry-notification",
  id: string,
  data: Record<string, unknown>,
  visitorContact: string,
) {
  try {
    const to = await ownerInbox(client);
    if (!to) return;
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorContact) ? visitorContact : undefined;
    await sendTemplateEmail(template, to, { templateData: data, idempotencyKey: `${template}-${id}`, replyTo });
  } catch (error) {
    // The request is already saved in the dashboard; a failed email must not lose it.
    console.error(`[inbox] ${template} email failed`, error);
  }
}

export const submitBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const client = await publicClient();
    const id = crypto.randomUUID();
    const notes = data.notes || null;
    const { error } = await client.from("bookings").insert({
      id,
      experience: data.experience,
      visit_date: data.visitDate,
      visit_time: data.visitTime,
      party: data.party,
      name: data.name,
      contact: data.contact,
      notes,
    });
    if (error) {
      console.error("[inbox] booking insert failed", error);
      return { ok: false as const };
    }
    await notifyOwner(client, "booking-notification", id, { ...data, notes }, data.contact);
    return { ok: true as const };
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const client = await publicClient();
    const id = crypto.randomUUID();
    const message = data.message || null;
    const { error } = await client.from("enquiries").insert({
      id,
      product: data.product,
      name: data.name,
      contact: data.contact,
      message,
    });
    if (error) {
      console.error("[inbox] enquiry insert failed", error);
      return { ok: false as const };
    }
    await notifyOwner(client, "enquiry-notification", id, { ...data, message }, data.contact);
    return { ok: true as const };
  });
