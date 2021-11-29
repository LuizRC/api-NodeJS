import nodemailer, { Transport } from 'nodemailer';

class SendMailService {
    private client: Transport

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const tranporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = tranporter;
        });
    }

    async execute(to: string, subject: string, body: string) {

        const message = await this.client.sendMail({
            to,
            subject,
            html: body,
            from: "NPS <noreplay@nps.com.br"
        })

        console.log('Message sent: %s', message.messageId);
        console.log('Previwe URL: %s', nodemailer.getTestMessageUrl(message));

    }
}

export default new SendMailService();