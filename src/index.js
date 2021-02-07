const { stream, feedparser } = require('rss-rewriter');
const { CronJob } = require('cron');
const async = require('async');
const FB = require('fb');

module.exports = ({
  facebookAppID,
  facebookAppSecret,
  facebookPageAccesToken,
  facebookPageID,
  source,
  cron = '00 00 06 * * *',
  timezone = 'America/Havana',
  filter,
  // template = '<a href="{{image}}"> </a> <b><a href="{{link}}">{{title}}</a></b>\n{{channel}}',
  preprocess,
  // disablePreview = false,
  // extraFields = {},
}) => {
  FB.options({
    clientID: facebookAppID, // process.env.FACEBOOK_APP_ID,
    clientSecret: facebookAppSecret, // process.env.FACEBOOK_APP_SECRET,
    accessToken: facebookPageAccesToken, // process.env.FACEBOOK_PAGE_ACCES_TOKEN
  });
  // var pageid = process.env.FACEBOOK_PAGE_ID;
  const postFacebook = async (message, link) => new Promise((res) => {
    FB.api(`${facebookPageID}/feed`, 'post', {
      message,
      link,
    }, (faceres) => {
      if (faceres.error) console.error(faceres.error);
      else { console.log(faceres); }
      res();
    });
  });

  return new CronJob(
    cron,
    async () => {
      try {
        console.log('executing cron');
        let items;
        if (typeof source === 'function') {
          items = await source();
        } else if (Array.isArray(source)) {
          items = source;
        } else {
          const data = await stream(source);
          items = await feedparser(data);
        }
        const filtered = filter ? await async.filter(items, filter) : items;
        const procesed = preprocess ? await async.map(filtered, preprocess) : filtered;
        // console.log('items', items.length, filtered.length);
        const result = await async.eachOfSeries(procesed,
          async (item) => postFacebook(item.title, item.link, item.image));

        console.log('finished', result);
      } catch (error) {
        console.error(error);
      }
    },
    null,
    true,
    timezone,
  );
};
