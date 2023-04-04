import nodemailer from 'nodemailer';
import moment from 'moment';
require('dotenv').config();
//
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
//
const sendSimpleEmail = async (data) => {
    // create reusable transporter object using the default SMTP transport
    const { namePatient, nameDoctor, time, date, baseUrlSend, email } = data;
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    //
    const dateFormat = capitalizeFirstLetter(moment(date).locale('vi').format('dddd - DD/MM/YYYY'));
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `<bookingcare.com>`, // sender address
        to: email, // list of receivers
        subject: `Lịch hẹn khám bệnh`, // Subject line
        text: 'Bạn đã đặt lịch khám này?', // plain text body
        html: `
    <div>
      <h2> Xin chào ${namePatient}!</h2>
      <h3>
        Bạn có một lịch hẹn với bác sĩ: <strong>${nameDoctor}</strong> vào lúc ${time.valueVI} 
          ${dateFormat}
      </h3>
      <a href=${baseUrlSend}>Click vào đây để xem lịch khám của bạn đã đặt!</a>
    </div>
    `, // html body
    });
};
const sendEmailCofirmBill = async (data) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    //
    const { email, nameDoctor, baseUrlSend, namePatient } = data;
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `<bookingcare@gmail.com>`, // sender address
        to: email, // list of receivers
        subject: `<BookingCare> Hóa đơn khám bệnh `, // Subject line
        text: 'Bạn đã đặt lịch khám này?', // plain text body
        html: `
    <div>
      <h2> Xin chào ${namePatient}!</h2>
      <div  >
        Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ tại booking care cùng với bác sĩ: <strong>${nameDoctor}</strong>
      </div>
      <a href=${baseUrlSend}>Click vào đây để đánh giá bác sĩ!</a>
    </div>
    `, // html body
        attachments: [
            {
                filename: `bill-${data.namePatient}-${data.patientId}.png`,
                content: data.image.split('base64')[1],
                encoding: 'base64',
            },
        ],
    });
};
const sendOTPEmailService = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `<bookingcare.com>`, // sender address
        to: email, // list of receivers
        subject: `Xác nhận Email!(Booking Care)`, // Subject line
        text: 'Bạn đang đăng ký tài khoản Booking App', // plain text body
        html: `
      <div>
        <h3> Xin chào ${email}!</h3>
        <p>Mã xác nhận của bạn: <strong>${otp}</strong></p>
        <span>Mã sẽ hết hạn trong 3 phút</span>
      </div>
      `, // html body
    });
};
module.exports = {
    sendSimpleEmail,
    sendEmailCofirmBill,
    sendOTPEmailService,
};
