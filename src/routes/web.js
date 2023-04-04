import siteRoute from './site.js';
import siteRuoteMongo from './siteMongo.js';
//
function initWebRoutes(app) {
   app.use('/', siteRoute);
   app.use('/', siteRuoteMongo);
}
//
module.exports = initWebRoutes;
