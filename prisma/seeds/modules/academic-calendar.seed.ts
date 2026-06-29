import { AcademicCalendarType, PrismaClient } from '@prisma/client';

interface CalendarEntry {
  title: string;
  type: AcademicCalendarType;
  startDate: string;
  endDate: string;
  description: string | null;
  needsSemester: boolean;
}

const DEFAULT_ENTRIES: CalendarEntry[] = [
  {
    title: 'Awal Semester Ganjil',
    type: AcademicCalendarType.SEMESTER_START,
    startDate: '2024-07-15',
    endDate: '2024-07-15',
    description: 'Hari pertama masuk semester ganjil',
    needsSemester: true,
  },
  {
    title: 'Ujian Tengah Semester Ganjil',
    type: AcademicCalendarType.EXAM_MID,
    startDate: '2024-10-07',
    endDate: '2024-10-11',
    description: 'Pelaksanaan UTS semester ganjil',
    needsSemester: true,
  },
  {
    title: 'Ujian Akhir Semester Ganjil',
    type: AcademicCalendarType.EXAM_FINAL,
    startDate: '2024-12-02',
    endDate: '2024-12-06',
    description: 'Pelaksanaan UAS semester ganjil',
    needsSemester: true,
  },
  {
    title: 'Libur Semester Ganjil',
    type: AcademicCalendarType.HOLIDAY_SCHOOL,
    startDate: '2024-12-23',
    endDate: '2025-01-03',
    description: 'Libur akhir semester ganjil',
    needsSemester: false,
  },
  {
    title: 'Awal Semester Genap',
    type: AcademicCalendarType.SEMESTER_START,
    startDate: '2025-01-06',
    endDate: '2025-01-06',
    description: 'Hari pertama masuk semester genap',
    needsSemester: true,
  },
  {
    title: 'Ujian Tengah Semester Genap',
    type: AcademicCalendarType.EXAM_MID,
    startDate: '2025-03-10',
    endDate: '2025-03-14',
    description: 'Pelaksanaan UTS semester genap',
    needsSemester: true,
  },
  {
    title: 'Ujian Akhir Semester Genap',
    type: AcademicCalendarType.EXAM_FINAL,
    startDate: '2025-05-26',
    endDate: '2025-05-30',
    description: 'Pelaksanaan UAS semester genap',
    needsSemester: true,
  },
  {
    title: 'Hari Kemerdekaan RI',
    type: AcademicCalendarType.HOLIDAY_NATIONAL,
    startDate: '2024-08-17',
    endDate: '2024-08-17',
    description: 'Hari Kemerdekaan Republik Indonesia',
    needsSemester: false,
  },
  {
    title: 'Pendaftaran Peserta Didik Baru',
    type: AcademicCalendarType.REGISTRATION,
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    description: 'Periode PPDB tahun ajaran baru',
    needsSemester: false,
  },
];

export async function seedAcademicCalendar(
  prisma: PrismaClient,
  academicYearId: string,
  semesters: { id: string; type: string }[],
) {
  const ganjil = semesters.find((s) => s.type === 'GANJIL');
  const genap = semesters.find((s) => s.type === 'GENAP');

  let created = 0;
  for (const entry of DEFAULT_ENTRIES) {
    let semesterId: string | null = null;
    if (entry.needsSemester) {
      const month = parseInt(entry.startDate.split('-')[1], 10);
      semesterId = month >= 7 ? (ganjil?.id ?? null) : (genap?.id ?? null);
    }

    const exists = await prisma.academicCalendar.findFirst({
      where: { academicYearId, title: entry.title, deletedAt: null },
    });

    if (!exists) {
      await prisma.academicCalendar.create({
        data: {
          academicYearId,
          semesterId,
          title: entry.title,
          type: entry.type,
          startDate: new Date(entry.startDate),
          endDate: new Date(entry.endDate),
          description: entry.description,
        },
      });
      created++;
    }
  }

  console.log(
    `  [academic-calendar] ${created} created, ${DEFAULT_ENTRIES.length} configured`,
  );
}
