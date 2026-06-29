import { Injectable } from '@nestjs/common';
import { DashboardsRepository } from '../repositories/dashboards.repository.js';

@Injectable()
export class GetDashboardSummaryService {
  constructor(private readonly dashboardRepository: DashboardsRepository) {}

  async execute() {
    const [
      totalStudents,
      totalTeachers,
      totalInstructors,
      totalClasses,
      totalSubjects,
      activeAcademicYear,
      institutionInfo,
      upcomingEvents,
      recentAnnouncements,
      studentDistribution,
      teacherDistribution,
    ] = await Promise.all([
      this.dashboardRepository.countActiveStudents(),
      this.dashboardRepository.countActiveTeachers(),
      this.dashboardRepository.countActiveInstructors(),
      this.dashboardRepository.countActiveClasses(),
      this.dashboardRepository.countActiveSubjects(),
      this.dashboardRepository.getActiveAcademicYear(),
      this.dashboardRepository.getInstitutionInfo(),
      this.dashboardRepository.getUpcomingCalendarEvents(5),
      this.dashboardRepository.getRecentAnnouncements(5),
      this.dashboardRepository.getStudentDistributionByGrade(),
      this.dashboardRepository.getTeacherDistributionByPosition(),
    ]);

    const activeSemester = activeAcademicYear?.semesters?.[0] ?? null;

    return {
      statistics: {
        totalStudents,
        totalTeachers,
        totalInstructors,
        totalClasses,
        totalSubjects,
      },

      academicInfo: {
        activeAcademicYear: activeAcademicYear
          ? { id: activeAcademicYear.id, name: activeAcademicYear.name }
          : null,
        activeSemester: activeSemester
          ? { id: activeSemester.id, type: activeSemester.type }
          : null,
      },

      institution: institutionInfo
        ? {
            name: institutionInfo.name,
            status: institutionInfo.status,
            type: institutionInfo.type,
          }
        : null,

      distributions: {
        studentsByGrade: studentDistribution,
        teachersByPosition: teacherDistribution,
      },

      upcomingEvents,

      recentAnnouncements,
    };
  }
}
