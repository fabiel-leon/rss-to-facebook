require('dotenv').config();
const { rewriter } = require('rss-rewriter');
const rssToTelegram = require('../src');

const {
  FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_PAGE_ACCES_TOKEN, FACEBOOK_PAGE_ID,
} = process.env;

rssToTelegram({
  facebookAppID: FACEBOOK_APP_ID,
  facebookAppSecret: FACEBOOK_APP_SECRET,
  facebookPageAccesToken: FACEBOOK_PAGE_ACCES_TOKEN,
  facebookPageID: FACEBOOK_PAGE_ID,
  cron: '1/15 * * * * *',
  // filter: async () => true,
  source: async () => rewriter({
    source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss', // source url or stream
    site: 'https://pricecrypto.netlify.app/redirect', // redirection page
    title: 'My Rss title',
    description: 'My Rss description',
    format: 'rss', // rss|atom|json  , default is rss
    array: true, // return array of items instead of string result in defined format
  }),
});
