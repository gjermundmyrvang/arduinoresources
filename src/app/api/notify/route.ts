import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { NewResourceEmail } from "../../components/new-email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { subject, body, resourceUrl } = await req.json();

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email");

  console.log("Subscribers:", subscribers, "DB error:", error);

  if (error)
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );

  const emails = subscribers.map((s) => s.email);
  console.log("Sending to:", emails);

  const { error: sendError, data: sendData } = await resend.batch.send(
    emails.map((to) => ({
      from: "Arduino Ressurser <noreply@gjermundmyrvang.com>",
      to,
      subject,
      bcc: "myrvang.gjermund@gmail.com",
      react: NewResourceEmail({ to, body, resourceUrl }),
    })),
  );

  console.log("Resend data:", JSON.stringify(sendData, null, 2));
  console.log("Resend error:", JSON.stringify(sendError, null, 2));

  if (sendError)
    return NextResponse.json(
      { error: "Failed to send", detail: sendError },
      { status: 500 },
    );

  return NextResponse.json({ success: true, sent: emails.length });
}
