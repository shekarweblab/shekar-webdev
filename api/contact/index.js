module.exports = async function (context, req) {
    context.log('Contact form function processed a request.');

    // Grab name, email, and message from the submitted form data
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        context.res = {
            status: 400,
            body: "Please provide name, email, and message."
        };
        return;
    }

    // For now, this logs the submission to your Azure console.
    // Once you set up SendGrid/Resend, you can plug their API here to send the actual email to your inbox.
    context.log(`New submission from ${name} (${email}): ${message}`);

    context.res = {
        status: 200,
        body: { success: true, message: "Requirement received successfully!" }
    };
};