// All durations in minutes
export const BUFFER_PREP = 15;   // before: in-person meet/setup
export const BUFFER_WRAP = 15;   // after: collect supplies, debrief
export const TRAVEL_BUFFER = 20; // travel between clients

export const SERVICE_CONFIG = {
  consult: {
    label: "Not Sure Yet — Let's Talk",
    color: "#B58A90",
    baseMinutes: 15,
    priceRange: [0, 0],
    description: "Not sure where to start? Book a free 15-minute call and we'll figure it out together. No commitment, no pressure. Available Mondays 10am–12pm.",
    scheduleNote: "Consultations are available Mondays only, 10am–12pm. Google Meet default; phone optional.",
    examples: [
      "I don't know what I need — let's just talk",
      "I want a custom quote for my situation",
      "I have a big project I want to walk through first",
      "I'm overwhelmed and don't know where to begin"
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
    label: "Hot Mess Express",
    sublabel: "Household Reset",
    color: "#EB9486",
    baseMinutes: 240,
    priceRange: [180, 500],
    hourlyRate: [75, 95],
    minHours: 2,
    description: "For households that need help getting back to baseline when life gets chaotic. Real help, zero judgment.",
    disclaimer: "Hot Mess Express focuses on household reset and functionality. This service does not include childcare, transportation, elder care, or deep cleaning.",
    examples: [
      "Dishes stacked, laundry everywhere, no idea where to start",
      "House hasn't been touched in weeks — full reset needed",
      "Company coming over and you need it presentable fast",
      "Post-sick household — everything piled up while you recovered",
      "ADHD paralysis reset — just need someone to come in and move"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "Laundry Washing", "Laundry Folding", "Laundry Put-Away",
      "Dish Washing", "Dishwasher Unloading", "Kitchen Reset",
      "Refrigerator Cleanout", "Pantry Straightening",
      "Bed Linen Change", "Towel Refresh", "Entryway Tidying",
      "Living Room Reset", "Bathroom Surface Refresh", "Toy Pickup",
      "Book & Media Straightening", "Mail Sorting", "Donation Bag Prep",
      "Light Closet Straightening", "Seasonal Decor Takedown",
      "Plant Watering", "Pet Feeding", "Trash & Recycling Reset",
      "Restocking Household Supplies", "Guest Room Preparation"
    ],
    addons: [
      { id: "fold_rush", label: "The Fold Rush — Laundry Wash, Dry & Fold", minutes: 60, price: 95 },
      { id: "extra_load", label: "Extra Laundry Load (+1)", minutes: 30, price: 25 },
      { id: "fridge_refresh", label: "Fridge Refresh — Cleanout & Reorganize", minutes: 30, price: 65 },
      { id: "pantry_party", label: "Pantry Party — Straighten & Zone", minutes: 45, price: 95 },
      { id: "bed_reset", label: "Bed Reset — All Rooms", minutes: 20, price: 45 },
      { id: "pet_check", label: "Pet Check — Feeding, Water, Litter", minutes: 20, price: 35 },
      { id: "stocked_up", label: "Stocked Up — Household Supply Restock", minutes: 30, price: 65 },
      { id: "donation_station", label: "Donation Station — Bag & Drop Off", minutes: 30, price: 45 },
      { id: "paper_trail", label: "The Paper Trail — Mail & Paper Sort", minutes: 30, price: 65 },
      { id: "toy_story", label: "Toy Story — Toy Pickup & Room Reset", minutes: 45, price: 75 },
      { id: "closet_comeback", label: "Closet Comeback — Light Reset & Fold", minutes: 60, price: 175 },
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
      { id: "allergies", label: "Any sensitivities or allergies to products?", type: "text", placeholder: "e.g. fragrance-free only, no bleach..." }
    ]
  },

  mothers_helper: {
    label: "Chaos Coordinator",
    sublabel: "Family Support",
    color: "#EFB988",
    baseMinutes: 180,
    priceRange: [120, 250],
    hourlyRate: [75, 95],
    minHours: 2,
    description: "Extra hands for busy family life, school logistics, recovery seasons, and keeping routines moving.",
    disclaimer: "Clean Slate Club provides support-based household and family assistance. This is not a licensed nanny agency or medical childcare provider.",
    examples: [
      "School pickup + snack + homework supervision",
      "Toddler entertainment while you work from home",
      "Postpartum support — baby and household",
      "Sick day when you can't be in two places",
      "Recovery support while you rest"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "School Pickup", "Activity Dropoff", "Homework Supervision",
      "Playtime Supervision", "Toddler Entertainment Support",
      "Baby Bottle Washing", "Baby Laundry", "School Lunch Packing",
      "Snack Preparation", "Parent Helper Support", "Recovery Support Assistance",
      "Child Room Tidying", "Backpack & School Paper Reset",
      "Car Seat Transfer Assistance", "Grocery Trip With Children",
      "Waiting With Sleeping Child", "Family Calendar Assistance",
      "Child Transportation Assistance", "School Project Assistance",
      "Toy Rotation Assistance", "Overflow Family Support",
      "Appointment Coverage Assistance", "Kids' Activity Prep", "Quiet Time Supervision"
    ],
    addons: [
      { id: "light_meal_prep", label: "Light Meal Prep for Kids", minutes: 30, price: 25 },
      { id: "school_pickup", label: "School Pickup & Dropoff", minutes: 45, price: 35 },
      { id: "bath_routine", label: "Bath & Bedtime Routine Support", minutes: 45, price: 35 },
      { id: "pediatric_errand", label: "Pharmacy/Pediatric Supply Run", minutes: 30, price: 30 },
      { id: "nursery_reset", label: "Nursery/Playroom Reset", minutes: 30, price: 25 },
      { id: "laundry_kids", label: "Kids Laundry Wash & Fold", minutes: 30, price: 25 },
      { id: "toy_story", label: "Toy Story — Toy Rotation & Reset", minutes: 45, price: 75 },
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
    label: "The Runaround",
    sublabel: "Errands & Concierge",
    color: "#CAE7B9",
    baseMinutes: 120,
    priceRange: [80, 160],
    hourlyRate: [75, 95],
    mileage: true,
    minHours: 2,
    description: "For the endless little tasks, pickups, dropoffs, and running around that eats up your whole day.",
    disclaimer: null,
    examples: [
      "Weekly grocery run with your list",
      "Pharmacy, dry cleaning, post office in one trip",
      "Birthday gift shopping + wrapped and ready",
      "Amazon returns + donation drop-off",
      "Multiple store run handled start to finish"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "Grocery Shopping", "Prescription Pickup",
      "Post Office Run", "Dry Cleaning Pickup or Dropoff",
      "Donation Dropoff", "Retail Returns", "Birthday Gift Pickup",
      "Holiday Shopping", "Household Supply Run", "Pet Supply Pickup",
      "Car Service Dropoff", "Waiting During Appointment",
      "Airport Dropoff", "Airport Pickup", "School Pickup",
      "Facebook Marketplace Pickup",
      "Coffee/Food Pickup", "Last-Minute Errand Assistance", "Personal Shopping Support"
    ],
    addons: [
      { id: "grocery_putaway", label: "Grocery Put-Away & Fridge Organize", minutes: 20, price: 20 },
      { id: "returns_processing", label: "Online Returns Processing (pack + ship)", minutes: 20, price: 20 },
      { id: "reset_run", label: "Reset Run — Org Supply Shopping", minutes: 45, price: 75 },
      { id: "gift_wrapping", label: "Gift Shopping + Wrapping", minutes: 45, price: 40 },
      { id: "post_office", label: "Post Office / Shipping Dropoff", minutes: 20, price: 15 },
      { id: "donation_drop", label: "Donation Station — Bag & Drop Off", minutes: 30, price: 45 },
      { id: "pet_supplies", label: "Pet Supply Run", minutes: 20, price: 15 },
      { id: "dry_cleaning", label: "Dry Cleaning Pickup or Dropoff", minutes: 20, price: 15 },
      { id: "stocked_up", label: "Stocked Up — Household Supply Restock", minutes: 30, price: 65 }
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
    label: "The Check-In",
    sublabel: "Senior & Companion Support",
    color: "#B58A90",
    baseMinutes: 120,
    priceRange: [100, 200],
    hourlyRate: [75, 95],
    minHours: 2,
    description: "Companion-style support and practical help for seniors and aging loved ones. The kind of help you'd ask a trusted friend for.",
    disclaimer: "Clean Slate Club provides non-medical companion-style support. We do not provide medical care, medication administration, bathing, lifting/transfers, wound care, or skilled nursing services.",
    examples: [
      "Friendly companionship and check-in visit",
      "Grocery and prescription runs",
      "Light housekeeping and laundry for an aging parent",
      "Appointment transportation and waiting room support",
      "Post-discharge recovery check-in"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "Friendly Companionship Visit", "Grocery Shopping Assistance",
      "Appointment Transportation", "Waiting Room Support", "Prescription Pickup",
      "Meal Portion Assistance", "Refrigerator Restocking", "Laundry Assistance",
      "Linen Refresh", "Mail Assistance", "Plant Watering", "Pet Feeding",
      "Technology Help", "Light Organization Support", "Closet Assistance",
      "Shoe & Jacket Assistance", "Recovery Check-In Support",
      "Conversation & Social Time", "Light Kitchen Assistance",
      "Puzzle/Game Companion Time", "Reading Assistance",
      "Household Supply Pickup", "Appointment Reminder Support", "Simple Mobility Assistance"
    ],
    addons: [
      { id: "meal_prep_senior", label: "Light Meal Prep & Kitchen Tidy", minutes: 45, price: 35 },
      { id: "companionship", label: "Extended Companionship & Conversation", minutes: 30, price: 25 },
      { id: "laundry_senior", label: "Laundry Wash & Fold", minutes: 45, price: 35 },
      { id: "grocery_senior", label: "Grocery / Errand Run", minutes: 60, price: 45 },
      { id: "safety_tidy", label: "Safety-Focused Declutter (trip hazards)", minutes: 45, price: 40 },
      { id: "pet_check", label: "Pet Check — Feeding, Water, Short Walk", minutes: 20, price: 35 }
    ],
    intakeQuestions: [
      { id: "client_age", label: "Approximate age of senior", type: "select", options: ["65–74", "75–84", "85–94", "95+"] },
      { id: "mobility_level", label: "Mobility level", type: "select", options: ["Fully mobile", "Uses cane or walker", "Uses wheelchair", "Primarily bed/chair-bound"] },
      { id: "stairs", label: "Stairs in home?", type: "select", options: ["No stairs", "Yes — one flight", "Yes — multi-level"] },
      { id: "transportation_needed", label: "Transportation to appointments needed?", type: "select", options: ["No", "Yes — medical appointments", "Yes — general errands"] },
      { id: "cognitive_notes", label: "Any memory or cognitive considerations?", type: "select", options: ["No", "Mild — occasional forgetfulness", "Moderate — needs guidance", "Significant — please call ahead"] },
      { id: "surgery_recovery", label: "Surgery or medical recovery?", type: "select", options: ["No", "Yes — recent surgery", "Yes — ongoing recovery"] },
      { id: "special_diet", label: "Dietary restrictions for meal support?", type: "text", placeholder: "e.g. diabetic, low sodium, soft foods only..." },
      { id: "has_pets", label: "Pets in home?", type: "select", options: ["No", "Yes — dog", "Yes — cat", "Yes — other"] },
      { id: "emergency_contact", label: "Emergency contact name & phone", type: "text", placeholder: "Name, relationship, phone number" }
    ]
  },

  meal_prep: {
    label: "Clean Plate Club",
    sublabel: "Meal Prep & Kitchen Support",
    color: "#F3DE8A",
    baseMinutes: 180,
    priceRange: [120, 240],
    hourlyRate: [75, 95],
    mileage: false,
    groceries: true,
    minHours: 2,
    description: "Nourishment support for busy households. Simple, real food — prepped and ready to go.",
    disclaimer: "Grocery costs are separate from service time. Clean Slate Club does not advance personal funds for groceries.",
    examples: [
      "Weekly proteins, grains & veggies prepped and portioned",
      "School lunch prep for 5 days",
      "Freezer batch cooking — 4–6 meals",
      "Post-grocery put-away and meal plan setup",
      "Smoothie packs, snack bags, grab-and-go containers"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "Grocery Shopping", "Grocery Put-Away", "Ingredient Washing",
      "Produce Prep", "Protein Prep", "Snack Station Prep",
      "School Lunch Prep", "Smoothie Prep Packs", "Portioning Meals",
      "Freezer Meal Prep", "Refrigerator Organization", "Pantry Restocking",
      "Breakfast Prep", "Family Dinner Prep", "Recovery Meal Prep",
      "Healthy Snack Prep", "Charcuterie Prep", "Beverage Restocking",
      "Labeling & Storage", "Kitchen Cleanup", "Bulk Batch Cooking",
      "Meal Planning Assistance", "Simple Recipe Preparation", "Food Expiration Reset"
    ],
    addons: [
      { id: "freezer_meals", label: "Freezer Meal Batch (4–6 meals)", minutes: 60, price: 55 },
      { id: "school_lunches", label: "Weekly School Lunch Prep (5 days)", minutes: 30, price: 30 },
      { id: "snack_packs", label: "Snack & Smoothie Pack Prep", minutes: 20, price: 20 },
      { id: "grocery_run_meals", label: "Grocery Run for Meal Ingredients", minutes: 45, price: 45, requiresFunds: true },
      { id: "fridge_refresh", label: "Fridge Refresh — Cleanout & Reorganize", minutes: 30, price: 65 },
      { id: "pantry_party", label: "Pantry Party — Straighten & Zone", minutes: 45, price: 95 },
      { id: "special_diet_prep", label: "Special Diet Prep (allergy/dietary)", minutes: 30, price: 35 },
      { id: "produce_prep", label: "Produce Prep — Wash, Chop & Store", minutes: 20, price: 20 },
      { id: "family_double_batch", label: "Family Double Batch", minutes: 45, price: 45 },
      { id: "breakfast_prep", label: "Breakfast Prep Pack", minutes: 30, price: 35 },
      { id: "senior_portioning", label: "Senior Meal Portioning (labeled portions)", minutes: 20, price: 25 },
      { id: "protein_pack", label: "Grab-and-Go Protein Pack", minutes: 20, price: 20 },
    ],
    intakeQuestions: [
      { id: "num_people", label: "Household size (meals for how many?)", type: "select", options: ["1–2 people", "3–4 people", "5–6 people", "7+ people"] },
      { id: "dietary_restrictions", label: "Dietary restrictions or allergies", type: "text", placeholder: "e.g. gluten-free, nut-free, dairy-free, vegetarian..." },
      { id: "meal_types", label: "What types of meals? (select all)", type: "multiselect", options: ["Breakfasts", "Lunches", "Dinners", "Snacks", "Kids meals", "Baby food", "Smoothie packs"] },
      { id: "cooking_style", label: "Preferred cooking style", type: "select", options: ["Simple & quick", "Comfort food", "Clean eating / whole foods", "Mediterranean", "Whatever you suggest!"] },
      { id: "appliances", label: "Available appliances", type: "multiselect", options: ["Instant Pot", "Air Fryer", "Slow Cooker", "Stand Mixer", "Blender", "Standard oven only"] },
      { id: "groceries_provided", label: "Will groceries be ready?", type: "select", options: ["Yes — all ingredients provided", "Mostly — a few things missing", "No — please add grocery run add-on"] },
      { id: "kitchen_access", label: "Kitchen setup notes", type: "text", placeholder: "e.g. pantry layout, storage preferences, labels used..." }
    ]
  },

  organization: {
    label: "Room Service",
    sublabel: "Organization & Decluttering",
    color: "#7E7F9A",
    baseMinutes: 240,
    priceRange: [140, 280],
    hourlyRate: [75, 95],
    minHours: 2,
    description: "For spaces that need a reset, not perfection. Calm, methodical, judgment-free decluttering and organization support.",
    disclaimer: "Room Service focuses on organization, sorting, and decluttering support. This service does not include deep cleaning.",
    examples: [
      "Pantry overhaul — bins, zones, labels",
      "Closet seasonal swap + donation prep",
      "Playroom or toy rotation reset",
      "Office or paper clutter purge",
      "Post-move setup and unpacking help"
    ],
    taskOptions: [
      "Help Me Choose — I'm Overwhelmed",
      "Pantry Organization", "Closet Reset", "Linen Closet Organization",
      "Bathroom Cabinet Organization", "Under Sink Organization",
      "Entryway Reset", "Mudroom Organization", "Toy Organization",
      "Playroom Reset", "Kitchen Drawer Organization", "Refrigerator Organization",
      "Paper Sorting", "Mail Organization", "Donation Sorting",
      "Seasonal Clothing Swap", "Storage Bin Labeling", "School Project Organization",
      "Office Reset", "Craft Supply Organization", "Laundry Room Reset",
      "Garage Zone Straightening", "Guest Room Refresh",
      "Overflow Clutter Assistance", "Household Systems Setup"
    ],
    addons: [
      { id: "closet_comeback", label: "Closet Comeback — Full Seasonal Reset", minutes: 90, price: 175 },
      { id: "pantry_party", label: "Pantry Party — Deep Zone & Label", minutes: 60, price: 95 },
      { id: "toy_story", label: "Toy Story — Sort, Rotate & Reset", minutes: 60, price: 75 },
      { id: "paper_trail", label: "The Paper Trail — Mail & Paper Purge", minutes: 45, price: 65 },
      { id: "donation_station", label: "Donation Station — Bag & Drop Off", minutes: 30, price: 45 },
      { id: "reset_run", label: "Reset Run — Org Supplies Shopping", minutes: 60, price: 75 },
      { id: "stocked_up", label: "Stocked Up — Household Restock", minutes: 30, price: 65 },
      { id: "bed_reset", label: "Bed Reset — Fresh Linens & Styling", minutes: 20, price: 45 }
    ],
    intakeQuestions: [
      { id: "home_size", label: "Home size", type: "select", options: ["Studio/1BR", "2BR", "3BR", "4BR", "5BR+"] },
      { id: "clutter_level", label: "Current condition of target space", type: "select", options: ["Mostly fine — just needs a refresh", "Somewhat cluttered", "Very overwhelmed", "Major overhaul needed"] },
      { id: "priority_spaces", label: "Which spaces need the most help? (select all)", type: "multiselect", options: ["Kitchen", "Pantry", "Closets", "Bedroom", "Kids Rooms", "Playroom", "Bathroom", "Office", "Basement/Garage", "Laundry Room"] },
      { id: "supplies_available", label: "Do you have organizing supplies?", type: "select", options: ["Yes — bins, labels, baskets ready", "Some — but I might need more", "No — please add Reset Run add-on"] },
      { id: "donation_ready", label: "Are there items to donate or remove?", type: "select", options: ["Yes — bags already packed", "Probably — we'll sort during visit", "No donation items"] },
      { id: "style_pref", label: "Organization style preference", type: "select", options: ["Minimal & clean", "Practical & functional", "Aesthetic & curated", "Just get it under control!"] },
      { id: "special_notes", label: "Any areas to avoid or special instructions?", type: "text", placeholder: "e.g. don't touch the hobby room, partner's side of closet, kids' sentimental items..." }
    ]
  }
};

// ─── Add-ons catalog (standalone reference for Services page) ─────────────────
export const ADDON_CATALOG = [
  { name: 'The Fold Rush', price: '$95–145', desc: 'Laundry overflow — wash, dry, fold, basket sort.' },
  { name: 'Load & Behold', price: '$150–250', desc: 'Full household laundry reset: linens, towels, overflow folding.' },
  { name: 'Extra Load', price: '$25–45', desc: 'Additional laundry load added onto your booked service.' },
  { name: 'Put It Away', price: '$45–95', desc: 'Laundry put-away: drawers, closets, hanging, simple organization.' },
  { name: 'Fridge Refresh', price: '$65–150', desc: 'Refrigerator cleanout, expiration reset, wipe-down, reorganization.' },
  { name: 'Pantry Party', price: '$95–350', desc: 'Pantry straightening, container zoning, labeling prep, shelf reset.' },
  { name: 'Closet Comeback', price: '$175–450', desc: 'Closet refresh: seasonal swaps, donation prep, organization resets.' },
  { name: 'Toy Story', price: '$75–225', desc: 'Toy pickup, sorting, rotation, and playroom reset.' },
  { name: 'The Paper Trail', price: '$65–185', desc: 'Mail sorting, paper organization, school paper resets.' },
  { name: 'Bed Reset', price: '$45–95', desc: 'Fresh linens, bed styling, pillow reset, bedroom refresh.' },
  { name: 'Pet Check', price: '$35–85', desc: 'Feeding, water refresh, litter refresh, short walks.' },
  { name: 'Stocked Up', price: '$65–150', desc: 'Household restocking: paper towels, toiletries, snacks, essentials.' },
  { name: 'Donation Station', price: '$45–95', desc: 'Donation bag coordination and dropoff support.' },
  { name: 'Reset Run', price: '$75–175', desc: 'Shopping for org supplies: bins, labels, baskets, containers. Travel time counts toward service.' },
];

// ─── Dynamic estimate logic ───────────────────────────────────────────────────

export function getDynamicEstimate(serviceKey, intakeAnswers, selectedTasks, selectedAddonIds) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return { low: 0, high: 0, durationMinutes: 0, flags: [] };

  let extraMinutes = 0;
  const flags = [];

  const taskCount = (selectedTasks || []).length;

  // Global task count logic (applies to all services)
  if (taskCount >= 4 && taskCount <= 6) { extraMinutes += 30; flags.push("4–6 focus areas selected — extra time built in"); }
  if (taskCount > 6) { extraMinutes += 75; flags.push("7+ focus areas — we recommend additional service time"); }

  if (serviceKey === 'home_reset') {
    if (intakeAnswers.clutter_level === "Very overwhelmed") { extraMinutes += 30; flags.push("Heavy clutter — extra time added"); }
    if (intakeAnswers.clutter_level === "Major reset needed") { extraMinutes += 60; flags.push("Major reset — substantial time added"); }
    if (intakeAnswers.home_size === "4BR" || intakeAnswers.home_size === "5BR+") { extraMinutes += 30; flags.push("Large home — extra time added"); }
    if (intakeAnswers.has_pets && intakeAnswers.has_pets !== "No") { extraMinutes += 10; }
    if (intakeAnswers.stairs === "Yes — multi-level") { extraMinutes += 15; }
    if (intakeAnswers.num_children !== "None" && intakeAnswers.num_children) { extraMinutes += 15; }
  }

  if (serviceKey === 'mothers_helper') {
    if (intakeAnswers.num_children === "3" || intakeAnswers.num_children === "4+") { extraMinutes += 30; flags.push("3+ children — extra time added"); }
    if (intakeAnswers.transportation_needed && intakeAnswers.transportation_needed !== "No") { extraMinutes += 45; flags.push("Transportation included — travel time added"); }
  }

  if (serviceKey === 'errands') {
    if (intakeAnswers.num_stops === "3–4") { extraMinutes += 20; }
    if (intakeAnswers.num_stops === "5+") { extraMinutes += 45; flags.push("5+ stops — significant travel time added"); }
    if (intakeAnswers.household_size === "5–6 people" || intakeAnswers.household_size === "7+ people") { extraMinutes += 20; flags.push("Large household — bigger shop estimated"); }
    if (intakeAnswers.dietary_restrictions && intakeAnswers.dietary_restrictions.trim().length > 5) { extraMinutes += 15; flags.push("Special diet — extra sourcing time added"); }
  }

  if (serviceKey === 'senior_support') {
    if (intakeAnswers.mobility_level === "Uses wheelchair" || intakeAnswers.mobility_level === "Primarily bed/chair-bound") { extraMinutes += 20; flags.push("Mobility assistance — extra care time added"); }
    if (intakeAnswers.surgery_recovery && intakeAnswers.surgery_recovery !== "No") { extraMinutes += 20; flags.push("Recovery support — extra time added"); }
    if (intakeAnswers.transportation_needed && intakeAnswers.transportation_needed !== "No") { extraMinutes += 45; flags.push("Transportation included — travel time added"); }
  }

  if (serviceKey === 'meal_prep') {
    if (intakeAnswers.num_people === "5–6 people" || intakeAnswers.num_people === "7+ people") { extraMinutes += 30; flags.push("Large household — more prep time added"); }
    if (intakeAnswers.dietary_restrictions && intakeAnswers.dietary_restrictions.trim().length > 5) { extraMinutes += 20; flags.push("Special diet — extra planning/sourcing time"); }
    if (intakeAnswers.groceries_provided === "No — please add grocery run add-on") { extraMinutes += 45; flags.push("Grocery run needed — travel time added"); }
  }

  if (serviceKey === 'organization') {
    if (intakeAnswers.clutter_level === "Very overwhelmed" || intakeAnswers.clutter_level === "Major overhaul needed") { extraMinutes += 45; flags.push("Heavy clutter — substantial time added"); }
    if (intakeAnswers.home_size === "4BR" || intakeAnswers.home_size === "5BR+") { extraMinutes += 30; flags.push("Large home — extra time added"); }
    if (intakeAnswers.supplies_available === "No — please add Reset Run add-on") { extraMinutes += 30; flags.push("Supply shopping needed — travel time added"); }
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

  const hourlyLow = config.hourlyRate ? config.hourlyRate[0] : 75;
  const hourlyHigh = config.hourlyRate ? config.hourlyRate[1] : 95;
  const totalDuration = BUFFER_PREP + config.baseMinutes + extraMinutes + addonMinutes + BUFFER_WRAP;
  const hours = totalDuration / 60;
  const low = Math.round(hours * hourlyLow) + addonPrice;
  const high = Math.round(hours * hourlyHigh) + addonPrice;

  return { low, high, durationMinutes: totalDuration, flags };
}

export const AVAILABLE_HOURS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM",
];

// Members get 9 AM access
export const MEMBER_HOURS = ["9:00 AM", "9:30 AM", ...AVAILABLE_HOURS];

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