const joi = require('joi');

const productSchema = joi.object({
    name: joi.string().required().trim(),
    img: joi.string().required().trim(),
    price: joi.number().min(0).required(),
    desc: joi.string().trim()
})

const reviewsSchema = joi.object({
    rating: joi.number().min(0).max(5),
    comment: joi.string().trim()
})


module.exports = {productSchema, reviewsSchema};