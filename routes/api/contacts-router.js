import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import contactsSchemas from "../../schemas/contacts-schemas.js";

import {validateBody} from "../../decorators/index.js";

import {isValidId, isEmptyBody} from "../../middlewars/index.js"

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', isValidId, contactsController.getById)

contactsRouter.post('/', validateBody(contactsSchemas.contactsAddSchema), contactsController.add)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

contactsRouter.put('/:contactId', isValidId, validateBody(contactsSchemas.contactsAddSchema), contactsController.updateById)

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactsController.updateStatusContact)

export default contactsRouter;