import nodeMailer from 'nodemailer';
import webConfig from '../web.config.json';

class Email {

  sendMail(to, subject, htmlContent) {

    const EMAIL = webConfig.emailconfig.email;
    const PASSWORD = webConfig.emailconfig.password;
    const MAIL_HOST = webConfig.emailconfig.host;
    const MAIL_PORT = webConfig.emailconfig.port;
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    var transporter = nodeMailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    var options = {
      from: EMAIL, // send form email
      to: to, // send to email
      subject: subject, // title mail
      html: htmlContent // content mail.
    };

    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options);
  }

}

export default new Email;
