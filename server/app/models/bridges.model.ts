import Joi from "joi";

const bridgesSchema = Joi.object({
  name: Joi.string().required(),
  data: Joi.array()
    .items(
      Joi.object({
        flowerName: Joi.string().required(),
        url: Joi.string().required(),
        status: Joi.boolean().required(),
      })
    )
    .required(),
});

export default bridgesSchema;
