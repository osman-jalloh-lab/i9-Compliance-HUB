import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const effectiveDate2025 = new Date('2025-10-30')

function jsonArray(items: string[]) {
  return JSON.stringify(items)
}

async function upsertI9Doc(code: string, name: string, listType: string, description: string, validForReverification: boolean) {
  return prisma.i9Doc.upsert({
    where: { code },
    update: { name, listType, description, validForReverification },
    create: { code, name, listType, description, validForReverification }
  })
}

async function upsertVisaOrStatus(data: {
  slug: string
  name: string
  category: string
  description: string
  officialRef?: string | null
  workAuthorization: {
    canWork: boolean
    requiresSponsorship: boolean
    maxDuration?: string | null
    restrictions?: string | null
    documentTypes: string
    reverificationRequired: boolean
    eadAutoExtensionEligible: boolean
    autoExtensionAuthority?: string | null
    autoExtensionEffectiveDate?: Date | null
  }
}) {
  return prisma.visaOrStatus.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      category: data.category,
      description: data.description,
      officialRef: data.officialRef,
      workAuthorization: {
        upsert: {
          update: {
            canWork: data.workAuthorization.canWork,
            requiresSponsorship: data.workAuthorization.requiresSponsorship,
            maxDuration: data.workAuthorization.maxDuration,
            restrictions: data.workAuthorization.restrictions,
            documentTypes: data.workAuthorization.documentTypes,
            reverificationRequired: data.workAuthorization.reverificationRequired,
            eadAutoExtensionEligible: data.workAuthorization.eadAutoExtensionEligible,
            autoExtensionAuthority: data.workAuthorization.autoExtensionAuthority,
            autoExtensionEffectiveDate: data.workAuthorization.autoExtensionEffectiveDate,
          },
          create: {
            canWork: data.workAuthorization.canWork,
            requiresSponsorship: data.workAuthorization.requiresSponsorship,
            maxDuration: data.workAuthorization.maxDuration,
            restrictions: data.workAuthorization.restrictions,
            documentTypes: data.workAuthorization.documentTypes,
            reverificationRequired: data.workAuthorization.reverificationRequired,
            eadAutoExtensionEligible: data.workAuthorization.eadAutoExtensionEligible,
            autoExtensionAuthority: data.workAuthorization.autoExtensionAuthority,
            autoExtensionEffectiveDate: data.workAuthorization.autoExtensionEffectiveDate,
          },
        },
      },
    },
    create: {
      slug: data.slug,
      name: data.name,
      category: data.category,
      description: data.description,
      officialRef: data.officialRef,
      workAuthorization: {
        create: {
          canWork: data.workAuthorization.canWork,
          requiresSponsorship: data.workAuthorization.requiresSponsorship,
          maxDuration: data.workAuthorization.maxDuration,
          restrictions: data.workAuthorization.restrictions,
          documentTypes: data.workAuthorization.documentTypes,
          reverificationRequired: data.workAuthorization.reverificationRequired,
          eadAutoExtensionEligible: data.workAuthorization.eadAutoExtensionEligible,
          autoExtensionAuthority: data.workAuthorization.autoExtensionAuthority,
          autoExtensionEffectiveDate: data.workAuthorization.autoExtensionEffectiveDate,
        },
      },
    },
  })
}

async function upsertDocumentRule(
  visaSlug: string,
  context: string,
  docCode: string,
  acceptable: boolean,
  listType: string,
  reason: string | null,
  effectiveDate: Date,
  sourceUrl: string | null
) {
  const visa = await prisma.visaOrStatus.findUnique({ where: { slug: visaSlug } })
  if (!visa) {
    throw new Error(`Visa or status not found for slug ${visaSlug}`)
  }

  return prisma.documentRule.upsert({
    where: {
      visaId_context_docCode: {
        visaId: visa.id,
        context,
        docCode,
      }
    },
    update: { acceptable, listType, reason, effectiveDate, sourceUrl },
    create: {
      visaId: visa.id,
      context,
      docCode,
      acceptable,
      listType,
      reason,
      effectiveDate,
      sourceUrl,
    }
  })
}

async function upsertSource(visaId: string, title: string, url: string) {
  const existing = await prisma.source.findFirst({ where: { visaId, title } })
  if (existing) {
    return prisma.source.update({ where: { id: existing.id }, data: { url } })
  }
  return prisma.source.create({ data: { visaId, title, url } })
}

async function upsertPlaybookScenario(scenario: {
  category: string
  scenarioTitle: string
  question: string
  answer: string
  recordNote: string
  source?: string | null
  sourceUrl?: string | null
}) {
  const existing = await prisma.playbookScenario.findFirst({ where: { scenarioTitle: scenario.scenarioTitle } })
  if (existing) {
    return prisma.playbookScenario.update({ where: { id: existing.id }, data: scenario })
  }
  return prisma.playbookScenario.create({ data: scenario })
}

async function findOrCreateSourceByVisaSlug(visaSlug: string, title: string, url: string) {
  const visa = await prisma.visaOrStatus.findUnique({ where: { slug: visaSlug } })
  if (!visa) throw new Error(`Visa not found for slug ${visaSlug}`)
  return upsertSource(visa.id, title, url)
}

async function main() {
  console.log('Start seeding ...')

  const documents = [
    { code: 'passport', name: 'U.S. Passport or Passport Card', listType: 'A', description: 'Issued by Department of State', validForReverification: false },
    { code: 'i766', name: 'Employment Authorization Document (Form I-766)', listType: 'A', description: 'Card that contains a photograph.', validForReverification: true },
    { code: 'foreign_passport_i94', name: 'Foreign Passport with Form I-94', listType: 'A', description: 'Foreign passport presented with Form I-94 or I-94A.', validForReverification: true },
    { code: 'i551', name: 'Permanent Resident Card (Form I-551)', listType: 'A', description: 'Evidence of permanent resident status.', validForReverification: false },
    { code: 'driver_license', name: 'Driver\'s License', listType: 'B', description: 'Issued by a U.S. state or outlying possession.', validForReverification: false },
    { code: 'school_id_with_photo', name: 'School Identification with Photograph', listType: 'B', description: 'School identification with a photograph.', validForReverification: false },
    { code: 'social_security_card', name: 'Social Security Account Number Card', listType: 'C', description: 'Unless the card includes a restrictive legend.', validForReverification: true },
    { code: 'restricted_social_security_card', name: 'Social Security Card with Restrictive Legend', listType: 'C', description: 'Not acceptable as List C when it includes a restrictive legend.', validForReverification: false },
    { code: 'certified_birth_certificate', name: 'Certified U.S. Birth Certificate', listType: 'C', description: 'Certified copy of a U.S. birth certificate.', validForReverification: true },
  ]

  for (const doc of documents) {
    await upsertI9Doc(doc.code, doc.name, doc.listType, doc.description, doc.validForReverification)
  }

  const visaStatuses = [
    {
      slug: 'us-citizen',
      name: 'U.S. Citizen',
      category: 'Status',
      description: 'Born or naturalized in the United States.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'No work authorization document required beyond Form I-9.',
        documentTypes: jsonArray(['passport', 'driver_license', 'school_id_with_photo', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'us-national',
      name: 'U.S. National',
      category: 'Status',
      description: 'A noncitizen national of the United States.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'No work authorization document required beyond Form I-9.',
        documentTypes: jsonArray(['passport', 'driver_license', 'school_id_with_photo', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'lpr',
      name: 'Lawful Permanent Resident (Green Card)',
      category: 'Status',
      description: 'Unlimited work authorization. No reverification required.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'No reverification required for a Form I-551.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'eb1',
      name: 'EB-1 Priority Workers',
      category: 'Immigrant Category',
      description: 'Lawful permanent residence employment category.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'Category based on immigrant petition.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'eb2',
      name: 'EB-2 Professionals with Advanced Degrees',
      category: 'Immigrant Category',
      description: 'Lawful permanent residence employment category.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'Category based on immigrant petition.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'eb3',
      name: 'EB-3 Skilled Workers/Professionals',
      category: 'Immigrant Category',
      description: 'Lawful permanent residence employment category.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'Category based on immigrant petition.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'eb4',
      name: 'EB-4 Special Immigrants',
      category: 'Immigrant Category',
      description: 'Lawful permanent residence employment category.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'Category based on immigrant petition.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'eb5',
      name: 'EB-5 Immigrant Investors',
      category: 'Immigrant Category',
      description: 'Lawful permanent residence employment category.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: 'Indefinite',
        restrictions: 'Category based on immigrant petition.',
        documentTypes: jsonArray(['i551', 'driver_license', 'social_security_card', 'certified_birth_certificate']),
        reverificationRequired: false,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'h1b',
      name: 'H-1B Specialty Occupation',
      category: 'Visa',
      description: 'Employment authorized incident to status with an H-1B petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-dod-cooperative-research-and-development-project-workers-and-fashion-models',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '6 years',
        restrictions: 'Employer-specific, petition-based.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'l1a',
      name: 'L-1A Intracompany Transferee (Manager)',
      category: 'Visa',
      description: 'Employment authorized incident to status with an L-1A petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '7 years',
        restrictions: 'Employer-specific, intracompany transfer.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'l1b',
      name: 'L-1B Intracompany Transferee (Specialized)',
      category: 'Visa',
      description: 'Employment authorized incident to status with an L-1B petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1b-intracompany-transferee-specialized-knowledge',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '5 years',
        restrictions: 'Employer-specific, intracompany transfer.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'tn',
      name: 'TN NAFTA Professional',
      category: 'Visa',
      description: 'Employment authorized incident to status for Canadian and Mexican professionals.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/tn-nafta-professionals',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '3 years increments',
        restrictions: 'Employer-specific, NAFTA professional.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'o1',
      name: 'O-1 Extraordinary Ability',
      category: 'Visa',
      description: 'Employment authorized incident to status with an O-1 petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '3 years initial',
        restrictions: 'Employer-specific, extraordinary ability.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'e3',
      name: 'E-3 Specialty Occupation (Australia)',
      category: 'Visa',
      description: 'Employment authorized incident to status for Australian nationals.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-3-specialty-occupation-workers-from-australia',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '2 years increments',
        restrictions: 'Employer-specific, E-3 status.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'h1b1',
      name: 'H-1B1 (Chile/Singapore)',
      category: 'Visa',
      description: 'Employment authorized incident to status for H-1B1 nationals.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b1-specialty-occupation-workers-from-chile-and-singapore',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '1 year increments',
        restrictions: 'Employer-specific, treaty-based.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'e1',
      name: 'E-1 Treaty Trader',
      category: 'Visa',
      description: 'Employment authorized incident to status with an E-1 treaty trader petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-1-treaty-traders',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '2 years increments',
        restrictions: 'Employer-specific, treaty trader.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'e2',
      name: 'E-2 Treaty Investor',
      category: 'Visa',
      description: 'Employment authorized incident to status with an E-2 treaty investor petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-2-treaty-investors',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '2 years increments',
        restrictions: 'Employer-specific, treaty investor.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'r1',
      name: 'R-1 Religious Worker',
      category: 'Visa',
      description: 'Employment authorized incident to status with an R-1 petition.',
      officialRef: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/r-1-temporary-religious-workers',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '5 years max',
        restrictions: 'Employer-specific, religious worker.',
        documentTypes: jsonArray(['foreign_passport_i94']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'f1-opt',
      name: 'F-1 OPT (Post-Completion)',
      category: 'Status',
      description: 'Employment authorized for 12 months with an approved OPT EAD.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: false,
        maxDuration: '12 months',
        restrictions: 'Employment authorization based on an approved OPT EAD.',
        documentTypes: jsonArray(['i766']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
    {
      slug: 'f1-stem-opt',
      name: 'F-1 STEM OPT Extension',
      category: 'Status',
      description: '24-month extension for STEM degree holders when the STEM OPT extension EAD is approved.',
      workAuthorization: {
        canWork: true,
        requiresSponsorship: true,
        maxDuration: '24 months (additional)',
        restrictions: 'Employment authorization based on an approved STEM OPT EAD.',
        documentTypes: jsonArray(['i766']),
        reverificationRequired: true,
        eadAutoExtensionEligible: false,
        autoExtensionAuthority: null,
        autoExtensionEffectiveDate: null,
      },
    },
  ]

  for (const status of visaStatuses) {
    await upsertVisaOrStatus(status)
  }

  const listBDocs = ['driver_license', 'school_id_with_photo']
  const listCDocs = ['social_security_card', 'certified_birth_certificate']
  const baseInitialSource = 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
  const reverificationSource = 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/60-reverification-and-rehires'

  const citizenLikeSlugs = ['us-citizen', 'us-national']
  const lprLikeSlugs = ['lpr', 'eb1', 'eb2', 'eb3', 'eb4', 'eb5']
  const visaSlugs = ['h1b', 'l1a', 'l1b', 'tn', 'o1', 'e3', 'h1b1', 'e1', 'e2', 'r1']
  const eadSlugs = ['f1-opt', 'f1-stem-opt', 'a12', 'c08', 'c09', 'c26', 'c19']

  for (const slug of citizenLikeSlugs) {
    for (const context of ['initial', 'rehire'] as const) {
      await upsertDocumentRule(slug, context, 'passport', true, 'A', null, effectiveDate2025, baseInitialSource)
      for (const docCode of listBDocs) {
        await upsertDocumentRule(slug, context, docCode, true, 'B', null, effectiveDate2025, baseInitialSource)
      }
      for (const docCode of listCDocs) {
        await upsertDocumentRule(slug, context, docCode, true, 'C', null, effectiveDate2025, baseInitialSource)
      }
      await upsertDocumentRule(slug, context, 'restricted_social_security_card', false, 'C', 'Restricted legend not acceptable as List C', effectiveDate2025, baseInitialSource)
    }
    await upsertDocumentRule(slug, 'reverify', 'passport', false, 'A', 'U.S. passports are not reverified.', effectiveDate2025, reverificationSource)
    for (const docCode of [...listBDocs, 'restricted_social_security_card']) {
      await upsertDocumentRule(slug, 'reverify', docCode, false, docCode === 'restricted_social_security_card' ? 'C' : 'B', docCode === 'restricted_social_security_card' ? 'Restricted legend not acceptable as List C' : 'List B documents are not acceptable for reverification.', effectiveDate2025, reverificationSource)
    }
  }

  for (const slug of lprLikeSlugs) {
    for (const context of ['initial', 'rehire'] as const) {
      await upsertDocumentRule(slug, context, 'i551', true, 'A', null, effectiveDate2025, baseInitialSource)
      for (const docCode of listBDocs) {
        await upsertDocumentRule(slug, context, docCode, true, 'B', null, effectiveDate2025, baseInitialSource)
      }
      for (const docCode of listCDocs) {
        await upsertDocumentRule(slug, context, docCode, true, 'C', null, effectiveDate2025, baseInitialSource)
      }
      await upsertDocumentRule(slug, context, 'restricted_social_security_card', false, 'C', 'Restricted legend not acceptable as List C', effectiveDate2025, baseInitialSource)
    }
    await upsertDocumentRule(slug, 'reverify', 'i551', false, 'A', 'Permanent Resident Cards are not reverified.', effectiveDate2025, reverificationSource)
    for (const docCode of [...listBDocs, 'restricted_social_security_card']) {
      await upsertDocumentRule(slug, 'reverify', docCode, false, docCode === 'restricted_social_security_card' ? 'C' : 'B', docCode === 'restricted_social_security_card' ? 'Restricted legend not acceptable as List C' : 'List B documents are not acceptable for reverification.', effectiveDate2025, reverificationSource)
    }
  }

  for (const slug of visaSlugs) {
    for (const context of ['initial', 'rehire', 'reverify'] as const) {
      await upsertDocumentRule(slug, context, 'foreign_passport_i94', true, 'A', null, effectiveDate2025, baseInitialSource)
    }
    for (const docCode of [...listBDocs, 'restricted_social_security_card']) {
      await upsertDocumentRule(slug, 'reverify', docCode, false, docCode === 'restricted_social_security_card' ? 'C' : 'B', docCode === 'restricted_social_security_card' ? 'Restricted legend not acceptable as List C' : 'List B documents are not acceptable for reverification.', effectiveDate2025, reverificationSource)
    }
  }

  for (const slug of eadSlugs) {
    for (const context of ['initial', 'rehire', 'reverify'] as const) {
      await upsertDocumentRule(slug, context, 'i766', true, 'A', null, effectiveDate2025, baseInitialSource)
    }
    for (const docCode of [...listBDocs, 'restricted_social_security_card']) {
      await upsertDocumentRule(slug, 'reverify', docCode, false, docCode === 'restricted_social_security_card' ? 'C' : 'B', docCode === 'restricted_social_security_card' ? 'Restricted legend not acceptable as List C' : 'List B documents are not acceptable for reverification.', effectiveDate2025, reverificationSource)
    }
  }

  const autoExtensionSlugs = ['a12', 'c08', 'c09', 'c19', 'c26']
  for (const slug of autoExtensionSlugs) {
    const visa = await prisma.visaOrStatus.findUnique({ where: { slug } })
    if (!visa) continue

    const existingAction = await prisma.i9Action.findFirst({
      where: { visaId: visa.id, trigger: 'EAD Receipt', actionType: 'Review Auto-Extension' }
    })
    if (existingAction) {
      await prisma.i9Action.update({ where: { id: existingAction.id }, data: { details: 'Automatic EAD extension eligibility must be confirmed based on the specific category and filing date; do not assume automatic extension for renewals filed on or after October 30, 2025.', mandatory: true } })
    } else {
      await prisma.i9Action.create({
        data: {
          visaId: visa.id,
          trigger: 'EAD Receipt',
          actionType: 'Review Auto-Extension',
          details: 'Automatic EAD extension eligibility must be confirmed based on the specific category and filing date; do not assume automatic extension for renewals filed on or after October 30, 2025.',
          mandatory: true,
        }
      })
    }
  }

  const receiptActionVias = ['a12', 'c19', 'c09', 'c26']
  for (const slug of receiptActionVias) {
    const visa = await prisma.visaOrStatus.findUnique({ where: { slug } })
    if (!visa) continue

    const existing = await prisma.i9Action.findFirst({
      where: { visaId: visa.id, trigger: 'EAD Receipt', actionType: 'Review Receipt Date' }
    })
    const details = slug === 'a12' || slug === 'c19'
      ? 'TPS automatic extension rules may change; verify the specific Federal Register notice and receipt date.'
      : 'Automatic extension after October 30, 2025 depends on category-specific guidance and should not be presumed.'

    if (existing) {
      await prisma.i9Action.update({ where: { id: existing.id }, data: { details, mandatory: true } })
    } else {
      await prisma.i9Action.create({
        data: {
          visaId: visa.id,
          trigger: 'EAD Receipt',
          actionType: 'Review Receipt Date',
          details,
          mandatory: true,
        }
      })
    }
  }

  const allVisas = await prisma.visaOrStatus.findMany()
  const sourceLinks = [
    { title: 'USCIS I-9 Central', url: 'https://www.uscis.gov/i-9' },
    { title: 'M-274 Handbook for Employers', url: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274' },
    { title: 'I-94 Official Site', url: 'https://i94.cbp.dhs.gov/' },
  ]

  for (const visa of allVisas) {
    for (const source of sourceLinks) {
      await upsertSource(visa.id, source.title, source.url)
    }
  }

  await prisma.changeLog.create({
    data: {
      date: effectiveDate2025,
      entity: 'I-9 Guidance',
      changeType: 'Rule Update',
      description: 'Added structured I-9 document rules, reverification guidance, and explicit EAD auto-extension metadata effective October 30, 2025.',
    }
  })

  const playbookScenarios = [
    {
      category: 'Timing',
      scenarioTitle: 'Scenario 1: Documents Forgotten',
      question: 'Do we have to complete Section 2 on Day 1?',
      answer: 'Usually you have up to 3 business days after hire to examine documents and complete Section 2. If documents are not presented within this time, the employee may not continue working.',
      recordNote: 'Hire Date: [Date]. Section 2 Deadline: [Hire Date + 3 Biz Days]. Result: [Document Name] examined on [Date].',
      source: 'USCIS M-274 Section 4.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Timing',
      scenarioTitle: 'Scenario 2: Short-Term Hires (Under 3 Days)',
      question: 'Can we do the I-9 later for a 2-day job?',
      answer: 'No. If employment lasts less than 3 business days, Section 2 must be completed at the time of hire. Receipts are NOT acceptable for short hires.',
      recordNote: 'Hire Date: [Date]. Section 2 Completed: [Hire Date]. (Note: Receipt Rule not applicable for <3 day hire).',
      source: 'USCIS M-274 Section 4.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 3: Section 1 before the offer is accepted',
      question: 'Can we have a candidate fill Section 1 before they accept the job offer, just to speed onboarding?',
      answer: 'No. Employees may complete Section 1 after accepting the job offer, but not before the employer extends the offer and the employee accepts it. Section 1 must be completed no later than the first day of employment for pay.',
      recordNote: 'Hire date: [Date]. Offer accepted: [Date/Time]. Section 1 completed/signed: [Date]. (Confirm Section 1 completion occurred after acceptance.)',
      source: 'USCIS M-274 Sections 2.0 and 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 4: Employee has only one legal name',
      question: 'What if the employee only has one name on their legal documents?',
      answer: 'If the employee has only one name, they should enter it in the Last Name field and enter "Unknown" in the First Name field.',
      recordNote: 'Section 1 Name fields: Last Name = [Single Name]. First Name = "Unknown". (No additional employer-side documents required.)',
      source: 'USCIS M-274 Section 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 5: No street address available',
      question: 'What if an employee doesn\'t have a street address (temporary housing, rural location, unhoused)?',
      answer: 'The employee must provide their current address. If they do not have a street address, they should enter a description of the location of their residence.',
      recordNote: 'Section 1 Address: [Descriptive location]. City/Town field can reflect the relevant local descriptor.',
      source: 'USCIS M-274 Section 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 6: Email and phone fields left blank',
      question: 'Can an employee leave email and phone blank in Section 1?',
      answer: 'Yes. Employees are not required to provide an email address or telephone number in Section 1; they may leave those fields blank if they choose.',
      recordNote: 'Section 1 Email/Phone: blank (employee opted not to provide). No follow-up documentation required.',
      source: 'USCIS M-274 Section 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 7: Multiple preparers/translators used',
      question: 'If an employee uses more than one preparer/translator, how do we document it?',
      answer: 'Each preparer/translator must complete a separate certification block in Supplement A for Section 1, and employers may provide additional supplement pages and attach them as needed.',
      recordNote: 'Supplement A: Preparer/Translator Block 1 = [Name], Block 2 = [Name], etc. Attached supplement pages: [Count]. Employee still signs or marks Section 1.',
      source: 'USCIS M-274 Section 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 8: Employee cannot sign Section 1',
      question: 'What if the employee cannot sign their name?',
      answer: 'If an employee cannot sign, they may place a mark in the signature field to indicate their signature.',
      recordNote: 'Section 1 signature: [Mark]. Date: [Date]. If preparer/translator assisted, Supplement A completed.',
      source: 'USCIS M-274 Section 3.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9',
    },
    {
      category: 'Section 1',
      scenarioTitle: 'Scenario 9: Errors found in Section 1 after completion',
      question: 'If we find an error in Section 1, who can correct it and how?',
      answer: 'Only the employee (or their preparer/translator) may correct Section 1. The correction method is: draw a line through incorrect info, enter the correct info, and initial and date the correction. Employers should attach a written explanation of why information needed correcting/was missing.',
      recordNote: 'Section 1 correction: [Field corrected]. Method: line-through + corrected value + employee initials/date. Attached memo: "Correction made because [Reason]."',
      source: 'USCIS M-274 Sections 3.0 and 9.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/90-correcting-errors-or-missing-information',
    },
    {
      category: 'Section 2',
      scenarioTitle: 'Scenario 10: Accepting copies vs originals in physical inspection',
      question: 'Can we accept photocopies of documents for Section 2?',
      answer: 'For in-person inspection, employers may only accept original documents. The handbook notes the limited exception that a certified copy of a birth certificate is acceptable.',
      recordNote: 'Section 2: "Originals physically examined on [Date]." If birth certificate used, note "certified copy" and record it per List C rules.',
      source: 'USCIS M-274 Section 4.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Section 2',
      scenarioTitle: 'Scenario 11: Restricted Social Security card presented',
      question: 'Employee brought a Social Security card that says "VALID FOR WORK ONLY WITH DHS AUTHORIZATION" (or similar). Can we accept it as List C?',
      answer: 'No. Restricted Social Security cards with the listed restrictive legends are not acceptable as List C documents; the employee must present a different List C document or a List A document.',
      recordNote: 'Attempted doc: Restricted SS card (List C) rejected (reason: restricted legend). Replacement docs accepted: [List A] or [List C + List B].',
      source: 'USCIS M-274 Sections 4.0 and 13.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Section 2',
      scenarioTitle: 'Scenario 12: Receipt rule mechanics and follow-up update',
      question: 'If an employee presents a receipt for a replacement document, how do we record it and what happens when the replacement arrives?',
      answer: 'If the employee presents an acceptable receipt (and the job is not under 3 days), the employer must accept it, record it as "Receipt" plus the document title in Section 2, and then, when the replacement document is presented, cross out "Receipt," enter replacement document info in Additional Information, and initial/date the change.',
      recordNote: 'Receipt accepted: "Receipt – [Doc Title]" recorded on [Date]. Receipt valid until: [Date]. Replacement doc examined: [Doc Title/Number], recorded in Additional Information on [Date], initialed/dated by employer rep.',
      source: 'USCIS M-274 Section 4.4',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/44-acceptable-receipts',
    },
    {
      category: 'Section 2',
      scenarioTitle: 'Scenario 13: Employer wants to copy documents "only when it feels risky"',
      question: 'Can we copy documents only for noncitizens or only when we think a case is "high-risk"?',
      answer: 'If you copy document(s), you should do it consistently for all new hires and reverified employees, regardless of national origin, citizenship, or immigration status; inconsistent copying can raise discrimination risk. Copying does not replace completing the Form I-9.',
      recordNote: 'Policy: "We copy documents for all hires (or none)." If copies kept: stored with Form I-9. Note that originals were still examined for Section 2.',
      source: 'USCIS M-274 Section 4.1',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/41-retaining-copies-of-documents',
    },
    {
      category: 'Section 2',
      scenarioTitle: 'Scenario 14: Employer address entry in Section 2',
      question: 'Can we use a company P.O. Box as the employer address in Section 2?',
      answer: 'No. The employer must enter a physical street address for the business in Section 2; employers may not enter a P.O. Box as their address.',
      recordNote: 'Section 2 Employer Address: [Street Address]. If corrected, line-through + correct address + employer initials/date + attached explanation (if needed).',
      source: 'USCIS M-274 Section 4.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Remote Verification',
      scenarioTitle: 'Scenario 15: Staffing agency "first day of employment" selection',
      question: 'For staffing agencies, what date should be used as "first day of employment" in Section 2?',
      answer: 'Staffing agencies may choose either: (1) the date the employee is assigned to their first job, or (2) the date the employee is entered into the assignment pool as the first day of employment, but should be consistent.',
      recordNote: 'Policy: "First day of employment" defined as [assignment date] OR [assignment pool date], applied consistently. First day entered on Form I-9 Section 2: [Date].',
      source: 'USCIS M-274 Section 4.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9',
    },
    {
      category: 'Remote Verification',
      scenarioTitle: 'Scenario 16: Notary public as authorized representative',
      question: 'If we use a notary public as our authorized representative, do they notarize the I-9 and stamp it?',
      answer: 'A notary public used as an authorized representative is not acting as a notary for Form I-9 purposes and should not provide a notary seal on the form. The employer remains liable for any violations or errors committed by the authorized representative.',
      recordNote: 'Authorized representative: [Name], Role: notary public acting as authorized rep. Section 2 completed/signed/dated by rep: [Date]. (No notary seal.)',
      source: 'USCIS M-274 Section 2.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/20-general-overview-and-instructions',
    },
    {
      category: 'Remote Verification',
      scenarioTitle: 'Scenario 17: Employee tries to complete Section 2 themselves',
      question: 'Can the employee be the authorized representative for their own Form I-9?',
      answer: 'No. Employees cannot act as authorized representatives for their own Form I-9 and cannot complete/update/correct Section 2 or Supplement B for themselves or attest to the authenticity of the documents they present.',
      recordNote: 'Section 2 completed by: [Employer rep / authorized rep]. Employee not listed as authorized rep.',
      source: 'USCIS M-274 Section 2.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/20-general-overview-and-instructions',
    },
    {
      category: 'Remote Verification',
      scenarioTitle: 'Scenario 18: Using the DHS alternative procedure for remote document examination',
      question: 'If we\'re an E-Verify employer, can we examine documents remotely instead of in-person?',
      answer: 'Yes, if you are enrolled in E-Verify in good standing and follow the required steps: examine copies (front/back), conduct a live video interaction where the employee presents the same documents, indicate the alternative procedure on the Form I-9, and retain clear/legible copies.',
      recordNote: 'Remote exam method: DHS alternative procedure. Steps logged: copies received [Date], live video review [Date], checkbox completed [Yes], copies retained [Yes].',
      source: 'USCIS M-274 Section 4.5',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/45-alternative-procedure-for-remote-examination-of-i-9-documentation',
    },
    {
      category: 'Reverification',
      scenarioTitle: 'Scenario 19: Reverification is (and is not) required',
      question: 'Which employees/documents do we need to reverify—and which ones should we not reverify?',
      answer: 'You must reverify employment authorization no later than the date it expires when reverification is required, using Supplement B, and the employee may present any acceptable document from List A or List C showing current authorization. Reverification is never required for U.S. citizens, U.S. nationals, or permanent residents, and not required when certain documents expire.',
      recordNote: 'Reverification trigger: [Doc type] expiring on [Date]. Supplement B completed on [Date] with new List A or C document: [Title/Number/Exp]. (No reverification for passports/green cards/List B expirations.)',
      source: 'USCIS M-274 Sections 6.0 and 6.1',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/60-reverification-and-rehires',
    },
    {
      category: 'Reverification',
      scenarioTitle: 'Scenario 20: Rehire within three years',
      question: 'If we rehire someone within three years, do we need a new I-9?',
      answer: 'If you rehire an employee within three years of the date their prior Form I-9 was completed, you may complete a block on Supplement B (or complete a new Form I-9 instead). If the prior Form I-9 is an older version, you must complete Supplement B on the current version and keep it with the previously completed I-9.',
      recordNote: 'Rehire date: [Date]. Action: Supplement B used [Yes/No]. If Supplement B used: employee name confirmed, Date of Rehire entered, employer signs/dates; if new I-9 used, attach to prior I-9 with explanation.',
      source: 'USCIS M-274 Section 6.2',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/62-rehires',
    },
    {
      category: 'Reverification',
      scenarioTitle: 'Scenario 21: Automatic EAD extension documentation (general case)',
      question: 'Can we accept an expired EAD with a renewal receipt notice (Form I-797C) as proof of work authorization?',
      answer: 'For eligible categories, an expired EAD may be treated as unexpired during an automatic extension period when presented with a qualifying Form I-797C receipt notice; the employer should annotate "EAD EXT" and reverify at the end of the extension period.',
      recordNote: 'Docs presented: EAD + I-797C receipt notice. Section 2 notation: "EAD EXT" and expiration adjusted to the extension date, with reverification due date tracked.',
      source: 'USCIS M-274 Section 5.1',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/51-automatic-extensions-of-employment-authorization-documents-eads-in-certain-circumstances',
    },
    {
      category: 'Reverification',
      scenarioTitle: 'Scenario 22: Renewal filed on/after October 30, 2025 (no more automatic EAD extension for most categories)',
      question: 'If someone filed an EAD renewal and shows an expired EAD plus a new Form I-797C receipt notice dated after October 30, 2025, can we treat that as an automatic extension?',
      answer: 'Under the October 30, 2025 interim final rule, automatic extension periods for renewal receipts filed on or after that date are not presumptively evidence of employment authorization. If the employee cannot show current authorization, the employer may not continue employment.',
      recordNote: 'EAD expiration: [Date]. Renewal receipt date: [Date]. If post-10/30/2025 and no other authorization is current, do not treat the receipt as evidence of authorization.',
      source: 'DHS interim final rule (8 CFR 274a.13(e))',
      sourceUrl: 'https://www.uscis.gov/i-9-central',
    },
    {
      category: 'Recordkeeping',
      scenarioTitle: 'Scenario 23: Correcting errors without "white-out," backdating, or hiding edits',
      question: 'If we discover mistakes, what is the correct way to fix an I-9?',
      answer: 'Corrections should be made by drawing a line through incorrect information, entering the correct info, and initialing/dating the change. A written explanation should be attached for why information was missing or needed correction. Employers should not conceal changes or backdate.',
      recordNote: 'Correction log: [Section] corrected on [Date] by [Employee or Employer Rep]. Method: line-through + initials/date; explanation attached.',
      source: 'USCIS M-274 Section 9.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/90-correcting-errors-or-missing-information',
    },
    {
      category: 'Recordkeeping',
      scenarioTitle: 'Scenario 24: Retention period, inspection readiness, and "don\'t send the I-9 to the government"',
      question: 'How long do we keep I-9s, and what do we do if there\'s an inspection?',
      answer: 'Employers must retain Form I-9 for as long as the person works for you, then for three years after hire or one year after employment ends, whichever is later. Authorized officers receive at least three business days’ notice before inspection.',
      recordNote: 'Retention schedule: Hire date [Date]; Termination date [Date]; Purge-after date [Later of hire+3 yrs or term+1 yr]. Inspection readiness: Forms available within three business days.',
      source: 'USCIS M-274 Sections 10.0 and 10.3',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/100-retaining-form-i-9',
    },
    {
      category: 'Discrimination',
      scenarioTitle: 'Scenario 25: Requesting specific documents or treating "foreign-looking" workers differently',
      question: 'Can we demand a green card, a DHS document, or a particular List A document—especially for noncitizens?',
      answer: 'No. The employee chooses which acceptable documents to present from the Lists of Acceptable Documents, and the employer must accept documents that reasonably appear genuine and relate to the employee.',
      recordNote: 'Policy: "We do not specify documents. We accept any acceptable List A or List B + List C combination that reasonably appears genuine and related."',
      source: 'USCIS M-274 Section 11.4',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/114-avoiding-discrimination',
    },
    {
      category: 'Discrimination',
      scenarioTitle: 'Scenario 26: E-Verify guardrails that aren\'t "mismatch handling"',
      question: 'Can we prescreen applicants in E-Verify, or run E-Verify only on noncitizens?',
      answer: 'No. Employers must use E-Verify consistently where required and not prescreen applicants or apply it selectively to certain workers.',
      recordNote: 'E-Verify policy: "All new hires processed; no prescreening." If List B + C used: List B photo present [Yes].',
      source: 'USCIS M-274 Section 1.2',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/12-e-verify',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 27: Documents show different last names during Section 2',
      question: 'If the employee presents two documents with different last names (e.g., just married), can we accept them?',
      answer: 'You may accept a document with a different name than the name in Section 1 if the document reasonably relates to the employee. You may attach a brief memo explaining the discrepancy.',
      recordNote: 'Memo attached: "Name discrepancy due to [Reason]." Decision: document accepted as reasonably relating [Yes/No].',
      source: 'USCIS M-274 Section 14.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/140-questions-and-answers',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 28: Prior "false identity," now employee wants to regularize under true identity',
      question: 'What if an employee admits they previously completed an I-9 under a false identity, but now has work authorization in their true identity?',
      answer: 'USCIS guidance says you should complete a new Form I-9, write the original hire date in Section 2, attach the new I-9 to the prior one, and include a written explanation.',
      recordNote: 'Action: New Form I-9 completed under true identity on [Date]. Section 2 first day of employment: [Original Hire Date]. Explanation attached.',
      source: 'USCIS M-274 Section 6.3',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/63-updating-section-1',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 29: Name Changes & I-9',
      question: 'What if an employee changes their name after Section 1?',
      answer: 'You are not required to update the I-9 for a name change, but it is recommended. If you do, enter the new name in Section 3 and provide the reason.',
      recordNote: 'Updated Section 3 with new name [Name] on [Date]. Original name: [Old Name].',
      source: 'USCIS M-274 Section 11.0',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/110-retaining-and-storing-form-i-9',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 30: E-Verify Mismatches',
      question: 'Can we suspend an employee if there\'s a mismatch?',
      answer: 'No. You cannot take adverse action while the employee is resolving a mismatch. Employers must follow the E-Verify process and give the employee the opportunity to contest the results.',
      recordNote: 'Action: Employee notified of mismatch. No adverse action taken during resolution.',
      source: 'USCIS E-Verify User Manual',
      sourceUrl: 'https://www.e-verify.gov/employers/employer-resources/e-verify-user-manual',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 31: I-94 Auto-Extension Rules',
      question: 'Can we accept an expired EAD with an I-94?',
      answer: 'Yes, for certain categories, an expired EAD combined with a valid I-94 showing status may be treated as current through an automatic extension. Confirm the specific category and notice.',
      recordNote: 'Docs: Expired EAD + valid I-94. Extension valid until I-94 expiry: [Date].',
      source: 'USCIS Auto-Extension Guidance',
      sourceUrl: 'https://www.uscis.gov/i-9-central',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 32: Remote Hire authorized rep',
      question: 'Can an employee\'s spouse be the authorized representative?',
      answer: 'Yes. Any individual may act as an authorized representative to complete Section 2. The employer remains liable for any errors.',
      recordNote: 'Authorized Rep: [Name] (Relationship: [Relationship]). Documents examined physically on [Date].',
      source: 'USCIS M-274 Section 4.1',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/41-retaining-copies-of-documents',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 33: P.O. Box in Section 1',
      question: 'Can an employee use a P.O. Box for their address?',
      answer: 'No. The employee must provide a physical street address. A P.O. Box is not acceptable in Section 1.',
      recordNote: 'Audit: Corrected Section 1 to include physical address [Street Address].',
      source: 'USCIS M-274 Section 3.1',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/31-completing-section-1-of-form-i-9',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 34: E-Verify & SSN',
      question: 'What if an E-Verify employee doesn\'t have an SSN yet?',
      answer: 'If the employee has applied for but not yet received an SSN, you must wait until they receive it to create a case in E-Verify. Do not block work in the meantime.',
      recordNote: 'E-Verify Case: Pending SSN receipt [Date]. Section 1 complete.',
      source: 'E-Verify User Manual Section 4.2',
      sourceUrl: 'https://www.e-verify.gov/employers/employer-resources/e-verify-user-manual',
    },
    {
      category: 'Advanced',
      scenarioTitle: 'Scenario 35: Employer cannot request specific immigration documents',
      question: 'Can we require employees to present a specific immigration document?',
      answer: 'No. Employees choose which acceptable documents to present. The employer may only examine documents that reasonably appear genuine and relate to the employee.',
      recordNote: 'Employee selected acceptable documents from the lists. Employer recorded the documents examined and did not ask for a specific form.',
      source: 'USCIS M-274 Section 11.4',
      sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/114-avoiding-discrimination',
    },
  ]

  console.log(`Seeding ${playbookScenarios.length} playbook scenarios...`)

  for (const scenario of playbookScenarios) {
    await upsertPlaybookScenario(scenario)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
