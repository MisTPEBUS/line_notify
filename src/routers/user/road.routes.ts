import { Router } from 'express';

import { validateData } from '../../middleware/validateRequest';
import { createRoadRequestSchema } from '../../Validation/road.dto';
import { RoadController } from '../../controllers/road.controller';

// Import the missing CheckUserType type
const RoadRouter = Router();

//註冊
RoadRouter.post('/', validateData(createRoadRequestSchema, 'body'), RoadController.createRecord);
RoadRouter.get('/', RoadController.getRecords);

export default RoadRouter;
