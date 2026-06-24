import { BOOKING_TEMPLATE_SEEDS } from '@/lib/bookingTemplateSeeds';
import { FORM_TEMPLATE_SEEDS } from '@/lib/formTemplates';

export const TEMPLATE_SEED_GROUPS = {
  booking: BOOKING_TEMPLATE_SEEDS,
  forms: FORM_TEMPLATE_SEEDS,
};

export const getTemplateSeeds = (groupKey) => {
  if (!groupKey) return Object.values(TEMPLATE_SEED_GROUPS).flat();
  return TEMPLATE_SEED_GROUPS[groupKey] || [];
};

export const findTemplateSeed = (templateKey) => getTemplateSeeds().find(template => template.key === templateKey) || null;
