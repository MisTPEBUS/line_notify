import { Router } from 'express';
import { UiFormSettingController } from '../../controllers/UiFormSetting.controller';

const configRouter = Router();
/**
 * GET /
 * 取得所有
 */
configRouter.get('/UiFormSetting/:fieldName', UiFormSettingController.UiFormSetting);

export default configRouter;
