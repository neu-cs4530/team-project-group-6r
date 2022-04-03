import mongoose from 'mongoose';

module.exports = {
  connect: (DB_URL: string) => {

    mongoose.connect(DB_URL);


    mongoose.connection.on('error', () => {
      process.exit();
    });
  },

  close: () => {
    mongoose.connection.close();
  },
};