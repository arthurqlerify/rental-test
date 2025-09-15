import { z } from "zod";

// --- Base Schemas for API Responses ---

export const errorSchema = z.object({
  message: z.string(),
});

export const leaseSchema = z.object({
  id: z.string(),
  apartmentId: z.string(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  currentRent: z.string(), // Number as string
  propertyId: z.string(),
  nextActorEmail: z.string().email().optional(),
  moveOutConfirmedAt: z.string().datetime().optional(), // ISO 8601 datetime
  turnoverId: z.string().optional(),
  tenantName: z.string().optional(),
});
export type Lease = z.infer<typeof leaseSchema>;

export const turnoverSchema = z.object({
  id: z.string(),
  leaseId: z.string(),
  apartmentId: z.string(),
  targetReadyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  propertyId: z.string(),
  nextActorEmail: z.string().email().optional(),
  vacatedAt: z.string().datetime().optional(), // ISO 8601 datetime
  keysReturned: z.string(), // Boolean as string ('true'/'false')
  notes: z.string().optional(),
  readyToRentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  listingReady: z.string().optional(), // Boolean as string ('true'/'false')
  marketingEmail: z.string().email().optional(),
  finalInspectionPassedAt: z.string().datetime().optional(), // ISO 8601 datetime
  openWorkOrdersCount: z.string().optional(), // Number as string
  leaseEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  checklist: z.string().optional(),
});
export type Turnover = z.infer<typeof turnoverSchema>;

export const inspectionSchema = z.object({
  id: z.string(),
  turnoverId: z.string(),
  apartmentId: z.string(),
  scheduledAt: z.string().datetime(), // ISO 8601 datetime
  assignedToEmail: z.string().email().optional(),
  inspectorName: z.string(),
  locationNotes: z.string().optional(),
  nextActorEmail: z.string().email().optional(),
  completedAt: z.string().datetime().optional(), // ISO 8601 datetime
  findingsSummary: z.string().optional(),
  hasDamages: z.string(), // Boolean as string ('true'/'false')
  photosUrl: z.string().url().optional(),
  passedAt: z.string().datetime().optional(), // ISO 8601 datetime
  certificateUrl: z.string().url().optional(),
  checklist: z.string().optional(),
});
export type Inspection = z.infer<typeof inspectionSchema>;

export const renovationReportSchema = z.object({
  id: z.string(),
  turnoverId: z.string(),
  inspectionId: z.string(),
  apartmentId: z.string(),
  damageSeverity: z.enum(["low", "medium", "high"]), // Example values
  estimatedRepairCost: z.string(), // Number as string
  damageSummary: z.string(),
  nextActorEmail: z.string().email().optional(),
});
export type RenovationReport = z.infer<typeof renovationReportSchema>;

export const renovationCaseSchema = z.object({
  id: z.string(),
  turnoverId: z.string(),
  apartmentId: z.string(),
  requestedLevels: z.string().optional(), // Comma-separated string e.g., "good,better"
  scopeNotes: z.string().optional(),
  targetReadyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  nextActorEmail: z.string().email().optional(),
  costGood: z.string().optional(), // Number as string
  costBetter: z.string().optional(), // Number as string
  costPremium: z.string().optional(), // Number as string
  leadDaysGood: z.string().optional(), // Number as string
  leadDaysBetter: z.string().optional(), // Number as string
  leadDaysPremium: z.string().optional(), // Number as string
  selectedLevel: z.enum(["good", "better", "premium"]).optional(),
  budgetApproved: z.string().optional(), // Boolean as string ('true'/'false')
  expectedCompletionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  currentRent: z.string().optional(), // Number as string
  projectedRent: z.string().optional(), // Number as string
  decisionReason: z.string().optional(),
});
export type RenovationCase = z.infer<typeof renovationCaseSchema>;

export const workOrderSchema = z.object({
  id: z.string(),
  renovationCaseId: z.string(),
  turnoverId: z.string(),
  apartmentId: z.string(),
  scopeSummary: z.string(),
  accessDetails: z.string().optional(),
  materialsList: z.string(),
  nextActorEmail: z.string().email().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  crewName: z.string(),
  assignedToEmail: z.string().email(),
  materialsReady: z.string().optional(), // Boolean as string ('true'/'false')
  actualStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  actualEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
  completionNotes: z.string().optional(),
  photosUrl: z.string().url().optional(),
  varianceNotes: z.string().optional(),
});
export type WorkOrder = z.infer<typeof workOrderSchema>;

export const apartmentSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  unitNumber: z.string(),
  floorAreaSqm: z.string(), // Number as string
  bedrooms: z.string(), // Number as string
  status: z.string(), // Example: "Occupied", "Vacant", "UnderRenovation"
});
export type Apartment = z.infer<typeof apartmentSchema>;

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  managerName: z.string(),
  managerEmail: z.string().email(),
  unitsCount: z.string(), // Number as string
});
export type Property = z.infer<typeof propertySchema>;

// --- Request Schemas for Form Validation ---

export const scheduleLeaseEndRequestSchema = z.object({
  id: z.string().min(1, "Lease ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format, expected YYYY-MM-DD"),
  noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid notice date format, expected YYYY-MM-DD"),
  currentRent: z.string().min(1, "Current rent is required").regex(/^\d+$/, "Rent must be a number string"),
  propertyId: z.string().min(1, "Property ID is required"),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type ScheduleLeaseEndRequest = z.infer<typeof scheduleLeaseEndRequestSchema>;

export const createTurnoverRequestSchema = z.object({
  leaseId: z.string().min(1, "Lease ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  targetReadyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid target ready date format, expected YYYY-MM-DD"),
  propertyId: z.string().min(1, "Property ID is required"),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type CreateTurnoverRequest = z.infer<typeof createTurnoverRequestSchema>;

export const scheduleInspectionRequestSchema = z.object({
  turnoverId: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  scheduledAt: z.string().datetime("Invalid scheduled date/time format, expected ISO 8601"),
  assignedToEmail: z.string().email().optional().or(z.literal("")),
  locationNotes: z.string().optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type ScheduleInspectionRequest = z.infer<typeof scheduleInspectionRequestSchema>;

export const markLeaseEndedRequestSchema = z.object({
  id: z.string().min(1, "Lease ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format, expected YYYY-MM-DD"),
  moveOutConfirmedAt: z.string().datetime("Invalid move-out confirmed date/time format, expected ISO 8601"),
  turnoverId: z.string().min(1, "Turnover ID is required"),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type MarkLeaseEndedRequest = z.infer<typeof markLeaseEndedRequestSchema>;

export const recordApartmentVacatedRequestSchema = z.object({
  id: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  vacatedAt: z.string().datetime("Invalid vacated date/time format, expected ISO 8601"),
  keysReturned: z.string().regex(/^(true|false)$/, "Keys Returned must be 'true' or 'false'"),
  notes: z.string().optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type RecordApartmentVacatedRequest = z.infer<typeof recordApartmentVacatedRequestSchema>;

export const completeInspectionRequestSchema = z.object({
  id: z.string().min(1, "Inspection ID is required"),
  turnoverId: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  completedAt: z.string().datetime("Invalid completed date/time format, expected ISO 8601"),
  findingsSummary: z.string().min(1, "Findings summary is required"),
  hasDamages: z.string().regex(/^(true|false)$/, "Has Damages must be 'true' or 'false'"),
  photosUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type CompleteInspectionRequest = z.infer<typeof completeInspectionRequestSchema>;

export const createRenovationReportRequestSchema = z.object({
  turnoverId: z.string().min(1, "Turnover ID is required"),
  inspectionId: z.string().min(1, "Inspection ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  damageSeverity: z.enum(["low", "medium", "high"], { message: "Invalid damage severity" }),
  estimatedRepairCost: z.string().min(1, "Estimated repair cost is required").regex(/^\d+$/, "Cost must be a number string"),
  damageSummary: z.string().min(1, "Damage summary is required"),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type CreateRenovationReportRequest = z.infer<typeof createRenovationReportRequestSchema>;

export const requestRenovationEstimateRequestSchema = z.object({
  turnoverId: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  requestedLevels: z.string().optional(), // "good,better,premium"
  scopeNotes: z.string().optional(),
  targetReadyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid target ready date format, expected YYYY-MM-DD").optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type RequestRenovationEstimateRequest = z.infer<typeof requestRenovationEstimateRequestSchema>;

export const provideRenovationEstimateRequestSchema = z.object({
  id: z.string().min(1, "Renovation Case ID is required"),
  costGood: z.string().min(1, "Cost (Good) is required").regex(/^\d+$/, "Cost must be a number string").optional().or(z.literal("")),
  costBetter: z.string().min(1, "Cost (Better) is required").regex(/^\d+$/, "Cost must be a number string").optional().or(z.literal("")),
  costPremium: z.string().min(1, "Cost (Premium) is required").regex(/^\d+$/, "Cost must be a number string").optional().or(z.literal("")),
  leadDaysGood: z.string().min(1, "Lead Days (Good) is required").regex(/^\d+$/, "Lead days must be a number string").optional().or(z.literal("")),
  leadDaysBetter: z.string().min(1, "Lead Days (Better) is required").regex(/^\d+$/, "Lead days must be a number string").optional().or(z.literal("")),
  leadDaysPremium: z.string().min(1, "Lead Days (Premium) is required").regex(/^\d+$/, "Lead days must be a number string").optional().or(z.literal("")),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type ProvideRenovationEstimateRequest = z.infer<typeof provideRenovationEstimateRequestSchema>;

export const selectRenovationPlanRequestSchema = z.object({
  id: z.string().min(1, "Renovation Case ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  selectedLevel: z.enum(["good", "better", "premium"], { message: "Please select a renovation level" }),
  budgetApproved: z.string().regex(/^(true|false)$/, "Budget Approved must be 'true' or 'false'"),
  expectedCompletionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid completion date format, expected YYYY-MM-DD"),
  projectedRent: z.string().min(1, "Projected rent is required").regex(/^\d+$/, "Projected rent must be a number string"),
  decisionReason: z.string().optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type SelectRenovationPlanRequest = z.infer<typeof selectRenovationPlanRequestSchema>;

export const createWorkOrderRequestSchema = z.object({
  renovationCaseId: z.string().min(1, "Renovation Case ID is required"),
  turnoverId: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  scopeSummary: z.string().min(1, "Scope summary is required"),
  accessDetails: z.string().optional(),
  materialsList: z.string().min(1, "Materials list is required"),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type CreateWorkOrderRequest = z.infer<typeof createWorkOrderRequestSchema>;

export const scheduleWorkOrderRequestSchema = z.object({
  id: z.string().min(1, "Work Order ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format, expected YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format, expected YYYY-MM-DD"),
  crewName: z.string().min(1, "Crew name is required"),
  assignedToEmail: z.string().email("Invalid email format").min(1, "Assigned to email is required"),
  materialsReady: z.string().regex(/^(true|false)$/, "Materials Ready must be 'true' or 'false'").optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type ScheduleWorkOrderRequest = z.infer<typeof scheduleWorkOrderRequestSchema>;

export const completeWorkOrderRequestSchema = z.object({
  id: z.string().min(1, "Work Order ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  actualStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid actual start date format, expected YYYY-MM-DD"),
  actualEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid actual end date format, expected YYYY-MM-DD"),
  completionNotes: z.string().min(1, "Completion notes are required"),
  photosUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  varianceNotes: z.string().optional(),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type CompleteWorkOrderRequest = z.infer<typeof completeWorkOrderRequestSchema>;

export const passFinalInspectionRequestSchema = z.object({
  id: z.string().min(1, "Inspection ID is required"),
  turnoverId: z.string().min(1, "Turnover ID is required"),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  passedAt: z.string().datetime("Invalid passed date/time format, expected ISO 8601"),
  inspectorName: z.string().min(1, "Inspector name is required"),
  certificateUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  nextActorEmail: z.string().email().optional().or(z.literal("")),
});
export type PassFinalInspectionRequest = z.infer<typeof passFinalInspectionRequestSchema>;

export const completeTurnoverRequestSchema = z.object({
  id: z.string().min(1, "Turnover ID is required"),
  readyToRentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid ready to rent date format, expected YYYY-MM-DD"),
  listingReady: z.string().regex(/^(true|false)$/, "Listing Ready must be 'true' or 'false'").optional(),
  marketingEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  apartmentId: z.string().min(1, "Apartment ID is required"),
  notes: z.string().optional(),
});
export type CompleteTurnoverRequest = z.infer<typeof completeTurnoverRequestSchema>;

export const createPropertyRequestSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  managerName: z.string().min(1, "Manager name is required"),
  managerEmail: z.string().email("Invalid email format").min(1, "Manager email is required"),
  unitsCount: z.string().min(1, "Units count is required").regex(/^\d+$/, "Units count must be a number string"),
});
export type CreatePropertyRequest = z.infer<typeof createPropertyRequestSchema>;

export const createApartmentRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  floorAreaSqm: z.string().min(1, "Floor area is required").regex(/^\d+$/, "Floor area must be a number string"),
  bedrooms: z.string().min(1, "Bedrooms count is required").regex(/^\d+$/, "Bedrooms must be a number string"),
  status: z.string().min(1, "Status is required"),
});
export type CreateApartmentRequest = z.infer<typeof createApartmentRequestSchema>;