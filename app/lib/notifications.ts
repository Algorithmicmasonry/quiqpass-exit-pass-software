import { supabase } from "supabase/supabase-client";

/**
 * Insert a system notification for a student.
 * Errors are logged but never thrown — notifications are fire-and-forget.
 */
export async function notifyStudent(
  studentId: string,
  message: string,
  passId: string
) {
  const { error } = await supabase.from("notification").insert({
    recipient_id: studentId,
    recipient_type: "student",
    type: "system",
    message,
    pass_id: passId,
    is_read: false,
  });
  if (error) console.error("Failed to notify student:", error);
}

/**
 * Insert a system notification for every staff member with the given role.
 * Errors are logged but never thrown — notifications are fire-and-forget.
 */
export async function notifyStaffByRole(
  role: "DSA" | "CSO",
  message: string,
  passId: string
) {
  const { data: staffList, error: fetchError } = await supabase
    .from("staff")
    .select("id")
    .eq("role", role);

  if (fetchError || !staffList?.length) {
    console.error(`Failed to fetch ${role} staff for notification:`, fetchError);
    return;
  }

  const rows = staffList.map((s) => ({
    recipient_id: s.id,
    recipient_type: "staff" as const,
    type: "system" as const,
    message,
    pass_id: passId,
    is_read: false,
  }));

  const { error: insertError } = await supabase.from("notification").insert(rows);
  if (insertError) console.error(`Failed to notify ${role} staff:`, insertError);
}

/**
 * Fetch a pass record with basic student info attached.
 * Returns null on error.
 */
export async function getPassWithStudent(passId: string) {
  const { data, error } = await supabase
    .from("pass")
    .select("student_id, student:student_id(first_name, last_name, matric_no)")
    .eq("id", passId)
    .single();

  if (error) {
    console.error("Failed to fetch pass for notification:", error);
    return null;
  }
  return data as {
    student_id: string;
    student:
      | { first_name: string; last_name: string; matric_no: string }
      | { first_name: string; last_name: string; matric_no: string }[]
      | null;
  };
}

/**
 * Normalise the student field (Supabase may return object or single-item array).
 */
export function resolveStudent(
  raw:
    | { first_name: string; last_name: string; matric_no: string }
    | { first_name: string; last_name: string; matric_no: string }[]
    | null
) {
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}
