import { useJson } from '@/src/hooks/useJson';
import { TCourse, TLesson } from '@/src/types/education';

class CourseService {
  useCourse(courseSlug: string | undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useJson<TCourse>(`/api/course/${courseSlug}`);
  }

  /**
   * Finds next lesson to which user can navigate.
   *
   * @param course
   * @param currentLesson Slug of the current lesson.
   */
  nextLesson(course: TCourse, currentLesson: string) {
    return this.findSiblingLesson(course, currentLesson, 1);
  }

  /**
   * Finds previous lesson to which user can navigate.
   *
   * @param course
   * @param currentLesson Slug of the current lesson.
   */
  prevLesson(course: TCourse, currentLesson: string) {
    return this.findSiblingLesson(course, currentLesson, -1);
  }

  private findSiblingLesson(course: TCourse, currentLesson: string, delta: number) {
    // start by collecting all the lessons in the course (depth first)
    let lessons = course.lessons;
    for (let lesson of lessons) {
      if (lesson.children) {
        lessons = lessons.concat(lesson.children);
      }
    }
    // filter out lessons without content
    lessons = lessons.filter(l => !!l.content);

    const currentLessonIndex = lessons.findIndex(l => l.slug === currentLesson);
    return lessons[currentLessonIndex + delta];
  }
}

export const courseService = new CourseService();
