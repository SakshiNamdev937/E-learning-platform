import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { 
  Plus, Search, Edit3, Trash2, X, Check,
  User, Mail, Phone, UserCheck, ShieldAlert, Download
} from 'lucide-react';

export const AdminUsers = () => {
  const { 
    users, currentUser, createAdminUser, deleteUser, 
    updateUserStatus, updateUserRole, updateUserInfo
  } = useContext(AuthContext);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals controller states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // React Hook Form for Add User
  const { 
    register: registerAdd, 
    handleSubmit: handleSubmitAdd, 
    reset: resetAdd, 
    formState: { errors: errorsAdd } 
  } = useForm();

  // React Hook Form for Edit User
  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    reset: resetEdit, 
    setValue: setValueEdit, 
    formState: { errors: errorsEdit } 
  } = useForm();

  // Filter users list
  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!user.name.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && user.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Handle Add User submission
  const onSubmitUser = (data) => {
    try {
      createAdminUser({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: data.role,
        status: data.status,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
      });
      setAddModalOpen(false);
      resetAdd();
    } catch (err) {
      alert(err.message || 'Error creating user');
    }
  };

  // Handle Edit User submission
  const onSubmitEditUser = (data) => {
    try {
      updateUserInfo(editingUser.id, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: data.role,
        status: data.status
      });
      setEditModalOpen(false);
      setEditingUser(null);
      resetEdit();
    } catch (err) {
      alert(err.message || 'Error updating user');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setValueEdit('name', user.name);
    setValueEdit('email', user.email);
    setValueEdit('mobile', user.mobile);
    setValueEdit('role', user.role);
    setValueEdit('status', user.status);
    setEditModalOpen(true);
  };

  const openDeleteModal = (userId) => {
    setDeletingUserId(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId);
      setDeleteModalOpen(false);
      setDeletingUserId(null);
    }
  };

  const toggleStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateUserStatus(userId, nextStatus);
  };

  const toggleRole = (userId, currentRole) => {
    const nextRole = currentRole === 'Admin' ? 'Student' : 'Admin';
    updateUserRole(userId, nextRole);
  };

  const handleExportCSV = () => {
    // Generate CSV content from users list
    const headers = ['User ID', 'Name', 'Email', 'Mobile', 'Role', 'Status', 'Join Date'];
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email,
      u.mobile,
      u.role,
      u.status,
      u.joinDate
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `edusphere_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-neutral-900 leading-tight">User Directory</h2>
          <p className="text-xs text-neutral-500">Manage student accounts, roles, access permissions, and profiles.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleExportCSV}
            variant="outline"
            iconLeft={<Download className="h-4.5 w-4.5" />}
            className="shadow-sm w-full sm:w-auto"
          >
            Export Directory
          </Button>
          <Button 
            onClick={() => {
              resetAdd();
              setAddModalOpen(true);
            }}
            iconLeft={<Plus className="h-4.5 w-4.5" />}
            className="shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 focus:border-primary-500 rounded-lg outline-none text-neutral-900 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-neutral-800 text-xs"
            >
              <option value="all">All</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-neutral-800 text-xs"
            >
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

        </div>

      </div>

      {/* Users Data Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center space-y-4 max-w-sm mx-auto shadow-sm">
          <User className="h-10 w-10 text-neutral-400 mx-auto" />
          <h4 className="font-heading font-bold text-sm text-neutral-900">No Users Match Filters</h4>
          <p className="text-xs text-neutral-500">Try adjusting your keyword terms or filtering configurations.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Join Date</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/40">
                      
                      {/* Name & Avatar */}
                      <td className="p-4 whitespace-nowrap">
                        <Link to={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                          <Avatar src={user.avatar} name={user.name} size="sm" />
                          <div>
                            <p className="font-semibold text-neutral-900 leading-snug">
                              {user.name} {isCurrent && <span className="text-[9px] text-primary-500 font-bold">(You)</span>}
                            </p>
                            <span className="text-[9px] text-neutral-400 block font-mono">{user.id}</span>
                          </div>
                        </Link>
                      </td>

                      {/* Email */}
                      <td className="p-4 whitespace-nowrap">{user.email}</td>

                      {/* Mobile */}
                      <td className="p-4 whitespace-nowrap">{user.mobile}</td>

                      {/* Join Date */}
                      <td className="p-4 whitespace-nowrap">{user.joinDate}</td>

                      {/* Role Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span 
                          onClick={() => !isCurrent && toggleRole(user.id, user.role)}
                          className={`cursor-pointer select-none`}
                        >
                          <Badge variant={user.role === 'Admin' ? 'primary' : 'neutral'}>
                            {user.role}
                          </Badge>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span 
                          onClick={() => !isCurrent && toggleStatus(user.id, user.status)}
                          className="cursor-pointer select-none"
                        >
                          <Badge variant={user.status === 'Active' ? 'success' : 'error'}>
                            {user.status}
                          </Badge>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 whitespace-nowrap text-right">
                        <div className="inline-flex gap-2.5 justify-end items-center">
                          <Link 
                            to={`/admin/users/${user.id}`}
                            className="p-1 text-primary-600 hover:text-primary-700 hover:underline font-bold"
                          >
                            Profile
                          </Link>
                          
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 rounded"
                            title="Edit details"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          {!isCurrent && (
                            <button
                              onClick={() => openDeleteModal(user.id)}
                              className="p-1 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded"
                              title="Delete account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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

      {/* Modal: ADD USER FORM */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full shadow-xl animate-in scale-in duration-200">
            
            <header className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-neutral-900">Add New Account</h3>
              <button 
                onClick={() => setAddModalOpen(false)} 
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleSubmitAdd(onSubmitUser)} className="p-5 space-y-4">
              
              {/* Name */}
              <Input
                label="Full Name *"
                placeholder="e.g. Jane Doe"
                error={errorsAdd.name?.message}
                {...registerAdd('name', { required: 'Name is required' })}
              />

              {/* Email */}
              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. jdoe@example.com"
                error={errorsAdd.email?.message}
                {...registerAdd('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                })}
              />

              {/* Mobile */}
              <Input
                label="Mobile Number *"
                placeholder="e.g. 555-010-0999"
                error={errorsAdd.mobile?.message}
                {...registerAdd('mobile', { required: 'Mobile is required' })}
              />

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Account Role</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...registerAdd('role')}
                    defaultValue="Student"
                  >
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Status</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...registerAdd('status')}
                    defaultValue="Active"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

              </div>

              <div className="border-t border-neutral-100 pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create User
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: EDIT USER FORM */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full shadow-xl animate-in scale-in duration-200">
            
            <header className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-neutral-900">Edit Account Details</h3>
              <button 
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingUser(null);
                }} 
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleSubmitEdit(onSubmitEditUser)} className="p-5 space-y-4">
              
              {/* Name */}
              <Input
                label="Full Name *"
                placeholder="e.g. Jane Doe"
                error={errorsEdit.name?.message}
                {...registerEdit('name', { required: 'Name is required' })}
              />

              {/* Email */}
              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. jdoe@example.com"
                error={errorsEdit.email?.message}
                {...registerEdit('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                })}
              />

              {/* Mobile */}
              <Input
                label="Mobile Number *"
                placeholder="e.g. 555-010-0999"
                error={errorsEdit.mobile?.message}
                {...registerEdit('mobile', { required: 'Mobile is required' })}
              />

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Account Role</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...registerEdit('role')}
                    disabled={currentUser?.id === editingUser?.id}
                  >
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">Status</label>
                  <select
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
                    {...registerEdit('status')}
                    disabled={currentUser?.id === editingUser?.id}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

              </div>

              <div className="border-t border-neutral-100 pt-4 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: DELETE USER CONFIRMATION */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl animate-in scale-in duration-200">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900">Verify Account Deletion</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Are you absolutely certain you wish to delete this account? Enrolled progress and generated certificates will be deleted.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
