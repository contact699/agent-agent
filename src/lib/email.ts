import { Resend } from "resend";

// Initialize Resend client (null if API key not configured)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Agent Agent <noreply@agent-agent.com>";

/**
 * Check if email is configured
 */
function isEmailConfigured(): boolean {
  if (!resend) {
    console.log("Email skipped: RESEND_API_KEY not configured");
    return false;
  }
  return true;
}

/**
 * Send email to agent when they receive a new pitch from a brokerage
 */
export async function sendPitchReceivedEmail({
  agentEmail,
  brokerageCompanyName,
  pitchId,
}: {
  agentEmail: string;
  brokerageCompanyName: string;
  pitchId: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    await resend!.emails.send({
      from: FROM_EMAIL,
      to: agentEmail,
      subject: `New Pitch from ${brokerageCompanyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've Received a New Pitch!</h2>
          <p>Great news! <strong>${brokerageCompanyName}</strong> has sent you a pitch on Agent Agent.</p>
          <p>They're interested in having you join their brokerage and have prepared an offer for you to review.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Pitch
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Your identity remains anonymous until you accept a pitch and the brokerage completes payment.
          </p>
        </div>
      `,
    });
    console.log(`Pitch received email sent to agent for pitch ${pitchId}`);
  } catch (error) {
    console.error("Failed to send pitch received email:", error);
  }
}

/**
 * Send email to brokerage when an agent accepts their pitch
 */
export async function sendPitchAcceptedEmail({
  brokerageEmail,
  agentAnonymousId,
  pitchId,
}: {
  brokerageEmail: string;
  agentAnonymousId: string;
  pitchId: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    await resend!.emails.send({
      from: FROM_EMAIL,
      to: brokerageEmail,
      subject: `Agent ${agentAnonymousId} Accepted Your Pitch!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Pitch Was Accepted!</h2>
          <p>Great news! <strong>Agent ${agentAnonymousId}</strong> has accepted your pitch on Agent Agent.</p>
          <p>To unlock the agent's full contact information and identity, please complete the payment.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Complete Payment
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Once payment is complete, you'll have full access to the agent's contact details.
          </p>
        </div>
      `,
    });
    console.log(`Pitch accepted email sent to brokerage for pitch ${pitchId}`);
  } catch (error) {
    console.error("Failed to send pitch accepted email:", error);
  }
}

/**
 * Send email to agent when brokerage completes payment for an accepted pitch
 */
export async function sendPaymentCompleteEmail({
  agentEmail,
  agentName,
  brokerageCompanyName,
  pitchId,
}: {
  agentEmail: string;
  agentName: string | null;
  brokerageCompanyName: string;
  pitchId: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    const greeting = agentName ? `Hi ${agentName}` : "Hi there";

    await resend!.emails.send({
      from: FROM_EMAIL,
      to: agentEmail,
      subject: `${brokerageCompanyName} Has Completed Payment - Time to Connect!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Complete - Time to Connect!</h2>
          <p>${greeting},</p>
          <p><strong>${brokerageCompanyName}</strong> has completed their payment for your accepted pitch on Agent Agent.</p>
          <p>Your contact information has now been shared with ${brokerageCompanyName}.
             They will reach out to you soon to discuss next steps.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Dashboard
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Congratulations on this exciting opportunity!
          </p>
        </div>
      `,
    });
    console.log(`Payment complete email sent to agent for pitch ${pitchId}`);
  } catch (error) {
    console.error("Failed to send payment complete email:", error);
  }
}

/**
 * Send email to brokerage when an agent declines their pitch
 */
export async function sendPitchDeclinedEmail({
  brokerageEmail,
  agentAnonymousId,
  pitchId,
}: {
  brokerageEmail: string;
  agentAnonymousId: string;
  pitchId: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    await resend!.emails.send({
      from: FROM_EMAIL,
      to: brokerageEmail,
      subject: `Pitch Update: Agent ${agentAnonymousId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Pitch Update</h2>
          <p>Unfortunately, <strong>Agent ${agentAnonymousId}</strong> has decided to decline your pitch on Agent Agent.</p>
          <p>Don't be discouraged! There are many other talented agents looking for the right brokerage.
             Keep browsing and sending pitches to find your next great team member.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Browse Agents
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Keep pitching - the right match is out there!
          </p>
        </div>
      `,
    });
    console.log(`Pitch declined email sent to brokerage for pitch ${pitchId}`);
  } catch (error) {
    console.error("Failed to send pitch declined email:", error);
  }
}
