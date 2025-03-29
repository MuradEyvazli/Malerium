import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    
    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'İsim, e-posta ve mesaj alanları zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Lütfen geçerli bir e-posta adresi girin.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Configure nodemailer with a real SMTP service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail kullanabilir veya başka bir sağlayıcı ile değiştirebilirsiniz
      auth: {
        user: process.env.EMAIL_USER, // .env dosyasında ayarlayın
        pass: process.env.EMAIL_PASSWORD // Gmail kullanıyorsanız uygulama şifresi kullanın
      }
    });
    
    // Email options
    const mailOptions = {
      from: `"İletişim Formu" <${process.env.EMAIL_USER}>`,
      to: 'muradnihad00@gmail.com', // E-posta adresiniz
      replyTo: email, // Doğrudan gönderene yanıt vermeyi kolaylaştırır
      subject: `${name} Tarafından Yeni İletişim Formu Gönderimi`,
      text: `
Ad: ${name}
E-posta: ${email}
Mesaj: ${message}
      `,
      html: `
<h2>Yeni İletişim Formu Gönderimi</h2>
<p><strong>Gönderen:</strong> ${name}</p>
<p><strong>E-posta:</strong> ${email}</p>
<p><strong>Mesaj:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return new Response(
      JSON.stringify({ message: 'Mesaj başarıyla gönderildi!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('E-posta gönderirken hata:', error);
    
    return new Response(
      JSON.stringify({ error: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}