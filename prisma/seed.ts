import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // --- I-9 Documents ---
    const passport = await prisma.i9Doc.upsert({
        where: { code: 'passport' },
        update: {},
        create: {
            code: 'passport',
            name: 'U.S. Passport or Passport Card',
            listType: 'A',
            description: 'Issued by Department of State'
        }
    })

    const formI766 = await prisma.i9Doc.upsert({
        where: { code: 'i766' },
        update: {},
        create: {
            code: 'i766',
            name: 'Employment Authorization Document (Form I-766)',
            listType: 'A',
            description: 'Card that contains a photograph'
        }
    })

    const foreignPassport = await prisma.i9Doc.upsert({
        where: { code: 'foreign_passport_i94' },
        update: {},
        create: {
            code: 'foreign_passport_i94',
            name: 'Foreign Passport with Form I-94',
            listType: 'A',
            description: 'Foreign passport that contains a temporary I-551 stamp or temporary I-551 printed notation on a machine-readable immigrant visa'
        }
    })

    const driverLicense = await prisma.i9Doc.upsert({
        where: { code: 'driver_license' },
        update: {},
        create: {
            code: 'driver_license',
            name: 'Driver\'s License',
            listType: 'B',
            description: 'Issued by State or outlying possession of the U.S.'
        }
    })

    const ssc = await prisma.i9Doc.upsert({
        where: { code: 'social_security_card' },
        update: {},
        create: {
            code: 'social_security_card',
            name: 'Social Security Account Number Card',
            listType: 'C',
            description: 'Unless the card includes one of the issuance restrictions'
        }
    })

    // --- Visas & Statuses ---

    // --- A-Categories (Employment Authorized Incident to Status) ---
    const aCategories = [
        { code: 'A01', name: 'Lawful Permanent Resident', desc: 'Rarely issued EAD; green card usually used' },
        { code: 'A02', name: 'Asylee', desc: 'Authorized incident to status' },
        { code: 'A03', name: 'Refugee', desc: 'Authorized incident to status' },
        { code: 'A04', name: 'N-8 or N-9', desc: 'Certain special immigrants' },
        { code: 'A05', name: 'J-2 spouse/dependent', desc: 'Employment authorized incident to status' },
        { code: 'A06', name: 'K-1 fiancé(e)', desc: 'Employment authorized incident to status' },
        { code: 'A07', name: 'K-2 dependent', desc: 'Employment authorized incident to status' },
        { code: 'A08', name: 'Citizen of Micronesia, Marshall Islands, Palau', desc: 'Employment authorized incident to status' },
        { code: 'A09', name: 'E-1/E-2 spouse', desc: 'Employment authorized incident to status' },
        { code: 'A10', name: 'Withholding of removal granted', desc: 'Employment authorized incident to status' },
        { code: 'A11', name: 'Deferred Enforced Departure', desc: 'Employment authorized incident to status' },
        { code: 'A12', name: 'Temporary Protected Status (TPS)', desc: 'Employment authorized incident to status' },
        { code: 'A13', name: 'Certain diplomats (A-3, G-5)', desc: 'Employment authorized incident to status' },
        { code: 'A14', name: 'LIFE Act legalization', desc: 'Employment authorized incident to status' },
        { code: 'A15', name: 'V visa', desc: 'Employment authorized incident to status' },
        { code: 'A16', name: 'T-1 principal', desc: 'Employment authorized incident to status' },
        { code: 'A17', name: 'E-3 spouse', desc: 'Employment authorized incident to status' },
        { code: 'A18', name: 'L-2 spouse', desc: 'Employment authorized incident to status' },
        { code: 'A19', name: 'U-1 principal', desc: 'Employment authorized incident to status' },
        { code: 'A20', name: 'U-2/U-3/U-4/U-5 dependents', desc: 'Employment authorized incident to status' },
    ]

    for (const cat of aCategories) {
        await prisma.visaOrStatus.upsert({
            where: { slug: cat.code.toLowerCase() },
            update: {},
            create: {
                slug: cat.code.toLowerCase(),
                name: `${cat.code} – ${cat.name}`,
                category: 'EAD Code (A)',
                description: cat.desc,
                workAuthorization: {
                    create: {
                        canWork: true,
                        requiresSponsorship: false,
                        documentTypes: JSON.stringify(['i766'])
                    }
                }
            }
        })
    }

    // --- C-Categories (EAD Required) ---
    const cCategories = [
        { code: 'C01', name: 'F-1 Practical Training' },
        { code: 'C02', name: 'J-2 dependent' },
        { code: 'C03A', name: 'Pre-completion OPT' },
        { code: 'C03B', name: 'Post-completion OPT' },
        { code: 'C03C', name: 'STEM OPT extension' },
        { code: 'C04', name: 'Asylum applicant' },
        { code: 'C05', name: 'J-1 trainee' },
        { code: 'C06', name: 'M-1 practical training' },
        { code: 'C07', name: 'Dependent of NATO' },
        { code: 'C08', name: 'Asylum pending' },
        { code: 'C09', name: 'Adjustment of Status applicant' },
        { code: 'C10', name: 'Suspension of deportation applicant' },
        { code: 'C11', name: 'Parolee' },
        { code: 'C14', name: 'Deferred Action (general)' },
        { code: 'C16', name: 'Registry applicant' },
        { code: 'C18', name: 'Order of supervision' },
        { code: 'C19', name: 'TPS applicant' },
        { code: 'C20', name: 'Section 210 legalization' },
        { code: 'C22', name: 'Section 245A legalization' },
        { code: 'C24', name: 'LIFE Act adjustment' },
        { code: 'C26', name: 'H-4 spouse' },
        { code: 'C27', name: 'Employment-based dependent' },
        { code: 'C28', name: 'Cuban adjustment' },
        { code: 'C29', name: 'NACARA' },
        { code: 'C30', name: 'VAWA self-petitioner' },
        { code: 'C31', name: 'VAWA approved' },
        { code: 'C33', name: 'DACA' },
        { code: 'C34', name: 'Spouse of international org employee' },
        { code: 'C35', name: 'T derivative' },
        { code: 'C36', name: 'U derivative' },
        { code: 'C37', name: 'CNMI long-term resident' },
        { code: 'C38', name: 'CW dependent' },
    ]

    for (const cat of cCategories) {
        await prisma.visaOrStatus.upsert({
            where: { slug: cat.code.toLowerCase() },
            update: {},
            create: {
                slug: cat.code.toLowerCase(),
                name: `${cat.code} – ${cat.name}`,
                category: 'EAD Code (C)',
                description: 'Employment authorization must be applied for.',
                workAuthorization: {
                    create: {
                        canWork: true,
                        requiresSponsorship: false,
                        documentTypes: JSON.stringify(['i766'])
                    }
                }
            }
        })
    }

    // --- Nonimmigrant Work Authorization (Incident to Status - No EAD Required) ---
    const incidentToStatus = [
        { slug: 'h1b', name: 'H-1B Specialty Occupation', max: '6 years', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-dod-cooperative-research-and-development-project-workers-and-fashion-models' },
        { slug: 'l1a', name: 'L-1A Intracompany Transferee (Manager)', max: '7 years', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager' },
        { slug: 'l1b', name: 'L-1B Intracompany Transferee (Specialized)', max: '5 years', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1b-intracompany-transferee-specialized-knowledge' },
        { slug: 'tn', name: 'TN NAFTA Professional', max: '3 years increments', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/tn-nafta-professionals' },
        { slug: 'o1', name: 'O-1 Extraordinary Ability', max: '3 years initial', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement' },
        { slug: 'e3', name: 'E-3 Specialty Occupation (Australia)', max: '2 years increments', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-3-specialty-occupation-workers-from-australia' },
        { slug: 'h1b1', name: 'H-1B1 (Chile/Singapore)', max: '1 year increments', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b1-specialty-occupation-workers-from-chile-and-singapore' },
        { slug: 'e1', name: 'E-1 Treaty Trader', max: '2 years increments', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-1-treaty-traders' },
        { slug: 'e2', name: 'E-2 Treaty Investor', max: '2 years increments', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-2-treaty-investors' },
        { slug: 'r1', name: 'R-1 Religious Worker', max: '5 years max', docs: ['foreign_passport_i94'], sponsorship: true, ref: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/r-1-temporary-religious-workers' },
    ]

    for (const v of incidentToStatus) {
        await prisma.visaOrStatus.upsert({
            where: { slug: v.slug },
            update: {},
            create: {
                slug: v.slug,
                name: v.name,
                category: 'Visa',
                description: 'Employment authorized incident to status with a specific employer.',
                officialRef: (v as any).ref,
                workAuthorization: {
                    create: {
                        canWork: true,
                        requiresSponsorship: v.sponsorship,
                        maxDuration: v.max,
                        restrictions: 'Employer-specific.',
                        documentTypes: JSON.stringify(v.docs)
                    }
                }
            }
        })
    }

    // --- Special Statuses (F-1 OPT, STEM) ---
    await prisma.visaOrStatus.upsert({
        where: { slug: 'f1-opt' },
        update: {},
        create: {
            slug: 'f1-opt',
            name: 'F-1 OPT (Post-Completion)',
            category: 'Status',
            description: 'Employment authorized for 12 months with EAD.',
            workAuthorization: {
                create: {
                    canWork: true,
                    requiresSponsorship: false,
                    maxDuration: '12 months',
                    documentTypes: JSON.stringify(['i766'])
                }
            }
        }
    })

    await prisma.visaOrStatus.upsert({
        where: { slug: 'f1-stem-opt' },
        update: {},
        create: {
            slug: 'f1-stem-opt',
            name: 'F-1 STEM OPT Extension',
            category: 'Status',
            description: '24-month extension for STEM degree holders.',
            workAuthorization: {
                create: {
                    canWork: true,
                    requiresSponsorship: true,
                    maxDuration: '24 months (additional)',
                    documentTypes: JSON.stringify(['i766'])
                }
            }
        }
    })

    // --- Immigrant Categories (Green Card Based) ---
    const immigrantCats = [
        { slug: 'eb1', name: 'EB-1 Priority Workers' },
        { slug: 'eb2', name: 'EB-2 Professionals with Advanced Degrees' },
        { slug: 'eb3', name: 'EB-3 Skilled Workers/Professionals' },
        { slug: 'eb4', name: 'EB-4 Special Immigrants' },
        { slug: 'eb5', name: 'EB-5 Immigrant Investors' },
    ]

    for (const v of immigrantCats) {
        await prisma.visaOrStatus.upsert({
            where: { slug: v.slug },
            update: {},
            create: {
                slug: v.slug,
                name: v.name,
                category: 'Immigrant Category',
                description: 'Lawful Permanent Resident basis.',
                workAuthorization: {
                    create: {
                        canWork: true,
                        requiresSponsorship: false,
                        maxDuration: 'Indefinite',
                        documentTypes: JSON.stringify(['i551'])
                    }
                }
            }
        })
    }

    // --- Special: Green Card / LPR ---
    await prisma.visaOrStatus.upsert({
        where: { slug: 'lpr', name: 'Lawful Permanent Resident (Green Card)' },
        update: {},
        create: {
            slug: 'lpr',
            name: 'Lawful Permanent Resident (Green Card)',
            category: 'Status',
            description: 'Unlimited work authorization. No reverification required.',
            workAuthorization: {
                create: {
                    canWork: true,
                    requiresSponsorship: false,
                    maxDuration: 'Indefinite',
                    documentTypes: JSON.stringify(['i551', 'social_security_card'])
                }
            }
        }
    })

    // --- Special Auto-Extension Rules ---
    const autoExtEligible = ['c09', 'c26', 'c08', 'a12', 'c19']
    for (const slug of autoExtEligible) {
        await prisma.i9Action.create({
            data: {
                visa: { connect: { slug } },
                trigger: 'Auto-Extension',
                actionType: 'Reverify',
                details: 'Eligible for automatic extension under 8 CFR 274a.13 if timely filed and category matches.',
                mandatory: true
            }
        })
    }

    // --- Official USCIS & DHS Links (Global Sources) ---
    const globalSources = [
        { title: 'USCIS Form I-9 Official Page', url: 'https://www.uscis.gov/i-9' },
        { title: 'I-94 Official Site (Travel Records)', url: 'https://i94.cbp.dhs.gov/' },
        { title: 'M-274 Handbook for Employers', url: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274' }
    ]

    const allRecords = await prisma.visaOrStatus.findMany()
    for (const source of globalSources) {
        for (const record of allRecords) {
            await prisma.source.create({
                data: {
                    visaId: record.id,
                    title: source.title,
                    url: source.url
                }
            })
        }
    }

    // --- I-9 Playbook Scenarios ---
    const playbookScenarios = [
        {
            category: 'Timing',
            scenarioTitle: 'Scenario 1: Documents Forgotten',
            question: 'Do we have to complete Section 2 on Day 1?',
            answer: 'Usually you have up to 3 business days after hire to examine documents and complete Section 2. If documents are not presented within this time, the employee may not continue working.',
            recordNote: 'Hire Date: [Date]. Section 2 Deadline: [Hire Date + 3 Biz Days]. Result: [Document Name] examined on [Date].',
            source: 'USCIS M-274 Section 4.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        {
            category: 'Timing',
            scenarioTitle: 'Scenario 2: Short-Term Hires (Under 3 Days)',
            question: 'Can we do the I-9 later for a 2-day job?',
            answer: 'No. If employment lasts less than 3 business days, Section 2 must be completed at the time of hire. Receipts are NOT acceptable for short hires.',
            recordNote: 'Hire Date: [Date]. Section 2 Completed: [Hire Date]. (Note: Receipt Rule not applicable for <3 day hire).',
            source: 'USCIS M-274 Section 4.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        {
            category: 'Discrimination',
            scenarioTitle: 'Scenario 30: E-Verify Mismatches',
            question: 'Can we suspend an employee if there\'s a mismatch?',
            answer: 'No. You cannot take adverse action (suspension/non-payment) while the employee is taking steps to resolve a mismatch.',
            recordNote: 'Action: Employee notified of mismatch. Following resolution period; no adverse action taken.',
            source: 'USCIS E-Verify User Manual',
            sourceUrl: 'https://www.e-verify.gov/employers/employer-resources/e-verify-user-manual'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 31: Name Changes & I-9',
            question: 'What if an employee changes their name after Section 1?',
            answer: 'You are not required to update the I-9 for a name change, but it is recommended. If you do, enter the new name in Section 3 and provide the reason.',
            recordNote: 'Action: Updated Section 3 with new name [Name] on [Date]. Original name: [Old Name].',
            source: 'M-274 Section 11.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/110-retaining-and-storing-form-i-9'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 32: I-94 Auto-Extension Rules',
            question: 'Can we accept an expired EAD with an I-94?',
            answer: 'Yes, for certain categories (like H-4, L-2, E-1/2 spouses), an expired EAD combined with a valid I-94 showing status can provide an automatic extension.',
            recordNote: 'Docs: Expired EAD [Number] + I-94 Status [Code]. Extension valid until I-94 expiry: [Date].',
            source: 'USCIS Auto-Extension Guidance',
            sourceUrl: 'https://www.uscis.gov/ead-auto-extend'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 33: Remote Hire authorized rep',
            question: 'Can an employee\'s spouse be the authorized representative?',
            answer: 'Yes. USCIS allows any individual to act as an authorized representative to complete Section 2. The employer remains liable for any errors.',
            recordNote: 'Authorized Rep: [Name] (Relationship: [Relationship]). Documents examined physically on [Date].',
            source: 'M-274 Section 4.1',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/41-completing-section-2-of-form-i-9'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 34: P.O. Box in Section 1',
            question: 'Can an employee use a P.O. Box for their address?',
            answer: 'No. The employee must provide a physical street address. A P.O. Box is not acceptable in Section 1.',
            recordNote: 'Audit: Corrected Section 1 to include physical address [Street Address].',
            source: 'M-274 Section 3.1',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/31-completing-section-1-of-form-i-9'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 35: E-Verify & SSN',
            question: 'What if an E-Verify employee doesn\'t have an SSN yet?',
            answer: 'If the employee has applied for but not yet received an SSN, you must wait until they receive it to create a case in E-Verify. Do not block work in the meantime.',
            recordNote: 'E-Verify Case: Pending SSN receipt [Date]. Section 1 complete.',
            source: 'E-Verify User Manual Section 4.2',
            sourceUrl: 'https://www.e-verify.gov/employers/employer-resources/e-verify-user-manual'
        }
    ];

    console.log(`Seeding ${playbookScenarios.length} scenarios...`);
    await prisma.playbookScenario.deleteMany(); // Clear existing to prevent duplicates during testing

    for (const scenario of playbookScenarios) {
        await prisma.playbookScenario.create({
            data: scenario
        });
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
