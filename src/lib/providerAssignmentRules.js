import { rankProvidersForBooking } from '@/lib/providerMatching';
import { buildSchedulePreview } from '@/lib/adminScheduleActions';

export const ASSIGNMENT_REASONS = {
  eligible: 'eligible',
  noServicePermission: 'no_service_permission',
  notActive: 'not_active',
  notReady: 'not_ready',
  scheduleConflict: 'schedule_conflict',
  outsideArea: 'outside_area',
};

export const buildAssignmentCandidate = ({ provider, booking, availability = [], existingBlocks = [] } = {}) => {
  const ranked = rankProvidersForBooking({ providers: [provider], booking, availability })[0];

  if (!ranked) {
    return {
      provider,
      canAssign: false,
      score: -1,
      reasons: [ASSIGNMENT_REASONS.notReady],
      conflicts: [],
    };
  }

  const schedulePreview = buildSchedulePreview({ booking, existingBlocks });
  const hasConflicts = schedulePreview.conflicts.length > 0;

  return {
    provider,
    canAssign: ranked.score >= 0 && !hasConflicts,
    score: hasConflicts ? Math.max(0, ranked.score - 50) : ranked.score,
    reasons: hasConflicts ? [ASSIGNMENT_REASONS.scheduleConflict] : [ASSIGNMENT_REASONS.eligible],
    conflicts: schedulePreview.conflicts,
    eligibility: ranked.eligibility,
    hasDayAvailability: ranked.hasDayAvailability,
  };
};

export const getAssignmentCandidates = ({ providers = [], booking = {}, availability = [], existingBlocks = [] } = {}) => (
  providers
    .map(provider => buildAssignmentCandidate({ provider, booking, availability, existingBlocks }))
    .sort((a, b) => b.score - a.score)
);

export const getBestAssignmentCandidate = (args = {}) => getAssignmentCandidates(args).find(candidate => candidate.canAssign) || null;

export const buildAssignmentRecommendation = (args = {}) => {
  const candidates = getAssignmentCandidates(args);
  const best = candidates.find(candidate => candidate.canAssign);

  return {
    best,
    candidates,
    hasAssignableProvider: Boolean(best),
    needsManualReview: !best,
  };
};
