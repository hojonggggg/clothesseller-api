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