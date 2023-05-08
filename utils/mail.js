const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses")
const crypto = require('crypto')
const Verification = require('../models/verificationModel')

// config options for SES
const config = {
  region:'us-east-1'
}
const client = new SESClient(config)

exports.welcome = async(user)=>{
    const input = { // SendEmailRequest
      Source: "admin@interplanetarybank.org", // required
      Destination: { // Destination
        ToAddresses: [ // AddressList
          user.email,
        ],
      },
      Message: { // Message
        Subject: { // Content
          Data: "Welcome To IPBS", // required
          Charset: "UTF-8",
        },
        Body: { // Body
          Text: {
            Data: "Welcome", // required
            Charset: "UTF-8",
          },
          Html: {
            Data: `<!doctype html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
                <title>
            
                </title>
                <!--[if !mso]><!-- -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <!--<![endif]-->
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            
            
                <style type="text/css">
                </style>
            
            </head>
            
            <body style="background-color:#f9f9f9;">
            
            
                <div style="background-color:#f9f9f9;">
            
            
                    <!--[if mso | IE]>
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                            <tbody>
                                <tr>
                                    <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                            <tbody>
                                <tr>
                                    <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                        <td
                           style="vertical-align:bottom;width:600px;"
                        >
                      <![endif]-->
            
                                        <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
            
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="width:64px;">
            
                                                                        <img height="auto" src="https://i.ibb.co/R9RRYjL/IPBS.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                            Welcome to Interplanatery Bank
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;text-align: justify;">
                                                            Hello ${user.firstName} ${user.lastName}!<br></br>
                                                            Thank you for choosing Interplanetary Bank as your trusted financial partner. We are a private blockchain-based banking system that aims to address the problems faced by users with the contemporary banking system.
                                                            <br><br>
                                                            At IPBS, we believe in providing our clients with secure and transparent banking services powered by the latest advancements in blockchain technology. As a member of our bank, you will enjoy unparalleled <b>security</b>,<b> availability</b>, <b>efficiency</b>, and <b>flexibility</b> in managing your finances. We are committed to serving you with excellence and ensuring a seamless banking experience.
                                                            <br><br>
                                                            Thank you for choosing us as your financial partner.
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
            
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                            <tr>
                                                                <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                                    <a style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;" href="https://interplanetarybank.org/" target="_blank">
                                                                        Login to Your Account
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                            Best regards,<br><br> The Interplanetary Bank Team <br>
                                                            <a href="https://interplanetarybank.org" style="color:#2F67F6">https://interplanetarybank.org</a>
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                            </table>
            
                                        </div>
            
                                        <!--[if mso | IE]>
                        </td>
                      
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                            <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                        <td
                           style="vertical-align:bottom;width:600px;"
                        >
                      <![endif]-->
            
                                        <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
            
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="vertical-align:bottom;padding:0;">
            
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
            
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
            
                                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                           The Interplanatery Bank
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
            
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
            
                                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                            <a mailto="admin@interplanetarybank.org" style="color:#575757">Unsubscribe</a> from our emails
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
            
                                                            </table>
            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
            
                                        </div>
            
                                        <!--[if mso | IE]>
                        </td>
                      
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  <![endif]-->
            
            
                </div>
            
            </body>
            
            </html>
            `, // required
            Charset: "UTF-8",
          },
        },
      },
      Tags: [ // MessageTagList
        { // MessageTag
          Name: "mail", // required
          Value: "welcome", // required
        },
      ],
    };
    const command = new SendEmailCommand(input);
    const response = await client.send(command);
    return response
}

exports.sendVerificationLink = async(user)=>{
  const secret = crypto.randomBytes(32).toString('hex')
  const verification = await Verification.create({secret:secret,user:user._id})
  const link = `https://interplanetarybank.org/verifyUser/${user._id}/${secret}`
  //await verification.save()
  const input = { // SendEmailRequest
    Source: "no-reply@interplanetarybank.org", // required
    Destination: { // Destination
      ToAddresses: [ // AddressList
        user.email,
      ],
    },
    Message: { // Message
      Subject: { // Content
        Data: "IPBS Verification Link", // required
        Charset: "UTF-8",
      },
      Body: { // Body
        Text: {
          Data: "Welcome", // required
          Charset: "UTF-8",
        },
        Html: {
          Data: `
          <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <title>

    </title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body style="background-color:#f9f9f9;">


    <div style="background-color:#f9f9f9;">


        <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->


        <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                <tbody>
                    <tr>
                        <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                            <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
        </tr>
      
                  </table>
                <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>


        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->


        <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                <tbody>
                    <tr>
                        <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                            <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               style="vertical-align:bottom;width:600px;"
            >
          <![endif]-->

                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">

                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="width:80px;">

                                                            <img height="auto" src="https://i.ibb.co/R9RRYjL/IPBS.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:32px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                Please confirm your email
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:center;color:#555;">
                                                Please validate your email address in order to choose Interplanetary Bank as your trusted financial partner
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:40px;word-break:break-word;">

                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                <tr>
                                                    <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                        <a style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;" href="${link}" target="_blank">
                                                            Confirm Your Email
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:center;color:#555;">
                                                or copy and paste this link in your browser manually:
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:center;color:#555;">
                                                <a href="${link}" style="color:#2F67F6">${link}</a>
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                Need Help?
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:center;color:#555;">
                                                If you did not sign up, do not click on this link.
                                                Please send and feedback or bug info<br> to <a href="mailto:admin@interplanetarybank.org" style="color:#2F67F6">admin@interplanetarybank.org</a>
                                            </div>

                                        </td>
                                    </tr>

                                </table>

                            </div>

                            <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>


        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->


        <div style="Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                    <tr>
                        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                            <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               style="vertical-align:bottom;width:600px;"
            >
          <![endif]-->

                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                    <tbody>
                                        <tr>
                                            <td style="vertical-align:bottom;padding:0;">

                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">

                                                    <tr>
                                                        <td align="center" style="font-size:0px;padding:0;word-break:break-word;">

                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                Interplanetary Bank
                                                            </div>

                                                        </td>
                                                    </tr>

                                                    <tr>
                                                       <!--  <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">

                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                            </div> -->

                                                        </td>
                                                    </tr>

                                                </table>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>


        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->


    </div>

</body>

</html>
          `, // required
          Charset: "UTF-8",
        },
      },
    },
    Tags: [ // MessageTagList
      { // MessageTag
        Name: "mail", // required
        Value: "verifyLink", // required
      },
    ],
  };
  const command = new SendEmailCommand(input)
  const response = await client.send(command)
  return response
}

exports.sendOTPMail = async (user,otp)=>{
  const input = { // SendEmailRequest
    Source: "no-reply@interplanetarybank.org", // required
    Destination: { // Destination
      ToAddresses: [ // AddressList
        user.email,
      ],
    },
    Message: { // Message
      Subject: { // Content
        Data: "IPBS OTP for transaction", // required
        Charset: "UTF-8",
      },
      Body: { // Body
        Text: {
          Data: "OTP", // required
          Charset: "UTF-8",
        },
        Html: {
          Data: `${otp}`, // required
          Charset: "UTF-8",
        },
      },
    },
    Tags: [ // MessageTagList
      { // MessageTag
        Name: "mail", // required
        Value: "otp", // required
      },
    ],
  };
  const command = new SendEmailCommand(input)
  const response = await client.send(command)
  return response
}