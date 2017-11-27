import nodemailer from 'nodemailer'

const from = '"Bookworm" <info@bookworm.com>'

function setup(){
  return nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
}

export function sendConfirmationEmail(user){
      const transport = setup()
      const email = {
        from,
        to:user.email,
        subject:'Welcome to Bookworm',
        html: `
          <h2>Welcome to Bookwom, please confirm your email</h2>
          <p>Click the button below to verify your email</p>
          <a href=${user.generateConfirmationUrl()}><button>Verify Email</button></a>
        `
      }

      transport.sendMail(email)
  }

  export function sendResetPasswordEmail(user){
        const transport = setup()
        const email = {
          from,
          to:user.email,
          subject:'Reset Password',
          html: `
            <h2>Follow this link to reset your password</h2>
            <a href=${user.generateResetPasswordLink()}><button>Reset Password</button></a>
          `
        }

        transport.sendMail(email)
    }
