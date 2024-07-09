import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

//  register
export const registerUser = asyncHandler(async (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    files.image[0].originalFilename = Date.now() + files.image.name;
    const __dirname = path.resolve();

    const newPath = `${__dirname}/uploads`;

    console.log(__dirname);
    const checkUser = await User.findOne({ email: fields.email });
    if (checkUser) {
      console.log('user already exists');
    } else {
      fs.copyFile(files.image[0].filepath, newPath, async (error) => {
        if (!error) {
          const createUser = await User.create({
            username: fields.username[0],
            email: fields.email[0],
            password: fields.password[0],
          });
          if (createUser) {
            console.log('success');
          }
        } else {
          console.log(error);
        }
      });
    }
  });
});
