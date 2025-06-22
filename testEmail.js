require('dotenv').config();
const sendReminderEmail = require('./mailer');

sendReminderEmail('your_email@gmail.com', 'Test Email', 'Hello from TaskX Pro test!')
  .then(() => console.log('Test email sent'))
  .catch(console.error);
