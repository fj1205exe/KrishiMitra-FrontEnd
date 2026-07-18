// ─── Indian states & districts ───────────────────────────────────────────────
// Used by onboarding (searchable state dropdown + dependent district dropdown)
// and by geolocation auto-detect. District lists are representative (major
// districts per state) — enough for a realistic demo without a 700-row dataset.

export const STATES: string[] = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu", "Delhi (NCT)",
  "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Changlang", "East Kameng", "East Siang", "Lohit", "Lower Subansiri", "Papum Pare", "Tawang", "Tirap", "West Kameng", "West Siang"],
  "Assam": ["Barpeta", "Cachar", "Darrang", "Dhubri", "Dibrugarh", "Golaghat", "Jorhat", "Kamrup", "Karbi Anglong", "Nagaon", "Sonitpur", "Tinsukia"],
  "Bihar": ["Araria", "Aurangabad", "Begusarai", "Bhagalpur", "Darbhanga", "Gaya", "Gopalganj", "Muzaffarpur", "Nalanda", "Patna", "Purnia", "Rohtas", "Samastipur", "Saran", "Vaishali"],
  "Chhattisgarh": ["Bastar", "Bilaspur", "Durg", "Janjgir-Champa", "Korba", "Mahasamund", "Raigarh", "Raipur", "Rajnandgaon", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Mehsana", "Rajkot", "Sabarkantha", "Surat", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Panipat", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kullu", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Giridih", "Hazaribagh", "Palamu", "Ranchi", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chikkamagaluru", "Davanagere", "Dharwad", "Hassan", "Kalaburagi", "Kolar", "Mandya", "Mysuru", "Shivamogga", "Tumakuru", "Vijayapura"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Betul", "Bhopal", "Chhindwara", "Dewas", "Dhar", "Gwalior", "Indore", "Jabalpur", "Rewa", "Sagar", "Satna", "Sehore", "Ujjain", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Buldhana", "Dhule", "Jalgaon", "Kolhapur", "Latur", "Nagpur", "Nashik", "Osmanabad", "Pune", "Sangli", "Satara", "Solapur", "Yavatmal"],
  "Manipur": ["Bishnupur", "Churachandpur", "Imphal East", "Imphal West", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Khasi Hills", "Jaintia Hills", "Ri Bhoi", "West Garo Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lunglei", "Mamit", "Serchhip"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Mon", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balasore", "Bargarh", "Bhadrak", "Cuttack", "Ganjam", "Kalahandi", "Keonjhar", "Khordha", "Koraput", "Mayurbhanj", "Puri", "Sambalpur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Patiala", "Sangrur"],
  "Rajasthan": ["Ajmer", "Alwar", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Chittorgarh", "Churu", "Ganganagar", "Jaipur", "Jaisalmer", "Jodhpur", "Kota", "Nagaur", "Pali", "Sikar", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Madurai", "Nagapattinam", "Namakkal", "Salem", "Thanjavur", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Vellore", "Villupuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Medak", "Nalgonda", "Nizamabad", "Rangareddy", "Warangal"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad (Prayagraj)", "Bareilly", "Ghaziabad", "Gorakhpur", "Jhansi", "Kanpur Nagar", "Lucknow", "Mathura", "Meerut", "Moradabad", "Muzaffarnagar", "Varanasi"],
  "Uttarakhand": ["Almora", "Chamoli", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Tehri Garhwal", "Udham Singh Nagar"],
  "West Bengal": ["Bankura", "Birbhum", "Cooch Behar", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur", "Purba Medinipur", "Purulia", "South 24 Parganas"],
  "Andaman & Nicobar Islands": ["Nicobar", "North & Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra & Nagar Haveli and Daman & Diu": ["Daman", "Diu", "Dadra & Nagar Haveli"],
  "Delhi (NCT)": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi", "West Delhi"],
  "Jammu & Kashmir": ["Anantnag", "Baramulla", "Budgam", "Jammu", "Kathua", "Kupwara", "Pulwama", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
};

// Given a free-text state name from geolocation, snap it to a known STATES entry.
export function normalizeState(raw: string): string {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  const exact = STATES.find((s) => s.toLowerCase() === lower);
  if (exact) return exact;
  return STATES.find((s) => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase())) || "";
}

// Given a state + free-text district, snap the district to a known entry.
export function normalizeDistrict(state: string, raw: string): string {
  if (!raw || !state || !DISTRICTS[state]) return "";
  const lower = raw.trim().toLowerCase();
  return DISTRICTS[state].find((d) => d.toLowerCase().includes(lower) || lower.includes(d.toLowerCase())) || "";
}
