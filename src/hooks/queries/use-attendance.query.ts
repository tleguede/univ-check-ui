import { AttendanceService } from "@/server/services/attendance.service";
import { Attendance, Course, CreateAttendanceInput, UpdateAttendanceInput } from "@/types/attendance.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const attendanceQueryKeys = {
  attendances: ["attendances"],
  attendance: (id: string) => ["attendance", id],
  professorAttendances: (professorId: string) => ["attendances", "professor", professorId],
  todaysCourses: (professorId: string) => ["courses", "professor", professorId, "today"],
};

export function useAttendancesQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...attendanceQueryKeys.attendances, page, limit],
    queryFn: () => AttendanceService.getAttendances(page, limit),
  });
}

export function useAttendanceQuery(id: string) {
  return useQuery({
    queryKey: attendanceQueryKeys.attendance(id),
    queryFn: () => AttendanceService.getAttendanceById(id),
    enabled: !!id,
  });
}

export function useProfessorAttendancesQuery(professorId: string) {
  return useQuery<Attendance[]>({
    queryKey: attendanceQueryKeys.professorAttendances(professorId),
    queryFn: () => AttendanceService.getProfessorAttendances(professorId),
    enabled: !!professorId,
  });
}

export function useProfessorTodaysCoursesQuery(professorId: string) {
  return useQuery<Course[]>({
    queryKey: attendanceQueryKeys.todaysCourses(professorId),
    queryFn: () => AttendanceService.getProfessorTodaysCourses(professorId),
    enabled: !!professorId,
  });
}

export function useCreateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAttendanceInput) => AttendanceService.createAttendance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendances });
    },
  });
}

export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAttendanceInput) => AttendanceService.updateAttendance(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendance(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendances });
    },
  });
}
