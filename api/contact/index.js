export default {
    async fetch(request, env, ctx) {
      // Handle CORS headers to allow requests from your Cloudflare Pages frontend
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };
  
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }
  
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: corsHeaders });
      }
  
      try {
        const { name, email, message } = await request.json();
  
        if (!name || !email || !message) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
  
        // Send the email through Resend using your secure environment variable
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: "shekarweblab@gmail.com", // Replace with your personal inbox email where you want to receive inquiries
            subject: `New Project Inquiry from ${name}`,
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>`
          })
        });
  
        const resendData = await resendResponse.json();
  
        if (!resendResponse.ok) {
          throw new Error(resendData.message || "Failed to send via Resend");
        }
  
        return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
  
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    },
  };