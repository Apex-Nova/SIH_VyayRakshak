import type { StateInfo } from "../types";

// Approximate centroids on a 0..100 stylised India canvas (x → east, y → south).
// Used by the SVG geospatial visualisation. Positions are illustrative.
export const STATES: StateInfo[] = [
  { id: "jk", name: "Jammu & Kashmir", code: "JK", cx: 30, cy: 10 },
  { id: "hp", name: "Himachal Pradesh", code: "HP", cx: 36, cy: 16 },
  { id: "pb", name: "Punjab", code: "PB", cx: 30, cy: 19 },
  { id: "uk", name: "Uttarakhand", code: "UK", cx: 42, cy: 20 },
  { id: "hr", name: "Haryana", code: "HR", cx: 34, cy: 23 },
  { id: "dl", name: "Delhi", code: "DL", cx: 37, cy: 25 },
  { id: "rj", name: "Rajasthan", code: "RJ", cx: 26, cy: 30 },
  { id: "up", name: "Uttar Pradesh", code: "UP", cx: 46, cy: 29 },
  { id: "br", name: "Bihar", code: "BR", cx: 58, cy: 32 },
  { id: "sk", name: "Sikkim", code: "SK", cx: 63, cy: 27 },
  { id: "as", name: "Assam", code: "AS", cx: 72, cy: 31 },
  { id: "ar", name: "Arunachal Pradesh", code: "AR", cx: 78, cy: 24 },
  { id: "ng", name: "Nagaland", code: "NL", cx: 78, cy: 31 },
  { id: "mn", name: "Manipur", code: "MN", cx: 77, cy: 35 },
  { id: "mz", name: "Mizoram", code: "MZ", cx: 75, cy: 39 },
  { id: "tr", name: "Tripura", code: "TR", cx: 72, cy: 37 },
  { id: "ml", name: "Meghalaya", code: "ML", cx: 70, cy: 34 },
  { id: "wb", name: "West Bengal", code: "WB", cx: 62, cy: 38 },
  { id: "jh", name: "Jharkhand", code: "JH", cx: 56, cy: 37 },
  { id: "gj", name: "Gujarat", code: "GJ", cx: 18, cy: 38 },
  { id: "mp", name: "Madhya Pradesh", code: "MP", cx: 40, cy: 38 },
  { id: "cg", name: "Chhattisgarh", code: "CG", cx: 50, cy: 42 },
  { id: "od", name: "Odisha", code: "OD", cx: 56, cy: 45 },
  { id: "mh", name: "Maharashtra", code: "MH", cx: 33, cy: 48 },
  { id: "ts", name: "Telangana", code: "TS", cx: 42, cy: 52 },
  { id: "ap", name: "Andhra Pradesh", code: "AP", cx: 45, cy: 58 },
  { id: "ka", name: "Karnataka", code: "KA", cx: 35, cy: 60 },
  { id: "goa", name: "Goa", code: "GA", cx: 28, cy: 58 },
  { id: "kl", name: "Kerala", code: "KL", cx: 34, cy: 72 },
  { id: "tn", name: "Tamil Nadu", code: "TN", cx: 42, cy: 70 },
  { id: "an", name: "Andaman & Nicobar", code: "AN", cx: 82, cy: 66 },
  { id: "ld", name: "Lakshadweep", code: "LD", cx: 22, cy: 70 },
  { id: " py", name: "Puducherry", code: "PY", cx: 44, cy: 66 },
  { id: "ch", name: "Chandigarh", code: "CH", cx: 33, cy: 21 },
  { id: "dn", name: "Dadra & Nagar Haveli", code: "DN", cx: 24, cy: 45 },
  { id: "la", name: "Ladakh", code: "LA", cx: 40, cy: 6 },
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  up: ["Aligarh", "Lucknow", "Varanasi", "Gorakhpur", "Meerut", "Prayagraj", "Agra", "Bareilly"],
  mp: ["Betul", "Indore", "Bhopal", "Jabalpur", "Gwalior", "Sagar", "Rewa"],
  br: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  jh: ["Hazaribagh", "Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"],
  mh: ["Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati"],
  rj: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
  cg: ["Raipur", "Bilaspur", "Durg", "Bastar", "Korba"],
  wb: ["Kolkata", "Howrah", "Darjeeling", "Malda", "Murshidabad"],
  ka: ["Bengaluru", "Mysuru", "Belagavi", "Kalaburagi", "Ballari"],
  tn: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  gj: ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Bhavnagar"],
  ap: ["Visakhapatnam", "Guntur", "Kurnool", "Nellore", "Kadapa"],
  ts: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
  od: ["Bhubaneswar", "Cuttack", "Ganjam", "Sambalpur", "Balasore"],
  kl: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  as: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon"],
  pb: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  hr: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Karnal"],
  an: ["South Andaman", "North & Middle Andaman", "Nicobar"],
};

export function districtsFor(stateId: string): string[] {
  return DISTRICTS_BY_STATE[stateId] ?? ["District 1", "District 2", "District 3"];
}
