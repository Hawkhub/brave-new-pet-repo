import { NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Define validation schemas for each step
const Step1Schema = z.object({
  projectType: z.enum(['website', 'webapp', 'mobile', 'other']),
  budget: z.enum(['<5k', '5k-10k', '10k-20k', '>20k']),
  timeline: z.enum(['1-2months', '2-3months', '3-6months', '>6months']),
});

const Step2Schema = z.object({
  companyName: z.string().min(2),
  industry: z.string().min(2),
  description: z.string().min(50),
});

const Step3Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredContact: z.enum(['email', 'phone']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate all steps
    const step1Data = Step1Schema.parse(body.step1);
    const step2Data = Step2Schema.parse(body.step2);
    const step3Data = Step3Schema.parse(body.step3);

    // Create email content
    const emailContent = `
      New Project Inquiry
      
      Project Details:
      - Type: ${step1Data.projectType}
      - Budget: ${step1Data.budget}
      - Timeline: ${step1Data.timeline}
      
      Company Information:
      - Name: ${step2Data.companyName}
      - Industry: ${step2Data.industry}
      - Project Description: ${step2Data.description}
      
      Contact Information:
      - Name: ${step3Data.name}
      - Email: ${step3Data.email}
      - Phone: ${step3Data.phone || 'Not provided'}
      - Preferred Contact: ${step3Data.preferredContact}
    `;

    // Send email
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL!,
      subject: 'New Project Inquiry',
      text: emailContent,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry submitted successfully' 
    });

  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit inquiry' },
      { status: 400 }
    );
  }
} 