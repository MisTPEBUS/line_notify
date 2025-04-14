export function getUTC8DateTime() {
  const now = new Date();

  // UTC+8 偏移：8 小時 = 480 分鐘
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const year = utc8.getUTCFullYear();
  const month = String(utc8.getUTCMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const date = String(utc8.getUTCDate()).padStart(2, '0');
  const hour = String(utc8.getUTCHours()).padStart(2, '0');
  const minute = String(utc8.getUTCMinutes()).padStart(2, '0');

  return {
    year,
    month,
    date,
    hour,
    minute,
    formatted: `${year}-${month}-${date} ${hour}:${minute}`,
  };
}
