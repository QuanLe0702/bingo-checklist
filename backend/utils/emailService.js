import nodemailer from 'nodemailer';

/**
 * Email service sử dụng nodemailer
 * Để test local, sử dụng Ethereal Email (fake SMTP)
 * Production nên dùng Gmail, SendGrid, hoặc AWS SES
 */

// Tạo transporter
const createTransporter = async () => {
  // Trong môi trường production, dùng Gmail hoặc SMTP service thật
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password, không phải mật khẩu thật
      },
    });
  }

  // Trong development, dùng Ethereal (fake SMTP để test)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Gửi email OTP
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Bingo Checklist" <noreply@bingochecklist.com>',
      to: email,
      subject: '🔐 Mã xác nhận đặt lại mật khẩu - Bingo Checklist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #667eea; text-align: center; margin-bottom: 20px;">🎯 Bingo Checklist</h1>
            <h2 style="color: #333; text-align: center;">Đặt lại mật khẩu</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Xin chào,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã OTP dưới đây để xác nhận:
            </p>
            
            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
              <h1 style="color: #667eea; font-size: 48px; margin: 0; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              ⏰ <strong>Mã OTP này có hiệu lực trong 10 phút.</strong>
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              ⚠️ Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Bingo Checklist. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Bingo Checklist - Đặt lại mật khẩu
        
        Mã OTP của bạn là: ${otp}
        
        Mã này có hiệu lực trong 10 phút.
        
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    
    // Nếu dùng Ethereal, log URL để xem email
    if (process.env.EMAIL_SERVICE !== 'gmail') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send email error:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

/**
 * Tạo mã OTP ngẫu nhiên 6 số
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
