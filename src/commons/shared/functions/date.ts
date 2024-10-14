export const getStartAndEndDate = (monthString) => {
  const [year, month] = monthString.split('/').map(Number);
  
    // 시작 날짜와 마지막 날짜를 문자열 형식으로 생성
    let startDate = `${year}/${month.toString().padStart(2, '0')}/01`; // 시작 날짜
    let endDate = `${year}/${month.toString().padStart(2, '0')}/31`; // 기본 마지막 날짜
  
    // 10월의 경우 마지막 날짜가 31일
    if (month === 2) {
      // 2월의 경우 윤년 고려
      endDate = `${year}/${month.toString().padStart(2, '0')}/${(year % 4 === 0 ? 29 : 28)}`;
    } else if ([4, 6, 9, 11].includes(month)) {
      // 4, 6, 9, 11월의 경우 30일
      endDate = `${year}/${month.toString().padStart(2, '0')}/30`;
    }
  
    return { startDate, endDate };
}

export const _getStartAndEndDate = (monthString) => {
  const [year, month] = monthString.split('/').map(Number);
  
  // 시작 날짜는 항상 첫째 날로 설정
  const startDate = `${year}/${month.toString().padStart(2, '0')}/01`;

  // 마지막 날짜 계산: Date 객체를 사용하여 해당 월의 마지막 날짜를 구함
  const lastDay = new Date(year, month, 0).getDate(); // month는 0부터 시작하므로
  const endDate = `${year}/${month.toString().padStart(2, '0')}/${lastDay}`;

  return { startDate, endDate };
}

export const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (1 + date.getMonth())).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return year + "/" + month + "/" + day;
}