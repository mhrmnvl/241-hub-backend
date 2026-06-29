import { PrismaClient } from '@prisma/client';

export async function seedTenantData(prisma: PrismaClient) {
  // 1. Seed Subscription Plans
  const plans = [
    {
      code: 'FREE',
      name: 'Paket Gratis',
      price: 0,
      storageLimit: 1073741824n, // 1 GB
      maxUsers: 15,
      maxSchoolUnits: 1,
      trialDays: 0,
    },
    {
      code: 'BASIC',
      name: 'Paket Dasar',
      price: 250000,
      storageLimit: 10737418240n, // 10 GB
      maxUsers: 100,
      maxSchoolUnits: 3,
      trialDays: 14,
    },
    {
      code: 'PROFESSIONAL',
      name: 'Paket Profesional',
      price: 750000,
      storageLimit: 53687091200n, // 50 GB
      maxUsers: 500,
      maxSchoolUnits: 10,
      trialDays: 14,
    },
    {
      code: 'ENTERPRISE',
      name: 'Paket Enterprise',
      price: 2000000,
      storageLimit: 536870912000n, // 500 GB
      maxUsers: 9999,
      maxSchoolUnits: 99,
      trialDays: 14,
    },
  ];

  console.log('  [tenant-seed] Seeding subscription plans...');
  const seededPlans: Record<string, string> = {};
  for (const plan of plans) {
    let existing = await prisma.subscriptionPlan.findUnique({
      where: { code: plan.code },
    });
    if (!existing) {
      existing = await prisma.subscriptionPlan.create({
        data: plan,
      });
      console.log(`    Plan created: ${plan.name}`);
    }
    seededPlans[plan.code] = existing.id;
  }

  // 2. Seed Organization Types
  const orgTypes = [
    { code: 'FOUNDATION', name: 'Yayasan / Foundation' },
    { code: 'GOVERNMENT', name: 'Pemerintah / Government' },
    { code: 'COMPANY', name: 'Perusahaan / Company' },
    { code: 'RELIGIOUS', name: 'Lembaga Keagamaan / Religious Institution' },
    { code: 'UNIVERSITY', name: 'Perguruan Tinggi / University' },
    { code: 'TRAINING_CENTER', name: 'Pusat Pelatihan / Training Center' },
    { code: 'OTHER', name: 'Lainnya / Other' },
  ];

  console.log('  [tenant-seed] Seeding organization types...');
  const seededOrgTypes: Record<string, string> = {};
  for (const ot of orgTypes) {
    let existing = await prisma.organizationType.findUnique({
      where: { code: ot.code },
    });
    if (!existing) {
      existing = await prisma.organizationType.create({
        data: ot,
      });
      console.log(`    Organization Type created: ${ot.name}`);
    }
    seededOrgTypes[ot.code] = existing.id;
  }

  // 3. Seed School Unit Types
  const unitTypes = [
    { code: 'TK', name: 'Taman Kanak-kanak (TK / RA)' },
    { code: 'SD', name: 'Sekolah Dasar (SD / MI)' },
    { code: 'SMP', name: 'Sekolah Menengah Pertama (SMP / MTs)' },
    { code: 'SMA', name: 'Sekolah Menengah Atas (SMA / MA / SMK)' },
    { code: 'SLB', name: 'Sekolah Luar Biasa (SLB)' },
    { code: 'PKBM', name: 'Pusat Kegiatan Belajar Masyarakat (PKBM)' },
    { code: 'LKP', name: 'Lembaga Kursus dan Pelatihan (LKP)' },
    { code: 'PESANTREN', name: 'Pondok Pesantren' },
    { code: 'OTHER', name: 'Lainnya' },
  ];

  console.log('  [tenant-seed] Seeding school unit types...');
  const seededUnitTypes: Record<string, string> = {};
  for (const ut of unitTypes) {
    let existing = await prisma.schoolUnitType.findUnique({
      where: { code: ut.code },
    });
    if (!existing) {
      existing = await prisma.schoolUnitType.create({
        data: ut,
      });
      console.log(`    School Unit Type created: ${ut.name}`);
    }
    seededUnitTypes[ut.code] = existing.id;
  }

  // 4. Seed Default Tenant
  console.log('  [tenant-seed] Seeding default tenant...');
  const tenantSlug = process.env.SEED_TENANT_SLUG || 'siakad-tenant';
  let tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        slug: tenantSlug,
        name: 'Yayasan Utama Tenant',
        planId: seededPlans['FREE'],
        status: 'ACTIVE',
      },
    });
    console.log(`    Tenant created: ${tenant.name}`);
  }

  // 5. Seed System File Categories
  const fileCategories = [
    { code: 'PROFILE_PHOTO', name: 'Foto Profil', description: 'Foto profil pengguna', isSystem: true },
    { code: 'DOCUMENT', name: 'Dokumen Pribadi', description: 'KTP, KK, Akta Kelahiran, dll', isSystem: true },
    { code: 'REPORT_CARD', name: 'Rapor', description: 'Laporan hasil belajar siswa', isSystem: true },
    { code: 'CERTIFICATE', name: 'Sertifikat', description: 'Sertifikat prestasi atau pelatihan', isSystem: true },
    { code: 'OTHER', name: 'Lainnya', description: 'Berkas umum lainnya', isSystem: true },
  ];

  console.log('  [tenant-seed] Seeding system file categories...');
  for (const fc of fileCategories) {
    const existing = await prisma.fileCategory.findFirst({
      where: { code: fc.code, organizationId: null, isSystem: true },
    });
    if (!existing) {
      await prisma.fileCategory.create({
        data: fc,
      });
      console.log(`    File Category created: ${fc.name}`);
    }
  }

  return {
    tenant,
    seededOrgTypes,
    seededUnitTypes,
  };
}
