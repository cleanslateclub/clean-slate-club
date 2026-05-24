// All durations in minutes
export const BUFFER_PREP = 15;   // before: in-person meet/setup
export const BUFFER_WRAP = 15;   // after: collect supplies, debrief
export const TRAVEL_BUFFER = 20; // travel between clients

export const SERVICE_CONFIG = {
  consult: {
    label: "Free Consult — Not Sure Yet",
    color: "#B58A90",
    baseMinutes: 15,
    priceRange: [0, 0],
    description: "Not sure where to start? Let's have a quick 15-minute conversation and figure it out together. No commitment, no pressure.",
    examples: [
      "I don't know what I need — let's just talk",
      "I want to explain my situation and get a custom quote",
      "I have a big project I want to walk through first",
      "I want to see if this is the right fit before booking"
    ],
    disclaimer: null,
    addons: [],
    taskOptions: null,
    intakeQuestions: [
      { id: "situation", label: "Tell us what's going on in your home or life right now", type: "text", placeholder: "The more you share, the better we can help. No wrong answers..." },
      { id: "biggest_pain_point", label: "What's the biggest thing weighing on you?", type: "select", options: ["The whole house is a mess", "Laundry / dishes spiral", "I'm postpartum / depleted", "Caring for an aging parent", "Just need recurring help", "I'm not sure — everything?", "Something else"] },
      { id: "ideal_outcome", label: "What would feel like success after our visit?", type: "text", placeholder: "e.g. I want to walk into a peaceful house, feel like I have a plan..." },
      { id: "preferred_contact", label: "Best way to reach you for the consult call", type: "select", options: ["Phone call", "Text message", "Email", "Video call (Zoom/FaceTime)"] },
      { id: "availability_notes", label: "When are you generally available for a quick call?", type: "text", placeholder: "e.g. weekday mornings, evenings after 7pm..." },
      { id: "wish_list_notes", label: "Anything specific you'd love help with? (optional wish list)", type: "text", placeholder: "Dream big — we'll work with your budget and timeline..." }
    ]
  },

  home_reset: {
    label: "Home Reset",
    color: "#EB9486",
    baseMinutes: 120,
    priceRange: [149, 299],
    description: "A full reset of your home — dishes, laundry, tidying, styling.",
    examples: [
      "Monday Miracle — reset the home before the week swallows you",
      "Post-holiday chaos cleanup",
      "Pre-guests-arriving emergency tidy",
      "After a sick week when everything piled up",
      "Move-in or move-out refresh"
    ],
    disclaimer: "Home Reset Support focuses on restoring household functionality and flow. This service does not include deep cleaning, heavy scrubbing, hazardous conditions, or moving heavy furniture.",
    taskOptions: [
      "Kitchen Reset", "Dishes", "Laundry — Wash & Dry", "Laundry Folding",
      "Laundry Put-Away", "Bed Reset", "Surface Tidying", "Toy Pickup",
      "Pantry Reset", "Fridge Refresh", "Mail Sorting", "Plant Watering",
      "Pet Feeding", "Overflow Clutter", "Entryway Reset", "Guest Prep"
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
      { id: "num_adults", label: "Number of adults in household", type: "select", options: ["1", "2", "3+"] },
      { id: "num_children", label: "Number of children", type: "select", options: ["None", "1", "2", "3", "4+"] },
      { id: "has_pets", label: "Pets in home?", type: "select", options: ["No", "Yes — dog", "Yes — cat", "Yes — multiple pets"] },
      { id: "stairs", label: "Stairs in home?", type: "select", options: ["No", "Yes — one level", "Yes — multi-level"] },
      { id: "parking", label: "Parking situation", type: "select", options: ["Driveway available", "Street parking", "Garage only", "Difficult / limited"] },
      { id: "clutter_level", label: "Current home condition (be honest — zero judgment!)", type: "select", options: ["Mostly maintained", "Slightly behind", "Very overwhelmed", "Major reset needed"] },
      { id: "priority_areas", label: "Priority areas (select all that apply)", type: "multiselect", options: ["Kitchen", "Living Room", "Primary Bedroom", "Kids Rooms", "Bathrooms", "Mudroom/Entry", "Home Office", "Basement"] },
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
    disclaimer: "Clean Slate Club provides support-based household and family assistance. This is not a licensed nanny agency or medical childcare provider.",
    taskOptions: [
      "Homework Help", "School Pickup", "Activity Dropoff", "Snack Prep",
      "Bottle Washing", "Baby Laundry", "Bedtime Support", "Play Supervision",
      "Routine Support", "Toy Pickup", "Kitchen Reset (kids-related)",
      "Parent Helper Support", "Postpartum Support", "Recovery Support"
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
      { id: "special_needs", label: "Special needs, allergies, or medical considerations?", type: "text", placeholder: "Please share anything helpful so we can prepare..." },
      { id: "pets_present", label: "Pets in the home during visit?", type: "select", options: ["No", "Yes — friendly dog", "Yes — cat", "Yes — will be secured/separated"] },
      { id: "parent_present", label: "Will a parent/guardian be home?", type: "select", options: ["Yes, working from home", "Yes, resting/recovering", "No — full solo support needed"] },
      { id: "preferred_routines", label: "Any preferred routines to follow?", type: "text", placeholder: "Nap times, snack preferences, bedtime rituals..." },
      { id: "transportation_needed", label: "Transportation needed?", type: "select", options: ["No", "Yes — school pickup/dropoff", "Yes — activity transport"] },
      { id: "emergency_contact", label: "Emergency contact name & phone *", type: "text", placeholder: "Name, relationship, phone number", required: true }
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
      "Birthday gift shopping",
      "Dry cleaning pickup and delivery"
    ],
    disclaimer: null,
    taskOptions: [
      "Grocery Shopping", "Multiple Store Run", "Grocery Put-Away",
      "Meal Prep", "School Lunch Prep", "Snack Prep", "Produce Prep",
      "Pantry Restock", "Fridge Organization", "Freezer Meals",
      "Returns", "Donation Dropoff", "Pharmacy Pickup",
      "Dry Cleaning", "Post Office Runs", "Pet Supply Run"
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
      { id: "grocery_store_pref", label: "Preferred grocery store(s)?", type: "text", placeholder: "e.g. Whole Foods, Giant, Trader Joe's, ALDI..." },
      { id: "dietary_restrictions", label: "Dietary restrictions or allergies?", type: "text", placeholder: "e.g. gluten-free, nut-free, dairy-free, vegetarian..." },
      { id: "household_size", label: "Household size (shopping for how many?)", type: "select", options: ["1–2 people", "3–4 people", "5–6 people", "7+ people"] },
      { id: "budget_limit", label: "Errand spend limit (we use your card or reimburse)", type: "select", options: ["Under $50", "$50–$100", "$100–$200", "$200+", "No limit — use judgment"] },
      { id: "list_ready", label: "Do you have a list ready?", type: "select", options: ["Yes — I'll share it", "Mostly — I'll finalize it", "No — please help me build one"] },
      { id: "num_stops", label: "Estimated number of stops", type: "select", options: ["1–2", "3–4", "5+", "Not sure"] },
      { id: "mileage_notes", label: "Any travel distance expectations or area limits?", type: "text", placeholder: "e.g. within 10 miles, specific towns..." },
      { id: "special_instructions", label: "Brand preferences or special instructions?", type: "text", placeholder: "e.g. organic only, specific brands, call if substituting..." }
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
    disclaimer: "Clean Slate Club provides non-medical companion-style support. Services are intended to provide the kind of practical help you might ask a trusted friend or family member for.",
    taskOptions: [
      "Companionship", "Grocery Shopping", "Meal Support", "Laundry",
      "Transportation", "Appointment Accompaniment", "Light Household Reset",
      "Plant Watering", "Pet Feeding", "Mail Assistance", "Organization Support",
      "Recovery Support", "Shoe/Sock Assistance", "Settling-In Assistance"
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
      { id: "client_age", label: "Approximate age of senior", type: "select", options: ["65–74", "75–84", "85–94", "95+"] },
      { id: "mobility_level", label: "Mobility level", type: "select", options: ["Fully mobile", "Uses cane or walker", "Uses wheelchair", "Primarily bed/chair-bound"] },
      { id: "stairs", label: "Stairs in home?", type: "select", options: ["No stairs", "Yes — one flight", "Yes — multi-level"] },
      { id: "transportation_needed", label: "Transportation to appointments needed?", type: "select", options: ["No", "Yes — medical appointments", "Yes — general errands"] },
      { id: "cognitive_notes", label: "Any memory or cognitive considerations?", type: "select", options: ["No", "Mild — occasional forgetfulness", "Moderate — needs guidance", "Significant — please call ahead"] },
      { id: "surgery_recovery", label: "Surgery or medical recovery?", type: "select", options: ["No", "Yes — recent surgery", "Yes — ongoing recovery"] },
      { id: "special_diet", label: "Dietary restrictions for meal support?", type: "text", placeholder: "e.g. diabetic, low sodium, soft foods only..." },
      { id: "medical_equipment", label: "Any medical equipment in home?", type: "text", placeholder: "e.g. oxygen tank, hospital bed, lift chair..." },
      { id: "has_pets", label: "Pets in home?", type: "select", options: ["No", "Yes — dog", "Yes — cat", "Yes — other"] },
      { id: "emergency_contact", label: "Emergency contact name & phone", type: "text", placeholder: "Name, relationship, phone number" }
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
    disclaimer: null,
    taskOptions: [
      "Grocery Shopping", "Multiple Store Run", "Grocery Put-Away",
      "Meal Prep", "School Lunch Prep", "Snack Prep", "Produce Prep",
      "Pantry Restock", "Fridge Organization", "Freezer Meals",
      "Smoothie Packs", "Baby Food Prep", "Post-Prep Kitchen Tidy"
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
      { id: "groceries_provided", label: "Will groceries be ready?", type: "select", options: ["Yes — all ingredients provided", "Mostly — a few things missing", "No — please add grocery run add-on"] },
      { id: "kitchen_access", label: "Kitchen setup notes (pantry systems, storage preferences)", type: "text", placeholder: "e.g. everything on counters, bins labeled, fridge layout..." }
    ]
  }
};

// ─── Dynamic estimate logic ───────────────────────────────────────────────────

export function getDynamicEstimate(serviceKey, intakeAnswers, selectedTasks, selectedAddonIds) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return { low: 0, high: 0, durationMinutes: 0, flags: [] };

  let extraMinutes = 0;
  const flags = [];

  if (serviceKey === 'home_reset') {
    const taskCount = (selectedTasks || []).length;
    if (taskCount >= 4 && taskCount <= 6) { extraMinutes += 30; flags.push("4–6 tasks selected — extra time added"); }
    if (taskCount > 6) { extraMinutes += 60; flags.push("Full reset scope — significant time added"); }
    if ((selectedTasks || []).includes("Pantry Reset")) { extraMinutes += 20; }
    if ((selectedTasks || []).includes("Fridge Refresh")) { extraMinutes += 15; }
    if ((selectedTasks || []).includes("Laundry Put-Away")) { extraMinutes += 20; }
    if (intakeAnswers.clutter_level === "Very overwhelmed") { extraMinutes += 30; flags.push("Heavy clutter — extra time added"); }
    if (intakeAnswers.clutter_level === "Major reset needed") { extraMinutes += 60; flags.push("Major reset — substantial time added"); }
    if (intakeAnswers.home_size === "4BR" || intakeAnswers.home_size === "5BR+") { extraMinutes += 30; flags.push("Large home — extra time added"); }
    if (intakeAnswers.has_pets && intakeAnswers.has_pets !== "No") { extraMinutes += 10; }
    if (intakeAnswers.stairs === "Yes — multi-level") { extraMinutes += 15; }
    if (intakeAnswers.num_children !== "None" && intakeAnswers.num_children) { extraMinutes += 15; }
  }

  if (serviceKey === 'mothers_helper') {
    if (intakeAnswers.num_children === "3" || intakeAnswers.num_children === "4+") { extraMinutes += 30; flags.push("3+ children — extra time added"); }
    if (intakeAnswers.transportation_needed && intakeAnswers.transportation_needed !== "No") { extraMinutes += 45; flags.push("Transportation — added travel time"); }
    const taskCount = (selectedTasks || []).length;
    if (taskCount > 5) { extraMinutes += 30; }
  }

  if (serviceKey === 'errands') {
    if (intakeAnswers.num_stops === "3–4") { extraMinutes += 20; }
    if (intakeAnswers.num_stops === "5+") { extraMinutes += 45; flags.push("5+ stops — significant travel time added"); }
    if ((selectedTasks || []).includes("Freezer Meals")) { extraMinutes += 60; flags.push("Freezer meal prep — substantial time added"); }
    if ((selectedTasks || []).includes("Multiple Store Run")) { extraMinutes += 30; flags.push("Multiple stores — extra time added"); }
    if (intakeAnswers.household_size === "5–6 people" || intakeAnswers.household_size === "7+ people") { extraMinutes += 20; flags.push("Large household — larger shop estimated"); }
    if (intakeAnswers.dietary_restrictions && intakeAnswers.dietary_restrictions.trim().length > 5) { extraMinutes += 15; flags.push("Special diet — extra sourcing time added"); }
  }

  if (serviceKey === 'senior_support') {
    if (intakeAnswers.mobility_level === "Uses wheelchair" || intakeAnswers.mobility_level === "Primarily bed/chair-bound") { extraMinutes += 20; flags.push("Mobility assistance — extra care time added"); }
    if (intakeAnswers.surgery_recovery && intakeAnswers.surgery_recovery !== "No") { extraMinutes += 20; flags.push("Recovery support — extra time added"); }
    if (intakeAnswers.transportation_needed && intakeAnswers.transportation_needed !== "No") { extraMinutes += 45; flags.push("Transportation to appointments — added travel time"); }
  }

  if (serviceKey === 'meal_prep') {
    if (intakeAnswers.num_people === "5–6 people" || intakeAnswers.num_people === "7+ people") { extraMinutes += 30; flags.push("Large household — more prep time added"); }
    if ((selectedTasks || []).includes("Freezer Meals")) { extraMinutes += 60; flags.push("Freezer meal batch — substantial time added"); }
    if (intakeAnswers.dietary_restrictions && intakeAnswers.dietary_restrictions.trim().length > 5) { extraMinutes += 20; flags.push("Special diet — extra planning/sourcing time"); }
    if (intakeAnswers.groceries_provided === "No — please add grocery run add-on") { extraMinutes += 45; flags.push("Grocery run needed — travel time added"); }
  }

  // Add-ons
  const addonMinutes = (selectedAddonIds || []).reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.minutes : 0);
  }, 0);
  const addonPrice = (selectedAddonIds || []).reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const totalDuration = BUFFER_PREP + config.baseMinutes + extraMinutes + addonMinutes + BUFFER_WRAP;
  const low = config.priceRange[0] + addonPrice;
  const high = config.priceRange[1] + addonPrice + Math.round(extraMinutes / 60 * 40);

  return { low, high, durationMinutes: totalDuration, flags };
}

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