import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { CourseContext } from '../context/CourseContext';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { 
  Plus, Search, Edit3, Trash2, X, ChevronDown, Check,
  Layers, User, BarChart, DollarSign, Calendar, SlidersHorizontal
} from 'lucide-react';

export const AdminCourses = () => {
  const { courses, categories, instructors, addCourse, updateCourse, deleteCourse } = useContext(CourseContext);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals controller states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  // Curriculum Builder state
  const [curriculum, setCurriculum] = useState([]);

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Curriculum Builder state mutators
  const addSection = () => {
    setCurriculum(prev => [
      ...prev,
      {
        sectionTitle: `Section ${prev.length + 1}`,
        lessons: []
      }
    ]);
  };

  const updateSectionTitle = (sectionIdx, newTitle) => {
    setCurriculum(prev => prev.map((sec, idx) => 
      idx === sectionIdx ? { ...sec, sectionTitle: newTitle } : sec
    ));
  };

  const deleteSection = (sectionIdx) => {
    setCurriculum(prev => prev.filter((_, idx) => idx !== sectionIdx));
  };

  const addLesson = (sectionIdx) => {
    setCurriculum(prev => prev.map((sec, idx) => {
      if (idx === sectionIdx) {
        return {
          ...sec,
          lessons: [
            ...sec.lessons,
            { title: "New Lesson", duration: "10:00", isPreview: false }
          ]
        };
      }
      return sec;
    }));
  };

  const updateLesson = (sectionIdx, lessonIdx, field, value) => {
    setCurriculum(prev => prev.map((sec, sIdx) => {
      if (sIdx === sectionIdx) {
        const updatedLessons = sec.lessons.map((les, lIdx) => {
          if (lIdx === lessonIdx) {
            return { ...les, [field]: value };
          }
          return les;
        });
        return { ...sec, lessons: updatedLessons };
      }
      return sec;
    }));
  };

  const deleteLesson = (sectionIdx, lessonIdx) => {
    setCurriculum(prev => prev.map((sec, sIdx) => {
      if (sIdx === sectionIdx) {
        return {
          ...sec,
          lessons: sec.lessons.filter((_, lIdx) => lIdx !== lessonIdx)
        };
      }
      return sec;
    }));
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!course.title.toLowerCase().includes(q) && !course.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    // Category filter
    if (selectedCategory !== 'all' && course.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && course.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Open Form Modal for Create Course
  const openCreateModal = () => {
    setEditingCourseId(null);
    setCurriculum([
      {
        sectionTitle: "Section 1: Foundations",
        lessons: [
          { title: "Introduction to the Course", duration: "05:00", isPreview: true }
        ]
      }
    ]);
    reset({
      title: '',
      subtitle: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      category: categories[0]?.name || '',
      instructorId: instructors[0]?.id || '',
      level: 'Beginner',
      price: '',
      originalPrice: '',
      lessonsCount: '1',
      duration: '5m',
      status: 'Draft',
      tagsString: '',
      learningOutcomesString: '',
      requirementsString: ''
    });
    setFormModalOpen(true);
  };

  // Open Form Modal for Edit Course
  const openEditModal = (course) => {
    setEditingCourseId(course.id);
    setCurriculum(course.curriculum || []);
    reset({
      title: course.title,
      subtitle: course.subtitle || '',
      description: course.description || '',
      thumbnail: course.thumbnail || '',
      banner: course.banner || '',
      category: course.category,
      instructorId: course.instructorId,
      level: course.level,
      price: course.price,
      originalPrice: course.originalPrice || '',
      lessonsCount: course.lessonsCount,
      duration: course.duration,
      status: course.status,
      tagsString: course.tags ? course.tags.join(', ') : '',
      learningOutcomesString: course.learningOutcomes ? course.learningOutcomes.join('\n') : '',
      requirementsString: course.requirements ? course.requirements.join('\n') : ''
    });
    setFormModalOpen(true);
  };

  // Open Delete verification modal
  const openDeleteModal = (courseId) => {
    setDeletingCourseId(courseId);
    setDeleteModalOpen(true);
  };

  // Form Submit handler
  const onSubmitForm = (data) => {
    const tagsArray = data.tagsString 
      ? data.tagsString.split(',').map(tag => tag.trim()).filter(Boolean) 
      : [];

    const outcomesArray = data.learningOutcomesString
      ? data.learningOutcomesString.split('\n').map(x => x.trim()).filter(Boolean)
      : [];

    const requirementsArray = data.requirementsString
      ? data.requirementsString.split('\n').map(x => x.trim()).filter(Boolean)
      : [];

    // Calculate total lessons in curriculum
    const totalLessons = curriculum.reduce((acc, sec) => acc + (sec.lessons || []).length, 0);

    const formattedData = {
      ...data,
      price: parseFloat(data.price) || 0,
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      lessonsCount: totalLessons || parseInt(data.lessonsCount) || 0,
      tags: tagsArray,
      learningOutcomes: outcomesArray,
      requirements: requirementsArray,
      curriculum: curriculum
    };

    if (editingCourseId) {
      updateCourse(editingCourseId, formattedData);
    } else {
      addCourse(formattedData);
    }

    setFormModalOpen(false);
    setEditingCourseId(null);
  };

  // Confirm delete handler
  const confirmDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeleteModalOpen(false);
      setDeletingCourseId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-neutral-900 leading-tight">Course Inventory</h2>
          <p className="text-xs text-neutral-500">Create, update, and manage student learning curriculums.</p>
        </div>
        <Button 
          onClick={openCreateModal}
          iconLeft={<Plus className="h-4.5 w-4.5" />}
          className="shadow-sm hover:shadow-md"
        >
          Add New Course
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search box */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 focus:border-primary-500 rounded-lg outline-none text-neutral-900 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Droplist filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-neutral-800 text-xs"
            >
              <option value="all">All</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-neutral-800 text-xs"
            >
              <option value="all">All</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

        </div>

      </div>

      {/* Courses inventory catalog */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center space-y-4 max-w-sm mx-auto shadow-sm">
          <Layers className="h-10 w-10 text-neutral-400 mx-auto" />
          <h4 className="font-heading font-bold text-sm text-neutral-900">No Courses Match Filters</h4>
          <p className="text-xs text-neutral-500">Try adjusting your category dropdown or key text terms.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="p-4">Course Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Enrollments</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {filteredCourses.map((course) => {
                  const instructor = instructors.find(i => i.id === course.instructorId);
                  return (
                    <tr key={course.id} className="hover:bg-neutral-50/40">
                      
                      {/* Title & Thumbnail */}
                      <td className="p-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="h-10 w-14 rounded object-cover border border-neutral-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 leading-snug truncate hover:underline cursor-pointer" title={course.title}>
                              {course.title}
                            </p>
                            <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">{course.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 whitespace-nowrap">{course.category}</td>

                      {/* Instructor */}
                      <td className="p-4 whitespace-nowrap">
                        {instructor && (
                          <div className="flex items-center gap-2">
                            <Avatar src={instructor.avatar} name={instructor.name} size="xs" />
                            <span>{instructor.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Student enrolled */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-bold text-neutral-900">{course.studentCount.toLocaleString()}</p>
                          <span className="text-[9px] text-neutral-400 font-semibold">{course.rating} ⭐ ({course.ratingCount} reviews)</span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="p-4 whitespace-nowrap font-bold text-neutral-900">
                        ${course.price}
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant={course.status === 'Published' ? 'success' : 'neutral'}>
                          {course.status}
                        </Badge>
                      </td>

                      {/* Action Menu */}
                      <td className="p-4 whitespace-nowrap text-right">
                        <div className="inline-flex gap-1.5 justify-end">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 rounded"
                            title="Edit details"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(course.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded"
                            title="Delete course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Modal: ADD / EDIT COURSE FORM */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl animate-in scale-in duration-200">
            
            <header className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                {editingCourseId ? 'Edit Course Curriculums' : 'Create Course Curriculum'}
              </h3>
              <button 
                onClick={() => setFormModalOpen(false)} 
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit(onSubmitForm)} className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
              
              {/* Row: Title */}
              <Input
                label="Course Title *"
                placeholder="e.g. React Front-to-Back Mastery"
                error={errors.title?.message}
                {...register('title', { required: 'Course title is required' })}
              />

              {/* Row: Subtitle */}
              <Input
                label="Subtitle (Brief summary)"
                placeholder="e.g. Master routing, state variables, and hooks..."
                error={errors.subtitle?.message}
                {...register('subtitle')}
              />

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Full Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide deep curriculum outline context details..."
                  className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none bg-white placeholder-neutral-400"
                  {...register('description')}
                />
              </div>

              {/* Grid: Category and Instructor */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Category *</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...register('category')}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Instructor *</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...register('instructorId')}
                  >
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>

              </div>

              {/* Grid: Level, Status */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Difficulty Level</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...register('level')}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Publishing Status</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...register('status')}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

              </div>

              {/* Grid: Thumbnail and Banner URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Thumbnail Image URL"
                  placeholder="https://images.unsplash.com/..."
                  {...register('thumbnail')}
                />
                <Input
                  label="Banner Image URL"
                  placeholder="https://images.unsplash.com/..."
                  {...register('banner')}
                />
              </div>

              {/* Grid: Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sales Price ($) *"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 89.99"
                  error={errors.price?.message}
                  {...register('price', { required: 'Pricing is required' })}
                />
                <Input
                  label="Original List Price ($)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 149.99"
                  {...register('originalPrice')}
                />
              </div>

              {/* Grid: Duration and Lesson count */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Lessons Count (Auto calculated if curriculum built)"
                  type="number"
                  placeholder="e.g. 15"
                  {...register('lessonsCount')}
                />
                <Input
                  label="Total Duration"
                  placeholder="e.g. 12h 45m"
                  {...register('duration')}
                />
              </div>

              {/* Tags */}
              <Input
                label="Tags (Comma separated)"
                placeholder="e.g. React, Nextjs, Coding, Frontend"
                {...register('tagsString')}
              />

              {/* Learning Outcomes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Learning Outcomes (One per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Master React hooks&#10;Understand state management&#10;Build modern SPAs"
                  className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none bg-white placeholder-neutral-400 font-mono"
                  {...register('learningOutcomesString')}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Requirements / Prerequisites (One per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Basic JavaScript knowledge&#10;HTML and CSS familiarity&#10;A computer with Node.js installed"
                  className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none bg-white placeholder-neutral-400 font-mono"
                  {...register('requirementsString')}
                />
              </div>

              {/* Interactive Curriculum Builder */}
              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-neutral-800">
                    Course Curriculum Builder
                  </label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="xs" 
                    onClick={addSection}
                    iconLeft={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add Section
                  </Button>
                </div>

                {curriculum.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No sections created yet. Add a section to get started.</p>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {curriculum.map((section, sIdx) => (
                      <div key={sIdx} className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={section.sectionTitle}
                            onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                            placeholder="Section Title"
                            className="flex-grow text-xs font-bold p-2 bg-white border border-neutral-200 focus:border-primary-500 rounded-lg outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => deleteSection(sIdx)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Section"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="pl-4 space-y-2 border-l border-neutral-200">
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Lessons ({section.lessons.length})</span>
                            <button
                              type="button"
                              onClick={() => addLesson(sIdx)}
                              className="text-[10px] text-primary-600 font-bold hover:underline flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Add Lesson
                            </button>
                          </div>

                          {section.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="flex items-center gap-2 bg-white p-2 border border-neutral-200/80 rounded-lg">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(sIdx, lIdx, 'title', e.target.value)}
                                placeholder="Lesson Title"
                                className="flex-grow text-[11px] p-1.5 border border-neutral-100 rounded focus:border-primary-500 outline-none"
                              />
                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(sIdx, lIdx, 'duration', e.target.value)}
                                placeholder="5:00"
                                className="w-14 text-[11px] p-1.5 border border-neutral-100 rounded focus:border-primary-500 outline-none text-center font-semibold"
                              />
                              <label className="flex items-center gap-1 cursor-pointer select-none text-[10px] text-neutral-500 font-semibold px-1">
                                <input
                                  type="checkbox"
                                  checked={!!lesson.isPreview}
                                  onChange={(e) => updateLesson(sIdx, lIdx, 'isPreview', e.target.checked)}
                                  className="rounded text-primary-600 focus:ring-primary-500 border-neutral-300"
                                />
                                <span>Preview</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => deleteLesson(sIdx, lIdx)}
                                className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                                title="Delete Lesson"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4 flex justify-end gap-3.5">
                <Button variant="outline" onClick={() => setFormModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourseId ? 'Save Changes' : 'Publish Course'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: DELETE VERIFICATION */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl animate-in fade-in duration-200">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900">Verify Course Deletion</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Are you absolutely certain you wish to delete this course from catalog inventories? This operation is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
