import Hapi from '@hapi/hapi';
import sendgrid from '@sendgrid/mail';

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    sendEmailToken(email: string, token: string): Promise<void>;
  }
}

const emailPlugin = {
  name: 'app/email',
  register: async function (server: Hapi.Server) {
    if (!process.env.SENDGRID_API_KEY) {
      server.log(
        'warn',
        `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails. Using debug mode which logs the email tokens instead.`
      );
      server.app.sendEmailToken = debugSendEmailToken;
    } else {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      server.app.sendEmailToken = sendEmailToken;
    }
  }
};

export default emailPlugin;

async function sendEmailToken(email: string, token: string) {
  const msg = {
    to: email,
    from: 'igocooper.gaming@gmail.com', // this should match email of identified sender in sendgrid admin panel
    subject: 'Login token for signup to React Adventure',
    text: `The login token is: ${token}`
  };

  await sendgrid.send(msg)
}

async function debugSendEmailToken(email: string, token: string) {
  console.log(`email token for ${email}: ${token} `);
}
