// All durations in minutes
export const BUFFER_PREP = 15;   // before: in-person meet/setup
export const BUFFER_WRAP = 15;   // after: collect supplies, debrief
export const TRAVEL_BUFFER = 20; // travel between clients

export const SERVICE_CONFIG = {
  home_reset: {
    label: "Home Reset",
    color: "#EB9486",
    baseMinutes: 120,
    priceRange: [149, 299],
    description: "A full reset of your home — dishes, laundry, tidying, styling.",
    examples: [
      "Sunday Scaries reset before the week starts",
      "Post-holiday chaos cleanup",
      "Pre-guests-arriving emergency tidy",
      "After a sick week when everything piled up",
      "Move-in or move-out refresh"
    ],
    addons: [
      { id: "laundry_wash_fold", label: "Laundry — Wash, Dry & Fold", minutes: 45, price: 35 },
      { id: "laundry_extra_load", label: "Extra Laundry Load (+1)", minutes: 30, price: 20 },
      { id: "deep_kitchen", label: "Deep Kitchen Reset (inside appliances)", minutes: 45, price: 40 },
      { id: "fridge_cleanout", label: "Fridge Cleanout & Organize", minutes: 30, price: 30 },
      { id: "pantry_organize", label: "Pantry Organization", minutes: 30, price: 30 },
      { id: "bed_refresh", label: "Full Bed Refresh (all rooms)", minutes: 20, price: 20 },
      { id: "trash_recycling", label: "Trash & Recycling Removal", minutes: 15, price: 15 },
      { id: "surface_wipedown", label: "Full Surface Wipe-Down", minutes: 30, price: 25 },
      { id: "toy_organization", label: "Kids Room / Toy Organization", minutes: 30, price: 25 },
      { id: "closet_reset", label: "Closet Reset & Fold", minutes: 45, price: 40 },
      { id: "mail_sort", label: "Mail & Paper Sort", minutes: 20, price: 20 },
      { id: "seasonal_swap", label: "Seasonal Clothing Swap", minutes: 60, price: 55 }
    ],
    intakeQuestions: [
      { id: "home_size", label: "Home size", type: "select", options: ["Studio/1BR", "2BR", "3BR", "4BR", "5BR+"] },
      { id: "num_bathrooms", label: "Number of bathrooms", type: "select", options: ["1", "2", "3", "4+"] },
      { id: "has_pets", label: "Do you have pets?", type: "select", options: ["No", "Yes — dog", "Yes — cat", "Yes — multiple pets"] },
      { id: "clutter_level", label: "Current clutter level (be honest, no judgment!)", type: "select", options: ["Light — just needs refreshing", "Moderate — a few piles", "Heavy — it's been a week", "Disaster mode — send help"] },
      { id: "priority_rooms", label: "Priority rooms (select all that apply)", type: "multiselect", options: ["Kitchen", "Living Room", "Primary Bedroom", "Kids Rooms", "Bathrooms", "Mudroom/Entry", "Home Office", "Basement"] },
      { id: "product_preference", label: "Cleaning product preference", type: "select", options: ["Use your products (eco-friendly)", "I have specific products I prefer", "No preference"] },
      { id: "allergies", label: "Any sensitivities or allergies to products?", type: "text", placeholder: "e.g. fragrance-free only, no bleach..." }
    ]
  },

  mothers_helper: {
    label: "Mother's Helper",
    color: "#EFB988",
    baseMinutes: 180,
    priceRange: [199, 399],
    description: "Hands-on household and childcare support so you can breathe.",
    examples: [
      "Watch the kids while you take a real shower",
      "Help during a newborn's witching hour",
      "School pickup + snack + homework supervision",
      "Sick day when you can't be in two places",
      "Post-partum support — baby and household",
      "Toddler entertainment while you work from home"
    ],
    addons: [
      { id: "light_meal_prep", label: "Light Meal Prep for Kids", minutes: 30, price: 25 },
      { id: "school_pickup", label: "School Pickup & Dropoff", minutes: 45, price: 35 },
      { id: "activity_planning", label: "Structured Activity / Play Planning", minutes: 20, price: 20 },
      { id: "bath_routine", label: "Bath & Bedtime Routine Support", minutes: 45, price: 35 },
      { id: "pediatric_errand", label: "Pharmacy/Pediatric Supply Run", minutes: 30, price: 30 },
      { id: "nursery_reset", label: "Nursery/Playroom Reset", minutes: 30, price: 25 },
      { id: "laundry_kids", label: "Kids Laundry Wash & Fold", minutes: 30, price: 25 },
      { id: "postpartum_support", label: "Post-Partum Meal & Recovery Support", minutes: 60, price: 55 }
    ],
    intakeQuestions: [
      { id: "num_children", label: "How many children?", type: "select", options: ["1", "2", "3", "4+"] },
      { id: "ages", label: "Ages of children", type: "text", placeholder: "e.g. 6 months, 3 years, 7 years" },
      { id: "child_ill", label: "Is any child currently ill?", type: "select", options: ["No", "Yes — mild cold/runny nose", "Yes — fever (note: we still help!)", "Yes — stomach bug"] },
      { id: "needs_diapers", label: "Diapering needed?", type: "select", options: ["No", "Yes — diapers provided", "Yes — need to pick up diapers too"] },
      { id: "feeding_needs", label: "Feeding needs during visit", type: "select", options: ["None / child feeds self", "Bottle feeding (formula provided)", "Breastmilk bottle (provided)", "Snacks / light meal prep", "Special dietary needs"] },
      { id: "mobility_needs", label: "Any child mobility/transport needs?", type: "select", options: ["No", "Stroller walks", "Car seat transport (note car required)", "Wheelchair accessible needs"] },
      { id: "nap_schedule", label: "Nap/sleep schedule during visit?", type: "select", options: ["No nap expected", "One nap", "Multiple naps", "Newborn — variable"] },
      { id: "special_needs", label: "Any special needs, sensory sensitivities, or medical considerations?", type: "text", placeholder: "Please share anything helpful so we can prepare..." },
      { id: "pets_present", label: "Pets in the home during visit?", type: "select", options: ["No", "Yes — friendly dog", "Yes — cat", "Yes — will be secured/separated"] },
      { id: "parent_present", label: "Will a parent/guardian be home?", type: "select", options: ["Yes, working from home", "Yes, resting/recovering", "No — full solo support needed"] }
    ]
  },

  errands: {
    label: "Errands & Life Logistics",
    color: "#CAE7B9",
    baseMinutes: 90,
    priceRange: [99, 199],
    description: "Your to-do list, handled. Grocery runs, returns, pick-ups, and more.",
    examples: [
      "Weekly grocery run with your list",
      "Target/Costco haul + put away",
      "Amazon returns and post office drops",
      "Prescription pickup",
      "School supply run",
      "Birthday gift shopping",
      "Car wash drop-off and pickup",
      "Dry cleaning pickup and delivery"
    ],
    addons: [
      { id: "grocery_putaway", label: "Grocery Put-Away & Fridge Organize", minutes: 20, price: 20 },
      { id: "multiple_stops", label: "Multiple Errand Stops (3+)", minutes: 30, price: 25 },
      { id: "returns_processing", label: "Online Returns Processing (pack + ship)", minutes: 20, price: 20 },
      { id: "prescription_pickup", label: "Prescription Pickup", minutes: 20, price: 15 },
      { id: "meal_ingredient_run", label: "Meal Ingredient Run (specific recipe)", minutes: 30, price: 25 },
      { id: "gift_wrapping", label: "Gift Shopping + Wrapping", minutes: 45, price: 40 },
      { id: "post_office", label: "Post Office / Shipping Dropoff", minutes: 20, price: 15 },
      { id: "donation_drop", label: "Donation Dropoff (items prepped)", minutes: 20, price: 20 },
      { id: "pet_supplies", label: "Pet Supply Run", minutes: 20, price: 15 },
      { id: "dry_cleaning", label: "Dry Cleaning Pickup or Dropoff", minutes: 20, price: 15 }
    ],
    intakeQuestions: [
      { id: "errand_types", label: "What errands are needed? (select all)", type: "multiselect", options: ["Grocery shopping", "Target/Walmart/Costco run", "Pharmacy/prescription", "Returns (Amazon, store)", "Post office / shipping", "Dry cleaning", "Pet supplies", "Specialty store", "Other"] },
      { id: "grocery_store_pref", label: "Preferred grocery store?", type: "text", placeholder: "e.g. Whole Foods, Giant, Trader Joe's, ALDI..." },
      { id: "budget_limit", label: "Errand spend limit (we use your card or reimburse)", type: "select", options: ["Under $50", "$50–$100", "$100–$200", "$200+", "No limit — use judgment"] },
      { id: "list_ready", label: "Do you have a list ready?", type: "select", options: ["Yes — I'll share it", "Mostly — I'll finalize it", "No — please help me build one"] },
      { id: "perishables", label: "Any perishables that need immediate refrigeration?", type: "select", options: ["No", "Yes — will be home to receive", "Yes — please put away on arrival"] },
      { id: "num_stops", label: "Estimated number of stops", type: "select", options: ["1–2", "3–4", "5+", "Not sure"] },
      { id: "special_instructions", label: "Any special instructions, dietary restrictions, or brand preferences?", type: "text", placeholder: "e.g. organic only, nut-free, specific brands..." }
    ]
  },

  senior_support: {
    label: "Senior Support",
    color: "#B58A90",
    baseMinutes: 120,
    priceRange: [149, 279],
    description: "Gentle, dignified household assistance for seniors and their families.",
    examples: [
      "Light housekeeping and laundry for an aging parent",
      "Grocery and prescription runs",
      "Companionship and light meal prep",
      "Home organization to reduce fall hazards",
      "Post-discharge recovery support"
    ],
    addons: [
      { id: "meal_prep_senior", label: "Light Meal Prep & Kitchen Tidy", minutes: 45, price: 35 },
      { id: "medication_reminder", label: "Medication Reminder Support (non-medical)", minutes: 15, price: 15 },
      { id: "companionship", label: "Companionship & Conversation Time", minutes: 30, price: 25 },
      { id: "laundry_senior", label: "Laundry Wash & Fold", minutes: 45, price: 35 },
      { id: "grocery_senior", label: "Grocery / Errand Run", minutes: 60, price: 45 },
      { id: "safety_tidy", label: "Safety-Focused Declutter (trip hazards)", minutes: 45, price: 40 }
    ],
    intakeQuestions: [
      { id: "mobility_level", label: "Mobility level of senior", type: "select", options: ["Fully mobile", "Uses cane or walker", "Uses wheelchair", "Primarily bed/chair-bound"] },
      { id: "cognitive_notes", label: "Any memory or cognitive considerations?", type: "select", options: ["No", "Mild — occasional forgetfulness", "Moderate — needs guidance", "Significant — please call ahead"] },
      { id: "home_accessibility", label: "Home accessibility", type: "select", options: ["Standard home", "One-level/no stairs", "Elevator building", "Stairs only"] },
      { id: "emergency_contact", label: "Emergency contact name & phone", type: "text", placeholder: "Name, relationship, phone number" },
      { id: "medical_equipment", label: "Any medical equipment in home?", type: "text", placeholder: "e.g. oxygen tank, hospital bed, lift chair..." },
      { id: "special_diet", label: "Dietary restrictions for meal prep?", type: "text", placeholder: "e.g. diabetic, low sodium, soft foods only..." }
    ]
  },

  meal_prep: {
    label: "Meal Prep & Kitchen Support",
    color: "#F3DE8A",
    baseMinutes: 120,
    priceRange: [129, 249],
    description: "Simple, nourishing meal prep and kitchen organization.",
    examples: [
      "Sunday prep — proteins, grains, veggies for the week",
      "School lunch prep for the week",
      "Freezer meal batch cooking",
      "Post-grocery put-away and meal plan setup",
      "Smoothie packs, snack bags, grab-and-go containers"
    ],
    addons: [
      { id: "freezer_meals", label: "Freezer Meal Batch (4–6 meals)", minutes: 60, price: 55 },
      { id: "school_lunches", label: "Weekly School Lunch Prep (5 days)", minutes: 30, price: 30 },
      { id: "snack_packs", label: "Snack & Smoothie Pack Prep", minutes: 20, price: 20 },
      { id: "grocery_run_meals", label: "Grocery Run for Meal Ingredients", minutes: 45, price: 35 },
      { id: "kitchen_deep_clean", label: "Post-Prep Kitchen Deep Clean", minutes: 30, price: 25 },
      { id: "recipe_planning", label: "Meal Planning Consultation (1 week)", minutes: 20, price: 20 },
      { id: "special_diet_prep", label: "Special Diet Prep (allergy/dietary)", minutes: 30, price: 30 }
    ],
    intakeQuestions: [
      { id: "num_people", label: "Household size (meals for how many?)", type: "select", options: ["1–2 people", "3–4 people", "5–6 people", "7+ people"] },
      { id: "dietary_restrictions", label: "Dietary restrictions or allergies", type: "text", placeholder: "e.g. gluten-free, nut-free, dairy-free, vegetarian..." },
      { id: "meal_types", label: "What types of meals? (select all)", type: "multiselect", options: ["Breakfasts", "Lunches", "Dinners", "Snacks", "Kids meals", "Baby food", "Smoothie packs"] },
      { id: "cooking_style", label: "Preferred cooking style", type: "select", options: ["Simple & quick", "Comfort food", "Clean eating / whole foods", "Mediterranean", "Whatever you suggest!"] },
      { id: "appliances", label: "Available appliances", type: "multiselect", options: ["Instant Pot", "Air Fryer", "Slow Cooker", "Stand Mixer", "Blender", "Standard oven only"] },
      { id: "groceries_provided", label: "Will groceries be ready?", type: "select", options: ["Yes — all ingredients provided", "Mostly — a few things missing", "No — please add grocery run add-on"] }
    ]
  }
};

export const AVAILABLE_HOURS = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];

export function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function calculateTotalDuration(serviceKey, selectedAddonIds) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return 0;
  const addonMinutes = selectedAddonIds.reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.minutes : 0);
  }, 0);
  return BUFFER_PREP + config.baseMinutes + addonMinutes + BUFFER_WRAP;
}

export function isSlotAvailable(date, startTimeStr, durationMinutes, existingBlocks) {
  const startMins = timeToMinutes(startTimeStr);
  const endMins = startMins + durationMinutes + TRAVEL_BUFFER;
  const dateBlocks = existingBlocks.filter(b => b.date === date);
  for (const block of dateBlocks) {
    const blockStart = timeToMinutes(block.start_time);
    const blockEnd = timeToMinutes(block.end_time);
    if (startMins < blockEnd && endMins > blockStart) return false;
  }
  const dayEnd = timeToMinutes('6:00 PM');
  return endMins <= dayEnd;
}