import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
// Config file used to specify where multer will save the .csv files

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (req, file, callback) => {
      const hashName = crypto.randomBytes(10).toString('HEX');
      const fileName = `${hashName}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
