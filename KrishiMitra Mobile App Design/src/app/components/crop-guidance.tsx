import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Search, Filter, Share2,
  Volume2, CheckCircle, Clock, Star, Droplets, Sun, Leaf, Beaker, Bug, Shield,
  Package, FileText, Award, AlertTriangle, Zap, MapPin, Cloud, ThumbsUp,
  ArrowRight, Play, Download, Bell, Users, MessageSquare, X, Check,
  SlidersHorizontal, Sprout, BookOpen, Mic,
} from "lucide-react";
import { useLang } from "../i18n";
import { useUser } from "../user";
import { useStore } from "../store";
import { CropBadge } from "./crop-illustrations";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary: "#6A994E", dark: "#606C38", success: "#A7C957", accent: "#DDA15E",
  highlight: "#F6BD60", bg: "#F8F9F3", card: "#FFFFFF", fg: "#1C2310",
  muted: "#5A6545", border: "rgba(106,153,78,0.18)", secondary: "#EEF4E8",
  destructive: "#C44B4B",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type GuidanceScreen = "home" | "task" | "article" | "bookmarks" | "search";

type TaskCategory = {
  id: string; icon: typeof Sun; color: string; bgColor: string;
  titleKey: string; descKey: string; articleCount: number;
};

export type Article = {
  id: string; taskId: string; crop: string; weekNum: number;
  titleKey: string; summaryKey: string; readingMin: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isOrganic?: boolean; growthStage: GrowthStage;
  sections: ArticleSection[];
};

type ArticleSection =
  | { type: "overview"; content: string }
  | { type: "important"; items: string[] }
  | { type: "recommendations"; items: string[] }
  | { type: "expert"; tip: string; author: string }
  | { type: "mistakes"; items: string[] }
  | { type: "summary"; content: string }
  | { type: "steps"; steps: { title: string; desc: string; emoji: string }[] }
  | { type: "tip"; icon: string; label: string; content: string }
  | { type: "warning"; content: string }
  | { type: "weather"; content: string };

type GrowthStage = "nursery" | "vegetative" | "flowering" | "fruiting" | "harvest";

// ─── Task categories ──────────────────────────────────────────────────────────
const TASK_CATEGORIES: TaskCategory[] = [
  { id: "plant_selection", icon: Star, color: "#9B6DC5", bgColor: "#F3EEFF", titleKey: "gc_task_plant_sel", descKey: "gc_task_plant_sel_desc", articleCount: 7 },
  { id: "site_selection", icon: MapPin, color: "#4A9FD4", bgColor: "#E8F4FD", titleKey: "gc_task_site_sel", descKey: "gc_task_site_sel_desc", articleCount: 5 },
  { id: "field_prep", icon: Sun, color: C.accent, bgColor: "#FFF4E8", titleKey: "gc_task_field_prep", descKey: "gc_task_field_prep_desc", articleCount: 6 },
  { id: "planting", icon: Sprout, color: C.primary, bgColor: C.secondary, titleKey: "gc_task_planting", descKey: "gc_task_planting_desc", articleCount: 8 },
  { id: "plant_training", icon: Leaf, color: C.dark, bgColor: "#EFF3E8", titleKey: "gc_task_training", descKey: "gc_task_training_desc", articleCount: 5 },
  { id: "monitoring", icon: Shield, color: "#E67E22", bgColor: "#FEF0E7", titleKey: "gc_task_monitoring", descKey: "gc_task_monitoring_desc", articleCount: 6 },
  { id: "irrigation", icon: Droplets, color: "#2E86AB", bgColor: "#E8F5FB", titleKey: "gc_task_irrigation", descKey: "gc_task_irrigation_desc", articleCount: 7 },
  { id: "fert_organic", icon: Leaf, color: "#27AE60", bgColor: "#E8F8F0", titleKey: "gc_task_fert_org", descKey: "gc_task_fert_org_desc", articleCount: 5 },
  { id: "fert_chemical", icon: Beaker, color: "#8E44AD", bgColor: "#F4E8FF", titleKey: "gc_task_fert_chem", descKey: "gc_task_fert_chem_desc", articleCount: 5 },
  { id: "weeding", icon: Bug, color: "#C0392B", bgColor: "#FDECEA", titleKey: "gc_task_weeding", descKey: "gc_task_weeding_desc", articleCount: 4 },
  { id: "preventive", icon: AlertTriangle, color: "#F39C12", bgColor: "#FEF9E7", titleKey: "gc_task_preventive", descKey: "gc_task_preventive_desc", articleCount: 6 },
  { id: "protection_organic", icon: Shield, color: "#16A085", bgColor: "#E8F8F5", titleKey: "gc_task_prot_org", descKey: "gc_task_prot_org_desc", articleCount: 5 },
  { id: "protection_chemical", icon: Zap, color: "#7F8C8D", bgColor: "#F2F3F4", titleKey: "gc_task_prot_chem", descKey: "gc_task_prot_chem_desc", articleCount: 5 },
  { id: "harvesting", icon: Award, color: C.highlight, bgColor: "#FFF9E6", titleKey: "gc_task_harvesting", descKey: "gc_task_harvesting_desc", articleCount: 5 },
  { id: "post_harvest", icon: Package, color: C.dark, bgColor: "#EFF3E8", titleKey: "gc_task_post_harvest", descKey: "gc_task_post_harvest_desc", articleCount: 4 },
];

// ─── Growth stages ────────────────────────────────────────────────────────────
const GROWTH_STAGE_DATA: { id: GrowthStage; emoji: string; label: string; color: string }[] = [
  { id: "nursery", emoji: "🌱", label: "Nursery", color: "#27AE60" },
  { id: "vegetative", emoji: "🌿", label: "Vegetative", color: C.primary },
  { id: "flowering", emoji: "🌼", label: "Flowering", color: C.highlight },
  { id: "fruiting", emoji: "🍅", label: "Fruiting", color: C.accent },
  { id: "harvest", emoji: "🌾", label: "Harvest", color: C.dark },
];

// ─── Article database ─────────────────────────────────────────────────────────
function buildArticles(crop: string): Article[] {
  const catMap: Record<string, string> = {
    cat_cereals: "cereal", cat_cash: "cash", cat_spices: "spice",
    cat_vegetables: "vegetable", cat_fruits: "fruit", cat_plantation: "plantation",
  };
  return [
    // Plant Selection
    {
      id: `${crop}_ps_1`, taskId: "plant_selection", crop, weekNum: 1,
      titleKey: "gc_art_seed_variety", summaryKey: "gc_art_seed_variety_sum",
      readingMin: 5, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: `Choosing the right seed variety is the foundation of a successful ${crop} harvest. The variety you select determines yield potential, disease resistance, and suitability for your local climate and soil.` },
        { type: "important", items: ["Always buy certified seeds from authorised dealers", "Check the seed label for germination rate (min 85%)", "Prefer varieties recommended by your state agriculture department", "Match variety to your soil type and water availability"] },
        { type: "steps", steps: [
          { title: "Assess Your Field", emoji: "🌍", desc: "Note your soil type (clay, loam, sandy), water source, and typical temperature range for your growing season." },
          { title: "Research Varieties", emoji: "📚", desc: "Compare hybrid vs open-pollinated varieties. Hybrids offer higher yield but seeds cannot be saved." },
          { title: "Check Pest Resistance", emoji: "🛡️", desc: "Select varieties with built-in resistance to locally common diseases and pests." },
          { title: "Purchase Certified Seeds", emoji: "✅", desc: "Buy from registered seed companies or government supply centers with valid certification tags." },
        ]},
        { type: "tip", icon: "💡", label: "Expert Tip", content: "For first-time growers, choose varieties with 'broad adaptability' — they perform well across different conditions and are more forgiving of management errors." },
        { type: "recommendations", items: ["Test a small plot with 2–3 varieties before large-scale adoption", "Keep records of variety performance for future seasons", "Consult your local Krishi Vigyan Kendra for state-specific recommendations"] },
        { type: "expert", tip: "The right variety can improve yields by 20–40% compared to traditional local varieties, while also reducing pesticide costs through natural resistance.", author: "Dr. K. Ramesh, ICAR" },
        { type: "mistakes", items: ["Using saved seeds from last season without quality check", "Choosing a variety based on price alone", "Ignoring maturity duration relative to your growing season", "Not treating seeds before sowing"] },
        { type: "summary", content: "Select certified, locally adapted varieties with good disease resistance. Invest time in research — the right seed variety is your most important decision of the season." },
      ],
    },
    {
      id: `${crop}_ps_2`, taskId: "plant_selection", crop, weekNum: 1,
      titleKey: "gc_art_hybrid_compare", summaryKey: "gc_art_hybrid_compare_sum",
      readingMin: 4, difficulty: "Intermediate", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Hybrid varieties are bred by crossing two parent lines to produce offspring with superior traits. Understanding the trade-offs helps you make the best investment for your farm." },
        { type: "tip", icon: "🌱", label: "Organic Method", content: "Open-pollinated (OP) varieties can be saved and replanted each year, reducing seed costs by up to 60% for organic farmers." },
        { type: "recommendations", items: ["Hybrids yield 25–50% more than open-pollinated varieties", "Hybrid seeds must be purchased fresh each season", "OP varieties allow seed saving but have lower, variable yields", "Certified Hybrid seeds carry a blue tag, OP varieties carry a green tag"] },
        { type: "mistakes", items: ["Saving hybrid seeds for replanting — F2 generation performs poorly", "Mixing hybrid and OP seeds in the same field"] },
        { type: "summary", content: "Hybrids offer higher yields and uniformity; OP varieties provide seed-saving flexibility. Choose based on your market access and budget." },
      ],
    },
    {
      id: `${crop}_ps_3`, taskId: "plant_selection", crop, weekNum: 2,
      titleKey: "gc_art_seed_treatment", summaryKey: "gc_art_seed_treatment_sum",
      readingMin: 6, difficulty: "Beginner", isOrganic: true, growthStage: "nursery",
      sections: [
        { type: "overview", content: "Seed treatment is a low-cost, high-impact practice that protects seeds from soil-borne pathogens and insects during the critical germination phase." },
        { type: "steps", steps: [
          { title: "Solar Treatment", emoji: "☀️", desc: "Spread seeds in a thin layer on a clean surface. Expose to sunlight for 4–6 hours. This kills surface pathogens and improves germination by 10–15%." },
          { title: "Salt Water Test", emoji: "💧", desc: "Dissolve 100g salt in 1L water. Dip seeds — discard floating seeds (hollow/damaged). Wash and dry the sinking seeds." },
          { title: "Fungicide Treatment", emoji: "🧪", desc: "Mix 2g Thiram or Captan per kg seed. Place seeds in a polythene bag, add the powder, seal and shake to coat evenly." },
          { title: "Bio-agent Treatment", emoji: "🌱", desc: "Soak seeds in Trichoderma harzianum solution (5g per liter of water) for 30 minutes. Air dry in shade before sowing." },
        ]},
        { type: "tip", icon: "⚠", label: "Warning", content: "Never mix chemical fungicide with bio-agents in the same treatment. Apply bio-agents only after chemical treatment has dried, or choose one method." },
        { type: "tip", icon: "🌱", label: "Organic Method", content: "Organic alternative: Soak seeds in diluted cow urine (1:20 ratio) for 12 hours. This ancient Vedic method has shown 15–20% improvement in germination in trials." },
        { type: "summary", content: "Seed treatment costs ₹30–60 per acre but can prevent losses worth ₹2,000–8,000. It's one of the highest-ROI practices in farming." },
      ],
    },
    // Site Selection
    {
      id: `${crop}_ss_1`, taskId: "site_selection", crop, weekNum: 4,
      titleKey: "gc_art_soil_conditions", summaryKey: "gc_art_soil_conditions_sum",
      readingMin: 7, difficulty: "Intermediate", growthStage: "nursery",
      sections: [
        { type: "overview", content: `Ideal soil for ${crop} is well-drained loam or clay-loam with a pH between 6.0 and 7.5. Understanding your soil profile before sowing prevents costly problems later.` },
        { type: "important", items: ["Conduct a soil test before every season (cost: ₹100–200 at KVK)", "Ideal pH: 6.0–7.5 for most crops", "Well-drained soil prevents root rot and nutrient lock-up", "Organic matter above 1% significantly improves water and nutrient retention"] },
        { type: "tip", icon: "📌", label: "Important", content: "A soil test is the single most important investment you can make. It eliminates guesswork from fertilizer application and can save ₹1,500–3,000 per acre in unnecessary inputs." },
        { type: "tip", icon: "🌦", label: "Weather Advice", content: "Avoid fields that remain waterlogged for more than 48 hours after heavy rain. Waterlogging causes root oxygen deprivation within 24–72 hours." },
        { type: "recommendations", items: ["Select slightly raised or sloped land for natural drainage", "Sandy soils need more irrigation frequency but drain quickly", "Clay soils hold nutrients well but need organic matter to improve aeration", "Avoid fields near industrial units or polluted water sources"] },
        { type: "steps", steps: [
          { title: "Collect Soil Sample", emoji: "🪣", desc: "Take samples from 8–10 random points across the field at 15cm depth. Mix together and send 500g to the nearest soil testing lab." },
          { title: "Read the Report", emoji: "📊", desc: "Focus on pH, organic carbon, N-P-K status, and micronutrient levels. The report includes crop-specific recommendations." },
          { title: "Soil Amendment", emoji: "🌱", desc: "For acidic soils (pH < 6.0): apply agricultural lime. For alkaline soils (pH > 7.5): apply gypsum or sulphur. For low organic matter: add farmyard manure." },
        ]},
        { type: "summary", content: "Test your soil every season. Match your crop choice to your soil type, and amend the soil to optimize pH and drainage before planting." },
      ],
    },
    {
      id: `${crop}_ss_2`, taskId: "site_selection", crop, weekNum: 4,
      titleKey: "gc_art_crop_rotation", summaryKey: "gc_art_crop_rotation_sum",
      readingMin: 5, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Crop rotation is the practice of growing different crops in the same field across different seasons. It naturally breaks pest and disease cycles, improves soil fertility, and increases yields." },
        { type: "recommendations", items: ["Alternate between legumes and non-legumes (legumes fix nitrogen)", "Never grow the same crop in the same field for 3 consecutive seasons", "Follow a cereal → legume → vegetable rotation for maximum benefit", "Keep rotation records to plan future seasons effectively"] },
        { type: "tip", icon: "💡", label: "Expert Tip", content: "Growing a legume (lentil, soybean, cowpea) before your main crop can add 40–80 kg of nitrogen per hectare to the soil, reducing fertilizer costs by 25–35%." },
        { type: "mistakes", items: ["Planting the same crop repeatedly increases pest pressure by 200–400%", "Not considering market demand in rotation planning"] },
        { type: "summary", content: "A planned 3-year rotation improves yields by 10–20% and reduces pest management costs by 30–40%. Plan your rotation now before land preparation." },
      ],
    },
    {
      id: `${crop}_ss_3`, taskId: "site_selection", crop, weekNum: 5,
      titleKey: "gc_art_bee_poll", summaryKey: "gc_art_bee_poll_sum",
      readingMin: 4, difficulty: "Beginner", growthStage: "flowering",
      sections: [
        { type: "overview", content: "Many crops depend on insect pollination to set fruit and seed. Protecting pollinators on and around your farm can significantly improve yields." },
        { type: "recommendations", items: ["Plant flowering border crops (sunflower, marigold) to attract bees", "Avoid pesticide spraying during flowering hours (6 AM – 10 AM)", "Maintain water sources (shallow dishes with stones) for bees near the field", "Consider renting bee colonies during peak flowering"] },
        { type: "tip", icon: "⚠", label: "Warning", content: "Spraying insecticides during flowering can kill pollinators and reduce fruit set by 40–60%. Always spray in the evening after bee activity stops." },
        { type: "summary", content: "Pollinator-friendly practices cost almost nothing but can increase fruit/seed crop yields by 10–30%. Protect your natural allies." },
      ],
    },
    // Field Preparation
    {
      id: `${crop}_fp_1`, taskId: "field_prep", crop, weekNum: 3,
      titleKey: "gc_art_land_prep", summaryKey: "gc_art_land_prep_sum",
      readingMin: 8, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Thorough land preparation is the foundation of a good crop. Proper tillage breaks up compacted soil, incorporates organic matter, and creates an ideal seedbed." },
        { type: "steps", steps: [
          { title: "First Ploughing", emoji: "🚜", desc: "Deep ploughing (25–30cm) 4–6 weeks before sowing using a mould-board plough. This buries crop residues and exposes soil to sunlight and frost, killing many pests." },
          { title: "Apply FYM", emoji: "🪣", desc: "Broadcast 10–15 tonnes of well-decomposed farmyard manure per hectare after the first ploughing. Let it weather for 2–3 weeks." },
          { title: "Secondary Tillage", emoji: "🔄", desc: "Cross-plough the field 2–3 times using a cultivator or rotavator to break clods, incorporate manure, and create a fine tilth." },
          { title: "Level the Field", emoji: "📐", desc: "Use a leveller or land plane to achieve uniform field level. Even 10cm height variation causes uneven irrigation and 5–15% yield loss." },
          { title: "Make Beds/Ridges", emoji: "🌿", desc: "For row crops: make raised beds or ridges at the recommended spacing. This improves drainage and aeration around the root zone." },
        ]},
        { type: "tip", icon: "🌱", label: "Organic Method", content: "Green manuring: sow dhaincha (Sesbania) or sunhemp, let it grow for 45 days, then incorporate before flowering. This adds 30–60 kg N/ha and improves soil structure." },
        { type: "important", items: ["Do not till wet soil — it destroys soil structure and creates compaction layers", "Minimum tillage is gaining popularity for moisture conservation and fuel savings", "Avoid burning crop residue — incorporate instead to improve organic matter"] },
        { type: "summary", content: "Good land preparation can increase yields by 10–20% through improved germination, drainage, and root development. Invest time here — it pays all season." },
      ],
    },
    // Planting
    {
      id: `${crop}_pl_1`, taskId: "planting", crop, weekNum: 1,
      titleKey: "gc_art_seed_sowing", summaryKey: "gc_art_seed_sowing_sum",
      readingMin: 8, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: `Correct sowing technique ensures uniform germination, optimal plant population, and a strong start for your ${crop} crop.` },
        { type: "steps", steps: [
          { title: "Calculate Seed Rate", emoji: "⚖️", desc: "Use the recommended seed rate for your variety (check seed packet). Account for 10–15% extra for gaps and poor germination." },
          { title: "Mark Row Spacing", emoji: "📏", desc: "Use a rope or marker to make straight furrows at the recommended row spacing. Straight rows allow easy mechanization later." },
          { title: "Set Correct Depth", emoji: "🎯", desc: "Sow at 2–4cm depth for small seeds (mustard, onion), 4–6cm for medium seeds (wheat, soybean), 5–8cm for large seeds (maize, groundnut)." },
          { title: "Place Seeds", emoji: "🌱", desc: "Drop 2–3 seeds per hill/station (thin to 1 later) or use a seed drill for uniform spacing. Cover seeds with fine soil." },
          { title: "Light Irrigation", emoji: "💧", desc: "Give a light irrigation immediately after sowing to ensure good soil-seed contact. Avoid heavy irrigation which can displace or suffocate seeds." },
        ]},
        { type: "tip", icon: "📌", label: "Important", content: "Sow at the recommended time for your region. Even a 2-week delay can reduce yield by 10–25% due to changes in temperature and day-length." },
        { type: "tip", icon: "🌦", label: "Weather Advice", content: "Do not sow on days with rain forecast within 24 hours. Heavy rain on freshly sown seed causes soil crusting and poor emergence." },
        { type: "recommendations", items: ["Check soil moisture before sowing — soil should form a ball when squeezed but crumble when pressed", "Sow in the evening to reduce seed desiccation in hot weather", "Mark sowing date in your farm diary for scheduling future activities"] },
        { type: "mistakes", items: ["Sowing too deep (seeds exhaust energy before emerging)", "Sowing too shallow (seeds dry out in top soil)", "Irregular spacing leading to competition between plants", "Not thinning seedlings — crowded plants yield 20–40% less"] },
        { type: "summary", content: "Precision sowing is an art. Take time to set correct depth and spacing. A well-established seedling gives you a full season advantage." },
      ],
    },
    {
      id: `${crop}_pl_2`, taskId: "planting", crop, weekNum: 2,
      titleKey: "gc_art_transplanting", summaryKey: "gc_art_transplanting_sum",
      readingMin: 6, difficulty: "Intermediate", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Transplanting moves seedlings from the nursery to the main field. Done correctly, it minimizes transplant shock and ensures rapid establishment." },
        { type: "steps", steps: [
          { title: "Harden Seedlings", emoji: "🌿", desc: "Reduce irrigation and shade gradually for 7–10 days before transplanting. This acclimatizes seedlings to field conditions." },
          { title: "Water the Nursery", emoji: "💧", desc: "Irrigate the nursery 12 hours before uprooting. This ensures roots hold moisture and reduces breakage." },
          { title: "Uproot Carefully", emoji: "🤲", desc: "Uproot with a small trowel or khurpi, keeping the root ball intact. Replant within 2–4 hours of uprooting." },
          { title: "Plant at Correct Depth", emoji: "📏", desc: "Plant at the same depth as in the nursery. Planting too deep causes stem rot; too shallow exposes roots to drying." },
          { title: "Post-Transplant Care", emoji: "☀️", desc: "Irrigate immediately after transplanting. Provide light shade for 2–3 days in hot weather using agri-net or palm fronds." },
        ]},
        { type: "tip", icon: "⚠", label: "Warning", content: "Avoid transplanting during the hottest part of the day (11 AM – 3 PM). Transplant in the evening or on cloudy days to reduce wilting stress." },
        { type: "summary", content: "Transplanting success depends on plant health, timing, and immediate post-plant care. Expect 5–10% natural mortality — plant extra seedlings to compensate." },
      ],
    },
    {
      id: `${crop}_pl_3`, taskId: "planting", crop, weekNum: 3,
      titleKey: "gc_art_gap_filling", summaryKey: "gc_art_gap_filling_sum",
      readingMin: 3, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Gap filling replaces failed or missing plants within 7–10 days of emergence. Every missing plant reduces final stand and yield proportionally." },
        { type: "important", items: ["Check germination/establishment at 7–10 days after sowing/transplanting", "Fill gaps only within 2 weeks — later plants cannot catch up with the main crop", "Keep 10–15% extra nursery plants or pre-germinated seeds for gap filling"] },
        { type: "summary", content: "A full plant stand is essential. One missing plant per square meter can cost 1–3% of total yield. Gap filling within 10 days is always worthwhile." },
      ],
    },
    // Irrigation
    {
      id: `${crop}_ir_1`, taskId: "irrigation", crop, weekNum: 1,
      titleKey: "gc_art_seedbed_irrigation", summaryKey: "gc_art_seedbed_irrigation_sum",
      readingMin: 5, difficulty: "Beginner", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Irrigation at the seedbed stage is critical for germination and early establishment. Too much or too little water at this stage causes irreversible stand failure." },
        { type: "recommendations", items: ["Irrigate immediately after sowing to ensure soil-seed contact", "Apply 3–4 cm of water — avoid heavy flooding which disturbs seeds", "Use sprinkler or drip for even water distribution on nursery beds", "Keep soil consistently moist (not wet) until 70% germination is achieved"] },
        { type: "tip", icon: "💡", label: "Expert Tip", content: "The 'finger test': push your finger 2–3 cm into the soil. If it comes out dry, irrigate. If it comes out with wet soil sticking, wait. This beats any gadget." },
        { type: "tip", icon: "⚠", label: "Warning", content: "Water-logged seedbeds cause damping-off disease (Pythium, Rhizoctonia) which kills seedlings at the soil surface. Always ensure drainage before irrigating." },
        { type: "summary", content: "Consistent moisture from sowing to emergence is the single most important factor for germination success. Monitor daily and irrigate lightly rather than heavily." },
      ],
    },
    {
      id: `${crop}_ir_2`, taskId: "irrigation", crop, weekNum: 3,
      titleKey: "gc_art_veg_irrigation", summaryKey: "gc_art_veg_irrigation_sum",
      readingMin: 6, difficulty: "Intermediate", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "The vegetative stage is when your crop builds its framework for yield. Adequate water drives cell division, canopy expansion, and nutrient uptake." },
        { type: "steps", steps: [
          { title: "Determine Water Requirement", emoji: "💧", desc: "Estimate daily crop water demand using the pan evaporation method or reference ET data from your state agriculture department." },
          { title: "Schedule Irrigation", emoji: "📅", desc: "Irrigate when soil moisture drops to 50–60% of field capacity. Use a soil moisture meter or the finger test." },
          { title: "Monitor Crop Signs", emoji: "👁️", desc: "Mild wilting in the evening that recovers overnight is acceptable stress. Wilting in the morning indicates urgent need for irrigation." },
          { title: "Maintain Records", emoji: "📓", desc: "Record each irrigation date and amount. This helps calculate water use efficiency and plan future irrigation schedules." },
        ]},
        { type: "tip", icon: "🌦", label: "Weather Advice", content: "Reduce irrigation by 50–75% during cloudy, humid weeks. Overwatering during cloudy weather causes root rot and nutrient leaching." },
        { type: "tip", icon: "📍", label: "Best Practice", content: "Drip irrigation at this stage can save 40–60% water compared to flood irrigation while improving yield by 10–20% through precise root-zone moisture." },
        { type: "summary", content: "Water the crop, not the field. Targeted root-zone irrigation during vegetative growth builds yield potential without the risk of disease from overhead wetting." },
      ],
    },
    {
      id: `${crop}_ir_3`, taskId: "irrigation", crop, weekNum: 4,
      titleKey: "gc_art_flowering_irr", summaryKey: "gc_art_flowering_irr_sum",
      readingMin: 5, difficulty: "Intermediate", growthStage: "flowering",
      sections: [
        { type: "overview", content: "Flowering is the most drought-sensitive stage for most crops. Water deficit here directly reduces the number of fruits/seeds set per plant." },
        { type: "important", items: ["Never allow moisture stress during flowering — it's the most critical stage", "Light irrigation every 3–4 days is better than heavy irrigation every 10 days", "Irrigate in the morning to reduce evaporation and disease risk", "Avoid wetting flowers — use drip or furrow irrigation"] },
        { type: "tip", icon: "⚠", label: "Warning", content: "Excessive irrigation during flowering causes flower drop and promotes fungal diseases (Botrytis, Powdery Mildew). Maintain moist but not waterlogged conditions." },
        { type: "summary", content: "Consistent moisture during flowering is non-negotiable. Even 3–5 days of drought stress at this stage can reduce yield by 15–30%." },
      ],
    },
    {
      id: `${crop}_ir_4`, taskId: "irrigation", crop, weekNum: 6,
      titleKey: "gc_art_drip_irrigation", summaryKey: "gc_art_drip_irrigation_sum",
      readingMin: 7, difficulty: "Advanced", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Drip irrigation delivers water directly to the root zone through a network of pipes and emitters. It is the most efficient irrigation method available, saving 40–60% water." },
        { type: "steps", steps: [
          { title: "System Design", emoji: "📐", desc: "Calculate number of emitters, pipe length, and pump capacity based on field size and crop spacing. Get a design from your drip irrigation supplier." },
          { title: "Installation", emoji: "🔧", desc: "Lay main line, sub-main lines, and lateral pipes before sowing. Position emitters at each plant location." },
          { title: "Filter Maintenance", emoji: "🔍", desc: "Clean the mesh/disc filter every 2–3 days in the first month, then weekly. Clogged filters reduce flow and damage the system." },
          { title: "Fertigation", emoji: "🧪", desc: "Mix water-soluble fertilizers in the fertigation unit to deliver nutrients directly to the root zone with each irrigation cycle." },
        ]},
        { type: "tip", icon: "📌", label: "Important", content: "Government subsidy of 55–90% is available on drip systems under PM-KSY scheme. Apply through your district agriculture officer. Paperwork takes 2–4 weeks." },
        { type: "summary", content: "Drip irrigation has a 3–5 year payback period but saves water, labour, and fertilizer costs every season while improving yields. Explore government subsidies." },
      ],
    },
    // Fertilization Organic
    {
      id: `${crop}_fo_1`, taskId: "fert_organic", crop, weekNum: 2,
      titleKey: "gc_art_fym_compost", summaryKey: "gc_art_fym_compost_sum",
      readingMin: 6, difficulty: "Beginner", isOrganic: true, growthStage: "nursery",
      sections: [
        { type: "overview", content: "Farmyard manure and compost are the backbone of organic soil fertility. Regular application improves soil structure, water holding capacity, and provides a slow-release supply of all nutrients." },
        { type: "steps", steps: [
          { title: "Collect Materials", emoji: "🌿", desc: "Collect cattle dung, farm waste, kitchen waste, and dry leaves. Layer in a pit or heap." },
          { title: "Build the Compost Heap", emoji: "🏗️", desc: "Alternate layers of green material (kitchen waste, crop residue) and brown material (dry leaves, straw). Keep moist." },
          { title: "Turn Regularly", emoji: "🔄", desc: "Turn the heap every 2–3 weeks to add oxygen and speed up decomposition. Ready compost is dark, crumbly, and smells earthy." },
          { title: "Apply Before Sowing", emoji: "🪣", desc: "Apply 10–15 tonnes per hectare and incorporate into the top 15–20cm of soil during land preparation." },
        ]},
        { type: "tip", icon: "💡", label: "Expert Tip", content: "Adding Trichoderma to your compost heap accelerates decomposition by 30–40% and suppresses soil-borne fungal pathogens when incorporated into the field." },
        { type: "summary", content: "Good compost takes 60–90 days to prepare but nourishes your soil for 2–3 seasons. Start a compost system today to reduce fertilizer costs by 30–50%." },
      ],
    },
    // Fertilization Chemical
    {
      id: `${crop}_fc_1`, taskId: "fert_chemical", crop, weekNum: 2,
      titleKey: "gc_art_npk_basal", summaryKey: "gc_art_npk_basal_sum",
      readingMin: 7, difficulty: "Intermediate", growthStage: "nursery",
      sections: [
        { type: "overview", content: "Basal fertilizer application provides essential nutrients at sowing time, supporting early root development and plant establishment. Always base application on soil test results." },
        { type: "important", items: ["Never apply fertilizers without a soil test — over-application wastes money and harms soil", "Apply phosphorus (P) and potassium (K) as full basal dose at sowing", "Split nitrogen (N) into 3 doses: 25% basal, 50% at tillering/branching, 25% at flowering", "Maintain correct fertilizer to seed distance (5–7cm) to prevent seed damage"] },
        { type: "tip", icon: "🧪", label: "Chemical Method", content: "NPK 12:32:16 is a convenient compound fertilizer that provides all three major nutrients in a single application. Ideal for basal application." },
        { type: "tip", icon: "⚠", label: "Warning", content: "Applying more nitrogen than recommended causes excessive vegetative growth, lodging (crop falling over), and increased disease susceptibility. More is not better." },
        { type: "steps", steps: [
          { title: "Calculate Requirement", emoji: "🧮", desc: "Use your soil test report. If unavailable, use the general recommendation for your crop from your state agriculture department." },
          { title: "Weigh Carefully", emoji: "⚖️", desc: "Use accurate weights. A 5% error in fertilizer application can cause nutrient imbalance. Mark fertilizer bags clearly." },
          { title: "Apply in Furrows", emoji: "🌾", desc: "Place fertilizer in seed furrows 5–7cm away from and 5cm below the seed. Cover with soil before placing seeds." },
          { title: "Irrigate Immediately", emoji: "💧", desc: "Give a light irrigation after applying fertilizer to dissolve and move nutrients into the root zone." },
        ]},
        { type: "summary", content: "Soil-test-based fertilization saves 20–30% on fertilizer costs and prevents nutrient imbalances that reduce yield. Get a soil test every 2–3 years." },
      ],
    },
    // Monitoring
    {
      id: `${crop}_mo_1`, taskId: "monitoring", crop, weekNum: 2,
      titleKey: "gc_art_scouting", summaryKey: "gc_art_scouting_sum",
      readingMin: 6, difficulty: "Beginner", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Regular crop scouting — systematic field inspection — is the foundation of Integrated Pest Management (IPM). It lets you detect problems early, when they're cheapest to manage." },
        { type: "steps", steps: [
          { title: "Walk a W-Pattern", emoji: "🚶", desc: "Walk a W or Z pattern across the field to get a representative sample. Don't just check field edges — pests move inward." },
          { title: "Inspect 10 Random Plants", emoji: "🔍", desc: "At each of 5–6 stops, inspect 2 plants thoroughly: roots, stem, leaves (top and underside), flowers, and fruits." },
          { title: "Count and Record", emoji: "📝", desc: "Count pest numbers per plant or per leaf. Compare with economic threshold levels (ETLs) to decide if action is needed." },
          { title: "Check Beneficial Insects", emoji: "🐝", desc: "Note predatory insects (spiders, ladybugs, parasitoid wasps). High beneficial populations may naturally control pests — don't spray unnecessarily." },
        ]},
        { type: "tip", icon: "📍", label: "Best Practice", content: "Scout every 5–7 days during the vegetative stage, every 3–4 days during flowering and fruiting. Early detection allows use of cheaper, safer organic methods." },
        { type: "recommendations", items: ["Keep a scouting diary with dates, pest counts, and actions taken", "Take photos for identification — share with your KVK extension officer", "Check weather apps — hot, humid weather increases disease risk; hot, dry weather increases aphid and mite risk"] },
        { type: "mistakes", items: ["Spraying on a calendar schedule without scouting — wastes money and kills beneficial insects", "Identifying pests from internet images without expert verification"] },
        { type: "summary", content: "Scouting takes 30–45 minutes per week but can save 3–5 pesticide applications per season, cutting costs by ₹1,500–4,000 per acre." },
      ],
    },
    // Harvesting
    {
      id: `${crop}_ha_1`, taskId: "harvesting", crop, weekNum: 16,
      titleKey: "gc_art_harvest_timing", summaryKey: "gc_art_harvest_timing_sum",
      readingMin: 6, difficulty: "Intermediate", growthStage: "harvest",
      sections: [
        { type: "overview", content: "Harvesting at the right time is critical for maximum yield, quality, and market price. Both early and late harvesting cause significant losses." },
        { type: "important", items: ["Physiological maturity ≠ harvest maturity — know the difference for your crop", "Check 3–5 indicators: grain colour, moisture content, husk colour, leaf senescence", "Target grain moisture of 20–22% for combine harvest (will dry to 14% safe storage)", "Early morning harvest reduces moisture loss and kernel damage"] },
        { type: "steps", steps: [
          { title: "Visual Assessment", emoji: "👁️", desc: "Check grain/fruit colour. For cereals: straw colour of the crop, black-layer formation at seed tip. For fruits: skin colour, firmness, aroma." },
          { title: "Moisture Test", emoji: "💧", desc: "Use a portable grain moisture meter (available at KVK or agri-service centers). Harvest at recommended moisture for your crop." },
          { title: "Test Harvest", emoji: "🌾", desc: "Harvest a small area (0.1 ha) first to check actual yield and machine settings before large-scale harvesting." },
          { title: "Schedule Labour/Machinery", emoji: "📅", desc: "Book combines or harvesting labour 2–3 weeks in advance. Delay in harvest post-maturity can cause 5–10% loss daily in some crops." },
        ]},
        { type: "tip", icon: "🌦", label: "Weather Advice", content: "Monitor 10-day weather forecasts. Harvest before any expected rain to prevent quality losses. Rain on mature grain causes sprouting, mould, and 20–50% market price reduction." },
        { type: "summary", content: "Timely harvest can be the difference between a profitable and a break-even season. Plan harvest activities 3–4 weeks before maturity." },
      ],
    },
    // Post Harvest
    {
      id: `${crop}_ph_1`, taskId: "post_harvest", crop, weekNum: 17,
      titleKey: "gc_art_storage", summaryKey: "gc_art_storage_sum",
      readingMin: 5, difficulty: "Beginner", growthStage: "harvest",
      sections: [
        { type: "overview", content: "Post-harvest losses in India average 10–30% of total production. Proper storage reduces losses to below 2%, directly improving your effective income." },
        { type: "steps", steps: [
          { title: "Drying", emoji: "☀️", desc: "Dry grain to safe moisture: wheat 12%, rice 13%, maize 12–14%, pulses 10–11%. Use solar dryer or spread on clean threshing floor." },
          { title: "Cleaning", emoji: "🧹", desc: "Remove broken grain, chaff, dust, and foreign matter using a winnower or aspirator. Clean grain stores better and fetches higher price." },
          { title: "Treatment", emoji: "🛡️", desc: "Treat with Aluminium Phosphide (3 tablets per tonne) or Pyrethrin dust for insect control in long-term storage. Handle chemicals carefully." },
          { title: "Store Properly", emoji: "🏛️", desc: "Use hermetic storage bags (Purdue Improved Crop Storage — PICS bags) for small quantities. For bulk storage, use cleaned concrete/metal bins." },
        ]},
        { type: "tip", icon: "📌", label: "Important", content: "Register with e-NAM (National Agriculture Market) to sell directly to buyers across India. Average price improvement is 15–25% over local mandi price." },
        { type: "summary", content: "Good post-harvest management can increase your net income by 15–30% by reducing losses and enabling better timing of market sales." },
      ],
    },
    // Preventive
    {
      id: `${crop}_pv_1`, taskId: "preventive", crop, weekNum: 3,
      titleKey: "gc_art_ipm_basics", summaryKey: "gc_art_ipm_basics_sum",
      readingMin: 7, difficulty: "Intermediate", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Integrated Pest Management (IPM) is a sustainable approach that combines multiple methods to manage pests with minimal economic, health, and environmental risks." },
        { type: "recommendations", items: ["Use resistant varieties as the first line of defence", "Encourage natural enemies by reducing broad-spectrum pesticide use", "Use pheromone traps for monitoring and mass trapping of key pests", "Apply pesticides only when pest counts exceed Economic Threshold Levels (ETL)"] },
        { type: "tip", icon: "🌱", label: "Organic Method", content: "Install yellow sticky traps (5–10 per acre) from seedling stage. They trap whiteflies, thrips, and aphids and are an excellent monitoring tool costing just ₹20–30 each." },
        { type: "steps", steps: [
          { title: "Cultural Control", emoji: "🌾", desc: "Crop rotation, resistant varieties, proper spacing, clean seed, sanitation, and timely sowing are the first line of IPM." },
          { title: "Biological Control", emoji: "🐛", desc: "Release Trichogramma cards (egg parasitoids) for lepidopteran pests. Spray Bacillus thuringiensis (Bt) for caterpillar control." },
          { title: "Mechanical Control", emoji: "🪤", desc: "Light traps, yellow sticky traps, pheromone traps, hand-picking egg masses and caterpillars in early stages." },
          { title: "Chemical Control (Last Resort)", emoji: "🧪", desc: "Use only when ETL is crossed. Choose selective pesticides. Rotate chemistry to prevent resistance. Follow safety label instructions." },
        ]},
        { type: "summary", content: "IPM reduces pesticide costs by 30–60%, protects human health and the environment, and ensures produce meets quality standards for premium markets." },
      ],
    },
    // Plant Training
    {
      id: `${crop}_pt_1`, taskId: "plant_training", crop, weekNum: 5,
      titleKey: "gc_art_pruning", summaryKey: "gc_art_pruning_sum",
      readingMin: 6, difficulty: "Intermediate", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Pruning removes unnecessary plant parts to direct energy toward productive growth. For fruit and vegetable crops, correct pruning can increase marketable yield by 20–40%." },
        { type: "steps", steps: [
          { title: "Identify Pruning Targets", emoji: "🔍", desc: "Remove diseased branches first (and discard away from field). Then identify suckers (vegetative shoots from the base or leaf axils that don't fruit)." },
          { title: "Use Clean Tools", emoji: "✂️", desc: "Sterilize pruning shears with 70% alcohol or bleach solution between plants to prevent disease spread. Blunt tools crush tissue and invite infection." },
          { title: "Make Clean Cuts", emoji: "✅", desc: "Cut at 45° angle, 0.5cm above a node or bud. Slanted cuts prevent water pooling on the wound surface." },
          { title: "Apply Wound Sealant", emoji: "🪣", desc: "Apply Bordeaux paste or copper-based sealant on cuts larger than 1cm to prevent fungal infection." },
        ]},
        { type: "tip", icon: "⚠", label: "Warning", content: "Over-pruning removes productive leaf area and reduces photosynthesis. Never remove more than 25–30% of the plant canopy at one time." },
        { type: "summary", content: "Pruning is both science and art. Start conservatively — you can always remove more, but you cannot put growth back." },
      ],
    },
    // Weeding
    {
      id: `${crop}_we_1`, taskId: "weeding", crop, weekNum: 2,
      titleKey: "gc_art_weed_mgmt", summaryKey: "gc_art_weed_mgmt_sum",
      readingMin: 5, difficulty: "Beginner", growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Weeds compete directly with your crop for water, nutrients, and sunlight. The first 20–45 days (critical weed-free period) are the most important for most crops." },
        { type: "important", items: ["Remove weeds before they flower and set seed — each plant can produce thousands of seeds", "The first weeding at 15–20 days after germination is most critical", "Manual weeding is effective but labour-intensive — consider integrated methods", "Use crop canopy management (close spacing, mulching) to suppress weeds naturally"] },
        { type: "recommendations", items: ["First weeding: 15–20 days after germination", "Second weeding: 35–40 days after germination", "Use inter-cultivation with a bullock-drawn hoe to weed and loosen topsoil simultaneously", "Mulching with paddy straw (5cm layer) suppresses weeds and retains soil moisture"] },
        { type: "tip", icon: "🌱", label: "Organic Method", content: "Mulching with paddy straw or dry leaves is the most effective organic weed control. 5cm of mulch suppresses 80–90% of weed emergence and retains soil moisture, reducing irrigation frequency by 25–40%." },
        { type: "summary", content: "Keep the field weed-free for the first 40–45 days. After canopy closure, shading suppresses most weeds naturally. One delayed weeding can mean 15–30% yield loss." },
      ],
    },
    // Protection Organic
    {
      id: `${crop}_po_1`, taskId: "protection_organic", crop, weekNum: 4,
      titleKey: "gc_art_neem_spray", summaryKey: "gc_art_neem_spray_sum",
      readingMin: 5, difficulty: "Beginner", isOrganic: true, growthStage: "vegetative",
      sections: [
        { type: "overview", content: "Neem (Azadirachta indica) products are highly effective organic pest deterrents. They disrupt insect feeding, moulting, and reproduction without harming beneficial insects when used correctly." },
        { type: "steps", steps: [
          { title: "Prepare Neem Solution", emoji: "🌿", desc: "Mix 5ml Neem oil per litre of water with a few drops of liquid soap as emulsifier. Or: soak 500g neem leaves in 10L water overnight, filter, and spray." },
          { title: "Spray Early Morning", emoji: "🌅", desc: "Spray before 9 AM when insects are active but beneficial pollinators are not yet foraging. Neem breaks down in UV light — morning application maximizes effectiveness." },
          { title: "Cover All Surfaces", emoji: "💦", desc: "Spray top and underside of all leaves thoroughly. Most soft-bodied insects (aphids, thrips, whiteflies) feed on leaf undersides." },
          { title: "Repeat Regularly", emoji: "🔄", desc: "Apply every 7–10 days for prevention, every 4–5 days for active infestations. Neem is preventive — it works best as routine protection." },
        ]},
        { type: "tip", icon: "📍", label: "Best Practice", content: "Combine neem spray with yellow sticky traps for whitefly and aphid control. This combination can replace 2–3 chemical sprays per season, saving ₹400–800 per acre." },
        { type: "summary", content: "Neem is safe for humans, animals, and beneficial insects. It costs ₹150–300 per acre per spray — a fraction of chemical alternatives." },
      ],
    },
  ];
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function StatusBar({ dark = false }: { dark?: boolean }) {
  const tc = dark ? "text-white" : "text-foreground";
  return (
    <div className={`flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold ${tc}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px] h-3">
          {[40, 60, 80, 100].map((h, i) => (
            <div key={i} className={`w-[3px] rounded-[1px] ${dark ? "bg-white" : "bg-foreground"}`} style={{ height: `${h}%`, opacity: h === 100 ? 1 : h / 100 + 0.2 }} />
          ))}
        </div>
        <Cloud size={10} className={dark ? "text-white" : "text-foreground"} />
        <div className={`w-5 h-2.5 rounded-[3px] border ${dark ? "border-white" : "border-foreground"} relative`}>
          <div className={`absolute inset-[2px] rounded-[1px] ${dark ? "bg-white" : "bg-foreground"}`} style={{ width: "75%" }} />
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ pct, size = 40, stroke = 3, color = C.primary }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.secondary} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
    </svg>
  );
}

function DifficultyChip({ level }: { level: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    Beginner: { color: C.primary, bg: C.secondary },
    Intermediate: { color: "#E67E22", bg: "#FEF0E7" },
    Advanced: { color: C.destructive, bg: "#FDECEA" },
  };
  const s = map[level] ?? map.Beginner;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
      {level}
    </span>
  );
}

// ─── Crop Guidance Home Screen ────────────────────────────────────────────────
export function CropGuidanceScreen({
  goBack,
  onOpenTask,
  onOpenArticle,
  onOpenBookmarks,
}: {
  goBack: () => void;
  onOpenTask: (taskId: string, crop: string) => void;
  onOpenArticle: (articleId: string, crop: string) => void;
  onOpenBookmarks: (crop: string) => void;
}) {
  const { t } = useLang();
  const { user } = useUser();
  const { guidanceProgress, guidanceBookmarks } = useStore();

  const cropList = user.crops.length ? user.crops : ["tomato", "wheat", "rice"];
  const [selectedCrop, setSelectedCrop] = useState(cropList[0]);
  const [tab, setTab] = useState<"task" | "stage">("task");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string[]>([]);
  const [filterOrganic, setFilterOrganic] = useState(false);

  const articles = useMemo(() => buildArticles(selectedCrop), [selectedCrop]);
  const progressKey = `${selectedCrop}`;
  const cropProgress = guidanceProgress[progressKey] ?? {};
  const completedCount = Object.values(cropProgress).filter(Boolean).length;
  const totalArticles = articles.length;
  const overallPct = totalArticles > 0 ? Math.round((completedCount / totalArticles) * 100) : 0;

  const taskCompletion = (taskId: string) => {
    const taskArticles = articles.filter(a => a.taskId === taskId);
    if (!taskArticles.length) return 0;
    const done = taskArticles.filter(a => cropProgress[a.id]).length;
    return Math.round((done / taskArticles.length) * 100);
  };

  const filteredCategories = TASK_CATEGORIES.filter(cat => {
    if (filterDifficulty.length === 0 && !filterOrganic) return true;
    const catArticles = articles.filter(a => a.taskId === cat.id);
    if (filterOrganic && !catArticles.some(a => a.isOrganic)) return false;
    if (filterDifficulty.length > 0 && !catArticles.some(a => filterDifficulty.includes(a.difficulty))) return false;
    return true;
  });

  const filteredBySearch = showSearch && searchQuery
    ? TASK_CATEGORIES.filter(cat =>
        t(cat.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(cat.descKey).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredCategories;

  const stageArticles = (stageId: GrowthStage) => articles.filter(a => a.growthStage === stageId);
  const stagePct = (stageId: GrowthStage) => {
    const sa = stageArticles(stageId);
    if (!sa.length) return 0;
    return Math.round((sa.filter(a => cropProgress[a.id]).length / sa.length) * 100);
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      <StatusBar />
      {/* Header */}
      <div className="shrink-0 px-4 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: C.secondary }}>
            <ChevronLeft size={20} color={C.fg} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-base text-foreground">{t("gc_title")}</h1>
            <p className="text-[11px] text-muted-foreground">{t("gc_subtitle")}</p>
          </div>
          <button onClick={() => setShowSearch(s => !s)} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: showSearch ? C.primary : C.secondary }}>
            <Search size={17} color={showSearch ? "#fff" : C.fg} />
          </button>
          <button onClick={() => onOpenBookmarks(selectedCrop)} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
            <Bookmark size={17} color={C.fg} />
            {guidanceBookmarks.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: C.accent }}>
                {guidanceBookmarks.length}
              </span>
            )}
          </button>
          <button onClick={() => setShowFilter(f => !f)} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: showFilter ? C.primary : C.secondary }}>
            <SlidersHorizontal size={17} color={showFilter ? "#fff" : C.fg} />
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <Search size={15} color={C.muted} />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t("gc_search_placeholder")}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && <button onClick={() => setSearchQuery("")}><X size={14} color={C.muted} /></button>}
          </div>
        )}

        {/* Filter chips */}
        {showFilter && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Beginner", "Intermediate", "Advanced"].map(d => (
              <button key={d} onClick={() => setFilterDifficulty(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all"
                style={{ background: filterDifficulty.includes(d) ? C.primary : C.secondary, color: filterDifficulty.includes(d) ? "#fff" : C.fg }}>
                {d}
              </button>
            ))}
            <button onClick={() => setFilterOrganic(f => !f)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1"
              style={{ background: filterOrganic ? "#27AE60" : C.secondary, color: filterOrganic ? "#fff" : C.fg }}>
              🌱 Organic
            </button>
            {(filterDifficulty.length > 0 || filterOrganic) && (
              <button onClick={() => { setFilterDifficulty([]); setFilterOrganic(false); }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: "#FDECEA", color: C.destructive }}>
                <X size={10} /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Crop selector */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
        {cropList.map(c => (
          <button key={c} onClick={() => setSelectedCrop(c)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 text-xs font-bold transition-all"
            style={{ background: c === selectedCrop ? C.primary : C.card, color: c === selectedCrop ? "#fff" : C.fg, border: `1.5px solid ${c === selectedCrop ? C.primary : C.border}` }}>
            <CropBadge crop={c} size={16} bg="transparent" /> {t(`crop_${c}`)}
          </button>
        ))}
      </div>

      {/* Progress banner */}
      <div className="mx-4 mb-2 rounded-2xl p-3 flex items-center gap-3 shrink-0" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <ProgressRing pct={overallPct} size={44} stroke={4} color="#A7C957" />
        <div className="flex-1 text-white">
          <p className="font-bold text-sm">{overallPct}% {t("gc_progress_complete")}</p>
          <p className="text-[11px] opacity-80">{completedCount}/{totalArticles} {t("gc_articles_read")}</p>
        </div>
        <div className="text-right text-white">
          <p className="text-[10px] opacity-70">{t("gc_crop")}</p>
          <p className="font-bold text-sm">{t(`crop_${selectedCrop}`)}</p>
        </div>
      </div>

      {/* Segmented tabs */}
      <div className="flex mx-4 mb-2 rounded-xl p-1 shrink-0" style={{ background: C.secondary }}>
        <button onClick={() => setTab("task")} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all" style={{ background: tab === "task" ? C.card : "transparent", color: tab === "task" ? C.primary : C.muted, boxShadow: tab === "task" ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
          {t("gc_tab_task")}
        </button>
        <button onClick={() => setTab("stage")} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all" style={{ background: tab === "stage" ? C.card : "transparent", color: tab === "stage" ? C.primary : C.muted, boxShadow: tab === "stage" ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
          {t("gc_tab_stage")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {tab === "task" ? (
          <>
            {filteredBySearch.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search size={36} color={C.muted} className="mb-3 opacity-40" />
                <p className="font-bold text-foreground">{t("gc_no_results")}</p>
                <p className="text-xs text-muted-foreground">{t("gc_no_results_sub")}</p>
              </div>
            )}
            {filteredBySearch.map((cat) => {
              const pct = taskCompletion(cat.id);
              const count = articles.filter(a => a.taskId === cat.id).length;
              return (
                <button key={cat.id} onClick={() => onOpenTask(cat.id, selectedCrop)}
                  className="w-full bg-card rounded-2xl p-3.5 mb-2.5 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.bgColor }}>
                    <cat.icon size={20} color={cat.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">{t(cat.titleKey)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{t(cat.descKey)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.secondary }}>
                        <div className="h-full rounded-full transition-all" style={{ background: pct === 100 ? C.success : C.primary, width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: pct === 100 ? C.primary : C.muted }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-semibold text-muted-foreground">{count} {t("gc_articles")}</span>
                    {pct === 100 ? <CheckCircle size={16} color={C.primary} /> : <ChevronRight size={16} color={C.muted} />}
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          /* Growth Stages */
          <div className="py-2">
            {GROWTH_STAGE_DATA.map((stage, idx) => {
              const pct = stagePct(stage.id);
              const sa = stageArticles(stage.id);
              return (
                <div key={stage.id}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: stage.color + "20", border: `2px solid ${stage.color}` }}>
                        {stage.emoji}
                      </div>
                      {idx < GROWTH_STAGE_DATA.length - 1 && (
                        <div className="w-0.5 flex-1 mt-1" style={{ background: `linear-gradient(to bottom, ${stage.color}, ${GROWTH_STAGE_DATA[idx + 1].color})`, minHeight: 40 }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-foreground">{stage.emoji} {stage.label}</p>
                        <span className="text-[10px] font-bold" style={{ color: stage.color }}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full mb-2 overflow-hidden" style={{ background: C.secondary }}>
                        <div className="h-full rounded-full" style={{ background: stage.color, width: `${pct}%` }} />
                      </div>
                      {sa.length === 0 ? (
                        <p className="text-xs text-muted-foreground">{t("gc_no_articles_stage")}</p>
                      ) : (
                        sa.slice(0, 3).map(a => (
                          <button key={a.id} onClick={() => onOpenArticle(a.id, selectedCrop)}
                            className="w-full text-left p-2.5 rounded-xl mb-1.5 flex items-center gap-2.5 active:scale-[0.98] transition-transform"
                            style={{ background: cropProgress[a.id] ? C.secondary : C.card, border: `1px solid ${C.border}` }}>
                            {cropProgress[a.id] ? <CheckCircle size={14} color={C.primary} /> : <Clock size={14} color={C.muted} />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground line-clamp-1">{t(a.titleKey)}</p>
                              <p className="text-[10px] text-muted-foreground">{a.readingMin} min · {a.difficulty}</p>
                            </div>
                            <ChevronRight size={13} color={C.muted} />
                          </button>
                        ))
                      )}
                      {sa.length > 3 && (
                        <p className="text-[11px] font-bold mt-1" style={{ color: C.primary }}>+{sa.length - 3} more articles</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Task Timeline Screen ─────────────────────────────────────────────────────
export function CropTaskScreen({
  taskId,
  crop,
  goBack,
  onOpenArticle,
}: {
  taskId: string;
  crop: string;
  goBack: () => void;
  onOpenArticle: (articleId: string) => void;
}) {
  const { t } = useLang();
  const { guidanceProgress, guidanceBookmarks, toggleGuidanceBookmark } = useStore();

  const task = TASK_CATEGORIES.find(c => c.id === taskId);
  const articles = useMemo(() => buildArticles(crop).filter(a => a.taskId === taskId), [crop, taskId]);
  const cropProgress = guidanceProgress[crop] ?? {};

  const weeks = [...new Set(articles.map(a => a.weekNum))].sort((a, b) => a - b);

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex items-center gap-2 px-4 py-2 shrink-0">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: C.secondary }}>
          <ChevronLeft size={20} color={C.fg} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {task && <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: task.bgColor }}><task.icon size={14} color={task.color} /></div>}
            <h1 className="font-bold text-base text-foreground">{task ? t(task.titleKey) : taskId}</h1>
          </div>
          <p className="text-[11px] text-muted-foreground">{articles.length} {t("gc_articles")} · {t(`crop_${crop}`)}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ background: C.secondary }}>
          <CheckCircle size={12} color={C.primary} />
          <span className="text-[11px] font-bold" style={{ color: C.primary }}>
            {articles.filter(a => cropProgress[a.id]).length}/{articles.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <BookOpen size={36} color={C.muted} className="mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">{t("gc_no_articles")}</p>
          </div>
        ) : (
          weeks.map(week => (
            <div key={week}>
              <div className="flex items-center gap-2 mb-2 mt-3">
                <div className="h-px flex-1" style={{ background: C.border }} />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: C.secondary, color: C.muted }}>
                  Week {week}
                </span>
                <div className="h-px flex-1" style={{ background: C.border }} />
              </div>
              {articles.filter(a => a.weekNum === week).map(article => {
                const isBookmarked = guidanceBookmarks.includes(article.id);
                const isDone = !!cropProgress[article.id];
                return (
                  <div key={article.id} className="bg-card rounded-2xl mb-3 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${isDone ? C.primary + "40" : C.border}` }}>
                    {/* Color band top */}
                    <div className="h-1" style={{ background: isDone ? C.primary : (task?.color ?? C.accent) }} />
                    <div className="p-3.5">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <DifficultyChip level={article.difficulty} />
                            {article.isOrganic && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#27AE60", background: "#E8F8F0" }}>🌱 Organic</span>
                            )}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#4A9FD4", background: "#E8F4FD" }}>
                              {GROWTH_STAGE_DATA.find(s => s.id === article.growthStage)?.emoji} {article.growthStage}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-foreground leading-tight">{t(article.titleKey)}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t(article.summaryKey)}</p>
                        </div>
                        <button onClick={() => toggleGuidanceBookmark(article.id)} className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0" style={{ background: isBookmarked ? C.highlight + "30" : C.secondary }}>
                          {isBookmarked ? <BookmarkCheck size={16} color={C.accent} /> : <Bookmark size={16} color={C.muted} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        <Clock size={12} color={C.muted} />
                        <span className="text-[11px] text-muted-foreground">{article.readingMin} min read</span>
                        {isDone && (
                          <span className="flex items-center gap-0.5 text-[11px] font-bold ml-auto" style={{ color: C.primary }}>
                            <CheckCircle size={11} /> Completed
                          </span>
                        )}
                      </div>
                      <button onClick={() => onOpenArticle(article.id)}
                        className="w-full mt-2.5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                        style={{ background: isDone ? C.secondary : `linear-gradient(135deg, ${C.primary}, ${C.dark})`, color: isDone ? C.primary : "#fff" }}>
                        {isDone ? <><Check size={14} /> Read Again</> : <><BookOpen size={14} /> Read More <ChevronRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Article Detail Screen ────────────────────────────────────────────────────
export function CropArticleScreen({
  articleId,
  crop,
  goBack,
  onAskAI,
}: {
  articleId: string;
  crop: string;
  goBack: () => void;
  onAskAI: () => void;
}) {
  const { t, lang } = useLang();
  const { guidanceProgress, markGuidanceComplete, guidanceBookmarks, toggleGuidanceBookmark, addRecentlyViewed } = useStore();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [textSize, setTextSize] = useState<"sm" | "base">("sm");
  const [voiceReading, setVoiceReading] = useState(false);
  const [completedEffect, setCompletedEffect] = useState(false);

  const articles = useMemo(() => buildArticles(crop), [crop]);
  const article = articles.find(a => a.id === articleId);
  const task = article ? TASK_CATEGORIES.find(c => c.id === article.taskId) : null;
  const isDone = !!(article && guidanceProgress[crop]?.[article.id]);
  const isBookmarked = article ? guidanceBookmarks.includes(article.id) : false;

  const relatedArticles = article
    ? articles.filter(a => a.id !== article.id && (a.taskId === article.taskId || a.growthStage === article.growthStage)).slice(0, 3)
    : [];

  useEffect(() => {
    if (article) addRecentlyViewed(article.id);
  // run once per article — addRecentlyViewed is stable (useCallback)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  const handleMarkComplete = useCallback(() => {
    if (article) {
      markGuidanceComplete(crop, article.id);
      setCompletedEffect(true);
      setTimeout(() => setCompletedEffect(false), 2000);
    }
  }, [article, crop, markGuidanceComplete]);

  const handleVoice = () => {
    if (voiceReading) {
      window.speechSynthesis?.cancel();
      setVoiceReading(false);
      return;
    }
    if (!article) return;
    const text = article.sections
      .map(s => {
        if (s.type === "overview") return s.content;
        if (s.type === "summary") return s.content;
        if (s.type === "tip") return `${s.label}: ${s.content}`;
        if (s.type === "recommendations") return s.items.join(". ");
        return "";
      })
      .filter(Boolean)
      .join(". ");

    const utter = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN", bn: "bn-IN", mr: "mr-IN", gu: "gu-IN", pa: "pa-IN" };
    utter.lang = langMap[lang] ?? "en-IN";
    utter.rate = 0.9;
    utter.onend = () => setVoiceReading(false);
    setVoiceReading(true);
    window.speechSynthesis?.speak(utter);
  };

  const aiQuestions = [
    "Explain in simple language",
    "Give me a checklist",
    "What if rainfall is heavy?",
    "Can I skip this step?",
    "Translate to Hindi",
    "What organic alternative exists?",
  ];

  if (!article) return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: C.bg }}>
      <p className="text-muted-foreground">Article not found.</p>
    </div>
  );

  const tsClass = textSize === "base" ? "text-base" : "text-sm";

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      <StatusBar />

      {/* Top bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 shrink-0" style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <ChevronLeft size={20} color={C.fg} />
        </button>
        <div className="flex-1" />
        <button onClick={handleVoice} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: voiceReading ? C.accent + "30" : C.secondary }}>
          <Volume2 size={16} color={voiceReading ? C.accent : C.muted} />
        </button>
        <button onClick={() => setTextSize(s => s === "sm" ? "base" : "sm")} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <span className="text-xs font-black" style={{ color: C.fg }}>Aa</span>
        </button>
        <button onClick={() => toggleGuidanceBookmark(article.id)} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: isBookmarked ? C.highlight + "30" : C.secondary }}>
          {isBookmarked ? <BookmarkCheck size={16} color={C.accent} /> : <Bookmark size={16} color={C.muted} />}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <Share2 size={16} color={C.muted} />
        </button>
      </div>

      {/* Article content */}
      <div className="flex-1 overflow-y-auto pb-36">
        {/* Hero */}
        <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden h-36 shrink-0 flex items-center justify-center" style={{ background: task ? `linear-gradient(135deg, ${task.bgColor}, ${task.color}22)` : `linear-gradient(135deg, ${C.secondary}, ${C.primary}22)` }}>
          <div className="flex flex-col items-center justify-center">
            {task && <task.icon size={48} color={task?.color ?? C.primary} strokeWidth={1.5} />}
            <span className="mt-1 font-bold text-xs" style={{ color: task?.color ?? C.primary }}>{task ? t(task.titleKey) : ""}</span>
          </div>
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 flex items-center gap-1" style={{ color: C.muted }}>
              <Download size={9} /> Offline Available
            </span>
          </div>
        </div>

        <div className="px-4 pt-3">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {task && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: task.color, background: task.bgColor }}>{t(task.titleKey)}</span>}
            <DifficultyChip level={article.difficulty} />
            {article.isOrganic && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#27AE60", background: "#E8F8F0" }}>🌱 Organic</span>}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5" style={{ color: C.muted, background: C.secondary }}>
              <Clock size={9} /> {article.readingMin} min
            </span>
            <span className="text-[10px] font-semibold ml-auto" style={{ color: C.muted }}>Updated Jul 2026</span>
          </div>

          <h2 className="font-bold text-lg text-foreground leading-tight mb-0.5">{t(article.titleKey)}</h2>
          <p className={`${tsClass} text-muted-foreground mb-3`}>{t(article.summaryKey)}</p>

          {/* Weather / soil / season quick chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: "none" }}>
            {[
              { icon: "🌡️", label: "25–35°C" },
              { icon: "🌧️", label: "500–800mm" },
              { icon: "🌱", label: "Loam / Clay-loam" },
              { icon: "📅", label: "Kharif season" },
              { icon: "📍", label: "All India" },
            ].map((chip, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-xl whitespace-nowrap shrink-0" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
                {chip.icon} {chip.label}
              </span>
            ))}
          </div>

          {/* Voice listen button */}
          <button onClick={handleVoice} className="w-full py-2.5 rounded-xl mb-3 flex items-center justify-center gap-2 font-bold text-sm transition-all"
            style={{ background: voiceReading ? C.accent + "20" : C.secondary, color: voiceReading ? C.accent : C.primary, border: `1px solid ${voiceReading ? C.accent : C.border}` }}>
            <Volume2 size={16} /> {voiceReading ? "Stop Listening" : "🔊 Listen to Article"}
          </button>

          {/* Article sections */}
          {article.sections.map((section, idx) => {
            if (section.type === "overview") return (
              <div key={idx} className="mb-4">
                <p className="font-bold text-sm text-foreground mb-1.5">Overview</p>
                <p className={`${tsClass} text-muted-foreground leading-relaxed`}>{section.content}</p>
              </div>
            );
            if (section.type === "important") return (
              <div key={idx} className="bg-amber-50 rounded-2xl p-3.5 mb-3 border border-amber-200">
                <p className="font-bold text-sm mb-2 flex items-center gap-1.5" style={{ color: "#92400E" }}>
                  <AlertTriangle size={15} /> Important Information
                </p>
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#D97706" }} />
                    <p className={`${tsClass} leading-snug`} style={{ color: "#92400E" }}>{item}</p>
                  </div>
                ))}
              </div>
            );
            if (section.type === "recommendations") return (
              <div key={idx} className="mb-4">
                <p className="font-bold text-sm text-foreground mb-2">Key Recommendations</p>
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-2.5 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: C.secondary }}>
                      <Check size={11} color={C.primary} />
                    </div>
                    <p className={`${tsClass} text-muted-foreground leading-snug flex-1`}>{item}</p>
                  </div>
                ))}
              </div>
            );
            if (section.type === "expert") return (
              <div key={idx} className="rounded-2xl p-3.5 mb-3" style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.dark}10)`, border: `1px solid ${C.primary}30` }}>
                <p className="font-bold text-sm mb-1.5 flex items-center gap-1.5" style={{ color: C.primary }}>
                  <Star size={14} color={C.highlight} fill={C.highlight} /> Expert Advice
                </p>
                <p className={`${tsClass} text-foreground leading-relaxed italic mb-1.5`}>"{section.tip}"</p>
                <p className="text-[10px] font-semibold" style={{ color: C.muted }}>— {section.author}</p>
              </div>
            );
            if (section.type === "mistakes") return (
              <div key={idx} className="rounded-2xl p-3.5 mb-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <p className="font-bold text-sm mb-2 flex items-center gap-1.5" style={{ color: C.destructive }}>
                  <X size={14} /> Common Mistakes
                </p>
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <X size={12} color={C.destructive} className="mt-0.5 shrink-0" />
                    <p className={`${tsClass} leading-snug`} style={{ color: "#991B1B" }}>{item}</p>
                  </div>
                ))}
              </div>
            );
            if (section.type === "summary") return (
              <div key={idx} className="rounded-2xl p-3.5 mb-3" style={{ background: C.secondary, border: `1px solid ${C.border}` }}>
                <p className="font-bold text-sm mb-1.5 flex items-center gap-1.5" style={{ color: C.dark }}>
                  <FileText size={14} /> Summary
                </p>
                <p className={`${tsClass} text-foreground leading-relaxed`}>{section.content}</p>
              </div>
            );
            if (section.type === "steps") return (
              <div key={idx} className="mb-4">
                <p className="font-bold text-sm text-foreground mb-2">Step-by-Step Guide</p>
                {section.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 mb-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base" style={{ background: C.secondary }}>
                        {step.emoji}
                      </div>
                      {i < section.steps.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: C.border, minHeight: 12 }} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: C.primary + "20", color: C.primary }}>Step {i + 1}</span>
                        <p className="font-bold text-xs text-foreground">{step.title}</p>
                      </div>
                      <p className={`${tsClass} text-muted-foreground leading-snug`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
            if (section.type === "tip") {
              const tipColors: Record<string, { bg: string; border: string; color: string }> = {
                "💡": { bg: "#FEFCE8", border: "#FDE68A", color: "#92400E" },
                "⚠": { bg: "#FFF7ED", border: "#FED7AA", color: "#9A3412" },
                "📌": { bg: "#EFF6FF", border: "#BFDBFE", color: "#1E40AF" },
                "🌱": { bg: "#F0FDF4", border: "#BBF7D0", color: "#166534" },
                "🧪": { bg: "#FAF5FF", border: "#E9D5FF", color: "#6B21A8" },
                "🌦": { bg: "#E0F2FE", border: "#BAE6FD", color: "#0C4A6E" },
                "📍": { bg: "#FFF1F2", border: "#FECDD3", color: "#9F1239" },
              };
              const tc = tipColors[section.icon] ?? tipColors["💡"];
              return (
                <div key={idx} className="rounded-2xl p-3.5 mb-3" style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                  <p className="font-bold text-xs mb-1.5" style={{ color: tc.color }}>{section.icon} {section.label}</p>
                  <p className={`${tsClass} leading-relaxed`} style={{ color: tc.color }}>{section.content}</p>
                </div>
              );
            }
            if (section.type === "warning") return (
              <div key={idx} className="rounded-2xl p-3.5 mb-3 flex gap-2.5" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                <AlertTriangle size={16} color="#D97706" className="shrink-0 mt-0.5" />
                <p className={`${tsClass} leading-relaxed`} style={{ color: "#92400E" }}>{section.content}</p>
              </div>
            );
            if (section.type === "weather") return (
              <div key={idx} className="rounded-2xl p-3.5 mb-3 flex gap-2.5" style={{ background: "#E0F2FE", border: "1px solid #BAE6FD" }}>
                <Cloud size={16} color="#0284C7" className="shrink-0 mt-0.5" />
                <p className={`${tsClass} leading-relaxed`} style={{ color: "#0C4A6E" }}>{section.content}</p>
              </div>
            );
            return null;
          })}

          {/* Government advisory placeholder */}
          <div className="rounded-2xl p-3.5 mb-3 flex items-center gap-3" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DBEAFE" }}>
              <Shield size={20} color="#1D4ED8" />
            </div>
            <div>
              <p className="font-bold text-xs" style={{ color: "#1E40AF" }}>Government Advisory</p>
              <p className="text-[11px]" style={{ color: "#3B82F6" }}>Connect with your local KVK for official recommendations specific to your district.</p>
            </div>
          </div>

          {/* Video placeholder */}
          <div className="rounded-2xl p-3.5 mb-3 flex items-center gap-3" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFEDD5" }}>
              <Play size={20} color="#EA580C" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs" style={{ color: "#C2410C" }}>Video Guide</p>
              <p className="text-[11px]" style={{ color: "#EA580C" }}>Visual demonstration coming soon. Subscribe for notifications.</p>
            </div>
            <Bell size={14} color="#EA580C" />
          </div>

          {/* Ask AI section */}
          <div className="rounded-2xl p-3.5 mb-3" style={{ background: `linear-gradient(135deg, #F3EEFF, #EDE9FE)`, border: "1px solid #DDD6FE" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm flex items-center gap-1.5" style={{ color: "#6D28D9" }}>
                <Zap size={14} /> Ask AI Assistant
              </p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "#DDD6FE", color: "#5B21B6" }}>Claude Sonnet</span>
            </div>
            {!showAIPanel ? (
              <button onClick={() => setShowAIPanel(true)}
                className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#7C3AED", color: "#fff" }}>
                <Mic size={15} /> Ask a question about this article
              </button>
            ) : (
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {aiQuestions.map((q, i) => (
                    <button key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#EDE9FE", color: "#5B21B6" }}>
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-center px-3 py-2 rounded-xl" style={{ background: "#fff", border: "1px solid #DDD6FE" }}>
                  <Mic size={14} color="#7C3AED" />
                  <input placeholder="Type or speak your question..." className="flex-1 bg-transparent text-xs outline-none" style={{ color: C.fg }} />
                  <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#7C3AED" }}>
                    <ArrowRight size={13} color="#fff" />
                  </button>
                </div>
                <p className="text-[10px] text-center mt-1.5" style={{ color: "#8B5CF6" }}>
                  Backend placeholder — Claude Sonnet integration ready
                </p>
              </div>
            )}
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mb-4">
              <p className="font-bold text-sm text-foreground mb-2">Related Articles</p>
              {relatedArticles.map(ra => {
                const rt = TASK_CATEGORIES.find(c => c.id === ra.taskId);
                return (
                  <div key={ra.id} className="bg-card rounded-xl p-3 mb-2 flex items-center gap-2.5" style={{ border: `1px solid ${C.border}` }}>
                    {rt && <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: rt.bgColor }}><rt.icon size={14} color={rt.color} /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground line-clamp-1">{t(ra.titleKey)}</p>
                      <p className="text-[10px] text-muted-foreground">{ra.readingMin} min · {ra.difficulty}</p>
                    </div>
                    <ChevronRight size={14} color={C.muted} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Related links */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { icon: "🦠", label: "Related Diseases", color: C.destructive },
              { icon: "📺", label: "Related Videos", color: "#E67E22" },
              { icon: "🏛️", label: "Govt Schemes", color: "#1D4ED8" },
              { icon: "💬", label: "Community Discussions", color: C.primary },
              { icon: "👨‍🌾", label: "Nearby Experts", color: C.dark },
              { icon: "📊", label: "Market Prices", color: C.accent },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <span className="text-base">{item.icon}</span>
                <span className="text-[11px] font-semibold text-left" style={{ color: item.color }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Notification subscribe */}
          <div className="rounded-2xl p-3.5 mb-4 flex items-center gap-3" style={{ background: C.secondary, border: `1px solid ${C.border}` }}>
            <Bell size={20} color={C.primary} />
            <div className="flex-1">
              <p className="font-bold text-xs text-foreground">Get Reminders</p>
              <p className="text-[11px] text-muted-foreground">We'll remind you when it's time to act</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: C.primary }}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-6 shrink-0" style={{ background: C.card, borderTop: `1px solid ${C.border}`, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
        {completedEffect && (
          <div className="flex items-center justify-center gap-2 mb-2 py-1.5 rounded-xl text-sm font-bold" style={{ background: C.secondary, color: C.primary }}>
            <CheckCircle size={16} /> Progress updated! Keep going!
          </div>
        )}
        <div className="flex gap-2">
          <button className="w-10 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ background: C.secondary }}>
            <Share2 size={17} color={C.muted} />
          </button>
          <button onClick={() => toggleGuidanceBookmark(article.id)} className="w-10 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ background: isBookmarked ? C.highlight + "30" : C.secondary }}>
            {isBookmarked ? <BookmarkCheck size={17} color={C.accent} /> : <Bookmark size={17} color={C.muted} />}
          </button>
          <button onClick={handleMarkComplete}
            className="flex-1 h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: isDone ? C.secondary : `linear-gradient(135deg, ${C.primary}, ${C.dark})`, color: isDone ? C.primary : "#fff" }}>
            {isDone ? <><CheckCircle size={16} /> Completed</> : <><Check size={16} /> Mark Complete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bookmarks Screen ─────────────────────────────────────────────────────────
export function CropBookmarksScreen({
  crop,
  goBack,
  onOpenArticle,
}: {
  crop: string;
  goBack: () => void;
  onOpenArticle: (articleId: string) => void;
}) {
  const { t } = useLang();
  const { guidanceBookmarks, guidanceProgress, recentlyViewed, toggleGuidanceBookmark } = useStore();
  const [tab, setTab] = useState<"saved" | "continue" | "completed" | "recent">("saved");

  const allArticles = useMemo(() => buildArticles(crop), [crop]);
  const cropProgress = guidanceProgress[crop] ?? {};

  const saved = allArticles.filter(a => guidanceBookmarks.includes(a.id));
  const completed = allArticles.filter(a => cropProgress[a.id]);
  const inProgress = allArticles.filter(a => !cropProgress[a.id] && recentlyViewed.includes(a.id));
  const recent = allArticles.filter(a => recentlyViewed.includes(a.id)).slice(0, 10);

  const sections = [
    { id: "saved", label: "Saved", count: saved.length, articles: saved },
    { id: "continue", label: "Continue Reading", count: inProgress.length, articles: inProgress },
    { id: "completed", label: "Completed", count: completed.length, articles: completed },
    { id: "recent", label: "Recently Viewed", count: recent.length, articles: recent },
  ] as const;

  const current = sections.find(s => s.id === tab)!;

  const ArticleRow = ({ a }: { a: Article }) => {
    const task = TASK_CATEGORIES.find(c => c.id === a.taskId);
    const isBm = guidanceBookmarks.includes(a.id);
    const isDone = !!cropProgress[a.id];
    return (
      <button onClick={() => onOpenArticle(a.id)} className="w-full text-left bg-card rounded-2xl p-3.5 mb-2.5 flex gap-3 items-start active:scale-[0.98] transition-transform" style={{ border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        {task && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: task.bgColor }}>
            <task.icon size={18} color={task.color} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground line-clamp-2 leading-tight">{t(a.titleKey)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{a.readingMin} min · {a.difficulty} · Week {a.weekNum}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {isDone && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5" style={{ background: C.secondary, color: C.primary }}><CheckCircle size={9} /> Done</span>}
            {a.isOrganic && <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: "#27AE60", background: "#E8F8F0" }}>🌱 Organic</span>}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); toggleGuidanceBookmark(a.id); }} className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0" style={{ background: isBm ? C.highlight + "30" : C.secondary }}>
          {isBm ? <BookmarkCheck size={13} color={C.accent} /> : <Bookmark size={13} color={C.muted} />}
        </button>
      </button>
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex items-center gap-2 px-4 py-2 shrink-0">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: C.secondary }}>
          <ChevronLeft size={20} color={C.fg} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-base text-foreground">My Learning</h1>
          <p className="text-[11px] text-muted-foreground">{t(`crop_${crop}`)} · {completed.length} completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 px-4 mb-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setTab(s.id as typeof tab)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold shrink-0 transition-all"
            style={{ background: tab === s.id ? C.primary : C.card, color: tab === s.id ? "#fff" : C.muted, border: `1px solid ${tab === s.id ? C.primary : C.border}` }}>
            {s.label} {s.count > 0 && <span className="ml-0.5 font-black">{s.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {current.articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Bookmark size={36} color={C.muted} className="mb-3 opacity-30" />
            <p className="font-bold text-foreground mb-1">Nothing here yet</p>
            <p className="text-xs text-muted-foreground">
              {tab === "saved" ? "Bookmark articles to save them here" :
               tab === "continue" ? "Start reading articles to continue here" :
               tab === "completed" ? "Complete articles to see them here" :
               "No recently viewed articles"}
            </p>
          </div>
        ) : (
          current.articles.map(a => <ArticleRow key={a.id} a={a} />)
        )}
      </div>
    </div>
  );
}
