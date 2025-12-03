
const fetch = require('node-fetch');

// Zoho Mail API docs: https://www.zoho.com/mail/help/api/post-send-an-email.html
// Required env vars: ZOHO_API_KEY, ZOHO_SENDER, ZOHO_DOMAIN, ZOHO_FROM, ZOHO_TO

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON' }) };
  }

  const { name, email, company, message } = payload;
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }

  // Zoho Mail API setup
  const apiKey = process.env.ZOHO_API_KEY;
  const sender = process.env.ZOHO_SENDER; // e.g. 'contact@duatflow.com'
  const domain = process.env.ZOHO_DOMAIN; // e.g. 'duatflow.com'
  const from = process.env.ZOHO_FROM || sender;
  const to = process.env.ZOHO_TO || 'contact@duatflow.com';

  if (!apiKey || !sender || !domain) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Zoho Mail API not configured.' }) };
  }

  // Compose email
  const subject = `Website Contact Request from ${name}`;
  const bodyText = `Name: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\n\nMessage:\n${message}`;
  const bodyHtml = `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company || '-'}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`;

  // Zoho Mail API endpoint
  const url = `https://mail.zoho.com/api/accounts/${sender}/messages`; // sender is the account email

  // Zoho Mail API payload
  const mailPayload = {
    fromAddress: from,
    toAddress: [to],
    ccAddress: [email],
    subject,
    content: [
      { type: 'plain', content: bodyText },
      { type: 'html', content: bodyHtml }
    ]
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(mailPayload)
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ message: data.message || 'Failed to send email', details: data }) };
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'Message sent', details: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Error sending email', error: err.message }) };
  }
};
