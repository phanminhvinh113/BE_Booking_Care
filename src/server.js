import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/web.js';
import morgan from 'morgan';
import connectDB from './config/connectDB.js';
import connectMongGo from './config/connectMongoDB.js';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import io from './Socket/Socket.Connection.js';

dotenv.config();
//

//
const app = express();

// cofig cors for call API from FrontEnd
const corsOptions = {
   origin: process.env.URL_REACT_CLIENT,
   credentials: true, //access-control-allow-credentials:true
   optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
//PORT
const port = process.env.PORT || 8085;
//methodOverride
app.use(methodOverride('_method'));

//config app

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('combined'));

//Token Based On Cookies http
app.use(cookieParser());

//Connect db
connectDB();
//
connectMongGo();
//
viewEngine(app);
//

initWebRoutes(app);

app.listen(port, () => {
   console.log(`Server is running http://localhost:${port}`);
});
