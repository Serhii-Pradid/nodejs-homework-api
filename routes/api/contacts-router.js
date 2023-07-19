import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import contactsSchemas from "../../schemas/contacts-schemas.js";

import {validateBody} from "../../decorators/index.js";

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', validateBody(contactsSchemas.contactsAddSchema), contactsController.add)

contactsRouter.delete('/:contactId', contactsController.deleteById)

contactsRouter.put('/:contactId', validateBody(contactsSchemas.contactsAddSchema), contactsController.updateById)

export default contactsRouter;