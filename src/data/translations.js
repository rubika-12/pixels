/**
 * Internationalization (i18n) dictionary for English and Tamil.
 */

export const translations = {
  en: {
    // Navigation
    brand: 'StoreOrSell',
    navHowItWorks: 'How it works',
    navAdvisor: 'Advisor',
    navMarketTrends: 'Market Trends',
    navArbitrage: 'Where to Sell',
    navSowing: 'Plan a Season',
    navImpact: 'Impact',
    navRoadmap: 'Roadmap',
    navTryAdvisor: 'Try the Advisor',
    judgesDemoBtn: '⚡ Judges Demo',
    judgesDemoDesc: 'Auto-pilot demo',
    langToggle: 'தமிழ்',

    // Hero
    heroBadge: 'POST-HARVEST DECISION INTELLIGENCE',
    heroTitlePart1: 'Hold or sell?',
    heroTitleHighlight: 'Stop guessing.',
    heroTitlePart2: 'See the money.',
    heroSubtitle: 'Every season, Indian farmers and traders lose ₹1.5L+ to post-harvest spoilage and panic distress sales. StoreOrSell tracks current market price trends by date, storage conditions, and shelf life to give you an uncompromising HOLD or SELL verdict with the exact Right Price Date.',
    heroCtaPrimary: 'Check Your Stock Now',
    heroCtaSecondary: 'Watch Demo Example',
    heroPreviewTitle: 'Live Preview',
    heroPreviewHolding: 'HOLD FOR 5 DAYS',
    heroPreviewGain: '+₹1,620 Extra Net',
    heroPreviewCrop: '1,000 kg Tomatoes in Cold Storage',
    heroMetricUsers: '2,400+ MT Advised',
    heroMetricAccuracy: '94% Prediction Fit',
    heroMetricLossPrevented: '₹42L+ Loss Saved',

    // Categories
    tabAll: 'All Produce',
    tabVegetables: '🥬 Vegetables (10)',
    tabFruits: '🍎 Fruits (8)',

    // Problem Strip
    problemTitle: 'The Post-Harvest Gamble',
    problemSubtitle: 'Two devastating pitfalls cost Indian farmers over ₹92,000 Crore annually.',
    problemWaitTitle: 'Wait too long → Spoilage',
    problemWaitDesc: 'Holding for higher prices without climate metrics leads to rapid rotting, weight shrinkage, and zero salvage value.',
    problemWaitLoss: 'Up to 35% produce dumped',
    problemSellTitle: 'Sell too early → Distress Price',
    problemSellDesc: 'Panic selling at market glut forces farmers to surrender margin to middlemen right before price recovery.',
    problemSellLoss: 'Average 22% margin forfeit',

    // How It Works
    howTitle: 'How StoreOrSell Works',
    howSubtitle: 'Three scientific steps to turn guesswork into bankable profit.',
    step1Num: '01',
    step1Title: 'Input Your Current Stock',
    step1Desc: 'Pick your fruit or vegetable, enter how much stock you hold in hand, and how long it has been stored.',
    step2Num: '02',
    step2Title: 'We Analyze Date-Wise Trends & Decay',
    step2Desc: 'Our engine computes daily storage tariffs, accelerating rot curves, and 7-day mandi price momentum.',
    step3Num: '03',
    step3Title: 'You Get Right Price & Clear Money',
    step3Desc: 'An exact date for the right price, unambiguous HOLD/SELL verdict, and net rupees in your pocket.',

    // Advisor Section
    advisorSectionBadge: 'AI ADVISOR & RIGHT PRICE FINDER',
    advisorSectionTitle: 'Post-Harvest Hold-or-Sell Advisor',
    advisorSectionSubtitle: 'Select your fruit or vegetable, enter your current stock on hand, and see the exact date when price will be right.',
    presetLabel: 'Load Demo Scenario:',
    presetPrompt: 'Select a judge test case...',

    // Form
    formTitle: 'Current Stock & Storage Conditions',
    formSubtitle: 'Manual inventory entry with date-based market price trends',
    stockWhatLabel: '1. What produce do you currently hold?',
    stockHowMuchLabel: '2. Current Stock On Hand',
    storageLabel: '3. Storage Facility & Environment',
    ageLabel: '4. Days in Storage / Produce Age',
    todayPriceLabel: "5. Today's Mandi Price (₹/kg)",
    storageCostLabel: '6. Storage Tariff (₹/kg/day)',
    unitSelectorLabel: 'Unit:',
    btnCalculate: 'Analyze Stock & Find Right Price',
    btnCalculating: 'Analyzing shelf life, decay & date-wise prices...',
    idealConditionsLabel: 'Optimal Storage Condition:',

    // Right Price Target Finder
    rightPriceTitle: 'When Will The Price Be The Right Price?',
    rightPriceSubtitle: 'Date-wise economic optimization of market peak vs storage cost & rot',
    rightPriceTargetBadge: 'TARGET RIGHT PRICE',
    rightPriceDateLabel: 'Optimal Selling Date',
    targetPriceLabel: 'Target Market Price',
    expectedNetLabel: 'Expected Net Realization',
    netAdvantageLabel: 'Net Difference vs Selling Today',

    // Results Dashboard
    resultsTitle: 'Advisory Verdict & Complete Analysis',
    resultsSubtitle: 'Net economic comparison after spoilage and storage costs',
    verdictHold: 'RECOMMENDATION: HOLD',
    verdictSell: 'RECOMMENDATION: SELL NOW',
    confidenceLabel: 'Confidence Level:',
    highConfidence: 'High Confidence',
    medConfidence: 'Medium Confidence',
    lowConfidence: 'Low Confidence (Close Call)',
    bestSellDay: 'Optimal Sell Window:',
    sellNowCardTitle: 'SELL TODAY',
    sellNowSubtitle: 'Immediate cash realization',
    sellNowGross: 'Gross Revenue',
    sellNowStorage: 'Storage Incurred',
    sellNowSpoilage: 'Spoilage Loss',
    sellNowNet: 'Net In Pocket',
    
    holdCardTitle: 'HOLD UNTIL RIGHT PRICE',
    holdSubtitle: 'Target sell date optimization',
    holdGross: 'Gross Realization',
    holdStorage: 'Cumulative Storage Fee',
    holdSpoilage: 'Projected Spoilage Loss',
    holdNet: 'Net In Pocket',
    differenceHighlight: 'Net Gain in Favor of',
    
    // Gauge & Charts
    shelfLifeTitle: 'Storage Condition & Shelf-Life Health',
    shelfLifeDaysLeft: 'Days Remaining',
    shelfLifeCondition: 'in prime marketable condition',
    shelfLifeWarning: 'Spoilage risk accelerates rapidly beyond this point',
    
    priceChartTitle: 'Current Market Price Trends by Date (₹/kg)',
    priceChartSubtitle: 'Historical verified rates and date-wise damped projection with target right price',
    legendHistorical: 'Historical Mandi Price',
    legendProjected: 'Projected Trend by Date',
    legendBestSell: 'Right Price Target Date',

    netValueChartTitle: 'Expected Net Value by Selling Date',
    netValueChartSubtitle: 'Net cash in pocket after deducting cumulative rot and daily storage fees',
    chartXDay: 'Date',

    // Factors
    factorsTitle: 'Complete Analysis: Why This Recommendation?',
    factorsSubtitle: 'Multi-factor breakdown driving the economic model',
    factorStorage: 'Storage Condition Protection',
    factorAge: 'Produce Freshness Index',
    factorMomentum: 'Price Momentum & Upside',
    factorSpoilage: 'Spoilage & Shrinkage Resistance',

    // Actions
    actionDownload: 'Download Summary Slip',
    actionShareWhatsApp: 'Share on WhatsApp',
    toastDownloaded: 'Advisory summary prepared for print/download!',
    toastCopied: 'Shareable link copied to clipboard!',
    toastPresetLoaded: 'Loaded demo preset successfully!',

    // Impact & Roadmap
    impactTitle: 'Measurable Ground Impact',
    impactSubtitle: 'Engineered specifically for Farmer Producer Organizations (FPOs) and smallholder aggregators.',
    impactStat1Val: '₹1,620+',
    impactStat1Label: 'Average Gain per MT of Produce',
    impactStat2Val: '28%',
    impactStat2Label: 'Reduction in Distress Sales',
    impactStat3Val: '18 Days',
    impactStat3Label: 'Average Shelf-Life Visibility',

    roadmapTitle: 'Product Roadmap',
    roadmapSubtitle: 'Our phased deployment pathway from hackathon MVP to national mandi scale.',
    stage1Badge: 'PHASE 1 • CURRENT MVP',
    stage1Title: 'Decision Intelligence Core',
    stage1Desc: 'Pure client-side optimization engine for 18 core fruits and vegetables, storage condition modeling, date-wise Recharts analytics, and bilingual support.',
    stage2Badge: 'PHASE 2 • Q2 2026',
    stage2Title: 'Live Mandi APIs & WhatsApp Bot',
    stage2Desc: 'Direct integration with Agmarknet real-time prices, automated WhatsApp daily alerts for registered farmers, and hyper-local weather risk alerts.',
    stage3Badge: 'PHASE 3 • Q4 2026',
    stage3Title: 'FPO Pilot & Cold Chain Booking',
    stage3Desc: 'On-ground pilots with 12 Farmer Producer Organizations in Tamil Nadu & Maharashtra, combined with in-app one-click cold storage slot reservation.',

    // Empty state
    emptyStateTitle: 'Ready to Evaluate Your Current Stock?',
    emptyStateDesc: 'Select your produce, enter your current stock in hand on the left, or click "⚡ Judges Demo" to watch the mathematical engine in action.',

    // Footer
    footerTagline: 'Empowering farmers and produce traders with data-driven post-harvest intelligence.',
    footerDisclaimer: 'Disclaimer: Market projections are based on mathematical trend algorithms and historical averages. Always cross-verify with local APMC mandis.',
  },

  ta: {
    // Navigation
    brand: 'StoreOrSell (ஸ்டோர் ஆர் செல்)',
    navHowItWorks: 'செயல்படும் விதம்',
    navAdvisor: 'ஆலோசகர் (Advisor)',
    navMarketTrends: 'சந்தை நிலவரம்',
    navArbitrage: 'எங்கு விற்பது (Arbitrage)',
    navSowing: 'பருவ திட்டம் (Sowing)',
    navImpact: 'பயன்கள்',
    navRoadmap: 'திட்டம்',
    navTryAdvisor: 'ஆலோசகரை தொடங்கு',
    judgesDemoBtn: '⚡ நடுவர் டெமோ (Demo)',
    judgesDemoDesc: 'தானியங்கி செயல்முறை',
    langToggle: 'English',

    // Hero
    heroBadge: 'அறுவடைக்குப் பிந்தைய முடிவெடுக்கும் தொழில்நுட்பம்',
    heroTitlePart1: 'சேமிக்கவா அல்லது விற்கவா?',
    heroTitleHighlight: 'யூகிப்பதை நிறுத்துங்கள்.',
    heroTitlePart2: 'லாபத்தை நேரடியாகக் காணுங்கள்.',
    heroSubtitle: 'ஒவ்வொரு பருவத்திலும், தமிழக விவசாயிகள் மற்றும் வணிகர்கள் பதற்றத்தினால் குறைவான விலைக்கு விற்று அல்லது அழுகல் காரணமாக பெருமளவு இழக்கின்றனர். StoreOrSell தேதி வாரியான சந்தை விலைப் போக்கு, சேமிப்பு தட்பவெப்பநிலை மற்றும் அழுகும் விகிதத்தை கணக்கிட்டு சரியான விற்பனை தேதியுடன் தெளிவான முடிவை வழங்குகிறது.',
    heroCtaPrimary: 'உங்கள் இருப்பை சோதிக்கவும்',
    heroCtaSecondary: 'மாதிரி உதாரணத்தைப் பார்க்க',
    heroPreviewTitle: 'நேரடி மாதிரி',
    heroPreviewHolding: '5 நாட்கள் சேமித்து வைக்கவும்',
    heroPreviewGain: '+₹1,620 கூடுதல் நிகர லாபம்',
    heroPreviewCrop: '1,000 கிலோ தக்காளி (குளிர்சாதன கிடங்கு)',
    heroMetricUsers: '2,400+ மெ.டன் ஆலோசிக்கப்பட்டது',
    heroMetricAccuracy: '94% துல்லியமான கணிப்பு',
    heroMetricLossPrevented: '₹42L+ இழப்பு தடுக்கப்பட்டது',

    // Categories
    tabAll: 'அனைத்து பொருட்கள்',
    tabVegetables: '🥬 காய்கறிகள் (10)',
    tabFruits: '🍎 பழங்கள் (8)',

    // Problem Strip
    problemTitle: 'அறுவடைக்குப் பிந்தைய சூதாட்டம்',
    problemSubtitle: 'விவசாயிகளுக்கு ஆண்டுதோறும் ஏற்படும் இரண்டு மிகப்பெரிய இழப்புகள்.',
    problemWaitTitle: 'அதிக நாள் காத்திருப்பு → அழுகல் நஷ்டம்',
    problemWaitDesc: 'சரியான அறிவியல் அளவீடின்றி கூடுதல் விலையை எதிர்பார்த்து காத்திருந்தால் எடை குறைவு மற்றும் அழுகல் காரணமாக முழு இழப்பு ஏற்படும்.',
    problemWaitLoss: '35% வரை விளைபொருள் சேதம்',
    problemSellTitle: 'அவசர விற்பனை → மிகக் குறைந்த விலை',
    problemSellDesc: 'சந்தையில் தற்காலிக வரத்து அதிகமான சமயத்தில் பயந்து உடனே விற்றால், இடைத்தரகர்களுக்கு அதிக லாபம் சென்று விவசாயிக்கு இழப்பு ஏற்படும்.',
    problemSellLoss: 'சராசரியாக 22% லாப இழப்பு',

    // How It Works
    howTitle: 'StoreOrSell செயல்படும் விதம்',
    howSubtitle: 'மூன்று எளிய படிகளில் யூகத்தை உறுதியான லாபமாக மாற்றுங்கள்.',
    step1Num: '01',
    step1Title: 'தற்போதைய கையிருப்பை உள்ளிடுங்கள்',
    step1Desc: 'காய்கறி அல்லது பழத்தைத் தேர்ந்தெடுத்து, உங்களிடம் தற்போது எவ்வளவு இருப்பு உள்ளது, எத்தனை நாட்கள் சேமிக்கப்பட்டுள்ளது என்பதை உள்ளிடவும்.',
    step2Num: '02',
    step2Title: 'நாங்கள் தேதி வாரியாக கணக்கிடுவோம்',
    step2Desc: 'சேமிப்பு தட்பவெப்பம், தினசரி சேமிப்புக் கட்டணம், அழுகல் வேகம் மற்றும் 7 நாள் மண்டி விலை நகர்வுகளை அலசுகிறோம்.',
    step3Num: '03',
    step3Title: 'சரியான விற்பனை நாள் & லாபம் பெறுங்கள்',
    step3Desc: 'எந்த தேதியில் விற்றால் அதிக லாபம் கிடைக்கும், சேமிக்கவா அல்லது விற்கவா என்ற நேரடி பரிந்துரை கிடைக்கும்.',

    // Advisor Section
    advisorSectionBadge: 'AI ஆலோசனைக் கருவி & சரியான விலை கணிப்பான்',
    advisorSectionTitle: 'பயிர் விற்பனை மற்றும் சரியான விலை ஆலோசகர்',
    advisorSectionSubtitle: 'உங்கள் பழம் அல்லது காய்கறியைத் தேர்ந்தெடுத்து, கையிருப்பை உள்ளிட்டு சரியான விற்பனை தேதியைக் காணுங்கள்.',
    presetLabel: 'மாதிரி காட்சியை ஏற்றவும்:',
    presetPrompt: 'நடுவர் சோதனை மாதிரியை தேர்வு செய்க...',

    // Form
    formTitle: 'கையிருப்பு மற்றும் சேமிப்பு விவரங்கள்',
    formSubtitle: 'தேதி வாரியான சந்தை விலை போக்குடன் நேரடி இருப்பு உள்ளீடு',
    stockWhatLabel: '1. உங்களிடம் தற்போது என்ன இருப்பு உள்ளது?',
    stockHowMuchLabel: '2. தற்போதைய கையிருப்பு அளவு',
    storageLabel: '3. சேமிப்பு வசதி & தட்பவெப்பநிலை',
    ageLabel: '4. சேமித்து எத்தனை நாட்கள் ஆகிறது (வயது)',
    todayPriceLabel: '5. இன்றைய மண்டி விலை (₹/கிலோ)',
    storageCostLabel: '6. தினசரி சேமிப்பு செலவு (₹/கிலோ/நாள்)',
    unitSelectorLabel: 'அளவு முறை:',
    btnCalculate: 'இருப்பை அலசி சரியான விற்பனை தேதியைக் காண்க',
    btnCalculating: 'ஆயுட்காலம், அழுகல் & தேதி வாரிய விலையை ஆராய்கிறது...',
    idealConditionsLabel: 'பரிந்துரைக்கப்பட்ட உகந்த சேமிப்பு:',

    // Right Price Target Finder
    rightPriceTitle: 'எந்த தேதியில் விற்றால் சரியான விலை கிடைக்கும்?',
    rightPriceSubtitle: 'சந்தை விலை உயர்வு vs சேமிப்பு செலவு மற்றும் அழுகல் இழப்பு ஆகியவற்றின் பொருளாதார ஒப்பீடு',
    rightPriceTargetBadge: 'இலக்கு சரியான விற்பனை தேதி',
    rightPriceDateLabel: 'சிறந்த விற்பனை தேதி',
    targetPriceLabel: 'எதிர்பார்க்கப்படும் இலக்கு விலை',
    expectedNetLabel: 'கைக்கு வரும் எதிர்பார்க்கப்படும் நிகர பணம்',
    netAdvantageLabel: 'இன்றே விற்பதை விட கூடுதல் நிகர லாபம்',

    // Results Dashboard
    resultsTitle: 'முழுமையான ஆலோசனை முடிவு',
    resultsSubtitle: 'அழுகல் மற்றும் சேமிப்புச் செலவு கழித்த பின் நிகர பண ஒப்பீடு',
    verdictHold: 'பரிந்துரை: சேமித்து வைக்கவும் (HOLD)',
    verdictSell: 'பரிந்துரை: உடனே விற்கவும் (SELL NOW)',
    confidenceLabel: 'நம்பகத்தன்மை அளவு:',
    highConfidence: 'அதிக நம்பகத்தன்மை (High)',
    medConfidence: 'மிதமான நம்பகத்தன்மை (Medium)',
    lowConfidence: 'குறைந்த வரம்பு (நெருக்கமான முடிவு)',
    bestSellDay: 'சிறந்த விற்பனை காலம்:',
    sellNowCardTitle: 'இன்றே விற்றால் (SELL TODAY)',
    sellNowSubtitle: 'உடனடி ரொக்கப் பண வரவு',
    sellNowGross: 'மொத்த வருமானம்',
    sellNowStorage: 'சேமிப்பு கட்டணம்',
    sellNowSpoilage: 'அழுகல் இழப்பு',
    sellNowNet: 'கைக்கு வரும் நிகர பணம்',
    
    holdCardTitle: 'சரியான நாள் வரை சேமித்தால் (HOLD)',
    holdSubtitle: 'உகந்த விற்பனை நாளில் விற்றால்',
    holdGross: 'மொத்த வருமானம்',
    holdStorage: 'மொத்த சேமிப்புக் கட்டணம்',
    holdSpoilage: 'எதிர்பார்க்கப்படும் அழுகல் இழப்பு',
    holdNet: 'கைக்கு வரும் நிகர பணம்',
    differenceHighlight: 'கூடுதல் நிகர லாபம் சாதகமாக இருப்பது:',

    // Gauge & Charts
    shelfLifeTitle: 'சேமிப்பு நிலை & நற்பத ஆயுட்காலம்',
    shelfLifeDaysLeft: 'நாட்கள் மீதம் உள்ளது',
    shelfLifeCondition: 'நல்ல சந்தை விற்பனை தரத்தில்',
    shelfLifeWarning: 'இதற்கு மேல் காத்திருந்தால் அழுகல் வேகம் மிக அதிகமாகும்',

    priceChartTitle: 'தேதி வாரியான தற்போதைய சந்தை விலை போக்குகள் (₹/கிலோ)',
    priceChartSubtitle: 'கடந்த கால மண்டி விலைகளும் சரியான விற்பனை தேதியுடன் கணிக்கப்பட்ட எதிர்கால போக்கும்',
    legendHistorical: 'கடந்த மண்டி விலை',
    legendProjected: 'தேதி வாரியாக கணிக்கப்பட்ட விலை',
    legendBestSell: 'சரியான விற்பனை தேதி',

    netValueChartTitle: 'விற்பனை செய்யும் தேதியைப் பொறுத்து நிகர மதிப்பு',
    netValueChartSubtitle: 'சேமிப்புச் செலவு மற்றும் அழுகல் இழப்பு கழித்த பின் கிடைக்கும் நிகர வருவாய்',
    chartXDay: 'தேதி',

    // Factors
    factorsTitle: 'முழுமையான பகுப்பாய்வு: இந்த முடிவுக்கு என்ன காரணம்?',
    factorsSubtitle: 'பொருளாதார மாதிரியை வழிநடத்தும் பல காரணிகளின் அலசல்',
    factorStorage: 'சேமிப்பு வசதி பாதுகாப்புத் திறன்',
    factorAge: 'பயிரின் நற்பதம் & முதிர்ச்சி',
    factorMomentum: 'சந்தை விலை ஏற்ற வேகம்',
    factorSpoilage: 'அழுகல் மற்றும் சுருங்குதல் எதிர்ப்பு',

    // Actions
    actionDownload: 'அறிக்கையை பதிவிறக்கு (Print Slip)',
    actionShareWhatsApp: 'வாட்ஸ்அப்பில் பகிர்க (WhatsApp)',
    toastDownloaded: 'அச்சு மற்றும் பகிர்வு அறிக்கை தயாராகிவிட்டது!',
    toastCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
    toastPresetLoaded: 'மாதிரி காட்சி வெற்றிகரமாக ஏற்றப்பட்டது!',

    // Impact & Roadmap
    impactTitle: 'களத்தில் அளவிடக்கூடிய பயன்கள்',
    impactSubtitle: 'விவசாய உற்பத்தியாளர் நிறுவனங்கள் (FPOs) மற்றும் விவசாயிகளுக்காக பிரத்யேகமாக உருவாக்கப்பட்டது.',
    impactStat1Val: '₹1,620+',
    impactStat1Label: 'ஒரு மெட்ரிக் டன்னுக்கு சராசரி கூடுதல் லாபம்',
    impactStat2Val: '28%',
    impactStat2Label: 'பதற்ற அவசர விற்பனையில் குறைப்பு',
    impactStat3Val: '18 நாட்கள்',
    impactStat3Label: 'முன்கூட்டியே தெரியும் சேமிப்பு ஆயுள்',

    roadmapTitle: 'வளர்ச்சித் திட்டம் (Roadmap)',
    roadmapSubtitle: 'ஹேக்கத்தான் மாதிரியிலிருந்து தேசிய அளவிலான பயன்பாட்டிற்கான எங்களின் திட்டமிடல்.',
    stage1Badge: 'கட்டம் 1 • தற்போதைய MVP',
    stage1Title: 'முடிவெடுக்கும் கணிதக் கருவி',
    stage1Desc: '18 முக்கிய காய்கறிகள் மற்றும் பழங்களுக்கான துல்லிய கணக்கீடு, தேதி வாரியான வரைபட விளக்கங்கள் மற்றும் தமிழ்/ஆங்கில மொழி ஆதரவு.',
    stage2Badge: 'கட்டம் 2 • Q2 2026',
    stage2Title: 'நேரடி மண்டி API & வாட்ஸ்அப் பாட்',
    stage2Desc: 'Agmarknet அரசு விலை API இணைப்பு, விவசாயிகளுக்கு தினசரி வாட்ஸ்அப் விலை அறிவிப்புகள் மற்றும் உள்ளூர் வானிலை எச்சரிக்கைகள்.',
    stage3Badge: 'கட்டம் 3 • Q4 2026',
    stage3Title: 'FPO களப்பணி & குளிர்சாதன முன்பதிவு',
    stage3Desc: 'தமிழ்நாடு மற்றும் மகாராஷ்டிராவில் உள்ள 12 FPO நிறுவனங்களுடன் களப்பயன்பாடு மற்றும் செயலியில் குளிர்சாதன கிடங்கு முன்பதிவு வசதி.',

    // Empty state
    emptyStateTitle: 'உங்கள் கையிருப்பை மதிப்பிடத் தயாரா?',
    emptyStateDesc: 'இடதுபுறத்தில் உள்ள விவரங்களை நிரப்பவும் அல்லது "⚡ நடுவர் டெமோ" பொத்தானை அழுத்தி உடனடி முடிவைக் காண்க.',

    // Footer
    footerTagline: 'விவசாயிகள் மற்றும் வணிகர்களுக்கு தரவு சார்ந்த அறிவார்ந்த வழிகாட்டி.',
    footerDisclaimer: 'குறிப்பு: விலை கணிப்புகள் கணிதப் போக்கு வழிமுறைகளை அடிப்படையாகக் கொண்டவை. உங்கள் உள்ளூர் APMC மண்டியில் விலையை உறுதிப்படுத்திக் கொள்ளவும்.',
  },
};
