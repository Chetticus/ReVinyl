// mm/yyyy
export function formatMonthYear(isoDateString: string): string {
  const date = new Date(isoDateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về 0-11
  const year = date.getFullYear();
  return `${month}/${year}`;
}

export function formatUTCToVietnamTime(isoString: any) {
  const utcDate = new Date(isoString);

  // Cộng thêm 7 tiếng để chuyển từ UTC sang UTC+7 (Giờ VN)
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnDate = new Date(utcDate.getTime() + vnOffsetMs);

  const day = String(vnDate.getDate()).padStart(2, '0');
  const month = String(vnDate.getMonth() + 1).padStart(2, '0');
  const year = vnDate.getFullYear();

  let hours = vnDate.getHours();
  const minutes = String(vnDate.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const hoursStr = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}
