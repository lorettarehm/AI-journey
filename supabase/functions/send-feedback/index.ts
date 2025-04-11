
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variable
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Email address to send feedback to (stored as environment variable for security)
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "loretta.rehm@gmail.com";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  subject: string;
  message: string;
  techniqueId?: string;
  techniqueName?: string;
  type: 'feedback' | 'support';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, message, techniqueId, techniqueName, type }: FeedbackRequest = await req.json();

    // Create email content based on type
    const emailSubject = type === 'feedback' 
      ? `Feedback: ${subject}`
      : `Support Request: ${subject}`;

    const emailHtml = `
      <h1>${type === 'feedback' ? 'Feedback Received' : 'Support Request'}</h1>
      <p><strong>Subject:</strong> ${subject}</p>
      ${techniqueId ? `<p><strong>Technique ID:</strong> ${techniqueId}</p>` : ''}
      ${techniqueName ? `<p><strong>Technique Name:</strong> ${techniqueName}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "NeuroDev App <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
