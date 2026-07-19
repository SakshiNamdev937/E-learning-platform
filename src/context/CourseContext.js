import React, { createContext, useState, useEffect } from 'react';
import mockCourses from '../data/courses.json';
import mockInstructors from '../data/instructors.json';
import mockCategories from '../data/categories.json';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const localCourses = localStorage.getItem('edusphere_courses');
    return localCourses ? JSON.parse(localCourses) : mockCourses;
  });

  const [instructors] = useState(mockInstructors);
  const [categories] = useState(mockCategories);

  useEffect(() => {
    localStorage.setItem('edusphere_courses', JSON.stringify(courses));
  }, [courses]);

  const getCourseById = (id) => {
    return courses.find(c => c.id === id);
  };

  const getInstructorById = (id) => {
    return instructors.find(i => i.id === id);
  };

  const addCourse = (courseData) => {
    const newCourse = {
      id: `course_${Date.now()}`,
      title: courseData.title,
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      banner: courseData.banner || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      category: courseData.category,
      level: courseData.level || 'All Levels',
      duration: courseData.duration || '10 hours',
      lessonsCount: parseInt(courseData.lessonsCount) || 12,
      price: parseFloat(courseData.price) || 0,
      originalPrice: courseData.originalPrice ? parseFloat(courseData.originalPrice) : undefined,
      instructorId: courseData.instructorId || 'inst_1',
      rating: 5.0,
      ratingCount: 0,
      studentCount: 0,
      status: courseData.status || 'Draft',
      tags: courseData.tags || [],
      learningOutcomes: courseData.learningOutcomes || [],
      requirements: courseData.requirements || [],
      curriculum: courseData.curriculum || [
        {
          sectionTitle: "Section 1: Foundations",
          lessons: [
            { "title": "Introduction to the Course", "duration": "05:00", "isPreview": true }
          ]
        }
      ],
      reviews: []
    };

    setCourses(prev => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (courseId, updatedData) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          ...updatedData,
          // Format numeric values
          price: parseFloat(updatedData.price) || 0,
          originalPrice: updatedData.originalPrice ? parseFloat(updatedData.originalPrice) : undefined,
          lessonsCount: parseInt(updatedData.lessonsCount) || c.lessonsCount
        };
      }
      return c;
    }));
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const addReview = (courseId, reviewData) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const newReview = {
          id: `rev_${Date.now()}`,
          userName: reviewData.userName,
          userAvatar: reviewData.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          rating: reviewData.rating,
          comment: reviewData.comment,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [newReview, ...(c.reviews || [])];
        const ratingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = parseFloat((ratingSum / updatedReviews.length).toFixed(1));

        return {
          ...c,
          reviews: updatedReviews,
          rating: newRating,
          ratingCount: updatedReviews.length
        };
      }
      return c;
    }));
  };

  return (
    <CourseContext.Provider value={{
      courses,
      instructors,
      categories,
      getCourseById,
      getInstructorById,
      addCourse,
      updateCourse,
      deleteCourse,
      addReview
    }}>
      {children}
    </CourseContext.Provider>
  );
};
