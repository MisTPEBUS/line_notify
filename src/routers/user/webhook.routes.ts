import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { validateData } from '../../middleware/validateRequest';

import { createUserRequestSchema, isCheckRequestSchema } from '../../Validation/user.dto';

// Import the missing CheckUserType type
const webhookRouter = Router();

webhookRouter.post('/', UserController.getUserByLineUserId);

export default webhookRouter;
