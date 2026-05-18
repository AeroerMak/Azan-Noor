export interface MuezzinOption {
  id: string;
  name: string;
  nameAr: string;
  src: string;
}

export const MUEZZIN_OPTIONS: MuezzinOption[] = [
  {
    id: 'omar-hisham',
    name: 'Omar Hisham Al-Arabi',
    nameAr: 'عمر هشام العربي',
    src: '/audio/azan-omar-hisham.mp3',
  },
];

export const DEFAULT_MUEZZIN_ID = 'omar-hisham';
