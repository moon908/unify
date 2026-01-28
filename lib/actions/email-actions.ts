'use server'

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendWorkspaceInvite(emailsString: string, workspaceName: string, orgId: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials not configured')
        return { success: false, error: 'Email service is not configured. Please check environment variables.' }
    }

    const emailList = emailsString
        .split(',')
        .map(email => email.trim())
        .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

    if (emailList.length === 0) {
        return { success: false, error: 'No valid email addresses provided.' }
    }

    try {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/organisation/${orgId}/dashboard/workspace`

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: emailList.join(', '),
            subject: `Invitation to join ${workspaceName} workspace`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
                    <h2 style="color: #2563eb;">Workspace Invitation</h2>
                    <p>Hello,</p>
                    <p>You have been invited to join the <strong>${workspaceName}</strong> workspace on Unify.</p>
                    <div style="margin: 30px 0;">
                        <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Join Workspace
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Sent by Unify - Collaborative Project Management</p>
                </div>
            `,
        }

        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error: any) {
        console.error('Error sending emails:', error)
        return { success: false, error: error.message || 'Failed to send invitations.' }
    }
}
