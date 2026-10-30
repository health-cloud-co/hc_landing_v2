/* English data for the home "proven technology" section on the en/ pages.
   Keep entries in sync with proof-data.js. type: 'patent' (registered) | 'pending' (application filed) | 'trademark' | 'copyright'.
   The first 4 items are always visible; the rest unfold under "Show more". Counts are computed from the list. */
window.HC_PROOF = {
  ip: [
    /* Order: filed applications, registered patents, trademarks, copyrights; newest first within each group.
       10-2988646 (July 2026) is only in the company profile deck; 10-2958760 (April 2026) was confirmed on KIPRIS. */
    { type: 'pending', tag: 'Filed', name: 'Personalized wellness management system based on ensuring reproducibility of time-series analysis using wide-area reference images and integrating biological and lifestyle data, and operating method thereof', ref: '10-2025-0144100' },
    { type: 'pending', tag: 'Filed', name: 'Artificial intelligence-based skin diagnosis system and operating method using the same', ref: '10-2024-0148919' },
    { type: 'patent', tag: 'Patent', name: 'Non-face-to-face system for physical and cognitive training tailored to senior care', ref: '10-2988646' },
    { type: 'patent', tag: 'Patent', name: 'Management system for day and night care facilities', ref: '10-2958760' },
    { type: 'patent', tag: 'Patent', name: 'Service operation system based on matching professional instructors for senior care customized programs', ref: '10-2854344' },
    { type: 'patent', tag: 'Patent', name: 'Service operation system based on visiting bath matching', ref: '10-2834779' },
    { type: 'patent', tag: 'Patent', name: 'Pet visit beauty matching and operation service system', ref: '10-2769583' },
    { type: 'patent', tag: 'Patent', name: 'Senior care center long-term care recipient needs and care service operation system', ref: '10-2657197' },
    { type: 'patent', tag: 'Patent', name: 'A program service operation system based on video content customized for senior care in a nursing institution', ref: '10-2369182' },
    { type: 'trademark', tag: 'Trademark', name: 'Health Cloud logo · Class 9 (smartphone application software and 12 more goods)', ref: '40-1827373' },
    { type: 'trademark', tag: 'Trademark', name: 'Health Cloud logo · Class 38 (internet and mobile internet platform access services and 7 more services)', ref: '40-1827374' },
    { type: 'trademark', tag: 'Trademark', name: 'Health Cloud logo · Class 44 (health care services and 7 more services)', ref: '40-1827377' },
    { type: 'trademark', tag: 'Trademark', name: 'WellNow logo · Class 44 (elderly nursing services and 12 more services)', ref: '40-1883920' },
    { type: 'trademark', tag: 'Trademark', name: 'WellNow logo · Class 45 (elderly care services and 3 more services)', ref: '40-1883921' },
    { type: 'copyright', tag: 'Copyright', name: 'Health Cloud Bellus skin/scalp/skin tone AI diagnosis and analysis app service', ref: 'C-2025-032370' },
    { type: 'copyright', tag: 'Copyright', name: 'Health Cloud scalp and hair AI analysis service', ref: 'C-2025-032246' },
    { type: 'copyright', tag: 'Copyright', name: 'Health Cloud generative AI image-based web prompt solution', ref: 'C-2024-019757' },
    { type: 'copyright', tag: 'Copyright', name: 'WellNow physical/cognitive/leisure program operation service solution based on senior-care video content for long-term care institutions', ref: 'C-2021-031540' },
    { type: 'copyright', tag: 'Copyright', name: 'WellNow needs assessment and care service solution for long-term care recipients', ref: 'C-2021-031539' },
    { type: 'copyright', tag: 'Copyright', name: 'WellNow smartphone camera-based AI scalp image analysis app service solution', ref: 'C-2021-031538' },
    { type: 'copyright', tag: 'Copyright', name: 'WellNow home nursing support service solution', ref: 'C-2021-031537' }
  ],
  grants: [
    /* Projects won 2023–2025, newest start date first. tag is the start year (the home card groups rows by it); ref is ministry (agency) · program · period.
       Agencies, programs and periods follow the Oct 2026 project status table. Lead/participant roles are not shown (H-PPG and MobiliLite are Participant (AI/SW) per the 2026 project list; no document states a role for the rest). */
    { type: 'grant', tag: '2025', name: 'Field validation of a diabetic foot home-care device and system combining H-PPG blood flow measurement with AI image analysis', ref: 'Gangwon Information & Culture Industry Promotion Agency · AI Medical Solution & Device Commercialization Validation Program · 2025.07–2027.12' },
    { type: 'grant', tag: '2025', name: 'Data processing for medication-analysis algorithms that summarize personal health information, predict conditions and recommend supplements', ref: 'Ministry of Science and ICT (Korea Data Agency) · Data Voucher Program · 2025.06–2025.11' },
    { type: 'grant', tag: '2025', name: 'Development of a mobile AI nailfold capillaroscopy (NFC) analysis system', ref: 'Ministry of SMEs and Startups (KISED) · Startup-Centered University · 2025.05–2025.12' },
    { type: 'grant', tag: '2025', name: 'Development of MobiliLite, a modular manual walking table with AI-based environment awareness and safety support', ref: 'Ministry of Health and Welfare (KHIDI) · Assistive Device Commercialization R&D Program · 2025.04–2028.12' },
    { type: 'grant', tag: '2025', name: 'Development of a precision skin-care solution using AI and sensor fusion', ref: 'Ministry of SMEs and Startups (TIPA) · Regional Innovation Leading Company R&D · 2025.04–2027.03' },
    { type: 'grant', tag: '2024', name: 'Field validation of a smart-signage cognitive rehabilitation coaching service', ref: 'Ministry of Science and ICT (Gangneung Science & Industry Promotion Agency) · Digital Innovation Global Growth R-Voucher · 2024.07–2024.11' },
    { type: 'grant', tag: '2024', name: 'Development of a multi-function home healthcare device with AI self-diagnosis', ref: 'Ministry of SMEs and Startups (TIPA) · Regional Specialty Project Legend 50+ · 2024.05–2024.12' },
    { type: 'grant', tag: '2023', name: 'Early screening of mild cognitive impairment and cognitive rehabilitation exercise service using a dot-pattern digital pen', ref: 'Ministry of SMEs and Startups (TIPA) · Startup Growth Technology Development (Stepping Stone) · 2023.10–2024.08' },
    { type: 'grant', tag: '2023', name: 'Building an AI training dataset of public speaking', ref: 'Ministry of Science and ICT (NIA) · AI Training Data Construction Program · 2023.06–2023.12' }
  ],
  allies: [
    /* Institutions, hospitals and companies only (no zones, certifications or program names). */
    { name: 'Hanyang University Hospital for Rheumatic Diseases', logo: '../assets/img/allies/hyumc-rheumatism.png' },
    { name: 'Wonju Medical Device Industry Promotion Agency (WMIT)', logo: '../assets/img/allies/wmit.png' },
    { name: 'Gangwon Center for Creative Economy & Innovation', logo: '../assets/img/allies/ccei-gangwon.png' },
    { name: 'Gangwon Industry-Academia Convergence Institute', logo: '../assets/img/allies/gwgic.png' },
    /* Partner companies (MOUs and joint business). */
    { name: 'Ziodia', logo: '../assets/img/allies/ziodia.png' },
    { name: 'GenieTech', logo: '../assets/img/allies/genie-tech.png' },
    { name: 'Miracle Healthcare', logo: '../assets/img/allies/miracle-healthcare.png' },
    { name: 'HMB', logo: '../assets/img/allies/hmb.png' },
    { name: 'FaceBloom', logo: '../assets/img/allies/facebloom.png' }
  ]
};
