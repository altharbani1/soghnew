import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
});

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'إعادة تعيين كلمة المرور - سوقه',
            html: `
        <div dir="rtl" style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #4F46E5;">طلب إعادة تعيين كلمة المرور</h1>
          <p>لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في سوقه.</p>
          <p>لإعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">إعادة تعيين كلمة المرور</a>
          <p>إذا لم تقم بطلب هذا التغيير، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">إذا كان الزر لا يعمل، يمكنك نسخ الرابط التالي ولصقه في المتصفح:<br>${resetLink}</p>
        </div>
      `,
        });
        console.log(`Password reset email sent to ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        // For development/debugging if env vars are missing
        if (process.env.NODE_ENV === "development") {
            console.log("DEV MODE - Reset Link:", resetLink);
            return true; // Simulate success in dev
        }
        return false;
    }
}
