import * as Joi from 'joi';

export default {
  generateFoodPictureUploadUrl: Joi.object({
    filename: Joi.string().required(),
  }),
  addFood: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    picture: Joi.string().required(),
  }),
};
