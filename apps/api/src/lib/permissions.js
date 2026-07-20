/**
 * SKILLYARDS AUTHORIZATION POLICY ENGINE
 * 
 * Centralized logic for resource access control.
 * Rules:
 * - ADMIN, MANAGER: Full system access.
 * - SALES, HR, DEVELOPER: Scoped access.
 * - STUDENT: Ownership-based access (Self only).
 */

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SALES: "SALES",
  HR: "HR",
  DEVELOPER: "DEVELOPER",
  DIGITAL_MARKETER: "DIGITAL_MARKETER",
  OUTSIDE_SALES: "OUTSIDE_SALES",
  STUDENT: "STUDENT",
};

/**
 * Checks if a user has access to a specific receipt.
 * @param {Object} session User session payload (userId, role)
 * @param {Object} payment Payment record from DB
 * @returns {{ authorized: boolean, reason: string }}
 */
export function canAccessReceipt(session, payment) {
  const { role, userId } = session;

  // 1. ADMIN/MANAGER: Master override
  if ([ROLES.ADMIN, ROLES.MANAGER].includes(role)) {
    return { authorized: true, reason: "ADMIN_OVERRIDE" };
  }

  // 2. STUDENT: Ownership check
  // Note: payment.studentId is the UUID of the student record
  if (role === ROLES.STUDENT && payment.studentId === userId) {
    return { authorized: true, reason: "OWNERSHIP_ACCESS" };
  }

  // 3. SALES: Explicitly restricted in V1 (until assignment logic is implemented)
  if (role === ROLES.SALES) {
    return { authorized: false, reason: "SALES_UNASSIGNED_DENY" };
  }

  // 4. Default Deny
  return { authorized: false, reason: `ROLE_RESTRICTED_${role}` };
}

/**
 * Checks if a user has access to a specific student's record.
 * @param {Object} session User session
 * @param {Object} student Student record
 */
export function canAccessStudent(session, student) {
  const { role, userId } = session;

  if ([ROLES.ADMIN, ROLES.MANAGER].includes(role)) {
    return { authorized: true, reason: "ADMIN_OVERRIDE" };
  }

  // If no specific student (e.g. LIST or CREATE), check role only
  if (!student) {
    if ([ROLES.ADMIN, ROLES.MANAGER].includes(role)) return { authorized: true, reason: "ADMIN_OVERRIDE" };
    return { authorized: false, reason: `ROLE_RESTRICTED_LIST_${role}` };
  }

  if (role === ROLES.STUDENT && student.id === userId) {
    return { authorized: true, reason: "OWNERSHIP_ACCESS" };
  }

  // SALES: Explicitly restricted for now
  if (role === ROLES.SALES) {
    return { authorized: false, reason: "SALES_UNASSIGNED_DENY" };
  }

  return { authorized: false, reason: `ROLE_RESTRICTED_${role}` };
}

/**
 * PUBLIC ACCESS POLICY
 */
export function publicAllow() {
  return { authorized: true, reason: "PUBLIC_ROUTE_ALLOW" };
}

/**
 * Checks if a user has access to enquiries (Leads).
 * Basically Admin/Manager only.
 */
export function canAccessEnquiry(session) {
  const { role } = session;
  if ([ROLES.ADMIN, ROLES.MANAGER].includes(role)) {
    return { authorized: true, reason: "ADMIN_OVERRIDE" };
  }
  return { authorized: false, reason: `ROLE_RESTRICTED_${role}` };
}

/**
 * INTERNAL SERVICE ONLY POLICY
 * Validates a shared secret in headers. No session required.
 */
export function internalServiceOnly(session, resource, req) {
  const authKey = req.headers.get("x-internal-key");
  const expectedKey = process.env.PDF_SERVICE_API_KEY;
  
  if (authKey && authKey === expectedKey) {
    return { authorized: true, reason: "INTERNAL_KEY_VALID" };
  }
  
  return { authorized: false, reason: "INTERNAL_KEY_INVALID" };
}

/**
 * Checks if a user can access the assessment system.
 * Admin/Manager or any authenticated STUDENT.
 */
export function canAccessAssessment(session) {
  const { role } = session;
  if ([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT].includes(role)) {
    return { authorized: true, reason: "AUTHORIZED_ROLE" };
  }
  return { authorized: false, reason: `ROLE_RESTRICTED_${role}` };
}
