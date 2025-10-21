// src/lib/utils/calendar.ts
export interface WeekData {
  weekNumber: number;
  label: string;
  startDate: Date;
  endDate: Date;
  dateRange: string;
}

export const getWeeksInMonth = (year: number, month: number): WeekData[] => {
  const weeks: WeekData[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let weekStart = new Date(firstDay);
  let weekNumber = 1;

  while (weekStart <= lastDay) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekEnd > lastDay) {
      weekEnd.setTime(lastDay.getTime());
    }

    weeks.push({
      weekNumber,
      label: `Minggu ke-${weekNumber}`,
      startDate: new Date(weekStart),
      endDate: new Date(weekEnd),
      dateRange: `${weekStart.getDate()} - ${weekEnd.getDate()}`,
    });

    weekStart.setDate(weekStart.getDate() + 7);
    weekNumber++;
  }

  return weeks;
};

export const getMonthsIn2025 = () => {
  return [
    { value: 0, label: 'Januari 2025' },
    { value: 1, label: 'Februari 2025' },
    { value: 2, label: 'Maret 2025' },
    { value: 3, label: 'April 2025' },
    { value: 4, label: 'Mei 2025' },
    { value: 5, label: 'Juni 2025' },
    { value: 6, label: 'Juli 2025' },
    { value: 7, label: 'Agustus 2025' },
    { value: 8, label: 'September 2025' },
    { value: 9, label: 'Oktober 2025' },
    { value: 10, label: 'November 2025' },
    { value: 11, label: 'Desember 2025' },
  ];
};

export const getDayName = (date: Date): string => {
  const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  return days[date.getDay()];
};
