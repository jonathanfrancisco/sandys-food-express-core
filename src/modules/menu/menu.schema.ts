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
  updateFood: Joi.object({
    name: Joi.string(),
    price: Joi.number().min(0),
    picture: Joi.string(),
  }),
  createScheduledMenu: Joi.object({
    scheduledAt: Joi.date(),
    foodIds: Joi.array().items(Joi.number()).min(1),
  }),
};
