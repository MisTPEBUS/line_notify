import exp from 'constants';
import { Router } from 'express';
import { sendMsgController } from '../../controllers/sendMsg.controller';
import { validateData } from '../../middleware/validateRequest';
import { sendMsgQuerySchema } from '../../Validation/sendMsg.dto';

const sendMsgRouter = Router();

/* sendMsgRouter.get('/', validateData(sendMsgQuerySchema, 'query'), sendMsgController.getAll); */
sendMsgRouter.get('/', validateData(sendMsgQuerySchema, 'query'), sendMsgController.getAllByDate);

export default sendMsgRouter;
