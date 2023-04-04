const { google } = require('googleapis');
const { auth } = require('google-auth-library');
const { encode } = require('base-64');
const { DateTime } = require('luxon');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Relative path for default - can be overridden in the function call
// service-key is the second file

const serviceAccountFile = path.join(__dirname, '../email_api/service-key.json');


// Google crap start -------------------------------------
async function serviceAccountLogin(senderAccount, serviceAccountFile) {
  const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

  const authClient = await auth.fromJSON(require(serviceAccountFile));
  authClient.subject = senderAccount;

  const gmail = google.gmail({
    version: 'v1',
    auth: authClient,
  });

  return gmail;
}

// Google crap ends ----------------------
exports.sendmail = async (req, res, next) => {
console.log("here");

console.log(serviceAccountFile);
  
  try {
    const to = 'k.daulatdar@gmail.com';
    const subject = 'Test email';
    const content = 'This is a test email from Node.js!';
    const sender = 'services@cbiconsultants.com';

    const gmail = await serviceAccountLogin(sender, serviceAccountFile);

    const message = `To: ${to}
From: 'services@cbiconsultants.com'
Subject: ${subject}

${content}`;
    const encodedMessage = encode(message);

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });

    const messageId = result.data.id;
    const logMessage = `${DateTime.local()} : Sending Email as: ${messageId}\n`;

    console.log(logMessage);

    return res.status(200).json({ message: 'sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
