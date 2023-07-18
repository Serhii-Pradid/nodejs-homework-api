// import Joi from "joi";
import contactsService from "../models/contacts.js";
import {ctrlWrapper} from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";

/* const contactsAddSchema = Joi.object ({
    name: Joi.string().required().messages({
      "any.required": `missing required name field`,
    }),
    email: Joi.string().required().messages({
      "any.required": `missing required email field`,
    }),
    phone: Joi.string().required().messages({
      "any.required": `missing required phone field`,
    }),
  }) */

  const getAll = async (req, res) => {
        const result = await contactsService.listContacts();
        res.json(result);
}

 const getById =  async (req, res) => {
       const {contactId} = req.params;
       const result = await contactsService.getContactById(contactId);
       if(!result) {
         throw HttpError(404, `Movie with id=${contactId} not found`);
    }
       res.json(result);
    } 
    

 const add = async (req, res) => {
      // const {error} = contactsAddSchema.validate(req.body);
      // if(error) {
      //   throw HttpError(400, error.message)
      // }
       const result = await contactsService.addContact(req.body)
       res.status(201).json(result)
    } 
      

 const updateById = async (req, res) => {
      // const {error} = contactsAddSchema.validate(req.body);
      // if(error) {
      //   throw HttpError(400, error.message)
      // }
      const {contactId} = req.params;
      const result = await contactsService.updateContact(contactId, req.body);
      if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`)
    } 
      res.json(result)
  }
    
  
  const deleteById = async (req, res) => {
      const {contactId} = req.params;
      const result = await contactsService.removeContact(contactId);
      if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`)
      }
      res.json("Contact deleted")
    } 
    

  export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById)
  }