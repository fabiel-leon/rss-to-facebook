require('dotenv').config();
const rssToTelegram = require('../src');

const {
  FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_PAGE_ACCES_TOKEN, FACEBOOK_PAGE_ID,
} = process.env;

rssToTelegram({
  facebookAppID: FACEBOOK_APP_ID,
  facebookAppSecret: FACEBOOK_APP_SECRET,
  facebookPageAccesToken: FACEBOOK_PAGE_ACCES_TOKEN,
  facebookPageID: FACEBOOK_PAGE_ID,
  filter: async ({ date }) => {
    const d = new Date();
    return date.getDate() === d.getDate()
      && date.getMonth() === d.getMonth()
      && date.getFullYear() === d.getFullYear();
  },
  cron: '1/15 * * * * *',
  source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss',
});
