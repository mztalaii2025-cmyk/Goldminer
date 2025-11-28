const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { email, code } = JSON.parse(event.body);
    console.log('📧 Sending email to:', email);

    // استفاده از Gmail واقعی
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // از Environment Variables
        pass: process.env.GMAIL_PASS   // از Environment Variables
      }
    });

    const mailOptions = {
      from: '"معدن‌چی طلا" <noreply@goldminer.com>',
      to: email,
      subject: 'کد تأیید معدن‌چی طلا',
      text: `کد تأیید ۶ رقمی شما: ${code}\n\nاین کد برای تأیید حساب شما در بازی معدن‌چی طلا است.`,
      html: `
        <div style="font-family: Tahoma; direction: rtl; text-align: right;">
          <h2 style="color: #FFD700;">کد تأیید معدن‌چی طلا</h2>
          <p>کد تأیید ۶ رقمی شما:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 10px; text-align: center; font-size: 24px; font-weight: bold; color: #FFD700; margin: 20px 0;">
            ${code}
          </div>
          <p>این کد برای تأیید حساب شما در بازی معدن‌چی طلا است.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            اگر شما این درخواست را نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'ایمیل ارسال شد'
      })
    };

  } catch (error) {
    console.error('❌ Gmail Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'خطا در ارسال ایمیل. لطفاً بعداً تلاش کنید.'
      })
    };
  }
};
