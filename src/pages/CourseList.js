import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import { useWishlist } from '../hooks/useWishlist';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { RatingStars } from '../components/RatingStars';
import { 
  Search, SlidersHorizontal, Heart, Clock, BookOpen, 
  X, Check, ChevronDown, Award, Star 
} from 'lucide-react';

export const CourseList = () => {
  const { courses, categories, instructors } = useContext(CourseContext);
  const { toggleWishlist, inWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('popular'); // popular, rating, price-asc, price-desc
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  // Derived filtered courses
  const filteredCourses = courses.filter((course) => {
    // Only show published courses
    if (course.status !== 'Published') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(query);
      const matchSubtitle = course.subtitle?.toLowerCase().includes(query);
      const matchTags = course.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!matchTitle && !matchSubtitle && !matchTags) return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const catObj = categories.find(c => c.slug === selectedCategory);
      if (catObj && course.category !== catObj.name) return false;
    }

    // Level filter
    if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;

    // Rating filter
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      if (course.rating < minRating) return false;
    }

    // Price filter
    if (selectedPrice === 'free' && course.price > 0) return false;
    if (selectedPrice === 'paid' && course.price === 0) return false;

    return true;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    // Default: popular (by studentCount)
    return b.studentCount - a.studentCount;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedRating('all');
    setSelectedPrice('all');
    setSortBy('popular');
    setSearchParams({});
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-hero-gradient from-primary-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="font-heading font-extrabold text-white text-3xl sm:text-4xl">Browse Our Catalog</h1>
        <p className="text-sm text-primary-100 max-w-xl">
          Level up your career with industry-proven, project-backed curricula led by certified developers and designers.
        </p>
      </div>

      {/* Control Bar (Search, sort, mobile filter button) */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search for courses, technologies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white text-neutral-900 border border-neutral-200 focus:border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all"
          />
        </div>

        {/* Action Toggles */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 ml-auto md:ml-0">
            <span>Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-800 font-medium cursor-pointer appearance-none"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters - Desktop Sidebar */}
        <aside className="hidden lg:block space-y-6 border border-neutral-200 p-5 rounded-md bg-primary-100">
          
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary-600" />
              <span>Filters</span>
            </h2>
            <button 
              onClick={clearFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Category</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  selectedCategory === 'all' ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-100/50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="h-3.5 w-3.5" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    selectedCategory === cat.slug ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-100/50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Difficulty Level</h3>
            <div className="space-y-2">
              {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    selectedLevel === lvl 
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}>
                    {selectedLevel === lvl && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={selectedLevel === lvl ? 'text-neutral-900 font-bold' : ''}>
                    {lvl === 'all' ? 'All Difficulty Levels' : lvl}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Min Rating</h3>
            <div className="space-y-2">
              {['all', '4.5', '4.0', '3.5'].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSelectedRating(rate)}
                  className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    selectedRating === rate 
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}>
                    {selectedRating === rate && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={selectedRating === rate ? 'text-neutral-900 font-bold' : ''}>
                    {rate === 'all' ? 'All Ratings' : `${rate} ⭐ & Above`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pricing</h3>
            <div className="space-y-2">
              {['all', 'paid', 'free'].map((prc) => (
                <button
                  key={prc}
                  onClick={() => setSelectedPrice(prc)}
                  className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    selectedPrice === prc 
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}>
                    {selectedPrice === prc && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`capitalize ${selectedPrice === prc ? 'text-neutral-900 font-bold' : ''}`}>
                    {prc === 'all' ? 'All Prices' : prc}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Course Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <p>Showing {sortedCourses.length} results</p>
            {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedRating !== 'all' || selectedPrice !== 'all') && (
              <button onClick={clearFilters} className="text-primary-600 hover:underline">
                Reset filters
              </button>
            )}
          </div>

          {sortedCourses.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-neutral-900">No Courses Found</h3>
              <p className="text-xs text-neutral-500">
                We couldn't find any courses matching your specific search parameters. Try adjusting your checkboxes or key terms.
              </p>
              <Button size="sm" onClick={clearFilters}>Reset All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => {
                const instructor = instructors.find(i => i.id === course.instructorId);
                const isWishlisted = inWishlist(course.id);
                return (
                  <Card key={course.id} hover={true} className="flex flex-col h-full relative group">
                    
                    {/* Thumbnail banner */}
                    <div className="block relative aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge variant="primary" className="absolute top-3 left-3 shadow-md z-10">
                        {course.category}
                      </Badge>
                      {/* Wishlist toggle absolute */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(course.id);
                        }}
                        className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-md text-neutral-400 hover:text-rose-600 transition-colors z-10"
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <CardBody className="flex-grow flex flex-col justify-between p-4.5 space-y-4">
                      
                      <div className="space-y-2">
                        {/* Rating block */}
                        <div className="flex items-center gap-1">
                          <RatingStars rating={course.rating} size="xs" />
                          <span className="text-[10px] font-bold text-neutral-700">{course.rating}</span>
                          <span className="text-[10px] text-neutral-400">({course.ratingCount})</span>
                        </div>

                        <Link to={`/courses/${course.id}`} className="block">
                          <h3 className="font-heading font-bold text-sm text-neutral-900 group-hover:text-primary-600 leading-snug line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Info items */}
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-3">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-neutral-400" /> {course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-neutral-400" /> {course.lessonsCount} lessons</span>
                      </div>

                      {/* Instructor Avatar */}
                      {instructor && (
                        <div className="flex items-center gap-2 border-t border-neutral-100 pt-3">
                          <Avatar src={instructor.avatar} name={instructor.name} size="xs" />
                          <div className="text-[9px] text-left leading-none">
                            <p className="font-semibold text-neutral-800">{instructor.name}</p>
                            <span className="text-neutral-400">{course.level}</span>
                          </div>
                        </div>
                      )}

                      {/* Price Footer */}
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <div>
                          <span className="text-base font-extrabold text-neutral-900">${course.price}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through ml-1.5">${course.originalPrice}</span>
                          )}
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm">Details</Button>
                        </Link>
                      </div>

                    </CardBody>

                  </Card>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Mobile filter drawer overlay */}
      {mobileFiltersOpen && (
        <>
          <div 
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="font-heading font-bold text-base text-neutral-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100">
                  <X className="h-5.5 w-5.5 text-neutral-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Category</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => { handleCategorySelect('all'); setMobileFiltersOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { handleCategorySelect(c.slug); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedCategory === c.slug ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Difficulty Level</h3>
                <div className="space-y-2">
                  {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                        selectedLevel === lvl 
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                          : 'border-neutral-300 bg-white hover:border-neutral-400'
                      }`}>
                        {selectedLevel === lvl && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={selectedLevel === lvl ? 'text-neutral-900 font-bold' : ''}>
                        {lvl === 'all' ? 'All Difficulty Levels' : lvl}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Min Rating</h3>
                <div className="space-y-2">
                  {['all', '4.5', '4.0', '3.5'].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSelectedRating(rate)}
                      className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                        selectedRating === rate 
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                          : 'border-neutral-300 bg-white hover:border-neutral-400'
                      }`}>
                        {selectedRating === rate && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={selectedRating === rate ? 'text-neutral-900 font-bold' : ''}>
                        {rate === 'all' ? 'All Ratings' : `${rate} ⭐ & Above`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pricing</h3>
                <div className="space-y-2">
                  {['all', 'paid', 'free'].map((prc) => (
                    <button
                      key={prc}
                      onClick={() => setSelectedPrice(prc)}
                      className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer hover:text-neutral-950 w-full text-left focus:outline-none"
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                        selectedPrice === prc 
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                          : 'border-neutral-300 bg-white hover:border-neutral-400'
                      }`}>
                        {selectedPrice === prc && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={`capitalize ${selectedPrice === prc ? 'text-neutral-900 font-bold' : ''}`}>
                        {prc === 'all' ? 'All Prices' : prc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 mt-6">
              <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
