import mongoose from 'mongoose';

export const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch(err => {
      console.error('MongoDB connection unsuccessful, retry after 5 seconds.', err);
      setTimeout(connectWithRetry, 5000);
    });
};
