import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express()
app.use(cors())
app.use(express.json())

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text,
  }

  try {
    await sgMail.send(msg)
    res.status(200).json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to send email' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
