import { MailService } from '@sendgrid/mail';
import { ContactFormData } from '@shared/schema';

// Initialize the SendGrid mail service
let mailService: MailService | null = null;

// Initialize SendGrid service with API key
export function initializeSendGrid() {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY environment variable is not set. Email functionality will not work.");
    return false;
  }

  try {
    mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    return true;
  } catch (error) {
    console.error("Failed to initialize SendGrid:", error);
    return false;
  }
}

// Send a contact form submission
export async function sendContactFormEmail(formData: ContactFormData): Promise<boolean> {
  if (!mailService) {
    if (!initializeSendGrid()) {
      console.error("Cannot send email: SendGrid not initialized");
      return false;
    }
  }
  
  // Safety check - if still null after initialization attempt, return error
  if (!mailService) {
    console.error("Cannot send email: SendGrid initialization failed");
    return false;
  }

  const { name, email, companyName, phoneNumber, message, calculationData } = formData;
  
  // Calculate a simple summary of the calculation results if available
  let calculationSummary = '';
  if (calculationData) {
    const { totalFuelCost, estimatedSavings, co2Reduction, vessels } = calculationData;
    const vesselCount = vessels?.length || 0;
    
    calculationSummary = `
    <h3>Calculation Summary</h3>
    <p>Fleet: ${vesselCount} vessel(s)</p>
    <p>Annual Fuel Cost: $${totalFuelCost?.toLocaleString() || 'N/A'}</p>
    <p>Estimated Savings: $${estimatedSavings?.toLocaleString() || 'N/A'}</p>
    <p>CO₂ Reduction: ${Math.round(co2Reduction || 0).toLocaleString()} MT</p>
    `;
  }

  // Prepare email content
  const emailContent = {
    to: process.env.SENDGRID_TO_EMAIL || 'sales@sofarocean.com', // Default recipient
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sofarocean.com', // Default sender
    subject: `New Lead from Fuel Calculator: ${companyName}`,
    text: `
      New contact form submission from the Maritime Fuel Savings Calculator
      
      Name: ${name}
      Email: ${email}
      Company: ${companyName}
      Phone: ${phoneNumber || 'Not provided'}
      Message: ${message || 'Not provided'}
    `,
    html: `
      <h2>New Lead from Maritime Fuel Savings Calculator</h2>
      <p>A new potential customer has submitted their information.</p>
      
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Phone:</strong> ${phoneNumber || 'Not provided'}</p>
      <p><strong>Message:</strong> ${message || 'Not provided'}</p>
      
      ${calculationSummary}
    `
  };

  try {
    await mailService.send(emailContent);
    return true;
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return false;
  }
}
