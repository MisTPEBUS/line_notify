export enum ErrorCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const ErrorMessage = {
  [ErrorCode.BAD_REQUEST]: '欄位未填寫正確',
  [ErrorCode.CONFLICT]: '資料重複',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '伺服器錯誤',
};

export const ErrorStatus = {
  [ErrorCode.SUCCESS]: '成功',
  [ErrorCode.BAD_REQUEST]: '送出失敗',
  [ErrorCode.CONFLICT]: '新增失敗',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'server error',
};
