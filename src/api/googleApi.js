const fs = require('fs').promises;
const path = require('path');
const process = require('process')

const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

export class GoogleCalendarAPI {
  // If modifying these scopes, delete token.json.
  static SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  static TOKEN_PATH = path.join(process.cwd(), 'token.json');
  static CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */

  constructor() {

    this.authorize()
      .then(auth => this.listEvents(auth))
      .catch(console.error);
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      console.log(client)
      return client;
    }
    client = await authenticate({
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      keyfilePath: path.join(process.cwd(), 'credentials.json'),

    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    })
  }
}
