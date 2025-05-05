import { MailService } from '@sendgrid/mail';
import { ContactFormData, CalculationResult } from '@shared/schema';

const mailService = new MailService();

// Initialize the SendGrid mail service with the API key from environment variables
export function initSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SendGrid API key not found. Email functionality will not work.');
    return false;
  }
  mailService.setApiKey(apiKey);
  return true;
}

// Format the vessel information for readable email content
function formatVesselsInfo(vessels: any[]): string {
  if (!vessels || vessels.length === 0) return 'No vessel information provided';
  
  return vessels.map((vessel, index) => {
    return `Vessel ${index + 1}:\n` +
           `- Type: ${vessel.category}\n` +
           `- Size: ${vessel.size}\n` +
           `- Count: ${vessel.count}\n` +
           `- Fuel Consumption: ${vessel.fuelConsumption} MT/day\n` +
           `- Sea Days Per Year: ${vessel.seaDaysPerYear}\n`;
  }).join('\n');
}

// Format calculation results for readable email content
function formatCalculationResults(calculationData: CalculationResult): string {
  return `Calculation Results:\n` +
         `- Total Fuel Cost: $${calculationData.totalFuelCost.toLocaleString()}\n` +
         `- Estimated Annual Savings: $${calculationData.estimatedSavings.toLocaleString()}\n` +
         `- CO2 Reduction: ${Math.round(calculationData.co2Reduction).toLocaleString()} MT\n` +
         `- Fuel Price: $${calculationData.fuelPrice.toLocaleString()}/MT\n` +
         `- Total Fuel Consumption: ${calculationData.totalFuelConsumption.toLocaleString()} MT\n`;
}

// Send a lead notification email using SendGrid
export async function sendLeadEmail(data: ContactFormData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not set. Cannot send email.');
      return false;
    }

    // Set up the base email message
    let emailText = `New Lead from Maritime Fuel Calculator\n\n` +
                   `Contact Information:\n` +
                   `- Name: ${data.name}\n` +
                   `- Email: ${data.email}\n` +
                   `- Company: ${data.companyName}\n`;
    
    // Add phone if provided
    if (data.phoneNumber) {
      emailText += `- Phone: ${data.phoneNumber}\n`;
    }
    
    // Add message if provided
    if (data.message) {
      emailText += `\nMessage:\n${data.message}\n`;
    }
    
    // Add calculation data if provided
    if (data.calculationData) {
      emailText += `\n${formatCalculationResults(data.calculationData as CalculationResult)}\n`;
      emailText += `\n${formatVesselsInfo(data.calculationData.vessels)}\n`;
    }
    
    // Format the HTML version of the email
    const htmlContent = emailText.replace(/\n/g, '<br>');
    
    // Set up email parameters
    const msg = {
      to: 'sales@sofarocean.com', // Change to your sales team email
      from: 'wayfinder@sofarocean.com', // Change to your verified sender
      subject: `New Lead: ${data.name} from ${data.companyName}`,
      text: emailText,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${htmlContent}</div>`,
    };
    
    // Send the email
    await mailService.send(msg);
    console.log('Lead email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending lead email:', error);
    return false;
  }
}
