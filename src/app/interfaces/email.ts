export interface IEmail {
    app?: string;
    to?: string;
    cc?: string;
    bcc?: string[];
    attachments?: string[];
    subject?: string;
    body?: string;
    isHtml?: boolean;
}
