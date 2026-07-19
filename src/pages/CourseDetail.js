import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { RatingStars } from '../components/RatingStars';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { 
  PlayCircle, Clock, Heart, Award, ArrowLeft, Star, 
  HelpCircle, ChevronDown, ChevronUp, Check, ShieldAlert,
  Share2, FileText, Infinity, Smartphone, Send
} from 'lucide-react';

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, getInstructorById, courses, addReview } = useContext(CourseContext);
  const { currentUser, enrollInCourse, isAuthenticated } = useAuth();
  const { toggleWishlist, inWishlist } = useWishlist();

  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [activeSections, setActiveSections] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const foundCourse = getCourseById(id);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundInst = getInstructorById(foundCourse.instructorId);
      setInstructor(foundInst);
      
      // Auto expand first section by default
      if (foundCourse.curriculum?.length > 0) {
        setActiveSections({ 0: true });
      }
    }
  }, [id, getCourseById, getInstructorById]);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 font-heading">Course Not Found</h2>
        <p className="text-sm text-neutral-500">The course you are attempting to access does not exist.</p>
        <Link to="/courses">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = currentUser?.enrolledCourses?.some(c => c.courseId === course.id);
  const isWishlisted = inWishlist(course.id);

  const toggleSection = (index) => {
    setActiveSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${course.id}`);
      return;
    }

    if (isEnrolled) {
      navigate('/dashboard');
    } else {
      enrollInCourse(course.id);
      navigate('/dashboard');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (reviewComment.trim()) {
      addReview(course.id, {
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        rating: reviewRating,
        comment: reviewComment
      });

      // Reload course state
      setCourse(getCourseById(course.id));
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Get related courses (same category, excluding current course)
  const relatedCourses = courses
    .filter(c => c.category === course.category && c.id !== course.id && c.status === 'Published')
    .slice(0, 3);

  return (
    <div className="space-y-10 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-neutral-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Catalog</span>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" className="bg-primary-950 text-primary-400 border-primary-900">
                {course.category}
              </Badge>
              <Badge variant="neutral" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                {course.level}
              </Badge>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight text-white max-w-3xl">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {course.subtitle}
            </p>

            {/* Ratings and Stats */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-300 pt-2 font-semibold">
              <div className="flex items-center gap-1">
                <RatingStars rating={course.rating} size="sm" />
                <span className="text-amber-400 font-bold">{course.rating}</span>
                <span className="text-neutral-400">({course.ratingCount} reviews)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span>{course.studentCount.toLocaleString()} students enrolled</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span>Last updated July 2026</span>
            </div>

            {/* Instructor credit */}
            {instructor && (
              <div className="flex items-center gap-2 pt-2">
                <Avatar src={instructor.avatar} name={instructor.name} size="xs" />
                <p className="text-xs text-neutral-300 font-medium">
                  Created by <span className="text-primary-400 font-bold">{instructor.name}</span> ({instructor.designation})
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. Page Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* What You'll Learn block */}
          <div className="border border-neutral-200/80 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-neutral-900">What You'll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-neutral-600">
              {course.learningOutcomes?.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="h-4.5 w-4.5 text-secondary-600 mt-0.5 flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Overview Description */}
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-neutral-900">Course Description</h2>
            <div className="text-xs leading-relaxed text-neutral-600 space-y-3">
              <p>{course.description}</p>
            </div>
          </div>

          {/* Curriculum Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="font-heading font-bold text-lg text-neutral-900">Course Curriculum</h2>
              <span className="text-xs text-neutral-500">{course.lessonsCount} Lectures • {course.duration} Total Duration</span>
            </div>

            <div className="space-y-3">
              {course.curriculum?.map((section, idx) => {
                const isOpen = !!activeSections[idx];
                return (
                  <div key={idx} className="border border-neutral-200 bg-white rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full text-left p-4 bg-neutral-50/50 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <div>
                        <h3 className="font-heading font-bold text-sm text-neutral-900">{section.sectionTitle}</h3>
                        <span className="text-[10px] text-neutral-400 font-semibold">{section.lessons.length} lessons</span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-neutral-500" /> : <ChevronDown className="h-4.5 w-4.5 text-neutral-500" />}
                    </button>
                    
                    {isOpen && (
                      <div className="border-t border-neutral-100 divide-y divide-neutral-100">
                        {section.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="px-4 py-3 flex items-center justify-between gap-4 text-xs hover:bg-neutral-50/30">
                            <div className="flex items-center gap-2.5 text-neutral-700">
                              <PlayCircle className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                              <span className="font-medium">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.isPreview && (
                                <Badge variant="secondary" className="px-2 py-0.5 text-[9px]">Preview</Badge>
                              )}
                              <span className="text-[10px] text-neutral-400 font-bold">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements block */}
          <div className="space-y-3 pt-4">
            <h2 className="font-heading font-bold text-lg text-neutral-900">Requirements</h2>
            <ul className="list-disc pl-5 text-xs text-neutral-600 space-y-1.5 leading-relaxed">
              {course.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Instructor Bio */}
          {instructor && (
            <div className="border border-neutral-200/80 bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-lg text-neutral-900">Your Instructor</h2>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <Avatar src={instructor.avatar} name={instructor.name} size="xl" />
                <div className="space-y-2">
                  <div>
                    <h3 className="font-heading font-bold text-base text-neutral-900 leading-tight">{instructor.name}</h3>
                    <p className="text-xs text-neutral-500">{instructor.designation}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-neutral-500 font-semibold">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {instructor.rating} Instructor Rating</span>
                    <span>{instructor.courseCount} Courses</span>
                    <span>{instructor.studentCount.toLocaleString()} Students</span>
                  </div>
                  
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Student Reviews & Form */}
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-lg text-neutral-900">Student Reviews</h2>

            {/* Add Review Panel */}
            <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Leave a Review</h3>
              
              {reviewSuccess && (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3 rounded-lg text-xs font-semibold">
                  Thank you! Your mock review has been successfully posted.
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                  <span>Rating:</span>
                  <RatingStars rating={reviewRating} size="md" interactive={true} onChange={setReviewRating} />
                </div>
                
                <div className="relative">
                  <textarea
                    rows="3"
                    required
                    placeholder={isAuthenticated ? "Write your feedback comment..." : "Please log in to submit a course review."}
                    disabled={!isAuthenticated}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none bg-neutral-50/50 focus:bg-white transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!isAuthenticated || !reviewComment.trim()}
                    className="absolute bottom-3 right-3 text-primary-600 hover:text-primary-700 disabled:opacity-30 cursor-pointer"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {course.reviews?.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No reviews yet for this curriculum. Be the first to leave feedback!</p>
              ) : (
                course.reviews?.map((review) => (
                  <div key={review.id} className="border-b border-neutral-100 pb-4 flex items-start gap-3 text-left">
                    <Avatar src={review.userAvatar} name={review.userName} size="sm" className="mt-0.5" />
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-bold text-neutral-800">{review.userName}</p>
                        <span className="text-[10px] text-neutral-400 font-semibold">{review.date}</span>
                      </div>
                      <RatingStars rating={review.rating} size="xs" />
                      <p className="text-xs text-neutral-600 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Related Courses Grid */}
          {relatedCourses.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="font-heading font-bold text-lg text-neutral-900">Students Also Bought</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCourses.map(rc => (
                  <Link key={rc.id} to={`/courses/${rc.id}`} className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-premium transition-shadow flex flex-col h-full">
                    <div className="aspect-video relative">
                      <img src={rc.thumbnail} alt={rc.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                      <h3 className="font-heading font-bold text-xs text-neutral-900 group-hover:text-primary-600 line-clamp-2 leading-tight">
                        {rc.title}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] border-t border-neutral-50 pt-2 font-bold text-neutral-800">
                        <span>${rc.price}</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{rc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Card Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <Card className="shadow-lg hover:shadow-lg border-neutral-200/90">
            <div className="aspect-video relative overflow-hidden group">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center">
                <PlayCircle className="h-14 w-14 text-white drop-shadow-md cursor-pointer hover:scale-105 transition-transform" />
              </div>
            </div>

            <CardBody className="p-6 space-y-6">
              
              {/* Pricing banner */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-neutral-900">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through font-semibold">${course.originalPrice}</span>
                )}
                {course.originalPrice && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Enrollment CTA Button */}
              <div className="space-y-2.5">
                <Button 
                  onClick={handleEnrollClick}
                  className="w-full py-3.5 text-sm font-bold shadow-md shadow-primary-500/10"
                >
                  {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1.5 text-xs py-2.5 justify-center"
                    onClick={() => toggleWishlist(course.id)}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1.5 text-xs py-2.5 justify-center relative"
                    onClick={handleShareClick}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                  </Button>
                </div>
              </div>

              {/* Course Features details list */}
              <div className="space-y-3.5 pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">This course includes:</h4>
                
                <ul className="space-y-2.5 text-xs text-neutral-600">
                  <li className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-neutral-400" />
                    <span>{course.duration} on-demand video</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-neutral-400" />
                    <span>{course.lessonsCount} downloadable coding resources</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Smartphone className="h-4 w-4 text-neutral-400" />
                    <span>Access on mobile, tablet, and TV</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Infinity className="h-4 w-4 text-neutral-400" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-neutral-400" />
                    <span>Secure Certificate of completion</span>
                  </li>
                </ul>
              </div>

            </CardBody>
          </Card>
        </div>

      </div>

    </div>
  );
};
