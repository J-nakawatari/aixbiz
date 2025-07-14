import sgMail from '@sendgrid/mail';
import { IContact } from '../models/Contact';

// SendGrid APIキーを設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid initialized with API key');
} else {
  console.error('SendGrid API key not found');
}

export class EmailService {
  // テスト環境やSendGrid APIキーがない場合はメール送信をスキップ
  private static shouldSendEmail(): boolean {
    return process.env.NODE_ENV === 'production' && 
           !!process.env.SENDGRID_API_KEY &&
           process.env.DISABLE_EMAIL !== 'true';
  }

  // お問い合わせ受付確認メール
  static async sendContactConfirmation(contact: IContact): Promise<void> {
    console.log('sendContactConfirmation called for:', contact.email);
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      disableEmail: process.env.DISABLE_EMAIL
    });
    
    if (!this.shouldSendEmail()) {
      console.log('Email sending skipped (test environment or no API key)');
      console.log('Would have sent email to:', contact.email);
      return;
    }

    const msg = {
      to: contact.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@aixbiz.jp',
        name: 'AI導入ナビゲーター'
      },
      subject: 'お問い合わせありがとうございます',
      text: this.getContactConfirmationText(contact),
      html: this.getContactConfirmationHtml(contact),
    };

    try {
      console.log('Attempting to send email with SendGrid...');
      const result = await sgMail.send(msg);
      console.log('Contact confirmation email sent successfully to:', contact.email);
      console.log('SendGrid response:', result);
    } catch (error: any) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('SendGrid error response:', error.response.body);
      }
      // メール送信エラーでも処理は続行（エラーをスローしない）
    }
  }

  // 管理者への通知メール
  static async sendAdminNotification(contact: IContact): Promise<void> {
    if (!this.shouldSendEmail()) {
      console.log('Admin notification skipped (test environment or no API key)');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('Admin email not configured');
      return;
    }

    const msg = {
      to: adminEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@aixbiz.jp',
        name: 'AI導入ナビゲーター'
      },
      subject: `新規お問い合わせ: ${contact.companyName}`,
      text: this.getAdminNotificationText(contact),
      html: this.getAdminNotificationHtml(contact),
    };

    try {
      await sgMail.send(msg);
      console.log('Admin notification sent');
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  }

  // お問い合わせ確認メールのテキスト版
  private static getContactConfirmationText(contact: IContact): string {
    return `
${contact.contactName} 様

この度は、AI導入ナビゲーターにお問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを承りました。

【お問い合わせ内容】
会社名: ${contact.companyName}
ご担当者名: ${contact.contactName}
メールアドレス: ${contact.email}
業種: ${contact.industry}
従業員数: ${contact.employeeCount}
課題・要望: ${contact.challenges.join('、')}
${contact.otherChallenge ? `その他の課題: ${contact.otherChallenge}` : ''}

担当者より2営業日以内にご連絡させていただきます。
お急ぎの場合は、下記メールアドレスまでご連絡ください。

info@aixbiz.jp

今後ともよろしくお願いいたします。

---
AI導入ナビゲーター
https://aixbiz.jp
`;
  }

  // お問い合わせ確認メールのHTML版
  private static getContactConfirmationHtml(contact: IContact): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f8f9fa; padding: 30px; margin-top: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .info-table td:first-child { font-weight: bold; width: 30%; }
    .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>お問い合わせありがとうございます</h1>
    </div>
    <div class="content">
      <p>${contact.contactName} 様</p>
      
      <p>この度は、AI導入ナビゲーターにお問い合わせいただき、誠にありがとうございます。</p>
      
      <p>以下の内容でお問い合わせを承りました。</p>
      
      <table class="info-table">
        <tr>
          <td>会社名</td>
          <td>${contact.companyName}</td>
        </tr>
        <tr>
          <td>ご担当者名</td>
          <td>${contact.contactName}</td>
        </tr>
        <tr>
          <td>メールアドレス</td>
          <td>${contact.email}</td>
        </tr>
        <tr>
          <td>業種</td>
          <td>${contact.industry}</td>
        </tr>
        <tr>
          <td>従業員数</td>
          <td>${contact.employeeCount}</td>
        </tr>
        <tr>
          <td>課題・要望</td>
          <td>${contact.challenges.join('、')}</td>
        </tr>
        ${contact.otherChallenge ? `
        <tr>
          <td>その他の課題</td>
          <td>${contact.otherChallenge}</td>
        </tr>
        ` : ''}
      </table>
      
      <p style="margin-top: 30px;">担当者より2営業日以内にご連絡させていただきます。<br>
      お急ぎの場合は、下記メールアドレスまでご連絡ください。</p>
      
      <p><a href="mailto:info@aixbiz.jp">info@aixbiz.jp</a></p>
      
      <p>今後ともよろしくお願いいたします。</p>
    </div>
    <div class="footer">
      <p>AI導入ナビゲーター<br>
      <a href="https://aixbiz.jp">https://aixbiz.jp</a></p>
    </div>
  </div>
</body>
</html>
`;
  }

  // 管理者通知メールのテキスト版
  private static getAdminNotificationText(contact: IContact): string {
    return `
新規お問い合わせがありました。

【お問い合わせ詳細】
会社名: ${contact.companyName}
ご担当者名: ${contact.contactName}
メールアドレス: ${contact.email}
電話番号: ${contact.phoneNumber || '未入力'}
業種: ${contact.industry}
従業員数: ${contact.employeeCount}
課題・要望: ${contact.challenges.join('、')}
${contact.otherChallenge ? `その他の課題: ${contact.otherChallenge}` : ''}
${contact.message ? `メッセージ: ${contact.message}` : ''}

受信日時: ${new Date(contact.createdAt).toLocaleString('ja-JP')}

管理画面で詳細を確認:
https://aixbiz.jp/admin/contacts/${contact._id}
`;
  }

  // 管理者通知メールのHTML版
  private static getAdminNotificationHtml(contact: IContact): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f8f9fa; padding: 30px; margin-top: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .info-table td:first-child { font-weight: bold; width: 30%; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>新規お問い合わせ</h1>
    </div>
    <div class="content">
      <table class="info-table">
        <tr>
          <td>会社名</td>
          <td>${contact.companyName}</td>
        </tr>
        <tr>
          <td>ご担当者名</td>
          <td>${contact.contactName}</td>
        </tr>
        <tr>
          <td>メールアドレス</td>
          <td>${contact.email}</td>
        </tr>
        <tr>
          <td>電話番号</td>
          <td>${contact.phoneNumber || '未入力'}</td>
        </tr>
        <tr>
          <td>業種</td>
          <td>${contact.industry}</td>
        </tr>
        <tr>
          <td>従業員数</td>
          <td>${contact.employeeCount}</td>
        </tr>
        <tr>
          <td>課題・要望</td>
          <td>${contact.challenges.join('、')}</td>
        </tr>
        ${contact.otherChallenge ? `
        <tr>
          <td>その他の課題</td>
          <td>${contact.otherChallenge}</td>
        </tr>
        ` : ''}
        ${contact.message ? `
        <tr>
          <td>メッセージ</td>
          <td>${contact.message}</td>
        </tr>
        ` : ''}
        <tr>
          <td>受信日時</td>
          <td>${new Date(contact.createdAt).toLocaleString('ja-JP')}</td>
        </tr>
      </table>
      
      <a href="https://aixbiz.jp/admin/contacts/${contact._id}" class="button">管理画面で詳細を確認</a>
    </div>
  </div>
</body>
</html>
`;
  }
}