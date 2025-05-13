import { CourseService } from "@/server/services/course.service";
import { Course, CreateCourseInput, UpdateCourseInput } from "@/types/course.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const coursesQueryKeys = {
  courses: ["courses"],
  course: (id: string) => ["course", id],
};

export function useCoursesQuery() {
  return useQuery<Course[]>({
    queryKey: coursesQueryKeys.courses,
    queryFn: () => CourseService.getCourses(),
  });
}

export function useCourseQuery(id: string) {
  return useQuery<Course>({
    queryKey: coursesQueryKeys.course(id),
    queryFn: () => CourseService.getCourseById(id),
    enabled: !!id,
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => CourseService.createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.courses });
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCourseInput) => CourseService.updateCourse(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.course(data.id) });
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.courses });
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CourseService.deleteCourse(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: coursesQueryKeys.course(id) });
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.courses });
    },
  });
}