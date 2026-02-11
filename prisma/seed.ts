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
        // Timing scenarios
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
        // Section 1 completion scenarios
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 3: Section 1 before the offer is accepted',
            question: 'Can we have a candidate fill Section 1 before they accept the job offer, just to speed onboarding?',
            answer: 'No. Employees may complete Section 1 after accepting the job offer, but not before the employer extends the offer and the employee accepts it. Section 1 must be completed no later than the first day of employment for pay.',
            recordNote: 'Hire date: [Date]. Offer accepted: [Date/Time]. Section 1 completed/signed: [Date]. (Confirm Section 1 completion occurred after acceptance.)',
            source: 'USCIS M-274 Sections 2.0 and 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 4: Employee has only one legal name',
            question: 'What if the employee only has one name on their legal documents?',
            answer: 'If the employee has only one name, they should enter it in the Last Name field and enter "Unknown" in the First Name field.',
            recordNote: 'Section 1 Name fields: Last Name = [Single Name]. First Name = "Unknown". (No additional employer-side documents required.)',
            source: 'USCIS M-274 Section 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 5: No street address available',
            question: 'What if an employee doesn\'t have a street address (temporary housing, rural location, unhoused)?',
            answer: 'The employee must provide their current address. If they do not have a street address, they should enter a description of the location of their residence (the handbook even gives an example like "Two miles south of I-81, near the water tower").',
            recordNote: 'Section 1 Address: [Descriptive location]. City/Town field can reflect the relevant local descriptor (village/county/etc. if not in a standard city/town).',
            source: 'USCIS M-274 Section 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 6: Email and phone fields left blank',
            question: 'Can an employee leave email and phone blank in Section 1?',
            answer: 'Yes. Employees are not required to provide an email address or telephone number in Section 1; they may leave those fields blank if they choose.',
            recordNote: 'Section 1 Email/Phone: blank (employee opted not to provide). No follow-up documentation required.',
            source: 'USCIS M-274 Section 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 7: Multiple preparers/translators used',
            question: 'If an employee uses more than one preparer/translator, how do we document it?',
            answer: 'Each preparer/translator must complete a separate certification block in Supplement A for Section 1, and employers may provide additional supplement pages and attach them as needed.',
            recordNote: 'Supplement A: Preparer/Translator Block 1 = [Name], Block 2 = [Name], etc. Attached supplement pages: [Count]. Employee still signs or marks Section 1.',
            source: 'USCIS M-274 Section 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 8: Employee cannot sign Section 1',
            question: 'What if the employee cannot sign their name?',
            answer: 'If an employee cannot sign, they may place a mark in the signature field to indicate their signature.',
            recordNote: 'Section 1 signature: [Mark]. Date: [Date]. If preparer/translator assisted, Supplement A completed.',
            source: 'USCIS M-274 Section 3.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/30-completing-section-1-of-form-i-9'
        },
        {
            category: 'Section 1',
            scenarioTitle: 'Scenario 9: Errors found in Section 1 after completion',
            question: 'If we find an error in Section 1, who can correct it and how?',
            answer: 'Only the employee (or their preparer/translator) may correct Section 1. The correction method is: draw a line through incorrect info, enter the correct info, and initial and date the correction. Employers should attach a written explanation of why information needed correcting/was missing. Employers also may not ask for documentation to verify information entered in Section 1.',
            recordNote: 'Section 1 correction: [Field corrected]. Method: line-through + corrected value + employee initials/date. Attached memo: "Correction made because [Reason]." (No document request to "prove" Section 1 details.)',
            source: 'USCIS M-274 Sections 3.0 and 9.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/90-correcting-errors-or-missing-information'
        },
        // Section 2 document handling scenarios
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 10: Accepting copies vs originals in physical inspection',
            question: 'Can we accept photocopies of documents for Section 2?',
            answer: 'For in-person inspection, employers may only accept original documents. The handbook notes the limited exception that a certified copy of a birth certificate is acceptable.',
            recordNote: 'Section 2: "Originals physically examined on [Date]." If birth certificate used, note "certified copy" and record it per List C rules.',
            source: 'USCIS M-274 Section 4.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 11: Restricted Social Security card presented',
            question: 'Employee brought a Social Security card that says "VALID FOR WORK ONLY WITH DHS AUTHORIZATION" (or similar). Can we accept it as List C?',
            answer: 'No. Restricted Social Security cards with the listed restrictive legends are not acceptable as List C documents; the employee must present a different List C document or a List A document.',
            recordNote: 'Attempted doc: Restricted SS card (List C) rejected (reason: restricted legend). Replacement docs accepted: [List A] or [List C + List B].',
            source: 'USCIS M-274 Section 4.0 and Section 13',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 12: Receipt rule mechanics and follow-up update',
            question: 'If an employee presents a receipt for a replacement document, how do we record it and what happens when the replacement arrives?',
            answer: 'If the employee presents an acceptable receipt (and the job is not under-3-days), the employer must accept it, record it as "Receipt" + document title in Section 2, and then, when the replacement document is presented, cross out "Receipt," enter replacement document info in Additional Information, and initial/date the change. Accepting a second receipt after the initial receipt period is not permissible.',
            recordNote: 'Receipt accepted: "Receipt – [Doc Title]" recorded on [Date]. Receipt valid until: [Date]. Replacement doc examined: [Doc Title/Number], recorded in Additional Information on [Date], initialed/dated by employer rep. (No second receipt.)',
            source: 'USCIS M-274 Section 4.4',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/44-acceptable-receipts'
        },
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 13: Employer wants to copy documents "only when it feels risky"',
            question: 'Can we copy documents only for noncitizens or only when we think a case is "high-risk"?',
            answer: 'If you copy document(s), you should do it consistently for all new hires and reverified employees, regardless of national origin, citizenship, or immigration status; inconsistent copying can raise discrimination risk. Also, copying does not replace completing the Form I-9.',
            recordNote: 'Policy: "We copy documents for all hires (or none)." If copies kept: stored with Form I-9. Note that originals were still examined for Section 2.',
            source: 'USCIS M-274 Section 4.1',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/41-retaining-copies-of-documents'
        },
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 14: Employer address entry in Section 2',
            question: 'Can we use a company P.O. Box as the employer address in Section 2?',
            answer: 'No. The employer must enter a physical street address for the business in Section 2; employers may not enter a P.O. Box as their address.',
            recordNote: 'Section 2 Employer Address: [Street Address]. If corrected, line-through + correct address + employer initials/date + attached explanation (if needed).',
            source: 'USCIS M-274 Section 4.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        {
            category: 'Section 2',
            scenarioTitle: 'Scenario 15: Staffing agency "first day of employment" selection',
            question: 'For staffing agencies, what date should be used as "first day of employment" in Section 2?',
            answer: 'Staffing agencies may choose either: (1) the date the employee is assigned to their first job, or (2) the date the employee is entered into the assignment pool as the first day of employment (but should be consistent).',
            recordNote: 'Policy: "First day of employment" defined as [assignment date] OR [assignment pool date], applied consistently. First day entered on Form I-9 Section 2: [Date].',
            source: 'USCIS M-274 Section 4.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/40-completing-section-2-of-form-i-9'
        },
        // Remote hires and authorized representatives
        {
            category: 'Remote Verification',
            scenarioTitle: 'Scenario 16: Notary public as authorized representative',
            question: 'If we use a notary public as our authorized representative, do they notarize the I-9 and stamp it?',
            answer: 'A notary public used as an authorized representative is not acting as a notary for Form I-9 purposes and should not provide a notary seal on the form. The employer remains liable for any violations or errors committed by the authorized representative.',
            recordNote: 'Authorized representative: [Name], Role: notary public acting as authorized rep. Section 2 completed/signed/dated by rep: [Date]. (No notary seal.)',
            source: 'USCIS M-274 Section 2.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/20-general-overview-and-instructions'
        },
        {
            category: 'Remote Verification',
            scenarioTitle: 'Scenario 17: Employee tries to complete Section 2 themselves',
            question: 'Can the employee be the authorized representative for their own Form I-9?',
            answer: 'No. Employees cannot act as authorized representatives for their own Form I-9 and cannot complete/update/correct Section 2 or Supplement B for themselves or attest to the authenticity of the documents they present.',
            recordNote: 'Section 2 completed by: [Employer rep / authorized rep]. Employee not listed as authorized rep.',
            source: 'USCIS M-274 Section 2.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/20-general-overview-and-instructions'
        },
        {
            category: 'Remote Verification',
            scenarioTitle: 'Scenario 18: Using the DHS alternative procedure for remote document examination',
            question: 'If we\'re an E-Verify employer, can we examine documents remotely instead of in-person?',
            answer: 'Yes, if you are enrolled in E-Verify in good standing and follow the required steps: examine copies (front/back), conduct a live video interaction where the employee presents the same documents, indicate the alternative procedure on the Form I-9, and retain clear/legible copies. If you choose to offer the alternative procedure at an E-Verify hiring site, it must be offered consistently for all employees at that site (though employers may choose to offer it for remote hires only as long as the practice is not discriminatory).',
            recordNote: 'Remote exam method: DHS alternative procedure. Steps logged: copies received [Date], live video review [Date], checkbox completed [Yes], copies retained [Yes].',
            source: 'USCIS M-274 Section 4.5',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/45-alternative-procedure-for-remote-examination-of-i-9-documentation'
        },
        // Reverification, rehire, and automatic extension scenarios
        {
            category: 'Reverification',
            scenarioTitle: 'Scenario 19: Reverification is (and is not) required',
            question: 'Which employees/documents do we need to reverify—and which ones should we not reverify?',
            answer: 'You must reverify employment authorization no later than the date it expires when reverification is required, using Supplement B, and the employee may present any acceptable document from List A or List C showing current authorization. Reverification is never required for U.S. citizens or noncitizen nationals, and also is not required when certain documents expire (including U.S. passports, U.S. passport cards, Permanent Resident Cards, and List B documents).',
            recordNote: 'Reverification trigger: [Doc type] expiring on [Date]. Supplement B completed on [Date] with new List A or C document: [Title/Number/Exp]. (No reverification for passports/green cards/List B expirations.)',
            source: 'USCIS M-274 Sections 6.0 and 6.1',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/60-reverification-and-rehires'
        },
        {
            category: 'Reverification',
            scenarioTitle: 'Scenario 20: Rehire within three years',
            question: 'If we rehire someone within three years, do we need a new I-9?',
            answer: 'If you rehire an employee within three years of the date their prior Form I-9 was completed, you may complete a block on Supplement B (or complete a new Form I-9 instead). If the prior Form I-9 is an older version, you must complete Supplement B on the current version and keep it with the previously completed I-9.',
            recordNote: 'Rehire date: [Date]. Action: Supplement B used [Yes/No]. If Supplement B used: employee name confirmed, Date of Rehire entered, employer signs/dates; if new I-9 used, attach to prior I-9 with explanation.',
            source: 'USCIS M-274 Section 6.2',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/62-rehires'
        },
        {
            category: 'Reverification',
            scenarioTitle: 'Scenario 21: Automatic EAD extension documentation (general case)',
            question: 'Can we accept an expired EAD with a renewal receipt notice (Form I-797C) as proof of work authorization?',
            answer: 'For eligible categories, an EAD that appears expired may be treated as unexpired for Form I-9 during an automatic extension period when presented with a qualifying Form I-797C receipt notice (and the employer should record/annotate the extension properly, including "EAD EXT" in Additional Information). The handbook also makes clear that the employee must be reverified at the end of the automatic extension period.',
            recordNote: 'Docs presented: EAD (Card # [Number], "Card Expires" [Date]) + Form I-797C receipt (Received Date [Date], category matches as required). Section 2 notation: "EAD EXT"; Expiration Date field set to the calculated extended date (then track reverification due date).',
            source: 'USCIS M-274 Section 5.1',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/51-automatic-extensions-of-employment-authorization-documents-eads-in-certain-circumstances'
        },
        {
            category: 'Reverification',
            scenarioTitle: 'Scenario 22: Renewal filed on/after October 30, 2025 (no more automatic EAD extension for most categories)',
            question: 'If someone filed an EAD renewal and shows an expired EAD plus a new Form I-797C receipt notice dated after October 30, 2025, can we treat that as an automatic extension?',
            answer: 'Under the DHS interim final rule effective October 30, 2025, DHS eliminated the practice of granting automatic extension periods (up to 540 days) for renewal applications filed on or after October 30, 2025, and USCIS notice/receipt language issued on or after that date is intended to indicate it is not evidence of employment authorization for that purpose. Operationally, if work authorization expires and the employee cannot present valid proof of current employment authorization, the employer may not continue employing the individual.',
            recordNote: 'EAD "Card Expires": [Date]. Renewal filing date: [Date]. If filing/receipt indicates post-10/30/2025 and no other extension applies: set reverification deadline to [EAD expiration]. Outcome: updated Supplement B with new acceptable authorization doc OR work paused/ended due to lack of proof.',
            source: 'DHS interim final rule (8 CFR 274a.13(e))',
            sourceUrl: 'https://www.uscis.gov/i-9-central'
        },
        // Recordkeeping and corrections
        {
            category: 'Recordkeeping',
            scenarioTitle: 'Scenario 23: Correcting errors without "white-out," backdating, or hiding edits',
            question: 'If we discover mistakes, what is the correct way to fix an I-9?',
            answer: 'Corrections should be made by drawing a line through incorrect information, entering the correct info, and initialing/dating the change. A written explanation should be attached for why information was missing or needed correction. Employers should not conceal changes (no erasing/correction fluid) and should not backdate; if a completion date was missing, enter the current date and initial. Electronic systems should maintain an audit trail reflecting corrections/additions.',
            recordNote: 'Correction log: [Section] corrected on [Date] by [Employee or Employer Rep, as appropriate]; method line-through + initials/date; attached memo with reason; electronic audit trail retained (if applicable).',
            source: 'USCIS M-274 Section 9.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/90-correcting-errors-or-missing-information'
        },
        {
            category: 'Recordkeeping',
            scenarioTitle: 'Scenario 24: Retention period, inspection readiness, and "don\'t send the I-9 to the government"',
            question: 'How long do we keep I-9s, and what do we do if there\'s an inspection?',
            answer: 'Employers must keep a completed Form I-9 for as long as the person works for you, and then retain it three years after hire or one year after employment ends, whichever is later. You only need to retain the pages that contain employee/employer-entered information (not the Lists of Acceptable Documents page, instructions, or blank supplements). Employers should not mail Form I-9 to USCIS or ICE. For inspection logistics, M-274 explains that authorized officers are entitled to inspect Forms I-9 and that agencies provide at least three business days\' notice before inspection; employers must make Forms I-9 available upon request.',
            recordNote: 'Retention schedule: Hire date [Date]; Termination date [Date]; Purge-after date [Later of: hire+3 yrs or term+1 yr]. Inspection readiness: Forms retrievable within 3 business days; stored format [paper/electronic/microfilm].',
            source: 'USCIS M-274 Sections 10.0 and 10.3',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/100-retaining-form-i-9'
        },
        // Discrimination scenarios
        {
            category: 'Discrimination',
            scenarioTitle: 'Scenario 25: Requesting specific documents or treating "foreign-looking" workers differently',
            question: 'Can we demand a green card, a DHS document, or a particular List A document—especially for noncitizens?',
            answer: 'No. The employee chooses which acceptable documents to present from the Lists of Acceptable Documents, and the employer must accept documents that reasonably appear genuine and relate to the employee. The handbook also gives "don\'ts" that include: don\'t refuse documents because they have a future expiration date; don\'t request specific documents to create an E-Verify case; don\'t demand a new document when a Permanent Resident Card expires; don\'t request specific documents for reverification; and don\'t limit jobs to U.S. citizens unless required by law/regulation/order/contract.',
            recordNote: 'Policy note: "We do not specify documents. We accept any acceptable List A or List B+List C combination that reasonably appears genuine/related." If an unacceptable doc is rejected, record the objective reason (e.g., expired where unexpired required; restricted SS card).',
            source: 'USCIS M-274 Section 11.4',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/114-avoiding-discrimination'
        },
        {
            category: 'Discrimination',
            scenarioTitle: 'Scenario 26: E-Verify guardrails that aren\'t "mismatch handling"',
            question: 'Can we prescreen applicants in E-Verify, or run E-Verify only on noncitizens?',
            answer: 'No. Employers must use E-Verify for all new hires (not selectively), may not prescreen applicants, and may not use E-Verify to check employees hired before becoming a participant (with limited federal-contractor exceptions), and may not use it to reverify employees who have temporary employment authorization. Also, if an employee presents a List B + List C combination, the List B document must contain a photograph for E-Verify employers.',
            recordNote: 'E-Verify policy: "All new hires processed; no prescreening." If List B + C used: List B photo present [Yes]. Internal note: E-Verify case created for each new hire after Form I-9 completion (use your internal case references as needed).',
            source: 'USCIS M-274 Section 1.2',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/12-e-verify'
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
        // Identity/document-name inconsistencies
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 27: Documents show different last names during Section 2',
            question: 'If the employee presents two documents with different last names (e.g., just married), can we accept them?',
            answer: 'You may accept a document with a different name than the name in Section 1 if the document reasonably relates to the employee. You may attach a brief memo explaining the discrepancy, and the employee may provide supporting documentation but is not required to do so. If you conclude the document does not reasonably appear genuine/related, the employee should be allowed to present other acceptable documents.',
            recordNote: 'Memo attached: "Name discrepancy due to [Reason]." Decision: document accepted as reasonably relating [Yes/No]. If "No," replacement documents presented: [List].',
            source: 'USCIS M-274 Section 14.0',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/140-questions-and-answers'
        },
        {
            category: 'Advanced',
            scenarioTitle: 'Scenario 28: Prior "false identity," now employee wants to regularize under true identity',
            question: 'What if an employee admits they previously completed an I-9 under a false identity, but now has work authorization in their true identity?',
            answer: 'In that situation, USCIS guidance says you should complete a new Form I-9, write the original hire date in Section 2, attach the new I-9 to the prior one, and include a written explanation. The handbook also states that if the employee demonstrates current authorization to work, Form I-9 rules do not require termination (though other laws/contracts/policies may matter).',
            recordNote: 'Action: New Form I-9 completed under true identity on [Date]. Section 2 first day of employment: [Original Hire Date]. Attachment: written explanation [attached]. Prior I-9 retained per retention rules.',
            source: 'USCIS M-274 Section 6.3',
            sourceUrl: 'https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/63-updating-section-1'
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
