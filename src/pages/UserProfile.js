import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CourseContext } from '../context/CourseContext';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { 
  ArrowLeft, Mail, Phone, Calendar, ShieldCheck, 
  BookOpen, Award, CheckCircle, BarChart3, ShieldAlert
} from 'lucide-react';

export const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, currentUser } = useContext(AuthContext);
  const { courses } = useContext(CourseContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const foundUser = users.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [id, users]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 font-heading">User Profile Not Found</h2>
        <p className="text-sm text-neutral-500">The user profile record does not exist or has been deleted.</p>
        <Link to="/admin/users">
          <Button variant="outline">Back to User Directory</Button>
        </Link>
      </div>
    );
  }

  // Get enrolled courses details
  const enrolledCoursesWithDetails = (user.enrolledCourses || []).map(enrolled => {
    const course = courses.find(c => c.id === enrolled.courseId);
    return {
      ...enrolled,
      courseDetails: course
    };
  }).filter(item => item.courseDetails !== undefined);

  const completedCourses = enrolledCoursesWithDetails.filter(c => c.progress >= 100);

  return (
    <div className="space-y-6">
      
      {/* Back button & Page header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/users">
          <button className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100/50 transition-colors text-neutral-500">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h2 className="font-heading font-extrabold text-xl text-neutral-900 leading-none">Account Profile</h2>
          <span className="text-[10px] text-neutral-400 mt-1 block font-mono">User ID: {user.id}</span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Personal Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-neutral-200/80 shadow-premium">
            <CardBody className="p-6 flex flex-col items-center text-center space-y-4">
              <Avatar src={user.avatar} name={user.name} size="2xl" />
              <div>
                <h3 className="font-heading font-extrabold text-base text-neutral-900">{user.name}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{user.role}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={user.status === 'Active' ? 'success' : 'error'}>
                  {user.status}
                </Badge>
                <Badge variant={user.role === 'Admin' ? 'primary' : 'neutral'}>
                  {user.role} Account
                </Badge>
              </div>

              {/* Bio / Meta data block */}
              <div className="w-full text-xs text-neutral-600 space-y-3 pt-4 border-t border-neutral-100 text-left">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <span>{user.mobile}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <span>Member since: {user.joinDate}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Metrics */}
          <Card className="border-neutral-200/80 shadow-sm">
            <CardBody className="p-5 grid grid-cols-3 gap-2 text-center divide-x divide-neutral-100">
              <div className="space-y-0.5">
                <p className="text-lg font-extrabold text-neutral-900 leading-none">{enrolledCoursesWithDetails.length}</p>
                <span className="text-[9px] text-neutral-400 font-semibold block uppercase">Enrolled</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <p className="text-lg font-extrabold text-neutral-900 leading-none">{completedCourses.length}</p>
                <span className="text-[9px] text-neutral-400 font-semibold block uppercase">Done</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <p className="text-lg font-extrabold text-neutral-900 leading-none">{user.certificates?.length || 0}</p>
                <span className="text-[9px] text-neutral-400 font-semibold block uppercase">Certs</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Courses & Achievements details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Enrolled Courses Grid list */}
          <Card className="border-neutral-200/80 shadow-premium">
            <CardHeader className="p-4 flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-primary-600" />
                <span>Enrolled Curriculums</span>
              </h3>
            </CardHeader>

            <CardBody className="p-0 divide-y divide-neutral-100">
              {enrolledCoursesWithDetails.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400 italic">
                  This user has not enrolled in any curriculum tracks yet.
                </div>
              ) : (
                enrolledCoursesWithDetails.map((item) => (
                  <div key={item.courseId} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.courseDetails.thumbnail} 
                        alt={item.courseDetails.title}
                        className="w-14 h-10 object-cover rounded border border-neutral-100 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-xs text-neutral-900 leading-snug line-clamp-1">
                          {item.courseDetails.title}
                        </h4>
                        <span className="text-[9px] text-neutral-400 font-semibold block mt-0.5">Last accessed: {item.lastAccessed}</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-44 flex items-center gap-3 flex-shrink-0">
                      <div className="flex-grow space-y-1">
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 border border-neutral-200/30">
                          <div className="bg-primary-600 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-[9px] text-neutral-400 block font-bold text-right">{item.progress}% Complete</span>
                      </div>
                      <Badge variant={item.progress >= 100 ? 'success' : 'neutral'} className="text-[9px] px-2 py-0.5">
                        {item.progress >= 100 ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Certificates panel */}
          <Card className="border-neutral-200/80 shadow-premium">
            <CardHeader className="p-4">
              <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                <span>Verified Credentials</span>
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              {(!user.certificates || user.certificates.length === 0) ? (
                <p className="text-xs text-neutral-400 italic text-center py-4">No verified academic certificates earned yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.certificates.map((cert) => {
                    const course = courses.find(c => c.id === cert.courseId);
                    if (!course) return null;
                    return (
                      <div key={cert.id} className="border border-neutral-200 rounded-lg p-3.5 flex items-center gap-3 bg-neutral-50/20">
                        <Award className="h-8 w-8 text-amber-500 flex-shrink-0" />
                        <div>
                          <h4 className="font-heading font-bold text-xs text-neutral-900 leading-snug line-clamp-1">{course.title}</h4>
                          <span className="text-[9px] text-neutral-400 block mt-0.5">Issue date: {cert.issueDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Simulated Activity logs */}
          <Card className="border-neutral-200/80 shadow-premium">
            <CardHeader className="p-4">
              <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-neutral-500" />
                <span>Simulated Activity Log</span>
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="space-y-4">
                {[
                  { desc: "Accessed classroom player dashboard", time: "July 18, 2026 at 5:10 PM" },
                  { desc: "Completed section 'React Fundamentals Deep Dive'", time: "July 12, 2026 at 11:24 AM" },
                  { desc: "Created account credentials on EduSphere", time: `${user.joinDate} at 9:00 AM` }
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-left border-l-2 border-neutral-200 pl-3 ml-1 pb-1">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-neutral-700">{act.desc}</p>
                      <span className="text-[10px] text-neutral-400 font-medium block">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </div>
  );
};
