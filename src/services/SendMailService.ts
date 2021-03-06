import nodemailer, { Transport } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

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

    async execute(to: string, subject: string, variables: object, path: string) {
        //const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables)

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br"
        })

        console.log('Message sent: %s', message.messageId);
        console.log('Previwe URL: %s', nodemailer.getTestMessageUrl(message));

    }
}

export default new SendMailService();