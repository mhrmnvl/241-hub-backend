import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './core/config/config.module.js';
import { PrismaModule } from './core/database/prisma.module.js';
import { SupabaseModule } from './core/supabase/supabase.module.js';
import { StorageModule } from './core/storage/storage.module.js';
import { HttpExceptionFilter } from './core/filters/http-exception.filter.js';
import { HealthModule } from './core/health/health.module.js';
import { ResponseInterceptor } from './core/interceptors/response.interceptor.js';
import { pinoLoggerConfig } from './core/logger/logger.config.js';
import { AcademicYearsModule } from './academic/academic-years/academic-years.module.js';
import { AchievementsModule } from './platform/profiles/achievements/achievements.module.js';
import { AnnouncementsModule } from './platform/announcements/announcements.module.js';
import { AttendanceModule } from './academic/attendance/attendance.module.js';
import { AuthModule } from './platform/auth/auth.module.js';
import { ClassroomsModule } from './academic/classrooms/classrooms.module.js';
import { DashboardsModule } from './platform/dashboards/dashboards.module.js';
import { CurriculaModule } from './academic/curricula/curricula.module.js';
import { AssessmentsModule } from './academic/assessments/assessments.module.js';
import { CalendarsModule } from './academic/calendars/calendars.module.js';

import { EducationsModule } from './platform/master-data/educations/educations.module.js';
import { EducationalHistoriesModule } from './platform/profiles/educational-histories/educational-histories.module.js';
import { TeachersModule } from './academic/teachers/teachers.module.js';
import { SchoolUnitsModule } from './platform/school-units/school-units.module.js';
import { OrganizationsModule } from './platform/organizations/organizations.module.js';
import { OccupationsModule } from './academic/master-data/occupations/occupations.module.js';
import { ParentsModule } from './academic/parents/parents.module.js';
import { SocialMediaModule } from './platform/master-data/social-media/social-media.module.js';
import { PositionsModule } from './academic/master-data/positions/positions.module.js';
import { EmploymentTypesModule } from './academic/master-data/employment-types/employment-types.module.js';
import { PositionCategoriesModule } from './academic/master-data/position-categories/position-categories.module.js';
import { ProfilesModule } from './platform/profiles/profiles.module.js';
import { ReportCardsModule } from './academic/report-cards/report-cards.module.js';
import { SchedulesModule as AcademicSchedulesModule } from './academic/schedules/schedules.module.js';
import { ScholarshipsModule } from './platform/profiles/scholarships/scholarships.module.js';
import { SemestersModule } from './academic/semesters/semesters.module.js';
import { EnrollmentsModule } from './academic/enrollments/enrollments.module.js';
import { GraduationsModule } from './academic/graduations/graduations.module.js';
import { StudentsModule } from './academic/students/students.module.js';
import { SubjectsModule } from './academic/subjects/subjects.module.js';
import { TeachingAssignmentsModule } from './academic/teaching-assignments/teaching-assignments.module.js';
import { UsersModule } from './platform/users/users.module.js';
import { GradesModule } from './academic/grades/grades.module.js';
import { RolesModule } from './platform/access-control/roles/roles.module.js';
import { PermissionsModule } from './platform/access-control/permissions/permissions.module.js';
import { SessionsModule } from './platform/sessions/sessions.module.js';
import { AuditLogsModule } from './platform/audit-logs/audit-logs.module.js';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from './platform/access-control/permissions/guards/permissions.guard.js';
import { SettingsModule } from './platform/settings/settings.module.js';
import { NotificationsModule } from './platform/notifications/notifications.module.js';
import { TenantsModule } from './platform/tenants/tenants.module.js';
import { FilesModule } from './platform/files/files.module.js';

import { TenantResolverMiddleware } from './core/middleware/tenant-resolver.middleware.js';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    SupabaseModule,
    StorageModule,
    LoggerModule.forRoot(pinoLoggerConfig),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<
          'development' | 'production' | 'test'
        >('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';

        return [
          {
            name: 'default',
            ttl: configService.get<number>('THROTTLE_TTL', 60000),
            limit: configService.get<number>(
              'THROTTLE_LIMIT',
              isProduction ? 100 : 500,
            ),
          },
          {
            name: 'auth',
            ttl: configService.get<number>('AUTH_THROTTLE_TTL', 60000),
            limit: configService.get<number>(
              'AUTH_THROTTLE_LIMIT',
              isProduction ? 5 : 20,
            ),
          },
        ];
      },
    }),
    HealthModule,
    DashboardsModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    SessionsModule,
    AuditLogsModule,
    TeachersModule,
    SchoolUnitsModule,
    OrganizationsModule,
    OccupationsModule,
    ParentsModule,
    SocialMediaModule,
    PositionsModule,
    EmploymentTypesModule,
    PositionCategoriesModule,
    ProfilesModule,
    StudentsModule,
    ClassroomsModule,
    GradesModule,
    SubjectsModule,
    EducationsModule,
    CurriculaModule,
    AssessmentsModule,
    CalendarsModule,
    AcademicYearsModule,
    SemestersModule,
    EnrollmentsModule,
    GraduationsModule,
    TeachingAssignmentsModule,
    AcademicSchedulesModule,
    AttendanceModule,
    AnnouncementsModule,
    AchievementsModule,
    ScholarshipsModule,
    EducationalHistoriesModule,
    ReportCardsModule,
    SettingsModule,
    NotificationsModule,
    TenantsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantResolverMiddleware)
      .exclude(
        'health',
        'auth/login',
        'organizations',
        'organizations/(.*)',
        'tenants',
        'tenants/(.*)',
      )
      .forRoutes('*');
  }
}
