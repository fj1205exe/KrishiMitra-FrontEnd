// KrishiMitra — Flat botanical crop illustrations
// Each crop is a unique 64×64 SVG using the earthy KrishiMitra palette.
// Palette: leaf #6A994E, leafDark #4F7A38, leafLight #A7C957, stem #7A8B4A,
//          gold #E9B84A, goldDark #C9922E, soil #B07D4B, soilDark #8A5E33

import React from "react";

const L = "#6A994E";   // leaf
const LD = "#4F7A38";  // leafDark
const LL = "#A7C957";  // leafLight
const S = "#7A8B4A";   // stem
const G = "#E9B84A";   // gold
const GD = "#C9922E";  // goldDark
const SO = "#B07D4B";  // soil
const SOD = "#8A5E33"; // soilDark

const art: Record<string, React.ReactNode> = {
  rice: (
    <g>
      <path d="M30 58 Q26 36 34 18" stroke={LD} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {[0,1,2,3,4].map(i=>(
        <ellipse key={i} cx={34-i*1.5} cy={18+i*7} rx="3" ry="6.5"
          fill={i%2?LL:G} transform={`rotate(${28-i*7} ${34-i*1.5} ${18+i*7})`}/>
      ))}
      <path d="M28 46 q-10-4-12-14 q11 1 14 10" fill={L}/>
      <path d="M34 40 q10-6 12-16 q-11 2-13 12" fill={LL}/>
    </g>
  ),
  wheat: (
    <g>
      <path d="M32 58V28" stroke={GD} strokeWidth="2.5" strokeLinecap="round"/>
      {[0,1,2,3].map(i=>(
        <g key={i} transform={`translate(0 ${18+i*8})`}>
          <path d="M32 8 q-9-2-11-8 q8-1 11 4" fill={G} transform="translate(0 4)"/>
          <path d="M32 8 q9-2 11-8 q-8-1-11 4" fill={GD} transform="translate(0 4)"/>
        </g>
      ))}
      <path d="M32 10 q-4-6 0-10 q4 4 0 10" fill={G}/>
      <path d="M24 52 q-8-2-10-10 q9 0 12 6" fill={L}/>
    </g>
  ),
  maize: (
    <g>
      <path d="M22 22 Q10 28 12 52 Q26 46 30 30" fill={LL}/>
      <path d="M42 20 Q56 26 52 52 Q38 44 34 30" fill={L}/>
      <rect x="26" y="8" width="12" height="42" rx="6" fill={G}/>
      {[0,1,2,3,4,5].map(r=>[0,1,2].map(c=>(
        <circle key={`${r}-${c}`} cx={29+c*3} cy={13+r*6} r="1.6" fill={GD}/>
      )))}
      <path d="M32 8 q-3-6 0-8 q3 4 0 8" fill={LD}/>
    </g>
  ),
  cotton: (
    <g>
      <path d="M32 58V26" stroke={SOD} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="32" cy="20" r="9" fill="#FFF"/>
      <circle cx="22" cy="26" r="7" fill="#F4F4F0"/>
      <circle cx="42" cy="26" r="7" fill="#F4F4F0"/>
      <circle cx="32" cy="28" r="7" fill="#FBFBF7"/>
      <path d="M25 31 l3 6 M39 31 l-3 6 M32 32 v6" stroke={SO} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M24 44 q-8-2-10-9 q9 0 12 5" fill={L}/>
    </g>
  ),
  tomato: (
    <g>
      <circle cx="30" cy="38" r="16" fill="#E24A3B"/>
      <path d="M30 22 l-4-6 M30 22 l4-6 M30 22 l-7-3 M30 22 l7-3 M30 22 v-7" stroke={L} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="24" cy="34" r="3" fill="#F58A7B" opacity="0.6"/>
    </g>
  ),
  onion: (
    <g>
      <path d="M32 12 q-4-6 0-8 q4 2 0 8" fill={L}/>
      <path d="M28 14 q-6-6-3-10 q5 4 3 10" fill={LL}/>
      <path d="M36 14 q6-6 3-10 q-5 4-3 10" fill={LD}/>
      <path d="M18 34 Q18 14 32 14 Q46 14 46 34 Q46 52 32 54 Q18 52 18 34 Z" fill="#B57ED6"/>
      <path d="M26 16 Q22 34 30 54 M38 16 Q42 34 34 54" stroke="#9C5FC0" strokeWidth="1.6" fill="none"/>
      <path d="M32 54 l-3 6 M32 54 l3 6 M32 54 v6" stroke={SOD} strokeWidth="1.4" strokeLinecap="round"/>
    </g>
  ),
  chilli: (
    <g>
      <path d="M40 14 q-6-4-12 0" stroke={LD} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <path d="M30 16 Q22 26 24 44 Q30 52 36 44 Q40 28 34 16 Z" fill="#D33A2C"/>
      <path d="M31 20 Q26 30 27 42" stroke="#F06A5A" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M44 18 q6-4 10 0 q-4 4-10 2" fill="#B62C22"/>
      <path d="M44 20 Q54 30 52 46 Q47 52 43 45 Q41 30 44 20 Z" fill="#E14434"/>
    </g>
  ),
  potato: (
    <g>
      <ellipse cx="30" cy="38" rx="18" ry="14" fill="#C89B6A"/>
      <ellipse cx="30" cy="38" rx="18" ry="14" fill={SOD} opacity="0.12"/>
      <circle cx="22" cy="34" r="1.8" fill={SOD}/>
      <circle cx="34" cy="32" r="1.8" fill={SOD}/>
      <circle cx="38" cy="42" r="1.8" fill={SOD}/>
      <circle cx="26" cy="44" r="1.8" fill={SOD}/>
      <path d="M46 30 q9-2 11-9 q-10-1-13 6" fill={L}/>
    </g>
  ),
  brinjal: (
    <g>
      <path d="M32 16 q-4-6 0-10 q4 4 0 10" fill={L}/>
      <path d="M28 16 q-6-4-5-10 q5 3 5 10" fill={LL}/>
      <path d="M36 16 q6-4 5-10 q-5 3-5 10" fill={LD}/>
      <path d="M16 38 Q16 18 32 18 Q48 18 48 38 Q48 56 32 58 Q16 56 16 38 Z" fill="#6B3FA0"/>
      <path d="M22 22 Q18 38 24 56" stroke="#9B6DC5" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="36" cy="48" rx="4" ry="6" fill="#8050B8" opacity="0.4"/>
    </g>
  ),
  okra: (
    <g>
      <path d="M40 10 l-4 6" stroke={LD} strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 16 Q30 34 26 52 Q34 54 36 52 Q40 32 40 18 Z" fill={L} transform="rotate(6 33 34)"/>
      <path d="M34 20 L34 50 M30 22 L30 50 M38 22 L38 48" stroke={LD} strokeWidth="1.3"/>
      <path d="M48 16 Q44 32 42 50 Q48 52 50 50 Q52 30 50 18 Z" fill={LL} transform="rotate(-4 47 34)"/>
    </g>
  ),
  banana: (
    <g>
      <path d="M14 22 Q22 50 48 50 Q34 40 30 20 Z" fill={G}/>
      <path d="M20 26 Q26 44 44 46" stroke={GD} strokeWidth="1.8" fill="none"/>
      <path d="M20 18 Q30 44 52 44 Q40 34 36 16 Z" fill="#F2C94C"/>
      <path d="M18 16 l-3-5 M36 15 l2-6" stroke={LD} strokeWidth="2.4" strokeLinecap="round"/>
    </g>
  ),
  mango: (
    <g>
      <path d="M40 14 q10-6 14-2 q-4 6-12 6" fill={L}/>
      <path d="M38 16 l4-6" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 30 Q22 16 36 18 Q52 20 50 38 Q48 54 32 54 Q20 50 22 30 Z" fill="#F2A63B"/>
      <path d="M24 32 Q26 20 38 21" stroke="#F8C877" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    </g>
  ),
  coconut: (
    <g>
      <path d="M32 26 Q14 18 8 22 Q20 24 30 30 Z" fill={L}/>
      <path d="M32 26 Q50 18 56 22 Q44 24 34 30 Z" fill={LD}/>
      <path d="M32 24 Q26 10 20 8 Q28 16 30 26 Z" fill={LL}/>
      <path d="M32 24 Q38 10 44 8 Q36 16 34 26 Z" fill={L}/>
      <circle cx="32" cy="42" r="14" fill={SO}/>
      <circle cx="27" cy="40" r="2" fill={SOD}/>
      <circle cx="35" cy="38" r="2" fill={SOD}/>
      <circle cx="31" cy="46" r="2" fill={SOD}/>
    </g>
  ),
  groundnut: (
    <g>
      <path d="M24 12 Q30 20 26 30 Q34 34 34 44 Q34 56 24 56 Q14 54 16 42 Q18 34 22 32 Q16 24 20 14 Q22 10 24 12 Z" fill="#D9B98A"/>
      <ellipse cx="24" cy="24" rx="3" ry="3" fill={SOD} opacity="0.35"/>
      <ellipse cx="25" cy="46" rx="3" ry="3" fill={SOD} opacity="0.35"/>
      <path d="M18 34 q8 2 14 0" stroke={SOD} strokeWidth="1.4" fill="none"/>
      <path d="M40 20 q10-4 14 0 q-6 4-12 3" fill={L}/>
    </g>
  ),
  turmeric: (
    <g>
      <path d="M14 40 Q18 32 28 34 Q38 36 42 32 Q52 28 54 36 Q50 44 40 42 Q30 40 24 44 Q16 48 14 40 Z" fill="#E8912E"/>
      <path d="M22 38 q6-2 10 0 M34 36 q6-2 10 0" stroke="#C4741E" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M30 34 Q30 18 22 12 Q28 22 26 34 Z" fill={L}/>
      <path d="M34 34 Q36 18 46 14 Q38 22 38 34 Z" fill={LD}/>
    </g>
  ),
  ginger: (
    <g>
      <path d="M12 42 Q16 34 24 36 Q30 30 36 34 Q44 30 48 36 Q56 34 54 42 Q48 48 40 44 Q34 48 28 44 Q20 48 12 42 Z" fill="#D9B08C"/>
      <path d="M22 40 q5-2 8 0 M34 40 q5-2 8 0" stroke="#B58A63" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="38" rx="2.5" ry="2" fill="#C79A72"/>
      <ellipse cx="44" cy="39" rx="2.5" ry="2" fill="#C79A72"/>
      <path d="M30 34 Q30 20 24 14 Q29 22 27 34 Z" fill={L}/>
      <path d="M36 34 Q38 20 46 16 Q39 22 40 34 Z" fill={LL}/>
    </g>
  ),
  sugarcane: (
    <g>
      {[24,32,40].map((x,i)=>(
        <g key={i}>
          <rect x={x-3} y="12" width="6" height="46" rx="3" fill={i===1?LL:L}/>
          <path d={`M${x-3} 22 h6 M${x-3} 32 h6 M${x-3} 42 h6`} stroke={LD} strokeWidth="1.4"/>
        </g>
      ))}
      <path d="M24 14 Q16 4 8 4 Q18 8 22 16 Z" fill={LL}/>
      <path d="M40 14 Q48 4 56 4 Q46 8 42 16 Z" fill={LD}/>
    </g>
  ),
  soybean: (
    <g>
      <path d="M30 58 Q26 36 34 14" stroke={LD} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <g transform="rotate(20 30 28)">
        <path d="M20 24 Q34 20 46 28 Q34 36 20 32 Q16 28 20 24 Z" fill={LL}/>
        <circle cx="26" cy="28" r="3.4" fill={L}/>
        <circle cx="34" cy="28" r="3.4" fill={L}/>
        <circle cx="42" cy="28" r="3.4" fill={L}/>
      </g>
      <path d="M28 44 q-9-2-11-9 q10-1 13 5" fill={L}/>
    </g>
  ),
  mustard: (
    <g>
      <path d="M30 58V24" stroke={S} strokeWidth="2.2" strokeLinecap="round"/>
      {[[30,16],[22,22],[38,22],[26,12],[34,12]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill={G}/>
          <circle cx={x-3} cy={y} r="3" fill="#F6BD60"/>
          <circle cx={x+3} cy={y} r="3" fill="#F6BD60"/>
          <circle cx={x} cy={y-3} r="3" fill="#F6BD60"/>
          <circle cx={x} cy={y} r="1.6" fill={GD}/>
        </g>
      ))}
      <path d="M24 44 q-8-2-10-9 q9 0 12 5" fill={L}/>
    </g>
  ),
  millets: (
    <g>
      <path d="M32 58V20" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="32" cy="14" rx="5" ry="10" fill={G}/>
      {[0,1,2,3,4,5].map(i=>(
        <ellipse key={i} cx={32+Math.cos(i*1.05)*6} cy={14+Math.sin(i*1.05)*8} rx="2.5" ry="4" fill={GD}
          transform={`rotate(${i*60} ${32+Math.cos(i*1.05)*6} ${14+Math.sin(i*1.05)*8})`}/>
      ))}
      <path d="M24 44 q-8-2-10-9 q9 0 12 5" fill={L}/>
      <path d="M40 40 q8-2 10-9 q-9 0-12 5" fill={LL}/>
    </g>
  ),
  ragi: (
    <g>
      <path d="M32 58V22" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 22 Q26 10 20 8 Q28 18 32 22" fill={GD}/>
      <path d="M32 22 Q38 10 44 8 Q36 18 32 22" fill={G}/>
      {[[-8,0],[-4,-8],[4,-8],[8,0],[4,8],[-4,8]].map(([dx,dy],i)=>(
        <circle key={i} cx={32+dx} cy={20+dy} r="3" fill={GD}/>
      ))}
      <path d="M24 44 q-8-2-10-9 q9 0 12 5" fill={L}/>
    </g>
  ),
  jowar: (
    <g>
      <path d="M32 58V16" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="32" cy="10" rx="7" ry="9" fill={GD}/>
      {[0,1,2,3,4,5,6,7].map(i=>(
        <circle key={i} cx={32+Math.cos(i*0.785)*5} cy={10+Math.sin(i*0.785)*7} r="2" fill={G}/>
      ))}
      <path d="M22 36 Q14 28 16 20 Q24 26 26 36 Z" fill={L}/>
      <path d="M42 36 Q50 28 48 20 Q40 26 38 36 Z" fill={LL}/>
    </g>
  ),
  bajra: (
    <g>
      <path d="M32 58V18" stroke={LD} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M32 18 Q26 6 24 4 Q30 12 32 18" fill={G}/>
      <path d="M32 18 Q38 6 40 4 Q34 12 32 18" fill={GD}/>
      {[-5,-3,-1,1,3,5].map((dx,i)=>(
        <ellipse key={i} cx={32+dx} cy={12+Math.abs(dx)*1.5} rx="2" ry="3" fill={i%2?G:GD}/>
      ))}
      <path d="M22 38 Q12 32 14 22 Q22 28 24 38 Z" fill={L}/>
      <path d="M42 38 Q52 32 50 22 Q42 28 40 38 Z" fill={LL}/>
    </g>
  ),
  sunflower: (
    <g>
      <path d="M32 58V30" stroke={S} strokeWidth="2.5" strokeLinecap="round"/>
      {[0,1,2,3,4,5,6,7].map(i=>(
        <ellipse key={i} cx={32+Math.cos(i*0.785-0.4)*14} cy={20+Math.sin(i*0.785-0.4)*14} rx="4" ry="7"
          fill={G} transform={`rotate(${i*45} ${32+Math.cos(i*0.785-0.4)*14} ${20+Math.sin(i*0.785-0.4)*14})`}/>
      ))}
      <circle cx="32" cy="20" r="8" fill={SOD}/>
      <circle cx="32" cy="20" r="5" fill="#6B3C14"/>
      <path d="M24 44 q-8-2-10-9 q9 0 12 5" fill={L}/>
    </g>
  ),
  sesame: (
    <g>
      <path d="M32 58V14" stroke={S} strokeWidth="2" strokeLinecap="round"/>
      {[18,26,34,42].map((y,i)=>(
        <g key={i}>
          <ellipse cx="26" cy={y} rx="5" ry="3.5" fill={i%2?LL:L} transform={`rotate(-20 26 ${y})`}/>
          <ellipse cx="38" cy={y+2} rx="5" ry="3.5" fill={i%2?L:LL} transform={`rotate(20 38 ${y+2})`}/>
          <ellipse cx="32" cy={y+5} rx="4" ry="5" fill="#F5E8C0" transform={`rotate(-5 32 ${y+5})`}/>
        </g>
      ))}
    </g>
  ),
  blackpepper: (
    <g>
      <path d="M22 14 Q32 4 42 14 Q52 24 48 36 Q44 48 32 52 Q20 48 16 36 Q12 24 22 14 Z" fill={LD}/>
      <path d="M22 16 Q32 8 42 16 Q50 24 46 36" stroke="#3A5C28" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {[[26,24],[38,22],[30,34],[40,32],[24,40]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#2A4520"/>
      ))}
      <path d="M38 50 q8 2 14-2 q-2 8-12 8" fill={L}/>
    </g>
  ),
  cardamom: (
    <g>
      <path d="M32 58V22" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      {[10,22,36].map((y,i)=>(
        <ellipse key={i} cx={32+(i===1?0:i===0?-4:4)} cy={y} rx="6" ry="9" fill={i===1?"#8BC34A":L}/>
      ))}
      {[8,20,34].map((y,i)=>(
        <path key={i} d={`M${32+(i===1?0:i===0?-4:4)-3} ${y+4} h6`} stroke={LD} strokeWidth="1.2"/>
      ))}
    </g>
  ),
  garlic: (
    <g>
      <path d="M32 14 q-3-6 0-10 q3 4 0 10" fill={L}/>
      <path d="M18 38 Q18 22 32 20 Q46 22 46 38 Q46 52 32 54 Q18 52 18 38 Z" fill="#F5ECD6"/>
      <path d="M32 22 Q24 30 26 48 M32 22 Q40 30 38 48" stroke="#D4C0A0" strokeWidth="1.5" fill="none"/>
      <path d="M22 32 Q18 38 22 44 Q26 28 32 22 Z" fill="#EEE0C0"/>
      <path d="M42 32 Q46 38 42 44 Q38 28 32 22 Z" fill="#EEE0C0"/>
    </g>
  ),
  carrot: (
    <g>
      <path d="M28 16 Q32 56 34 58 Q32 62 30 58 Q26 56 28 16 Z" fill="#E8621A" transform="rotate(-10 31 37)"/>
      <path d="M32 16 Q36 54 38 58 Q36 62 34 58 Q30 54 32 16 Z" fill="#F07830" transform="rotate(-10 31 37)"/>
      <path d="M28 16 l-4-8 M30 14 l-2-8 M32 14 v-8 M34 14 l2-8 M36 16 l4-8" stroke={L} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M29 26 Q26 36 27 46" stroke="#C9501A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>
  ),
  beans: (
    <g>
      <path d="M14 44 Q22 22 38 18 Q52 14 54 28 Q56 42 40 46 Q24 50 14 44 Z" fill={L}/>
      <path d="M18 42 Q26 24 40 20 Q52 16 52 28" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {[24,34,44].map((cx,i)=>(
        <circle key={i} cx={cx} cy={28+i*4} r="3.5" fill="#8BC34A"/>
      ))}
      <path d="M22 18 Q18 8 22 6 Q26 10 24 18 Z" fill={LD}/>
    </g>
  ),
  peas: (
    <g>
      <path d="M12 36 Q16 18 32 16 Q48 14 52 30 Q54 46 36 48 Q18 50 12 36 Z" fill={LL}/>
      <path d="M14 36 Q18 20 32 18 Q46 16 50 30" stroke={L} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {[22,30,38,46].map((cx,i)=>(
        <circle key={i} cx={cx} cy={30+i*2} r="4" fill={L}/>
      ))}
      <path d="M24 16 Q22 6 28 4 Q30 10 26 16 Z" fill={LD}/>
    </g>
  ),
  cabbage: (
    <g>
      <circle cx="32" cy="34" r="20" fill={LL}/>
      <path d="M16 30 Q22 14 32 18 Q42 14 48 30 Q44 48 32 50 Q20 48 16 30" fill={L}/>
      <path d="M22 20 Q28 12 32 18 Q36 12 42 20 Q44 34 32 40 Q20 34 22 20" fill="#8BC34A"/>
      <path d="M28 16 Q32 10 36 16 Q38 26 32 30 Q26 26 28 16" fill={LL}/>
    </g>
  ),
  cauliflower: (
    <g>
      <path d="M12 44 Q14 30 26 32 Q22 20 32 18 Q42 16 44 28 Q54 26 54 38 Q54 50 40 52 Q28 54 12 44 Z" fill="#F5F5F0"/>
      <circle cx="24" cy="34" r="6" fill="#EEEEEA"/>
      <circle cx="34" cy="28" r="7" fill="#F5F5F0"/>
      <circle cx="44" cy="34" r="6" fill="#EEEEEA"/>
      <circle cx="32" cy="40" r="6" fill="#F0F0EB"/>
      <path d="M22 52 Q18 44 20 50 M32 54 v4 M42 52 Q46 44 44 50" stroke={L} strokeWidth="2" strokeLinecap="round"/>
    </g>
  ),
  spinach: (
    <g>
      <path d="M32 58 Q28 38 20 22 Q26 22 30 34 Q32 22 32 12 Q34 22 36 30 Q40 20 44 22 Q36 38 32 58 Z" fill={L}/>
      <path d="M20 22 Q26 24 30 34" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M44 22 Q38 24 36 30" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 12 Q32 24 32 58" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </g>
  ),
  papaya: (
    <g>
      <path d="M32 8 Q24 16 26 28 Q28 42 32 56 Q36 42 38 28 Q40 16 32 8 Z" fill="#F5A623"/>
      <path d="M32 8 Q26 16 28 28" stroke="#E8951A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 8 Q22 8 16 14 Q18 22 26 28 Z" fill={L}/>
      <path d="M32 8 Q42 8 48 14 Q46 22 38 28 Z" fill={LD}/>
      <path d="M26 28 Q28 38 30 46 Q32 40 34 46 Q36 38 38 28 Q34 36 32 34 Q30 36 26 28 Z" fill="#C8811A" opacity="0.5"/>
    </g>
  ),
  guava: (
    <g>
      <path d="M38 14 q10-6 14-2 q-4 6-12 6" fill={L}/>
      <path d="M36 16 l4-6" stroke={LD} strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 34 Q18 16 32 16 Q48 18 48 34 Q48 52 32 54 Q16 52 18 34 Z" fill="#A8D878"/>
      <path d="M22 22 Q20 36 26 50" stroke="#86C450" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38 44 Q42 48 40 52" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </g>
  ),
  pomegranate: (
    <g>
      <path d="M28 12 Q24 6 28 4 Q32 6 36 4 Q40 6 36 12 Z" fill="#E8300C"/>
      <path d="M20 32 Q18 16 32 16 Q46 16 44 32 Q44 52 32 56 Q20 52 20 32 Z" fill="#D92414"/>
      <path d="M26 18 Q22 34 24 50" stroke="#F07060" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {[[26,26],[36,24],[30,36],[40,32],[28,44]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#FFBDB8" opacity="0.7"/>
      ))}
    </g>
  ),
  tea: (
    <g>
      <path d="M14 36 Q16 24 26 20 Q28 28 22 34 Z" fill={L}/>
      <path d="M28 30 Q26 16 36 12 Q40 20 34 28 Z" fill={LD}/>
      <path d="M38 26 Q40 12 50 14 Q50 24 44 28 Z" fill={LL}/>
      <path d="M20 36 Q28 44 44 36 Q38 52 28 52 Q18 50 20 36 Z" fill={L}/>
      <path d="M26 38 Q32 46 40 38" stroke={LD} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </g>
  ),
  coffee: (
    <g>
      <path d="M24 14 Q32 6 40 14 Q44 24 38 30 Q44 34 42 44 Q36 50 28 48 Q22 44 22 36 Q16 32 18 24 Q18 14 24 14 Z" fill={L}/>
      <path d="M26 16 Q32 10 38 16 Q40 24 36 28" stroke={LD} strokeWidth="1.5" fill="none"/>
      {[[28,36],[36,34],[32,44]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="4" fill="#CC3300"/>
      ))}
      {[[28,36],[36,34],[32,44]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#FF5522"/>
      ))}
    </g>
  ),
  rubber: (
    <g>
      <path d="M32 56V24" stroke={SOD} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 24 Q20 16 14 8 Q26 12 32 24" fill={L}/>
      <path d="M32 24 Q44 16 50 8 Q38 12 32 24" fill={LD}/>
      <path d="M32 34 Q18 26 12 16 Q24 20 32 34" fill={LL}/>
      <path d="M32 34 Q46 26 52 16 Q40 20 32 34" fill={L}/>
      <path d="M24 54 Q20 48 22 52 M40 54 Q44 48 42 52" stroke={SO} strokeWidth="2" strokeLinecap="round"/>
    </g>
  ),
  cashew: (
    <g>
      <path d="M18 28 Q18 12 32 10 Q46 10 46 28 Q46 44 32 46 Q18 44 18 28 Z" fill="#F5A623"/>
      <path d="M22 18 Q28 12 36 16 Q40 22 36 30" stroke="#E8951A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 46 Q36 50 40 56 Q34 56 32 50 Q30 56 24 56 Q28 50 32 46 Z" fill="#D4821A"/>
      <path d="M36 48 Q42 52 44 58 Q38 56 36 50" fill="#E8951A"/>
      <path d="M32 10 Q38 4 44 6 Q44 12 38 12 Q36 10 32 10" fill={L}/>
    </g>
  ),
  arecanut: (
    <g>
      <path d="M32 58V10" stroke={SOD} strokeWidth="3" strokeLinecap="round"/>
      <path d="M32 10 Q22 14 18 20 Q22 26 32 22 Z" fill={L}/>
      <path d="M32 10 Q42 14 46 20 Q42 26 32 22 Z" fill={LD}/>
      <path d="M32 22 Q22 26 18 32 Q22 38 32 34 Z" fill={LL}/>
      <path d="M32 22 Q42 26 46 32 Q42 38 32 34 Z" fill={L}/>
      {[10,16,22,28,34,40].map((y,i)=>(
        <ellipse key={i} cx={32+(i%2?4:-4)} cy={y} rx="6" ry="4" fill={SO} opacity="0.5"/>
      ))}
    </g>
  ),
  default: (
    <g>
      <path d="M32 58V28" stroke={S} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M32 34 Q16 30 12 14 Q30 14 34 32 Z" fill={L}/>
      <path d="M32 28 Q48 22 52 8 Q34 10 30 26 Z" fill={LL}/>
      <circle cx="32" cy="28" r="3" fill={GD}/>
    </g>
  ),
};

const alias: Record<string,string> = {
  chilli: "chili", corn: "maize", peanut: "groundnut",
  ladyfinger: "okra", bhindi: "okra", paddy: "rice",
  chili: "chilli",
};

export function CropIllustration({ crop, size=44, className="" }: { crop:string; size?:number; className?:string }) {
  const key = alias[crop] ?? crop;
  const node = art[key] ?? art.default;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={`${crop} illustration`}>
      {node}
    </svg>
  );
}

export function CropBadge({ crop, size=56, bg="#EEF4E8", border=false }: { crop:string; size?:number; bg?:string; border?:boolean }) {
  return (
    <div className="flex items-center justify-center rounded-full shrink-0"
      style={{ width:size, height:size, background:bg, border: border ? `2px solid #A7C957` : undefined }}>
      <CropIllustration crop={crop} size={Math.round(size*0.68)}/>
    </div>
  );
}
