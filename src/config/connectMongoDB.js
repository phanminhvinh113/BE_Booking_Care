import mongoose from 'mongoose';
const connectMongGo = () => {
    mongoose
        .connect('mongodb+srv://booking_care:phanminhvinh2003@cluster02.gnptasf.mongodb.net/?retryWrites=true&w=majority', {
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
