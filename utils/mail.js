const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'malwablockpbx1@gmail.com',
        pass:'Mb@123456'
    }
})

function welcome(user){
    const options = {
        from:'malwablockpbx1@gmail.com',
        to:user,
        subject: 'Welcome to IPBS',
        text: 'IPBS is a private blockchain based banking system which aims to address the problems faced by users with the contemporary banking system. Thank you for choosing us as your trusted financial partner.\n\nAt IPBS, we believe in providing our clients with secure and transparent banking services powered by the latest advancements in blockchain technology. As a member of our bank, you will enjoy unparalleled security, availability, efficiency, and flexibility in managing your finances. We are committed to serving you with excellence and ensuring a seamless banking experience.\n\nThank you for choosing us as your financial partner.\n\n Best regards.'
    }
}