import siteRoute from './site.js';
import siteRuoteMongo from './siteMongo.js';
import { limitRequestApi } from '../middlewares/limitation.js';
//
function initWebRoutes(app) {
    app.use(limitRequestApi);
    app.use('/', siteRoute);
    app.use('/', siteRuoteMongo);
}
//
module.exports = initWebRoutes;
