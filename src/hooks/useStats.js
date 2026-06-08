import { useMemo } from 'react';
import { isToday, subDays, format, eachDayOfInterval } from 'date-fns';

/**
 * Compute dashboard statistics from students and attendance data.
 * @param {Array} students - Array of student objects
 * @param {Array} records - Array of attendance record objects
 */
export function useStats(students, records) {
  return useMemo(() => {
    const totalStudents = students.length;

    // Filter today's records
    const todayRecords = records.filter(r => {
      if (!r.timestamp) return false;
      const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      return isToday(date);
    });

    // Unique students present today (by UID)
    const uniquePresentToday = new Set(todayRecords.map(r => r.uid));
    const presentToday = uniquePresentToday.size;
    const absentToday = Math.max(totalStudents - presentToday, 0);
    const attendancePercentage = totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100)
      : 0;
    const totalScans = records.length;

    // Daily attendance for last 7 days (for charts)
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const dailyAttendance = last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLabel = format(day, 'MMM dd');
      const dayRecords = records.filter(r => {
        if (!r.timestamp) return false;
        const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
        return format(date, 'yyyy-MM-dd') === dayStr;
      });
      const uniqueStudents = new Set(dayRecords.map(r => r.uid));
      return {
        date: dayLabel,
        present: uniqueStudents.size,
        absent: Math.max(totalStudents - uniqueStudents.size, 0),
        scans: dayRecords.length,
      };
    });

    // Subject-wise attendance (for today)
    const subjectMap = {};
    todayRecords.forEach(r => {
      const subj = r.subject || 'Unknown';
      if (!subjectMap[subj]) subjectMap[subj] = new Set();
      subjectMap[subj].add(r.uid);
    });
    const subjectAttendance = Object.entries(subjectMap).map(([subject, uids]) => ({
      subject,
      count: uids.size,
    }));

    return {
      totalStudents,
      presentToday,
      absentToday,
      attendancePercentage,
      totalScans,
      dailyAttendance,
      subjectAttendance,
      todayRecords,
    };
  }, [students, records]);
}
