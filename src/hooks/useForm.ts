import dayjs from 'dayjs';

export const useForm = () => {
  /*
   * 获取快速日期选择
   * @param daysList [1,2,3,4,5,6,7]
   * @param after 是否是后面的日期
   * @return
   */
  const getQuickDateSelectRange = (daysList: number[] = [7, 14, 30, 90], after: boolean = false) => {
    const result =
      daysList?.map(day => {
        return {
          text: `最近${day}天`,
          value: () => {
            return after
              ? [dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().add(day, 'day').format('YYYY-MM-DD HH:mm:ss')]
              : [dayjs().subtract(day, 'day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')];
          }
        };
      }) || [];
    return result;
  };

  return {
    getQuickDateSelectRange
  };
};
