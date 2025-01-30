const joi = require("joi");

const customerSchema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required().email(),
    contact_number: joi.string().required(),
    address: joi.string().required()
})


function CustomerValidation(req,res,next){
    const{full_name, email, contact_number, address} = req.body;
    const{error} = customerSchema.validate({full_name, email, contact_number, address})
    if (error) {
        return res.json(error)
    }
    next()
}

module.exports = CustomerValidation;