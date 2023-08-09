import Contact from "../models/contacts.js";

import {ctrlWrapper} from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import fs from "fs/promises";

import path from "path";

const avatarPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
        const {_id: owner} = req.user;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner" , "email");
        res.json(result);
}

const getById =  async (req, res) => {
       const {contactId} = req.params;
              const result = await Contact.findById(contactId);
       if(!result) {
         throw HttpError(404, `Movie with id=${contactId} not found`);
    }
       res.json(result);
    }
    

 const add = async (req, res) => {
      const {_id: owner} = req.user;
      const { path: oldPath, filename } = req.file;
      const newPath = path.join(avatarPath, filename);
      await fs.rename(oldPath, newPath);
      const avatar = path.join("avatars", filename)
      const result = await Contact.create({...req.body, avatar, owner})
      res.status(201).json(result)
    }
      

 const updateById = async (req, res) => {
     
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
      if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`)
    } 
      res.json(result)
  }

  const updateStatusContact = async (req, res) => {
     
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`)
  } 
    res.json(result)
}
    
  
   const deleteById = async (req, res) => {
      const {contactId} = req.params;
      const result = await Contact.findByIdAndDelete(contactId);
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
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById)
  } 