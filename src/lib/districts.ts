// Aktau microdistricts with approximate relative coordinates (0-100 grid)
// based on a stylized map layout — used for the SVG interactive map.

export type District = {
  id: string;
  name: string;
  x: number; // % from left
  y: number; // % from top
  r: number; // bubble radius
};

export const AKTAU_DISTRICTS: District[] = [
  { id: "1 мкр", name: "1 мкр", x: 28, y: 70, r: 22 },
  { id: "3 мкр", name: "3 мкр", x: 36, y: 62, r: 22 },
  { id: "4 мкр", name: "4 мкр", x: 44, y: 55, r: 24 },
  { id: "5 мкр", name: "5 мкр", x: 52, y: 50, r: 22 },
  { id: "6 мкр", name: "6 мкр", x: 60, y: 46, r: 22 },
  { id: "7 мкр", name: "7 мкр", x: 50, y: 38, r: 24 },
  { id: "8 мкр", name: "8 мкр", x: 58, y: 32, r: 22 },
  { id: "9 мкр", name: "9 мкр", x: 66, y: 36, r: 22 },
  { id: "11 мкр", name: "11 мкр", x: 42, y: 30, r: 24 },
  { id: "12 мкр", name: "12 мкр", x: 35, y: 24, r: 22 },
  { id: "13 мкр", name: "13 мкр", x: 28, y: 35, r: 22 },
  { id: "14 мкр", name: "14 мкр", x: 22, y: 45, r: 24 },
  { id: "15 мкр", name: "15 мкр", x: 70, y: 50, r: 22 },
];

export const ALL_DISTRICTS = AKTAU_DISTRICTS.map((d) => d.id);
