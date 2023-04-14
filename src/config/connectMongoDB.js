import mongoose from 'mongoose';
require('dotenv').config();
//
mongoose.set('strictQuery', false);
const connectMongGo = () => {
    mongoose
        .connect(process.env.MONGODB_URL_ATLAT, {
            useNewUrlParser: true,
        })
        .then(() => {
            console.log('Connect to MongoDB success!');
        })
        .catch(() => {
            console.log('Connect MongoDB Failed!');
        });
};
export default connectMongGo;
