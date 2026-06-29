import { PrismaClient, SemesterType } from '@prisma/client';

export async function seedSemesters(
  prisma: PrismaClient,
  academicYearId: string,
) {
  const types: SemesterType[] = [SemesterType.GANJIL, SemesterType.GENAP];
  const results: { id: string; type: SemesterType }[] = [];

  for (const type of types) {
    let semester = await prisma.semester.findFirst({
      where: { academicYearId, type, deletedAt: null },
    });

    if (!semester) {
      const isActive = type === SemesterType.GENAP;

      if (isActive) {
        await prisma.semester.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      semester = await prisma.semester.create({
        data: { academicYearId, type, isActive },
      });
      console.log(
        `  [semester] created: ${type}${isActive ? ' (active)' : ''}`,
      );
    } else {
      console.log(`  [semester] already exists: ${type}`);
    }

    results.push({ id: semester.id, type: semester.type });
  }

  return results;
}
