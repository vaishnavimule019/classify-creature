import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const categoryData: Record<string, object> = {
  organic: {
    title: "Organic Waste",
    tagline: "Return to the Earth",
    description:
      "Organic waste consists of biodegradable materials derived from living organisms. When composted properly, organic waste transforms into nutrient-rich humus that enriches soil and supports new plant growth — completing nature's cycle.",
    impact: {
      landfillPercent: 35,
      methaneReduction: "60%",
      compostValue: "$200–$500 per ton",
      decompositionTime: "2 weeks – 6 months",
    },
    examples: [
      { name: "Fruit & Vegetable Scraps", detail: "Peels, cores, rinds, and spoiled produce. These are the most common organic waste and decompose within 2–4 weeks in a compost pile." },
      { name: "Coffee Grounds & Tea Bags", detail: "Rich in nitrogen, they accelerate composting. Remove staples from tea bags. Coffee filters are also compostable." },
      { name: "Eggshells", detail: "High in calcium carbonate, excellent for soil amendment. Crush them to speed decomposition — takes about 3 months." },
      { name: "Garden Clippings & Leaves", detail: "Grass clippings, hedge trimmings, fallen leaves, and dead flowers. Leaves are carbon-rich 'browns' ideal for balanced compost." },
      { name: "Food Leftovers", detail: "Cooked rice, bread, pasta, and other prepared foods. Avoid meat and dairy in home compost — they attract pests." },
      { name: "Paper Towels & Napkins", detail: "Unbleached and food-soiled paper towels break down easily. Avoid ones with chemical cleaners." },
    ],
    disposalSteps: [
      "Separate organic waste from other trash at the source",
      "Use a countertop compost bin with a carbon filter to control odor",
      "Transfer to an outdoor compost bin or municipal green bin weekly",
      "Layer greens (food scraps) and browns (leaves, cardboard) 1:3 ratio",
      "Keep compost moist like a wrung-out sponge and turn every 1–2 weeks",
    ],
    facts: [
      "Organic waste in landfills produces methane — a greenhouse gas 80x more potent than CO₂ in the short term.",
      "Composting 1 ton of food waste prevents 0.75 tons of CO₂ equivalent emissions.",
      "Worm composting (vermicomposting) can process food scraps 5x faster than traditional compost.",
      "The average household generates 300+ lbs of organic waste per year.",
    ],
  },
  recyclable: {
    title: "Recyclable Waste",
    tagline: "Give Materials a Second Life",
    description:
      "Recyclable waste includes materials that can be collected, processed, and manufactured into new products. Recycling conserves natural resources, saves energy, and reduces the volume of waste sent to landfills and incinerators.",
    impact: {
      landfillPercent: 25,
      energySaved: "up to 95% (aluminum)",
      waterSaved: "7,000 gallons per ton of paper",
      treesSaved: "17 trees per ton of paper",
    },
    examples: [
      { name: "Plastic Bottles & Containers", detail: "PET (#1) and HDPE (#2) plastics are the most recyclable. Rinse, remove caps, and crush to save space. Avoid black plastic — sorting machines can't detect it." },
      { name: "Paper & Cardboard", detail: "Newspapers, office paper, magazines, cereal boxes, and corrugated cardboard. Flatten boxes. Avoid wax-coated or food-soiled paper." },
      { name: "Aluminum & Tin Cans", detail: "Soda cans, food cans, and aluminum foil. Aluminum can be recycled infinitely without quality loss. One recycled can saves enough energy to run a TV for 3 hours." },
      { name: "Glass Bottles & Jars", detail: "Clear, green, and brown glass are all recyclable. Remove lids. Glass can be recycled endlessly. Don't include window glass, mirrors, or ceramics." },
      { name: "Newspapers & Magazines", detail: "One of the easiest items to recycle. Keep dry and bundle together. Glossy magazine paper is fine for recycling." },
      { name: "Metal Lids & Caps", detail: "Steel and aluminum lids from jars and bottles. Small pieces can fall through sorting machines — place inside a can and crimp shut." },
    ],
    disposalSteps: [
      "Rinse all containers to remove food residue",
      "Remove caps, lids, and labels where possible",
      "Flatten cardboard boxes to save bin space",
      "Keep recyclables dry — wet paper becomes non-recyclable",
      "Place in your blue recycling bin or drop at a recycling center",
      "Check local guidelines — accepted materials vary by municipality",
    ],
    facts: [
      "Recycling one aluminum can saves enough energy to power a laptop for 5 hours.",
      "A glass bottle takes 1 million years to decompose in a landfill but can be recycled infinitely.",
      "The average person generates 4.4 lbs of recyclable waste per day.",
      "Only 9% of all plastic ever produced has been recycled — proper sorting is critical.",
    ],
  },
  hazardous: {
    title: "Hazardous Waste",
    tagline: "Handle with Extreme Care",
    description:
      "Hazardous waste contains substances that are toxic, flammable, corrosive, or reactive. Improper disposal can contaminate soil, water supplies, and air — posing serious risks to human health and ecosystems for decades.",
    impact: {
      contaminationRadius: "up to 2 miles from dump site",
      groundwaterRisk: "Can persist 100+ years",
      healthEffects: "Cancer, organ damage, neurological disorders",
      properDisposalRate: "Only 40% is properly handled globally",
    },
    examples: [
      { name: "Batteries (All Types)", detail: "Lithium-ion, alkaline, nickel-cadmium, and lead-acid batteries. Lithium batteries can cause fires in landfills. Tape terminals before disposal to prevent short circuits." },
      { name: "Electronic Waste (E-Waste)", detail: "Phones, laptops, circuit boards, TVs, and cables. Contains lead, mercury, cadmium, and flame retardants. Many retailers offer free e-waste drop-off programs." },
      { name: "Fluorescent & CFL Bulbs", detail: "Contain small amounts of mercury vapor. If broken, ventilate the area and use damp paper to collect fragments. LED bulbs are safer alternatives." },
      { name: "Paint & Chemical Solvents", detail: "Oil-based paints, thinners, varnishes, and adhesives. Never pour down drains. Latex paint can be dried out and disposed with regular trash in some areas." },
      { name: "Medical Waste & Sharps", detail: "Needles, syringes, lancets, and expired medications. Use FDA-cleared sharps containers. Many pharmacies accept unused medications for safe disposal." },
      { name: "Pesticides & Cleaning Chemicals", detail: "Herbicides, insecticides, bleach, ammonia, and drain cleaners. Never mix chemicals. Keep in original containers and deliver to hazardous waste facilities." },
    ],
    disposalSteps: [
      "NEVER place hazardous items in regular trash or recycling bins",
      "Store in original containers with labels intact",
      "Keep away from children, pets, and food items",
      "Find your nearest hazardous waste collection facility",
      "Many communities hold periodic collection events — check local schedules",
      "Retailers like Best Buy, Home Depot, and pharmacies accept specific items",
    ],
    facts: [
      "One quart of motor oil can contaminate 250,000 gallons of drinking water.",
      "E-waste represents only 2% of landfill volume but 70% of toxic waste.",
      "A single mercury thermometer can contaminate a 20-acre lake.",
      "Properly recycled e-waste recovers gold, silver, copper, and rare earth metals worth billions annually.",
    ],
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    const key = (category || "").toLowerCase().trim();

    if (!categoryData[key]) {
      return new Response(
        JSON.stringify({ error: "Invalid category. Use: organic, recyclable, or hazardous" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(categoryData[key]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("category-info error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
