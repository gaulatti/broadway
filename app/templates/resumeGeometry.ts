/** One preview pixel equals one PDF point on the 612 × 792 Letter canvas. */
export const RESUME_PAGE = {
  width: 612,
  height: 792,
  primarySidebarWidth: 190,
  secondarySidebarWidth: 185,
  top: 46,
  primaryBottom: 38,
  secondaryBottom: 40,
  primaryRight: 42,
  secondaryRight: 42
} as const;

export const RESUME_TYPE = {
  name: {
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: -0.6,
    lineHeight: 0.98,
    marginBottom: 6
  },
  role: { fontSize: 10, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.2 },
  company: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 0.2,
    lineHeight: 1.2
  },
  bullet: { fontSize: 8.5, lineHeight: 1.45 },
  spotlightTitle: {
    fontSize: 8.6,
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: 2
  },
  spotlightMetric: {
    fontSize: 9.2,
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: 2
  },
  spotlightImpact: { fontSize: 8, lineHeight: 1.4 },
  section: { fontSize: 9, fontWeight: 500, letterSpacing: 2 },
  sidebarHeading: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 1.4,
    marginBottom: 6
  },
  sidebarGroup: {
    fontSize: 7.5,
    fontWeight: 500,
    letterSpacing: 0.2,
    marginBottom: 3
  },
  sidebarText: { fontSize: 7, lineHeight: 1.35 },
  intro: { fontSize: 8, lineHeight: 1.45, marginBottom: 20 }
} as const;

export const RESUME_CARD = {
  verticalPadding: 6,
  horizontalPadding: 4,
  gap: 6,
  spotlightVerticalPadding: 6,
  spotlightHorizontalPadding: 8
} as const;
