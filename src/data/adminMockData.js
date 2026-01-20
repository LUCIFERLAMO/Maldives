export const MOCK_AGENT_RESUMES = [
    {
        id: 1,
        name: 'Sita Dewi',
        email: 'sita.d@example.com',
        whatsapp: '+62 812 3456 7890',
        nationality: 'Indonesian',
        role: 'Guest Relations Officer',
        agency: 'GLOBAL TALENT',
        status: 'SELECTED',
        statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        documents: {
            resume: 'Sita_Resume_2024.pdf',
            passport: 'Passport_Sita.pdf',
            education: 'Deg_Hospitality.pdf',
            pcc: 'Police_Clearance.pdf',
            goodStanding: 'Good_Standing.pdf'
        },
        appliedDate: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
        id: 2,
        name: 'Amit Patel',
        email: 'amit@example.com',
        whatsapp: '+91 987 654 3210',
        nationality: 'Indian',
        role: 'Sous Chef',
        agency: 'GLOBAL TALENT',
        status: 'REJECTED',
        statusColor: 'bg-slate-100 text-slate-500 border-slate-200',
        documents: {
            resume: 'Amit_CV.pdf',
            passport: 'Passport_Amit.pdf',
            education: 'Culinary_Arts.pdf',
            pcc: 'PCC_India.pdf',
            goodStanding: 'Ref_Letter.pdf'
        },
        appliedDate: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
        id: 3,
        name: 'Kevin Hart',
        email: 'kevin@example.com',
        whatsapp: '+44 7700 900077',
        nationality: 'British',
        role: 'Diving Instructor',
        agency: 'ISLAND RECRUITERS',
        status: 'ARRIVED',
        statusColor: 'bg-blue-50 text-blue-600 border-blue-100',
        documents: {
            resume: 'Kevin_Dive_CV.pdf',
            passport: 'Passport_UK.pdf',
            education: 'PADI_Master.pdf',
            pcc: 'DBS_Check.pdf',
            goodStanding: 'Ref_DiveShop.pdf'
        },
        appliedDate: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
    },
    {
        id: 4,
        name: 'Jane Doe',
        email: 'jane@example.com',
        whatsapp: '+1 555 0123 4567',
        nationality: 'American',
        role: 'Spa Manager',
        agency: 'ISLAND RECRUITERS',
        status: 'PROCESSING',
        statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
        documents: {
            resume: 'Jane_Spa_CV.pdf',
            passport: 'Passport_USA.pdf',
            education: 'Spa_Management.pdf',
            pcc: 'FBI_Check.pdf',
            goodStanding: 'Health_Cert.pdf'
        },
        appliedDate: new Date(Date.now() - 86400000 * 45).toISOString() // 45 days ago
    },

];

export const MOCK_AUDIT_QUEUE = [
    {
        id: 101,
        name: 'Elena Rossi',
        email: 'elena.r@example.com',
        whatsapp: '+39 333 1234567',
        nationality: 'Italian',
        role: 'Sommelier',
        agency: 'Direct',
        region: 'Rome, Italy',
        source: 'Direct',
        status: 'PROCESSING',
        statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
        documents: {
            resume: 'Elena_CV.pdf',
            passport: 'Passport_IT.pdf',
            education: 'WSET_Level3.pdf',
            pcc: 'Police_Clearance_IT.pdf',
            goodStanding: 'Ref_Hotel.pdf'
        },
        appliedDate: new Date(Date.now() - 1800000).toISOString() // 30 mins ago
    },
    {
        id: 102,
        name: 'Rajiv Singh',
        email: 'rajiv.s@example.com',
        whatsapp: '+91 999 888 7777',
        nationality: 'Indian',
        role: 'Maintenance Manager',
        agency: 'GLOBAL TALENT',
        region: 'Mumbai, India',
        source: 'Agency',
        status: 'PROCESSING',
        statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
        documents: {
            resume: 'Rajiv_Resume.pdf',
            passport: 'Passport_IN.pdf',
            education: 'BTech_Mech.pdf',
            pcc: 'PCC_Mumbai.pdf',
            goodStanding: 'Exp_Letter.pdf'
        },
        appliedDate: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
        id: 103,
        name: 'Sarah Connor',
        email: 'sarah.c@example.com',
        whatsapp: '+1 310 555 0199',
        nationality: 'American',
        role: 'Security Chief',
        agency: 'ISLAND RECRUITERS',
        region: 'California, USA',
        source: 'Agency',
        status: 'PROCESSING',
        statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
        documents: {
            resume: 'Sarah_CV.pdf',
            passport: 'Passport_US.pdf',
            education: 'Security_Cert.pdf',
            pcc: 'FBI_Clearance.pdf',
            goodStanding: 'Ref_Mil.pdf'
        },
        appliedDate: new Date(Date.now() - 86400000 * 20).toISOString() // 20 days ago
    }
];

export const MOCK_NEW_PARTNER_APPS = [
    {
        id: 1,
        applicant: 'Michael Chen',
        agency: 'PACIFIC TALENT SOURCING',
        region: 'Singapore / SE Asia',
        email: 'm.chen@pacifictalent.com',
        status: 'YET TO BE CHECKED',
        statusColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        submittedDate: '2024-05-24',
        documents: {
            identity: 'Identity_Proof.pdf',
            license: 'Business_License.jpg',
            profile: 'Agency_Profile.pdf'
        }
    },
    {
        id: 2,
        applicant: 'Sarah Abed',
        agency: 'MENA HOSPITALITY',
        region: 'Dubai, UAE',
        email: 'sarah.a@menahospitality.com',
        status: 'YET TO BE CHECKED',
        statusColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        submittedDate: '2024-05-25',
        documents: {
            identity: 'Identity_Doc.pdf',
            license: 'License_UAE.pdf',
            profile: 'Company_Profile_MENA.pdf'
        }
    },
    {
        id: 3,
        applicant: 'David Low',
        agency: 'ASEAN CONNECT',
        region: 'Bangkok, Thailand',
        email: 'david.low@aseanconnect.th',
        status: 'ON HOLD',
        statusColor: 'bg-amber-50 text-amber-600 border-amber-100',
        submittedDate: '2024-05-22',
        documents: {
            identity: 'Thai_ID.pdf',
            license: 'Biz_Reg.pdf',
            profile: 'Portfolio_ASEAN.pdf'
        }
    }
];
