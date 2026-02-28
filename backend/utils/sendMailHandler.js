import { Resend } from "resend"
import { AppError } from "./AppError.js"

class MailService {
    constructor() {
        this.client = null
    }

    createClient() {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
            return null
        }

        return new Resend(apiKey)
    }

    getClient() {
        if (!this.client) {
            this.client = this.createClient()
        }
        return this.client
    }

    getSender() {
        return process.env.RESEND_FROM || "onboarding@resend.dev"
    }

    async sendRawEmail(to, subject, html) {
        if (!to) {
            throw new AppError("Recipient email is required", 400)
        }
        const client = this.getClient()
        if (!client) {
            throw new AppError("RESEND_API_KEY is missing. Email service is not configured.", 500)
        }
        const from = this.getSender()
        if (!from) {
            throw new AppError("RESEND_FROM is missing. Email sender is not configured.", 500)
        }

        const { error } = await client.emails.send({
            from,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        })

        if (error) {
            throw new AppError(error.message || "Failed to send email", 502)
        }
    }

    async sendVerificationMail(to, subject, token, software) {
        const html = `<p>Your ${software} verification code is <b>${token}</b>.</p>`
        await this.sendRawEmail(to, subject, html)
    }

    async sendWelcomeMail(to, subject, software) {
        const html = `<p>Welcome to ${software}.</p>`
        await this.sendRawEmail(to, subject, html)
    }

    async forgotPassword(to, subject, link, software) {
        const html = `<p>${software} password reset: <a href="${link}">${link}</a></p>`
        await this.sendRawEmail(to, subject, html)
    }

    async passwordResetSuccess(to, subject, software) {
        const html = `<p>Your ${software} password has been reset successfully.</p>`
        await this.sendRawEmail(to, subject, html)
    }
}

export default new MailService()
