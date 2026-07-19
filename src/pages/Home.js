import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CourseContext } from "../context/CourseContext";
import { RatingStars } from "../components/RatingStars";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Avatar } from "../components/Avatar";
import * as Icons from "lucide-react";
import testimonialsData from "../data/testimonials.json";
import faqsData from "../data/faqs.json";

const LucideIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.BookOpen;
  return <IconComponent className={className} />;
};

export const Home = () => {
  const { courses, categories, instructors } = useContext(CourseContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Get only published courses and limit to 4 for popular grid
  const popularCourses = courses
    .filter((c) => c.status === "Published")
    .slice(0, 4);
  // Take first 3 instructors
  const featuredInstructors = instructors.slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setEmailSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Decorative Background */}
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl"></div>

        <div className="absolute top-20 right-0 h-[450px] w-[450px] rounded-full bg-secondary-200/30 blur-3xl"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.05),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(22,163,74,0.08),transparent_45%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}

            <div>
              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-premium border border-primary-100 px-5 py-2 text-sm font-medium text-primary-700">
                🚀 Trusted by 250,000+ Learners Worldwide
              </div>

              {/* Heading */}

              <h1 className="mt-8 text-5xl lg:text-5xl font-heading font-extrabold leading-tight text-neutral-900">
                Become
                <span className="bg-hero-gradient bg-clip-text text-transparent mx-3">
                  Industry Ready
                </span>
                with Real Projects
              </h1>

              {/* Description */}

              <p className="mt-6 text-md leading-6 text-neutral-600 max-w-xl">
                Learn from industry experts, build production-ready projects,
                earn verified certificates, and accelerate your career with
                job-focused courses in Development, Design, AI, Marketing, and
                more.
              </p>

              {/* SEARCH */}

              <div className="mt-10 flex flex-col sm:flex-row bg-white rounded-2xl shadow-premium border border-neutral-200 overflow-hidden">
                <div className="flex items-center flex-1 px-5">
                  <svg
                    className="w-5 h-5 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.3-4.3"></path>
                  </svg>

                  <input
                    type="text"
                    placeholder="Search courses, skills, technologies..."
                    className="w-full px-4 py-5 outline-none text-neutral-700 placeholder:text-neutral-400"
                  />
                </div>

                <button className="bg-primary-800 text-white px-8 py-5 font-semibold hover:scale-105 transition duration-300">
                  Search
                </button>
              </div>

              {/* CTA */}

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-secondary-800 text-white px-8 py-4 rounded-xl shadow-premium hover:shadow-premium-hover transition duration-300 hover:-translate-y-1">
                  Start Learning Free
                </button>

                <button className="border border-secondary-800 bg-white text-secondary-700 px-8 py-4 rounded-xl hover:bg-secondary-50 transition">
                  Explore Courses
                </button>
              </div>
            </div>

            {/* RIGHT CONTENT */}

            <div className="relative">
              {/* Glow */}

              <div className="absolute inset-0 bg-hero-gradient opacity-20 blur-3xl rounded-full"></div>

              {/* Main Card */}

              <div className="relative bg-white/70 rounded-3xl shadow-md border border-white/60 p-5 pb-0 flex ms-auto w-[70%]">
                <img
                  src="images/office-girl.png"
                  alt=""
                  className="rounded-4xl w-full h-[500px] object-contain"
                />

                {/* Top Right */}

                <div className="absolute top-8 -right-10 backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl px-5 py-4 border border-white">
                  <p className="text-yellow-500 text-2xl">⭐ 4.9</p>

                  <span className="text-neutral-500 text-sm">
                    Course Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm mt-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Active Students */}
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-5 bg-gradient-to-br from-primary-50 to-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-primary-700">250K+</h3>
                  <p className="text-sm text-neutral-500">Active Students</p>
                </div>
              </div>

              {/* Courses */}
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-5 bg-gradient-to-br from-secondary-50 to-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5A9.97 9.97 0 003 6.253v13C4.246 18.477 5.832 18 7.5 18c1.746 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5A9.97 9.97 0 0121 6.253v13C19.754 18.477 18.168 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-secondary-700">
                    1200+
                  </h3>
                  <p className="text-sm text-neutral-500">Premium Courses</p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-5 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-green-700">98%</h3>
                  <p className="text-sm text-neutral-500">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted-by Logo Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white  rounded-xl p-6 shadow-sm text-center space-y-4">
          <div>
            <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-2">
              Trusted By
            </h2>
            <p className="text-sm font-semibold text-neutral-400 mb-6">
              Trusted by teams at forward-thinking organizations
            </p>
          </div>
          <div className="w-full rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur-sm shadow-sm px-8 py-8">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              <div className="group flex h-20 w-40 items-center justify-center rounded-2xl border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-md">
                <img
                  src="/images/partner1.png"
                  alt="Partner 1"
                  className="h-10 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>

              <div className="group flex h-20 w-40 items-center justify-center rounded-2xl border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-md">
                <img
                  src="/images/partner2.png"
                  alt="Partner 2"
                  className="h-10 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>

              <div className="group flex h-20 w-40 items-center justify-center rounded-2xl border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-md">
                <img
                  src="/images/partner3.png"
                  alt="Partner 3"
                  className="h-10 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>

              <div className="group flex h-20 w-40 items-center justify-center rounded-2xl border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-md">
                <img
                  src="/images/partner4.png"
                  alt="Partner 4"
                  className="h-10 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>

              <div className="group flex h-20 w-40 items-center justify-center rounded-2xl border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-md">
                <img
                  src="/images/partner5.jpeg"
                  alt="Partner 5"
                  className="h-10 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-3xl text-neutral-900">
              Explore Popular Courses
            </h2>
            <p className="text-sm text-neutral-500">
              Pick from our highest-rated and most enrolled interactive
              curricula.
            </p>
          </div>
          <Link to="/courses">
            <Button
              variant="outline"
              iconRight={<Icons.ArrowRight className="h-4 w-4" />}
            >
              View All Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map((course) => {
            const instructor = instructors.find(
              (i) => i.id === course.instructorId,
            );
            return (
              <Card
                key={course.id}
                hover={true}
                className="flex flex-col h-full"
              >
                <Link
                  to={`/courses/${course.id}`}
                  className="block relative aspect-video overflow-hidden"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge
                    variant="primary"
                    className="absolute top-3 left-3 shadow-md"
                  >
                    {course.category}
                  </Badge>
                </Link>

                <CardBody className="flex-grow flex flex-col justify-between p-4.5 space-y-4">
                  <div className="space-y-2">
                    {/* Rating info */}
                    <div className="flex items-center gap-1">
                      <RatingStars rating={course.rating} size="xs" />
                      <span className="text-[11px] font-bold text-neutral-700">
                        {course.rating}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        ({course.ratingCount})
                      </span>
                    </div>

                    <Link to={`/courses/${course.id}`} className="block group">
                      <h3 className="font-heading font-bold text-sm text-neutral-900 group-hover:text-primary-600 line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Meta items */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Icons.Clock className="h-3 w-3" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icons.BookOpen className="h-3 w-3" />{" "}
                      {course.lessonsCount} lessons
                    </span>
                  </div>

                  {/* Instructor profile */}
                  {instructor && (
                    <div className="flex items-center gap-2 border-t border-neutral-100 pt-3">
                      <Avatar
                        src={instructor.avatar}
                        name={instructor.name}
                        size="xs"
                      />
                      <div className="text-[10px] text-left leading-none">
                        <p className="font-semibold text-neutral-800">
                          {instructor.name}
                        </p>
                        <span className="text-neutral-400">Instructor</span>
                      </div>
                    </div>
                  )}

                  {/* Pricing and Button */}
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <div>
                      <span className="text-base font-extrabold text-primary-900">
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-primary-400 line-through ml-1.5">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <Link to={`/courses/${course.id}`}>
                      <Button variant="secondary" size="sm">
                        Enroll
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. Categories Grid */}
      <section className="bg-secondary-800 mx-auto px-4  py-10  sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-white">
            Browse by Category
          </h2>
          <p className="text-sm text-white">
            Discover handpicked, expertly curated courses designed to elevate
            your creative and professional skills.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/courses?category=${category.slug}`}
              className="bg-white border border-neutral-200 hover:border-primary-800 hover:shadow-premium-hover p-5 rounded-xl text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center group-hover:bg-primary-800 group-hover:text-white transition-colors">
                <LucideIcon name={category.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-neutral-900 mb-0.5">
                  {category.name}
                </h3>
                <span className="text-[10px] text-neutral-400">
                  {category.courseCount} Courses
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Learning Journey Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-neutral-900">
            Your Learning Journey
          </h2>
          <p className="text-sm text-neutral-500">
            Four straightforward steps to landing your next developer, designer,
            or business strategy role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            {
              step: "01",
              title: "Select a Curated Track",
              desc: "Filter courses based on your current experience level and field targets (Development, UI/UX, Finance).",
            },
            {
              step: "02",
              title: "Build Hands-On Projects",
              desc: "Write actual code, architect design systems in Figma, and build financial spreadsheet projections.",
            },
            {
              step: "03",
              title: "Complete Assessments",
              desc: "Validate learning milestones through self-paced quizzes and code challenges from scratch.",
            },
            {
              step: "04",
              title: "Get Hired",
              desc: "Publish your interactive portfolio, secure your completion certificates, and nail technical recruitment screens.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative group bg-white border border-neutral-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-heading font-black text-5xl text-primary-100 group-hover:text-primary-200 transition-colors block mb-4">
                {item.step}
              </span>
              <h3 className="font-heading font-bold text-sm text-neutral-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-neutral-900 text-white py-20 overflow-hidden relative border-y border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <Badge
              variant="primary"
              className="bg-primary-950 text-primary-400 border-primary-900"
            >
              ⚡ High Performance
            </Badge>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
              A Premium Platform Built For Practical Success.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We reject shallow video clickbaits. Our curricula focus on
              rigorous, deep dives. We build production-ready frontends and
              database models from step zero, explaining all critical
              architecture constraints.
            </p>
            <div className="pt-2">
              <Link to="/courses">
                <Button variant="primary" size="lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "World-Class Mentors",
                desc: "Courses authored strictly by engineers and designers who worked at Netflix, Google, Airbnb, and leading tech startups.",
                icon: "Award",
              },
              {
                title: "Rigorous Curriculums",
                desc: "No generic copy-paste. Complete source code walkthroughs, design files in Figma, and interactive assignments.",
                icon: "CheckCircle",
              },
              {
                title: "Official Certificates",
                desc: "Generate secure completion certificates to demonstrate validated skill sets on LinkedIn and to recruiters.",
                icon: "Award",
              },
              {
                title: "Lifetime Access",
                desc: "Pay once and receive all future course updates, new lecture drops, and community repository downloads free.",
                icon: "Compass",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-neutral-800/40 border border-neutral-800/80 rounded-xl p-5 hover:border-neutral-700/80 transition-all duration-300 space-y-3"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-950 text-primary-400 flex items-center justify-center">
                  <LucideIcon name={benefit.icon} className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Featured Instructors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-neutral-900">
            Meet Our Featured Instructors
          </h2>
          <p className="text-sm text-neutral-500">
            Learn from seasoned industry leaders, venture builders, and
            commercial photographers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {featuredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 text-center flex flex-col items-center justify-between gap-4 hover:shadow-premium transition-shadow"
            >
              <Avatar
                src={instructor.avatar}
                name={instructor.name}
                size="xl"
              />
              <div>
                <h3 className="font-heading font-bold text-base text-neutral-900 mb-0.5">
                  {instructor.name}
                </h3>
                <p className="text-xs text-neutral-500 leading-tight">
                  {instructor.designation}
                </p>
              </div>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed px-2">
                {instructor.bio}
              </p>
              <div className="flex items-center gap-3 border-t border-neutral-100 pt-3 w-full justify-center text-xs text-neutral-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Icons.Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                  {instructor.rating}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <span>{instructor.courseCount} Courses</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="bg-secondary-50 border-y border-neutral-200/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading font-bold text-3xl text-neutral-900">
              What Our Graduates Say
            </h2>
            <p className="text-sm text-neutral-500">
              Real feedback from users who transformed their professional career
              paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-6 right-6 text-neutral-100">
                  <Icons.HelpCircle className="h-10 w-10 transform rotate-180" />
                </div>
                <div className="space-y-4 relative">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Icons.Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 mt-6">
                  <Avatar src={t.userAvatar} name={t.userName} size="sm" />
                  <div className="text-left leading-none">
                    <p className="text-xs font-bold text-neutral-900">
                      {t.userName}
                    </p>
                    <span className="text-[10px] text-neutral-400">
                      {t.userRole}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-heading font-bold text-3xl text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-500">
            Everything you need to know about enrollments, access, and refunds.
          </p>
        </div>

        <div className="space-y-4">
          {faqsData.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.id}
                className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-bold text-sm text-neutral-900 hover:text-primary-600 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <Icons.Minus className="h-4.5 w-4.5 text-neutral-400 flex-shrink-0" />
                  ) : (
                    <Icons.Plus className="h-4.5 w-4.5 text-neutral-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-500 leading-relaxed border-t border-neutral-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Newsletter Signup Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-hero-gradient from-primary-600 to-indigo-800 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
          <div className="relative max-w-xl mx-auto space-y-6">
            <h2 className="font-heading font-bold text-white text-2xl sm:text-3xl leading-tight">
              Ready to Upgrade Your Skills? Join Our Weekly Newsletter.
            </h2>
            <p className="text-xs sm:text-sm text-primary-100">
              Receive tips, tutorials, coupon codes, and notices for new course
              catalog releases straight in your inbox once a week.
            </p>

            {emailSubscribed ? (
              <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2">
                <Icons.Check className="h-4.5 w-4.5 text-secondary-500" />
                <span>Success! You've been subscribed to the newsletter.</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow rounded-lg px-4 py-3 bg-white text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none border-0"
                />
                <Button type="submit" variant="secondary" size="md">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
