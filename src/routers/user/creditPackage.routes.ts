import { Router } from 'express';
import creditPackageController from '../../controllers/lineHook.controller';
import { validateData } from '../../middleware/validateRequest';
import creditPackageDto from '../../Validation/lineHook.dto';

const lineHookRouter = Router();
/**
 * GET /
 * 取得所有
 */
lineHookRouter.get('/', creditPackageController.getAsyncPublicCreditPackage);
/**
 * POST /
 * 新增一筆
 */
lineHookRouter.post(
  '/',
  validateData(creditPackageDto.creditPackageSchema, 'body'),
  creditPackageController.createAsyncCreditPackage,
);
/**
 * DELETE /
 * 刪除指定 ID 的 CreditPackage
 */
lineHookRouter.delete(
  '/:creditPackageId',
  validateData(creditPackageDto.delParams, 'params'),
  creditPackageController.deleteAsyncCreditPackage,
);

export default lineHookRouter;
