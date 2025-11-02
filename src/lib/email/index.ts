import { Resend } from 'resend';
import { log } from '@/lib/logger';

/**
 * Email Notification Service
 * Send transactional emails using Resend
 */

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@toilet-monitoring.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@toilet-monitoring.com';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    log.warn('Email service not configured', {
      type: 'email',
      subject: options.subject,
    });
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      log.error('Failed to send email', error, {
        type: 'email',
        subject: options.subject,
      });
      return false;
    }

    log.info('Email sent successfully', {
      type: 'email',
      subject: options.subject,
      messageId: data?.id,
    });

    return true;
  } catch (error) {
    log.error('Email sending error', error);
    return false;
  }
}

/**
 * Send inspection completion notification
 */
export async function sendInspectionCompletedEmail(params: {
  userEmail: string;
  userName: string;
  locationName: string;
  status: 'pass' | 'fail' | 'needs_attention';
  inspectionId: string;
}): Promise<boolean> {
  const statusColor = {
    pass: '#10b981',
    fail: '#ef4444',
    needs_attention: '#f59e0b',
  }[params.status];

  const statusText = {
    pass: 'Passed',
    fail: 'Failed',
    needs_attention: 'Needs Attention',
  }[params.status];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status { display: inline-block; padding: 8px 16px; border-radius: 6px; color: white; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Inspection Completed</h1>
          </div>
          <div class="content">
            <p>Hello ${params.userName},</p>
            <p>An inspection has been completed for <strong>${params.locationName}</strong>.</p>
            <p>
              Status: <span class="status" style="background-color: ${statusColor};">${statusText}</span>
            </p>
            <p>Inspection ID: ${params.inspectionId}</p>
            <p>Please review the inspection details in the dashboard.</p>
          </div>
          <div class="footer">
            <p>Smart Toilet Monitoring System</p>
            <p>This is an automated notification.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: params.userEmail,
    subject: `Inspection ${statusText}: ${params.locationName}`,
    html,
    text: `Inspection completed for ${params.locationName}. Status: ${statusText}. Inspection ID: ${params.inspectionId}`,
  });
}

/**
 * Send alert notification to admin
 */
export async function sendAlertEmail(params: {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  metadata?: Record<string, any>;
}): Promise<boolean> {
  const severityColor = {
    info: '#3b82f6',
    warning: '#f59e0b',
    critical: '#ef4444',
  }[params.severity];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; background: #f9fafb; }
          .metadata { background: white; padding: 15px; border-radius: 6px; margin-top: 15px; }
          .metadata-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: ${severityColor};">
            <h1>🚨 ${params.title}</h1>
          </div>
          <div class="content">
            <p><strong>Severity:</strong> ${params.severity.toUpperCase()}</p>
            <p>${params.message}</p>
            ${
              params.metadata
                ? `
              <div class="metadata">
                <h3>Additional Details</h3>
                ${Object.entries(params.metadata)
                  .map(
                    ([key, value]) => `
                  <div class="metadata-item">
                    <span><strong>${key}:</strong></span>
                    <span>${value}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
                : ''
            }
            <p style="margin-top: 20px;"><em>Timestamp: ${new Date().toISOString()}</em></p>
          </div>
          <div class="footer">
            <p>Smart Toilet Monitoring System - Alert</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[${params.severity.toUpperCase()}] ${params.title}`,
    html,
    text: `${params.title}\n\n${params.message}\n\nSeverity: ${params.severity}`,
  });
}

/**
 * Send weekly summary report
 */
export async function sendWeeklySummaryEmail(params: {
  userEmail: string;
  userName: string;
  inspectionsCount: number;
  passRate: number;
  topLocations: Array<{ name: string; count: number }>;
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .stat { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; text-align: center; }
          .stat-value { font-size: 36px; font-weight: bold; color: #3b82f6; }
          .stat-label { color: #6b7280; margin-top: 5px; }
          .locations { background: white; padding: 15px; border-radius: 6px; margin-top: 15px; }
          .location-item { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Summary</h1>
          </div>
          <div class="content">
            <p>Hello ${params.userName},</p>
            <p>Here's your weekly inspection summary:</p>

            <div class="stat">
              <div class="stat-value">${params.inspectionsCount}</div>
              <div class="stat-label">Total Inspections</div>
            </div>

            <div class="stat">
              <div class="stat-value">${params.passRate.toFixed(1)}%</div>
              <div class="stat-label">Pass Rate</div>
            </div>

            <div class="locations">
              <h3>Top Inspected Locations</h3>
              ${params.topLocations
                .map(
                  (loc) => `
                <div class="location-item">
                  <strong>${loc.name}</strong>: ${loc.count} inspections
                </div>
              `
                )
                .join('')}
            </div>
          </div>
          <div class="footer">
            <p>Smart Toilet Monitoring System</p>
            <p>Keep up the great work!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: params.userEmail,
    subject: 'Your Weekly Inspection Summary',
    html,
    text: `Weekly Summary: ${params.inspectionsCount} inspections, ${params.passRate.toFixed(1)}% pass rate.`,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  userEmail: string;
  resetToken: string;
  resetUrl: string;
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p>You requested a password reset for your Toilet Monitoring account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${params.resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Or copy this link: ${params.resetUrl}
            </p>
          </div>
          <div class="footer">
            <p>Smart Toilet Monitoring System</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: params.userEmail,
    subject: 'Password Reset Request',
    html,
    text: `Reset your password: ${params.resetUrl}`,
  });
}
