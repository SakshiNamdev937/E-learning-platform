import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { CourseContext } from '../context/CourseContext';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { RatingStars } from '../components/RatingStars';
import { 
  BookOpen, Award, Clock, Heart, PlayCircle, ExternalLink, 
  CheckCircle2, ChevronRight, X, Play, BookOpenCheck, Calendar, Trophy,
  Star
} from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser, updateCourseProgress, users } = useAuth();
  const { courses, instructors } = useContext(CourseContext);
  const { wishlist, toggleWishlist } = useWishlist();

  // Selected course for the active player modal
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  if (!currentUser) return null;

  // Retrieve full course details for enrolled IDs
  const enrolledCoursesWithDetails = (currentUser.enrolledCourses || []).map(enrolled => {
    const course = courses.find(c => c.id === enrolled.courseId);
    return {
      ...enrolled,
      courseDetails: course
    };
  }).filter(item => item.courseDetails !== undefined); // filter out deleted courses

  // Calculate statistics
  const totalEnrolled = enrolledCoursesWithDetails.length;
  const completedCount = enrolledCoursesWithDetails.filter(c => c.progress >= 100).length;
  const certificatesCount = currentUser.certificates?.length || 0;

  // Generate recommended courses (excluding enrolled ones)
  const recommendedCourses = courses
    .filter(c => c.status === 'Published' && !(currentUser.enrolledCourses || []).some(ec => ec.courseId === c.id))
    .slice(0, 3);

  // Retrieve course items in wishlist
  const wishlistedCourses = courses.filter(c => wishlist.includes(c.id));

  // Resume course / Open Course Player Modal
  const openCoursePlayer = (courseId) => {
    setActiveCourseId(courseId);
    setActiveSectionIndex(0);
    setActiveLessonIndex(0);
  };

  const activeCourseItem = enrolledCoursesWithDetails.find(c => c.courseId === activeCourseId);

  // Mark lesson as complete & update overall progress
  const toggleLessonComplete = (secIdx, lesIdx) => {
    if (!activeCourseItem) return;
    const details = activeCourseItem.courseDetails;
    
    // Create a composite key or keep track of ticks. 
    // In our mock model, let's calculate progress based on sections/lessons count.
    // Let's assume each section and lesson has a weight.
    const totalLessons = details.curriculum.reduce((sum, sec) => sum + sec.lessons.length, 0);
    
    // For mock simplicity, let's increment progress:
    // If they complete a lesson, we recalculate progress percentage.
    // If they check it, we bump progress.
    const currentProgress = activeCourseItem.progress;
    const increment = Math.ceil(100 / totalLessons);
    const newProgress = Math.min(currentProgress + increment, 100);

    updateCourseProgress(activeCourseId, newProgress);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-primary-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-3 relative text-center md:text-left">
          <Badge className="bg-primary-950 text-primary-300 border-primary-800 font-bold uppercase tracking-wider py-1 px-3.5">
            Student workspace
          </Badge>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Welcome Back, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-primary-100 max-w-md">
            You're making outstanding progress. Jump back into your last lecture and continue leveling up your skillset.
          </p>
        </div>
        
        {/* Floating statistics summary card */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg relative max-w-sm w-full md:w-auto">
          <div className="h-10 w-10 rounded-lg bg-white/20 text-white flex items-center justify-center flex-shrink-0">
            <Trophy className="h-5.5 w-5.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-left leading-tight text-white">
            <p className="text-xs font-bold">Academic Status</p>
            <span className="text-[10px] text-primary-100 font-medium">
              Completed {completedCount} of {totalEnrolled} courses
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stat Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Enrolled Tracks", value: totalEnrolled, desc: "Active learning grids", icon: BookOpenCheck, color: "text-primary-600 bg-primary-50 border-primary-100" },
          { label: "Completed Courses", value: completedCount, desc: "100% video checks completed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Certificates Earned", value: certificatesCount, desc: "Secured credentials", icon: Award, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Wishlist Courses", value: wishlistedCourses.length, desc: "Saved to learn later", icon: Heart, color: "text-rose-600 bg-rose-50 border-rose-100" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-neutral-200/80 shadow-premium">
              <CardBody className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">{stat.label}</p>
                  <h3 className="font-heading font-extrabold text-2xl text-neutral-900 leading-tight mt-0.5">{stat.value}</h3>
                  <span className="text-[10px] text-neutral-400 mt-1 block font-medium">{stat.desc}</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Dashboard Layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Active Enrolls (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-primary-600" />
              <span>Your Enrolled Curriculums</span>
            </h3>
            <span className="text-xs text-neutral-500 font-medium">{enrolledCoursesWithDetails.length} Total</span>
          </div>

          {enrolledCoursesWithDetails.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center space-y-4 max-w-sm mx-auto shadow-sm">
              <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-900">No Enrolled Courses</h4>
              <p className="text-xs text-neutral-500">
                You haven't enrolled in any curriculum tracks yet. Browse the catalog to start learning.
              </p>
              <Link to="/courses">
                <Button size="sm">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCoursesWithDetails.map((item) => {
                const course = item.courseDetails;
                const instructor = instructors.find(i => i.id === course.instructorId);
                return (
                  <Card key={item.courseId} className="border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <CardBody className="p-4 flex flex-col sm:flex-row items-center gap-4 text-left">
                      <div className="w-full sm:w-36 aspect-video rounded-lg overflow-hidden border border-neutral-100 flex-shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow space-y-3 w-full">
                        <div>
                          <Badge variant="primary" className="text-[9px] py-0.5 px-2 mb-1.5">{course.category}</Badge>
                          <h4 className="font-heading font-bold text-sm text-neutral-900 leading-snug line-clamp-1">{course.title}</h4>
                          {instructor && <p className="text-[10px] text-neutral-400 mt-0.5">By {instructor.name}</p>}
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-neutral-500">Curriculum Progress</span>
                            <span className="text-primary-600">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200/30">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-4 pt-1.5">
                          <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Last accessed: {item.lastAccessed}
                          </span>
                          <Button 
                            size="sm" 
                            onClick={() => openCoursePlayer(course.id)}
                            iconRight={<ChevronRight className="h-3.5 w-3.5" />}
                          >
                            {item.progress >= 100 ? 'Review Lectures' : 'Resume Course'}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Certificates Grid list */}
          {currentUser.certificates?.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-amber-500" />
                  <span>Your Academic Certificates</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.certificates.map((cert) => {
                  const course = courses.find(c => c.id === cert.courseId);
                  if (!course) return null;
                  return (
                    <Card key={cert.id} className="border-neutral-200 bg-gradient-to-br from-white to-amber-50/20 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/10 rounded-full -mr-6 -mt-6 blur-lg" />
                      <CardBody className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <Award className="h-8 w-8 text-amber-500 flex-shrink-0" />
                          <Badge variant="warning" className="text-[9px] px-2 py-0.5">Verified</Badge>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs text-neutral-900 leading-snug line-clamp-1">{course.title}</h4>
                          <span className="text-[10px] text-neutral-400 mt-1 block">Issued on: {cert.issueDate}</span>
                        </div>
                        <a 
                          href="#download" 
                          className="inline-flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 font-bold hover:underline"
                        >
                          <span>View Certificate</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Recommendations & Saved Wishlist */}
        <div className="space-y-8">
          
          {/* Wishlisted Courses */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-rose-500" />
              <span>Saved Wishlist ({wishlistedCourses.length})</span>
            </h3>

            {wishlistedCourses.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No courses saved to your wishlist yet.</p>
            ) : (
              <div className="space-y-3">
                {wishlistedCourses.map(wc => (
                  <div key={wc.id} className="bg-white border border-neutral-200/80 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow transition-shadow">
                    <img src={wc.thumbnail} alt={wc.title} className="w-16 h-12 object-cover rounded-lg border border-neutral-100 flex-shrink-0" />
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <Link to={`/courses/${wc.id}`} className="block">
                        <h4 className="text-xs font-bold text-neutral-800 truncate hover:text-primary-600 leading-tight">
                          {wc.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between gap-4 mt-1">
                        <span className="text-xs font-extrabold text-neutral-900">${wc.price}</span>
                        <button 
                          onClick={() => toggleWishlist(wc.id)}
                          className="text-[10px] text-rose-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Courses list */}
          {recommendedCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                Recommended For You
              </h3>

              <div className="space-y-3.5">
                {recommendedCourses.map(rc => (
                  <Link key={rc.id} to={`/courses/${rc.id}`} className="group bg-white border border-neutral-200 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow transition-shadow">
                    <img src={rc.thumbnail} alt={rc.title} className="w-16 h-12 object-cover rounded-lg border border-neutral-100 flex-shrink-0" />
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 group-hover:text-primary-600 line-clamp-1 leading-tight">
                          {rc.title}
                        </h4>
                        <span className="text-[9px] text-neutral-400 mt-0.5 block">{rc.category}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-neutral-900">${rc.price}</span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span className="text-[10px] text-neutral-700 font-bold">{rc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. Fullscreen Course Player Modal */}
      {activeCourseId && activeCourseItem && (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <header className="bg-neutral-900 border-b border-neutral-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm leading-none">{activeCourseItem.courseDetails.title}</h3>
                <span className="text-[10px] text-neutral-400 mt-1 block">Course player dashboard</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveCourseId(null)}
              className="p-2 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="h-5.5 w-5.5" />
            </button>
          </header>

          {/* Player Grid splits */}
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Left: Video Player Box */}
            <div className="flex-grow bg-neutral-950 flex flex-col justify-center p-4 relative">
              <div className="aspect-video max-w-4xl w-full mx-auto bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800/80 flex items-center justify-center relative group">
                <img 
                  src={activeCourseItem.courseDetails.banner} 
                  alt="video screen" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30" 
                />
                
                {/* Floating Play center widget */}
                <div className="relative text-center space-y-4">
                  <Play className="h-16 w-16 text-primary-500 fill-primary-500 p-4 bg-white rounded-full shadow-lg mx-auto cursor-pointer transform hover:scale-105 transition-transform" />
                  <p className="text-xs font-semibold text-neutral-300">
                    Playing: {activeCourseItem.courseDetails.curriculum[activeSectionIndex]?.lessons[activeLessonIndex]?.title || 'Introduction'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Course Curriculum Drawer (Fixed width) */}
            <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900 text-white flex flex-col">
              
              {/* Drawer Top Stats */}
              <div className="p-4 border-b border-neutral-800 space-y-2 bg-neutral-900/50">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Course Progress</span>
                  <span>{activeCourseItem.progress}% Complete</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-500 h-full" style={{ width: `${activeCourseItem.progress}%` }} />
                </div>
              </div>

              {/* Drawer Syllabus list */}
              <div className="flex-grow overflow-y-auto custom-scrollbar divide-y divide-neutral-800/80 p-2 space-y-3">
                {activeCourseItem.courseDetails.curriculum.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-1.5 pt-2 first:pt-0">
                    <h4 className="text-xs font-extrabold text-neutral-400 px-2 leading-tight uppercase tracking-wider">
                      {section.sectionTitle}
                    </h4>
                    <div className="space-y-1">
                      {section.lessons.map((lesson, lIdx) => {
                        const isActive = activeSectionIndex === sIdx && activeLessonIndex === lIdx;
                        return (
                          <button
                            key={lIdx}
                            onClick={() => {
                              setActiveSectionIndex(sIdx);
                              setActiveLessonIndex(lIdx);
                            }}
                            className={`
                              w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between gap-3 transition-colors
                              ${isActive ? 'bg-primary-600 text-white font-semibold' : 'text-neutral-300 hover:bg-neutral-800'}
                            `}
                          >
                            <span className="truncate">{lesson.title}</span>
                            
                            {/* Complete lesson trigger button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(sIdx, lIdx);
                              }}
                              className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-emerald-500 flex-shrink-0"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
