// Clean Slate Club Backend OS foundation
// This file is the single source of truth for admin/team portal structure,
// booking rules, provider compliance requirements, service menu defaults,
// and notification rules. UI screens and estimators should pull from here
// instead of hard-coding separate copies of prices, minutes, and policies.

export const PORTAL_ROUTES = {
  admin: '/admin',
  team: '/team',
  legacy: {
    adminLogin: '/admin-login',
    providerLogin: '/provider-login',
    staffLogin: '/staff-login',
    provider: '/provider',
  },
};

export const ADMIN_NAV_SECTIONS = [
  { key: 'home', label: 'Home', description: 'Daily command center for bookings, alerts, revenue, and provider readiness.' },
  { key: 'calendar', label: 'Calendar', description: 'Schedule, availability, blocked time, and visit movement.' },
  { key: 'bookings', label: 'Bookings', description: 'Pending, confirmed, completed, cancelled, and archived visits.' },
  { key: 'guests', label: 'Guests', description: 'Household profiles, notes, membership status, and visit history.' },
  { key: 'providers', label: 'Providers', description: 'Provider profiles, onboarding, clearances, access, and assignments.' },
  { key: 'services', label: 'Services', description: 'Packages, add-ons, pricing, durations, estimator rules, and online visibility.' },
  { key: 'payments', label: 'Payments', description: 'Deposits, checkout links, final balances, refunds, reschedule fees, and manual payments.' },
  { key: 'forms', label: 'Forms', description: 'Guest intake, provider onboarding, document upload, incidents, and visit completion.' },
  { key: 'messages', label: 'Messages', description: 'One-off branded emails, SMS messages, provider alerts, and communication logs.' },
  { key: 'campaigns', label: 'Campaigns', description: 'Automated and manual email/SMS campaigns using Clean Slate branding.' },
  { key: 'reports', label: 'Reports', description: 'Revenue, visits, cancellations, reschedules, provider payouts, and membership performance.' },
  { key: 'settings', label: 'Settings', description: 'Business rules, booking rules, payment rules, provider rules, and brand settings.' },
];

export const BOOKING_RULES_DEFAULTS = {
  bookingEnabled: true,
  publicHours: { start: '10:00', end: '18:00' },
  minimumLeadTimeHours: 24,
  noClientFacingSundays: true,
  minimumVisitMinutes: 120,
  maximumVisitMinutes: 480,
  travelBufferMinutes: 20,
  onePackagePerVisit: true,
  suggestTwoProvidersAfterAddonCount: 4,
  depositAmount: 50,
  cancellationWindowHours: 48,
  autoRefundOnTimeCancellation: true,
  retainDepositOnLateCancellation: true,
  rescheduleWindowHours: 48,
  nonMemberRescheduleFee: 25,
  memberFreeReschedules: 3,
  blackoutHolidays: ['New Year\'s Day', 'Thanksgiving Day', 'Christmas Day'],
  premiumHolidays: ['Easter weekend', 'Memorial Day weekend', 'July 4', 'Labor Day', 'Christmas Eve', 'New Year\'s Eve'],
  waitlist: {
    enabled: false,
    defaultMode: 'manual_pick',
    modes: [
      { key: 'manual_pick', label: 'Manual Pick', description: 'Admin manually chooses who to offer the opening to.' },
      { key: 'first_in_line', label: 'First in Line', description: 'The first guest on the waitlist gets the first offer.' },
      { key: 'priority_members', label: 'Priority Members First', description: 'Members get the opening offer before non-members.' },
      { key: 'instant_offer', label: 'Instant Offer', description: 'Everyone eligible is notified and the first person to book gets it.' },
    ],
  },
};

export const PROVIDER_STATUSES = [
  { key: 'draft', label: 'Draft', canSeeJobs: false, canBeAssigned: false },
  { key: 'invited', label: 'Invited', canSeeJobs: false, canBeAssigned: false },
  { key: 'onboarding', label: 'Onboarding', canSeeJobs: false, canBeAssigned: false },
  { key: 'pending_review', label: 'Pending Review', canSeeJobs: false, canBeAssigned: false },
  { key: 'active', label: 'Active', canSeeJobs: true, canBeAssigned: true },
  { key: 'restricted', label: 'Restricted', canSeeJobs: true, canBeAssigned: false },
  { key: 'suspended', label: 'Suspended', canSeeJobs: false, canBeAssigned: false },
  { key: 'archived', label: 'Archived', canSeeJobs: false, canBeAssigned: false },
];

export const PROVIDER_SERVICE_PERMISSIONS = [
  { key: 'home_reset', label: 'Hot Mess Express / Home Reset' },
  { key: 'meal_prep', label: 'Clean Plate Club / Meal Prep' },
  { key: 'family_support', label: 'Chaos Coordinator / Family Support' },
  { key: 'senior_support', label: 'The Check-In / Elder Companion Support' },
  { key: 'errands', label: 'The Runaround / Errands' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'organization', label: 'Room Service / Organization' },
  { key: 'shopping', label: 'Shopping / Store Runs' },
  { key: 'pet_support', label: 'Pet-Related Light Support' },
];

export const PROVIDER_DOCUMENT_REQUIREMENTS = {
  base: [
    { key: 'w9', label: 'W-9', required: true, sensitive: true, expires: false, helper: 'Required contractor tax document. Admin-only access.' },
    { key: 'contractor_agreement', label: 'Independent Contractor Agreement', required: true, sensitive: true, expires: false, helper: 'Signed agreement that defines contractor relationship, scope, and payment terms.' },
    { key: 'confidentiality_agreement', label: 'Confidentiality / Privacy Agreement', required: true, sensitive: false, expires: false, helper: 'Required before seeing guest addresses, phone numbers, access notes, or photos.' },
    { key: 'scope_policy', label: 'Scope of Work + Safety Policy', required: true, sensitive: false, expires: false, helper: 'Confirms what Clean Slate Club does and does not provide.' },
    { key: 'background_check', label: 'Background Check', required: true, sensitive: true, expires: true, helper: 'Required before provider can be activated for in-home visits.' },
  ],
  meal_prep: [
    { key: 'food_handling', label: 'Food Handling / ServeSafe', required: true, sensitive: false, expires: true, helper: 'Required for meal prep, kitchen support, and food handling visits.' },
  ],
  transportation: [
    { key: 'drivers_license', label: 'Driver\'s License', required: true, sensitive: true, expires: true, helper: 'Required before transportation or driving-related errands.' },
    { key: 'auto_insurance', label: 'Auto Insurance', required: true, sensitive: true, expires: true, helper: 'Required before driving guests, children, seniors, or running transportation-based errands.' },
    { key: 'transportation_policy', label: 'Transportation Policy', required: true, sensitive: false, expires: false, helper: 'Confirms provider understands driving, pickup, dropoff, and safety rules.' },
  ],
  family_support: [
    { key: 'cpr_certification', label: 'CPR Certification', required: true, sensitive: false, expires: true, helper: 'Required for child/family support.' },
    { key: 'child_abuse_clearance', label: 'Child Abuse Clearance', required: true, sensitive: true, expires: true, helper: 'Required before child/family support assignments.' },
    { key: 'child_safety_policy', label: 'Child Safety Policy', required: true, sensitive: false, expires: false, helper: 'Confirms safety, supervision, transportation, and emergency expectations.' },
  ],
  senior_support: [
    { key: 'cpr_certification', label: 'CPR Certification', required: true, sensitive: false, expires: true, helper: 'Required for elder companion support.' },
    { key: 'no_medical_care_policy', label: 'No Medical Care Policy', required: true, sensitive: false, expires: false, helper: 'Confirms provider understands Clean Slate Club does not provide medical care, bathing, lifting, wound care, or medication administration.' },
  ],
};

export const SERVICE_MENU_DEFAULTS = [
  {
    key: 'home_reset',
    label: 'Hot Mess Express',
    category: 'Household Reset',
    baseMinutes: 180,
    minMinutes: 180,
    price: 195,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: false,
    providerPermissions: ['home_reset'],
    description: 'For households that need help getting back to baseline when life gets chaotic. Real help, zero judgment.',
    focusItems: ['Laundry Washing', 'Laundry Folding', 'Laundry Put-Away', 'Dish Washing', 'Dishwasher Unloading', 'Kitchen Reset', 'Refrigerator Cleanout', 'Pantry Straightening', 'Bed Linen Change', 'Towel Refresh', 'Entryway Tidying', 'Living Room Reset', 'Bathroom Surface Refresh', 'Toy Pickup', 'Mail Sorting', 'Donation Bag Prep', 'Plant Watering', 'Pet Feeding', 'Trash & Recycling Reset', 'Restocking Household Supplies'],
    addons: [
      { key: 'fold_rush', label: 'The Fold Rush', minutes: 90, price: 95 },
      { key: 'extra_laundry_load', label: 'Extra Laundry Load', minutes: 60, price: 45 },
      { key: 'fridge_refresh', label: 'Fridge Refresh', minutes: 30, price: 95 },
      { key: 'pantry_party', label: 'Pantry Party', minutes: 45, price: 95 },
      { key: 'bed_reset', label: 'Bed Reset', minutes: 20, price: 45 },
      { key: 'pet_check', label: 'Pet Check', minutes: 20, price: 30 },
      { key: 'stocked_up', label: 'Stocked Up', minutes: 30, price: 30 },
      { key: 'donation_station', label: 'Donation Station', minutes: 30, price: 30 },
      { key: 'paper_trail', label: 'The Paper Trail', minutes: 30, price: 50 },
      { key: 'toy_story', label: 'Toy Story', minutes: 45, price: 75 },
    ],
  },
  {
    key: 'meal_prep',
    label: 'Clean Plate Club',
    category: 'Meal Prep & Kitchen Support',
    baseMinutes: 180,
    minMinutes: 180,
    price: 195,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: false,
    providerPermissions: ['meal_prep'],
    description: 'Nourishment support for busy households. Simple, real food, prepped and ready to go.',
    focusItems: ['Grocery Shopping', 'Grocery Put-Away', 'Ingredient Washing', 'Produce Prep', 'Protein Prep', 'Snack Station Prep', 'School Lunch Prep', 'Smoothie Prep Packs', 'Portioning Meals', 'Freezer Meal Prep', 'Refrigerator Organization', 'Pantry Restocking', 'Breakfast Prep', 'Family Dinner Prep', 'Recovery Meal Prep', 'Labeling & Storage', 'Kitchen Cleanup', 'Meal Planning Assistance'],
    addons: [
      { key: 'freezer_meals', label: 'Freezer Meal Batch', minutes: 60, price: 55 },
      { key: 'school_lunches', label: 'Weekly School Lunch Prep', minutes: 30, price: 30 },
      { key: 'snack_packs', label: 'Snack & Smoothie Pack Prep', minutes: 20, price: 20 },
      { key: 'grocery_run_meals', label: 'Grocery Run for Meal Ingredients', minutes: 45, price: 45, requiresFunds: true },
      { key: 'fridge_refresh', label: 'Fridge Refresh', minutes: 30, price: 65 },
      { key: 'pantry_party', label: 'Pantry Party', minutes: 45, price: 95 },
      { key: 'special_diet_prep', label: 'Special Diet Prep', minutes: 30, price: 35 },
      { key: 'produce_prep', label: 'Produce Prep', minutes: 20, price: 20 },
      { key: 'family_double_batch', label: 'Family Double Batch', minutes: 45, price: 45 },
    ],
  },
  {
    key: 'family_support',
    label: 'Chaos Coordinator',
    category: 'Family Support',
    baseMinutes: 120,
    minMinutes: 120,
    price: 150,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: true,
    providerPermissions: ['family_support'],
    description: 'Extra hands for busy family life, school logistics, recovery seasons, and keeping routines moving.',
    focusItems: ['Childcare & Supervision', 'Recovery and Postpartum Support', 'School Pickup & Activity Transportation', 'Baby & Toddler Support', 'Lunch Packing & Snack Preparation', 'Children\'s Laundry', 'Child Bedroom Reset', 'Playroom Reset', 'Errands & Appointment Assistance', 'Grocery Shopping Assistance', 'Help Me Choose — I\'m Overwhelmed'],
    addons: [
      { key: 'light_meal_prep_kids', label: 'Light Meal Prep for Kids', minutes: 30, price: 25 },
      { key: 'school_pickup', label: 'School Pickup & Dropoff', minutes: 45, price: 35, requiresTransportation: true },
      { key: 'pediatric_errand', label: 'Pharmacy/Pediatric Supply Run', minutes: 30, price: 30 },
      { key: 'nursery_reset', label: 'Nursery/Playroom Reset', minutes: 30, price: 25 },
      { key: 'kids_laundry', label: 'Kids Laundry Wash & Fold', minutes: 30, price: 25 },
      { key: 'toy_rotation', label: 'Toy Rotation & Reset', minutes: 45, price: 75 },
      { key: 'postpartum_support', label: 'Postpartum Meal & Recovery Support', minutes: 60, price: 55 },
    ],
  },
  {
    key: 'senior_support',
    label: 'The Check-In',
    category: 'Senior & Companion Support',
    baseMinutes: 120,
    minMinutes: 120,
    price: 150,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: true,
    providerPermissions: ['senior_support'],
    description: 'Companion-style support and practical help for seniors and aging loved ones. Non-medical support only.',
    focusItems: ['Friendly Companionship Visit', 'Grocery Shopping Assistance', 'Appointment Transportation', 'Waiting Room Support', 'Prescription Pickup', 'Meal Portion Assistance', 'Refrigerator Restocking', 'Laundry Assistance', 'Linen Refresh', 'Mail Assistance', 'Technology Help', 'Light Organization Support', 'Recovery Check-In Support', 'Conversation & Social Time'],
    addons: [
      { key: 'light_meal_prep_senior', label: 'Light Meal Prep & Kitchen Tidy', minutes: 45, price: 35 },
      { key: 'extended_companionship', label: 'Extended Companionship & Conversation', minutes: 30, price: 25 },
      { key: 'senior_laundry', label: 'Laundry Wash & Fold', minutes: 45, price: 35 },
      { key: 'grocery_senior', label: 'Grocery / Errand Run', minutes: 60, price: 45, requiresFunds: true },
      { key: 'safety_tidy', label: 'Safety-Focused Declutter', minutes: 45, price: 40 },
      { key: 'pet_check', label: 'Pet Check', minutes: 20, price: 35 },
    ],
  },
  {
    key: 'errands',
    label: 'The Runaround',
    category: 'Errands & Concierge',
    baseMinutes: 120,
    minMinutes: 120,
    price: 150,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: false,
    providerPermissions: ['errands'],
    description: 'For the little tasks, pickups, dropoffs, and running around that eats up the day.',
    focusItems: ['Grocery Shopping & Pickup', 'Prescription & Pharmacy Pickup', 'Post Office, Shipping & Returns', 'Dry Cleaning Pickup or Dropoff', 'Donation Dropoff', 'Retail Returns & Exchanges', 'Gift Shopping & Pickup', 'Household Supply Run', 'Pet Supply Pickup', 'Appointment Transportation', 'School Pickup or Dropoff', 'Activity Pickup or Dropoff', 'Local Errand Assistance', 'Help Me Choose — I\'m Overwhelmed'],
    addons: [
      { key: 'grocery_putaway', label: 'Grocery Put-Away & Fridge Organize', minutes: 20, price: 20 },
      { key: 'returns_processing', label: 'Online Returns Processing', minutes: 20, price: 20 },
      { key: 'reset_run', label: 'Reset Run / Supply Shopping', minutes: 45, price: 75, requiresFunds: true },
      { key: 'gift_wrapping', label: 'Gift Shopping + Wrapping', minutes: 45, price: 40 },
      { key: 'post_office', label: 'Post Office / Shipping Dropoff', minutes: 20, price: 15 },
      { key: 'donation_drop', label: 'Donation Station', minutes: 30, price: 45 },
      { key: 'pet_supplies', label: 'Pet Supply Run', minutes: 20, price: 15 },
      { key: 'stocked_up', label: 'Household Supply Restock', minutes: 30, price: 65 },
    ],
  },
  {
    key: 'organization',
    label: 'Room Service',
    category: 'Organization & Decluttering',
    baseMinutes: 120,
    minMinutes: 120,
    price: 150,
    memberHourlyRate: 60,
    nonMemberHourlyRate: 75,
    requiresApproval: false,
    providerPermissions: ['organization'],
    description: 'For spaces that need a reset, not perfection. Calm, methodical, judgment-free organizing support.',
    focusItems: ['Pantry Organization', 'Closet Reset', 'Linen Closet Organization', 'Bathroom Cabinet Organization', 'Under Sink Organization', 'Entryway Reset', 'Mudroom Organization', 'Toy Organization', 'Playroom Reset', 'Kitchen Drawer Organization', 'Refrigerator Organization', 'Paper Sorting', 'Mail Organization', 'Donation Sorting', 'Seasonal Clothing Swap', 'Storage Bin Labeling', 'Office Reset', 'Craft Supply Organization', 'Laundry Room Reset', 'Household Systems Setup'],
    addons: [
      { key: 'closet_comeback', label: 'Closet Comeback', minutes: 90, price: 175 },
      { key: 'pantry_party', label: 'Pantry Party', minutes: 60, price: 95 },
      { key: 'toy_story', label: 'Toy Story', minutes: 60, price: 75 },
      { key: 'paper_trail', label: 'The Paper Trail', minutes: 45, price: 65 },
      { key: 'donation_station', label: 'Donation Station', minutes: 30, price: 45 },
      { key: 'reset_run', label: 'Org Supplies Shopping', minutes: 60, price: 75, requiresFunds: true },
      { key: 'stocked_up', label: 'Household Restock', minutes: 30, price: 65 },
    ],
  },
  {
    key: 'consult',
    label: 'Free Consult Call',
    category: 'Consult',
    baseMinutes: 15,
    minMinutes: 15,
    price: 0,
    memberHourlyRate: 0,
    nonMemberHourlyRate: 0,
    requiresApproval: false,
    providerPermissions: [],
    description: 'A free 15-minute call to choose the right support before booking.',
    focusItems: ['Help Me Choose — I\'m Overwhelmed'],
    addons: [],
  },
];

export const SCHEDULE_NOTIFICATION_RULES = {
  admin: {
    emailEveryScheduleChange: true,
    smsEveryScheduleChange: false,
    email: 'cleanslateclubpa@gmail.com',
    phone: '',
    helper: 'Admin receives an email for every booking or schedule change, including changes made from provider-side workflows.',
  },
  provider: {
    emailOnAssignedScheduleChange: true,
    smsOnAssignedScheduleChange: true,
    helper: 'Providers receive an email and/or text when assigned jobs are created, moved, cancelled, reassigned, or completed.',
  },
  events: [
    'booking_created',
    'booking_confirmed',
    'provider_assigned',
    'provider_changed',
    'booking_rescheduled',
    'time_block_updated',
    'booking_cancelled',
    'booking_completed',
    'payment_link_sent',
  ],
};

export const CAMPAIGN_TEMPLATE_SEEDS = [
  'Booking request received',
  'Booking confirmed',
  'Consult booked',
  'Provider assigned',
  'Visit reminder 24 hours before',
  'Morning-of visit reminder',
  'Final checkout link',
  'Thank you after payment',
  'How was your visit?',
  'Happy birthday',
  'We miss you',
  'Membership invitation',
  'Member welcome',
  'Reschedule confirmation',
  'Cancellation confirmation',
];

export const getServiceMenuItem = (serviceKey) => SERVICE_MENU_DEFAULTS.find(service => service.key === serviceKey);

export const getAddonMenuItem = (serviceKey, addonKey) => {
  const service = getServiceMenuItem(serviceKey);
  return service?.addons?.find(addon => addon.key === addonKey || addon.id === addonKey);
};

export const calculateBackendEstimate = ({ serviceKey, addonKeys = [], isMember = false, extraMinutes = 0 } = {}) => {
  const service = getServiceMenuItem(serviceKey);
  if (!service) return null;

  const selectedAddons = addonKeys
    .map(addonKey => getAddonMenuItem(serviceKey, addonKey))
    .filter(Boolean);

  const addonMinutes = selectedAddons.reduce((sum, addon) => sum + (Number(addon.minutes) || 0), 0);
  const addonPrice = selectedAddons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
  const durationMinutes = Math.max(service.minMinutes || 0, (service.baseMinutes || 0) + addonMinutes + extraMinutes);
  const hourlyRate = isMember ? service.memberHourlyRate : service.nonMemberHourlyRate;
  const hourlyBase = Math.ceil(durationMinutes / 60) * hourlyRate;
  const estimatedServiceTotal = Math.max(service.price || 0, hourlyBase) + addonPrice;

  return {
    serviceKey,
    serviceLabel: service.label,
    durationMinutes,
    addonMinutes,
    addonPrice,
    hourlyRate,
    low: estimatedServiceTotal,
    high: estimatedServiceTotal,
    depositDue: service.price > 0 ? BOOKING_RULES_DEFAULTS.depositAmount : 0,
    selectedAddons,
  };
};
