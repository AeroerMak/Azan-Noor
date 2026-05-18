import type { Dua } from '@/types';

export const duas: Dua[] = [
  // MORNING
  {
    id: 'morning-1',
    category: 'morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku walahul hamdu wahuwa 'ala kulli shay'in qadir",
    translation: 'We have entered the morning and at this very time the kingdom belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah, Alone, without any partner. To Him belongs the kingdom and all praise are due to Him, and He is able to do all things.',
    source: 'Abu Dawud',
  },
  {
    id: 'morning-2',
    category: 'morning',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.',
    source: 'Abu Dawud, Tirmidhi',
  },
  {
    id: 'morning-3',
    category: 'morning',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: "Raditu billahi rabba, wabil-islami dina, wabi-Muhammadin sallallahu 'alayhi wa sallama nabiyya",
    translation: 'I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad (peace be upon him) as my Prophet.',
    source: 'Abu Dawud, Tirmidhi',
  },

  // EVENING
  {
    id: 'evening-1',
    category: 'evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: 'We have entered the evening and at this very time the kingdom belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah, Alone, without any partner.',
    source: 'Muslim',
  },
  {
    id: 'evening-2',
    category: 'evening',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    translation: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the Final Return.',
    source: 'Tirmidhi',
  },

  // SLEEPING
  {
    id: 'sleeping-1',
    category: 'sleeping',
    arabic: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: 'In Your name O Allah, I die and I live.',
    source: 'Bukhari',
  },
  {
    id: 'sleeping-2',
    category: 'sleeping',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: 'O Allah, protect me from Your punishment on the day Your servants are resurrected.',
    source: 'Abu Dawud, Tirmidhi',
  },
  {
    id: 'sleeping-3',
    category: 'sleeping',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ',
    transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk",
    translation: 'O Allah, I submit myself to You, entrust my affairs to You, and turn my face towards You.',
    source: 'Bukhari, Muslim',
  },

  // EATING
  {
    id: 'eating-1',
    category: 'eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: "Bismillah",
    translation: 'In the name of Allah.',
    source: 'Abu Dawud, Tirmidhi',
  },
  {
    id: 'eating-2',
    category: 'eating',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
    transliteration: "Allahumma barik lana fihi wa at'imna khayran minh",
    translation: 'O Allah, bless it for us and provide us with better than it.',
    source: 'Tirmidhi',
  },
  {
    id: 'eating-3',
    category: 'eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    translation: 'All praise is due to Allah Who has given us food and drink, and made us Muslims.',
    source: 'Abu Dawud, Tirmidhi',
  },

  // TRAVEL
  {
    id: 'travel-1',
    category: 'travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhanalladhi sakhkhara lana hadha wama kunna lahu muqrinin wa inna ila rabbina lamunqalibun",
    translation: 'Glory be to Him Who has subjected this to us, and we were not capable of that, and surely to our Lord we must return.',
    source: 'Quran 43:13-14',
  },
  {
    id: 'travel-2',
    category: 'travel',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى',
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wattaqwa, waminal-'amali ma tarda",
    translation: 'O Allah, we ask You during this journey for righteousness, piety, and deeds that please You.',
    source: 'Muslim',
  },

  // PROTECTION
  {
    id: 'protection-1',
    category: 'protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    source: 'Muslim',
  },
  {
    id: 'protection-2',
    category: 'protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wala fis-sama'i wahuwa as-sami'ul-'alim",
    translation: 'In the name of Allah, with Whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, All-Knowing.',
    source: 'Abu Dawud, Tirmidhi',
  },
  {
    id: 'protection-3',
    category: 'protection',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wahuwa rabbul-'arshil-'azim",
    translation: 'Allah is sufficient for me; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.',
    source: 'Quran 9:129',
  },

  // GENERAL
  {
    id: 'general-1',
    category: 'general',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhabannar",
    translation: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.',
    source: 'Quran 2:201',
  },
  {
    id: 'general-2',
    category: 'general',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    transliteration: "Allahummaghfir li warhamni wahdini wa'afini warzuqni",
    translation: 'O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.',
    source: 'Muslim',
  },
  {
    id: 'general-3',
    category: 'general',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "Subhanallahi wabihamdihi, subhanallahil-'azim",
    translation: 'Glory and praise be to Allah; Glory be to Allah the Almighty.',
    source: 'Bukhari, Muslim',
  },
];

export const DUA_CATEGORIES = [
  { key: 'morning', label: 'Morning', icon: '🌅' },
  { key: 'evening', label: 'Evening', icon: '🌇' },
  { key: 'sleeping', label: 'Sleeping', icon: '🌙' },
  { key: 'eating', label: 'Eating', icon: '🍽️' },
  { key: 'travel', label: 'Travel', icon: '✈️' },
  { key: 'protection', label: 'Protection', icon: '🛡️' },
  { key: 'general', label: 'General', icon: '📿' },
] as const;
