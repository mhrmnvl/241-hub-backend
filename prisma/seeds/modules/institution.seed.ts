import { SchoolUnitStatus, PrismaClient } from '@prisma/client';

const e = (key: string, fallback: string) => {
  const val = process.env[key];
  return val && val.trim() !== '' ? val : fallback;
};

export async function seedInstitution(
  prisma: PrismaClient,
  tenantId: string,
  orgTypeId: string | null,
  schoolUnitTypeId: string | null,
) {
  let organization = await prisma.organization.findFirst({
    where: { deletedAt: null },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        tenantId,
        typeId: orgTypeId,
        name: e('SEED_ORGANIZATION_NAME', 'Yayasan Pendidikan Siakad'),
        code: e('SEED_ORGANIZATION_CODE', 'siakad'),
        email: e('SEED_ORGANIZATION_EMAIL', 'info@siakad.org'),
        phoneNumber: e('SEED_ORGANIZATION_PHONE', '021123456'),
        isActive: true,
      },
    });
    console.log(`  [organization] created: ${organization.name}`);
  } else {
    console.log(`  [organization] already exists: ${organization.name}`);
  }

  let schoolUnit = await prisma.schoolUnit.findFirst({
    where: { deletedAt: null },
  });

  if (!schoolUnit) {
    schoolUnit = await prisma.schoolUnit.create({
      data: {
        organizationId: organization.id,
        typeId: schoolUnitTypeId,
        name: e('SEED_INSTITUTION_NAME', 'MTs Negeri 1 Kota Malang'),
        surname: e('SEED_INSTITUTION_SURNAME', 'MTsN 1 Malang'),
        nsm: e('SEED_INSTITUTION_NSM', '121135730001'),
        npsn: e('SEED_INSTITUTION_NPSN', '20518057'),
        status: e('SEED_INSTITUTION_STATUS', 'PUBLIC') as SchoolUnitStatus,
        npwp: e('SEED_INSTITUTION_NPWP', '00.000.000.0-000.000'),
        phone: e('SEED_INSTITUTION_PHONE', '0341000000'),
        email: e('SEED_INSTITUTION_EMAIL', 'info@mtsn1malang.sch.id'),
        website: e('SEED_INSTITUTION_WEBSITE', 'https://mtsn1malang.sch.id'),
        subdomain: e('SEED_INSTITUTION_SUBDOMAIN', 'mtsn1malang'),
        isActive: true,
      },
    });
    console.log(`  [schoolUnit] created: ${schoolUnit.name}`);
  } else {
    console.log(`  [schoolUnit] already exists: ${schoolUnit.name}`);
  }

  const hasAddress = await prisma.address.findFirst({
    where: { schoolUnitId: schoolUnit.id },
  });
  if (!hasAddress) {
    await prisma.address.create({
      data: {
        schoolUnitId: schoolUnit.id,
        street: e('SEED_INSTITUTION_STREET', 'Jl. Bandung No. 7C'),
        rt: e('SEED_INSTITUTION_RT', '001'),
        rw: e('SEED_INSTITUTION_RW', '002'),
        village: e('SEED_INSTITUTION_VILLAGE', 'Penanggungan'),
        district: e('SEED_INSTITUTION_DISTRICT', 'Klojen'),
        city: e('SEED_INSTITUTION_CITY', 'Kota Malang'),
        province: e('SEED_INSTITUTION_PROVINCE', 'Jawa Timur'),
        country: e('SEED_INSTITUTION_COUNTRY', 'Indonesia'),
        postalCode: e('SEED_INSTITUTION_POSTAL', '65113'),
        isPrimary: true,
      },
    });
    console.log(`  [schoolUnit] address created`);
  }

  const igName = e('SEED_INSTITUTION_IG', '');
  if (igName) {
    const igPlatform = await prisma.socialMedia.findFirst({
      where: { name: 'Instagram' },
    });
    if (igPlatform) {
      const exists = await prisma.schoolUnitSocialMedia.findFirst({
        where: { schoolUnitId: schoolUnit.id, socialMediaId: igPlatform.id },
      });
      if (!exists) {
        await prisma.schoolUnitSocialMedia.create({
          data: {
            schoolUnitId: schoolUnit.id,
            socialMediaId: igPlatform.id,
            username: igName,
          },
        });
        console.log(`  [schoolUnit] Instagram linked: @${igName}`);
      }
    }
  }

  return { organization, schoolUnit };
}
