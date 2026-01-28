// Directory.jsx - Professional Alumni Directory
import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, User, Mail, MapPin, Briefcase, GraduationCap, 
  Upload, Download, X, Check, AlertCircle, FileSpreadsheet,
  ChevronRight, Calendar, Building2, Users, 
  Linkedin, Phone, MoreHorizontal, Edit3, Trash2,
  Plus, UserCircle, Shield, ExternalLink, LayoutGrid, List
} from "lucide-react";
import * as XLSX from "xlsx";

export default function Directory() {
  const { role, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [importData, setImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, activeFilter, selectedBatch, sortBy]);

  const fetchUsers = async () => {
    try {
      setError("");
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);

      const allUsers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.displayName || data.name || data.fullName || "Unknown User",
          email: data.email || "No email",
          role: data.role || "alumni",
          profession: data.profession || data.position || data.job || data.occupation || "",
          college: data.college || data.collegeName || data.university || "",
          batch: data.batch || data.class || "",
          gradYear: data.gradYear || data.graduateYear || data.yearToGraduate || data.yearOfGraduation || "",
          location: data.location || data.city || data.country || "",
          company: data.company || data.organization || "",
          phone: data.phone || data.phoneNumber || data.mobile || "",
          skills: data.skills || data.expertise || [],
          linkedin: data.linkedin || data.linkedInUrl || "",
          photoUrl: data.photoURL || data.photoUrl || data.avatar || "",
        };
      });

      const filtered = allUsers.filter(u => u.uid !== currentUser?.uid && u.id !== currentUser?.uid);
      setUsers(filtered);
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Failed to fetch users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.profession?.toLowerCase().includes(searchLower) ||
        user.company?.toLowerCase().includes(searchLower) ||
        user.location?.toLowerCase().includes(searchLower)
      );
    });

    if (activeFilter !== "all") {
      filtered = filtered.filter(user => user.role === activeFilter);
    }
    if (selectedBatch) {
      filtered = filtered.filter(user => user.batch === selectedBatch || user.gradYear === selectedBatch);
    }

      filtered.sort((a, b) => {
      const aVal = a[sortBy]?.toString().toLowerCase() || "";
      const bVal = b[sortBy]?.toString().toLowerCase() || "";
          return aVal.localeCompare(bVal);
      });

    setFilteredUsers(filtered);
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.name || !form.email || !form.role) {
      setError("Name, Email, and Role are required.");
      return;
    }

    try {
      if (editingUser) {
        await updateDoc(doc(db, "users", editingUser.id), { ...form, updatedAt: new Date().toISOString() });
        setSuccess("Updated successfully!");
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, "users", id), { ...form, createdAt: new Date().toISOString(), uid: id });
        setSuccess("Added successfully!");
      }
      
      await fetchUsers();
      setShowModal(false);
      setForm({});
      setEditingUser(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      await fetchUsers();
      if (selectedUser?.id === id) setSelectedUser(null);
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  // Excel Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const mappedData = jsonData.map((row, index) => {
          const user = {
            id: `import_${Date.now()}_${index}`,
            name: row.name || row.fullName || row['Full Name'] || row.Name || '',
            email: row.email || row.Email || row['Email Address'] || '',
            role: (row.role || row.Role || row.Type || 'alumni').toLowerCase(),
            profession: row.profession || row.Profession || row.Position || '',
            college: row.college || row.College || row.University || '',
            batch: row.batch || row.Batch || row.Class || '',
            gradYear: row.gradYear || row['Grad Year'] || row['Graduation Year'] || '',
            location: row.location || row.Location || row.City || '',
            company: row.company || row.Company || row.Organization || '',
            phone: row.phone || row.Phone || row['Phone Number'] || '',
            linkedin: row.linkedin || row.LinkedIn || '',
            createdAt: new Date().toISOString(),
          };
          user.valid = !!(user.name && user.email && user.role);
          return user;
        });

        setImportData(mappedData);
        setShowImportModal(true);
        e.target.value = '';
      } catch (error) {
        setError('Error parsing file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportUsers = async () => {
    if (!importData.length) return;
    setIsImporting(true);
    setImportProgress(0);

    const validUsers = importData.filter(user => user.valid);
    const batch = writeBatch(db);

    try {
      for (let i = 0; i < validUsers.length; i++) {
        const user = validUsers[i];
          const docId = user.email.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now();
        batch.set(doc(db, "users", docId), { ...user, uid: docId });
        setImportProgress(Math.round(((i + 1) / validUsers.length) * 100));
      }

      await batch.commit();
      await fetchUsers();
      setSuccess(`Imported ${validUsers.length} users!`);
      setShowImportModal(false);
      setImportData([]);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError('Failed to import users.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      { 'Name': 'John Doe', 'Email': 'john@example.com', 'Role': 'alumni', 'Profession': 'Software Engineer', 'College': 'MIT', 'Batch': '2020', 'Location': 'New York', 'Company': 'Tech Corp' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "AlumniConnect_Template.xlsx");
  };

  // Get unique batches for filter
  const batches = useMemo(() => {
    const allBatches = users.map(u => u.batch || u.gradYear).filter(b => b);
    return [...new Set(allBatches)].sort((a, b) => b.localeCompare(a));
  }, [users]);

  // Users filtered by batch only (for role stats)
  const batchFilteredUsers = useMemo(() => {
    if (!selectedBatch) return users;
    return users.filter(user => user.batch === selectedBatch || user.gradYear === selectedBatch);
  }, [users, selectedBatch]);

  // Stats - calculated from batch-filtered users so role counts update correctly
  const stats = useMemo(() => ({
    total: batchFilteredUsers.length,
    alumni: batchFilteredUsers.filter(u => u.role === 'alumni').length,
    students: batchFilteredUsers.filter(u => u.role === 'student').length,
    admins: batchFilteredUsers.filter(u => u.role === 'admin').length,
  }), [batchFilteredUsers]);

  const categories = [
    { id: "all", label: "All Members", icon: Users, count: stats.total },
    { id: "alumni", label: "Alumni", icon: GraduationCap, count: stats.alumni },
    { id: "student", label: "Students", icon: UserCircle, count: stats.students },
    { id: "admin", label: "Admins", icon: Shield, count: stats.admins },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Success Toast */}
      <AnimatePresence>
        {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 alert alert-success shadow-lg py-3"
          >
            <Check className="w-4 h-4" />
            <span>{success}</span>
            </motion.div>
          )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-base-content pb-2 border-b-2 border-primary">Alumni Directory</h1>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="join">
              <button
                onClick={() => setViewMode("list")}
                className={`btn btn-sm join-item ${viewMode === "list" ? "btn-active" : "btn-ghost"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`btn btn-sm join-item ${viewMode === "grid" ? "btn-active" : "btn-ghost"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-base-300 hidden sm:block"></div>
            
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                placeholder="Search members..."
                className="input input-bordered input-sm pl-9 w-48 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
                  {role === "admin" && (
              <button
                onClick={() => { setForm({}); setEditingUser(null); setShowModal(true); }}
                className="btn btn-primary btn-sm gap-2"
              >
                <Plus className="w-4 h-4" />
                        Add Member
              </button>
                  )}
              </div>
            </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Filters */}
          <div className="lg:col-span-3">
            <div className="bg-base-100 rounded-2xl shadow-sm p-4 sticky top-6">
              <h2 className="font-semibold text-base-content mb-4">Filter by Role</h2>
              
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeFilter === cat.id;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-primary text-primary-content' : 'bg-base-200'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Batch Filter */}
              {batches.length > 0 && (
                <div className="mt-6 pt-6 border-t border-base-200">
                  <h3 className="text-sm font-medium text-base-content/60 mb-3">Passout Year</h3>
              <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">All Years</option>
                    {batches.map(batch => (
                      <option key={batch} value={batch}>Class of {batch}</option>
                ))}
              </select>
            </div>
              )}

              {/* Admin Actions */}
              {role === "admin" && (
                <div className="mt-6 pt-6 border-t border-base-200 space-y-2">
              <button
                    onClick={() => setShowImportModal(true)}
                    className="btn btn-outline btn-sm w-full gap-2"
              >
                    <Upload className="w-4 h-4" />
                    Import Excel
              </button>
                  <button
                    onClick={downloadTemplate}
                    className="btn btn-ghost btn-sm w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              )}
              </div>
            </div>

          {/* CENTER - Main Content */}
          <div className="lg:col-span-9">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4 py-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
                <button className="btn btn-ghost btn-xs" onClick={() => setError("")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Members List/Grid */}
            {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
                className="bg-base-100 rounded-2xl shadow-sm p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-base-content/30" />
                </div>
                <h3 className="font-semibold text-base-content mb-2">No members found</h3>
                <p className="text-base-content/60 text-sm">
                  {searchTerm ? `No results for "${searchTerm}"` : "Try adjusting your filters"}
            </p>
          </motion.div>
            ) : viewMode === "list" ? (
              /* List View */
              <div className="space-y-2">
                {filteredUsers.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedUser(member)}
                    className="bg-base-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="avatar placeholder shrink-0">
                        {member.photoUrl ? (
                          <div className="w-12 h-12 rounded-full">
                            <img src={member.photoUrl} alt={member.name} />
                          </div>
                        ) : (
                          <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                            <span className="text-sm font-medium">{getInitials(member.name)}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-content">
                            {member.name}
                </h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-base-200 text-base-content/70">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/60 mt-0.5 line-clamp-1">
                          {[member.profession, member.company].filter(Boolean).join(' at ') || member.email}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="hidden sm:flex items-center gap-4 text-sm text-base-content/60">
                        {member.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {member.location}
                          </span>
                        )}
                        {(member.batch || member.gradYear) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {member.batch || member.gradYear}
                          </span>
                        )}
                      </div>

                      {/* Admin Actions */}
                      {role === "admin" && (
                        <div className="dropdown dropdown-end shrink-0">
                    <label
                            tabIndex={0} 
                            className="btn btn-ghost btn-xs btn-square"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                    </label>
                          <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-xl w-32 border border-base-200">
                            <li>
                              <button onClick={(e) => { e.stopPropagation(); setEditingUser(member); setForm(member); setShowModal(true); }}>
                                <Edit3 className="w-4 h-4" />
                                Edit
                    </button>
                            </li>
                            <li>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(member.id); }} className="text-error">
                                <Trash2 className="w-4 h-4" />
                                Delete
                </button>
                            </li>
                          </ul>
        </div>
                      )}

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-base-content/30 shrink-0" />
    </div>
                  </motion.article>
                ))}
                </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUsers.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedUser(member)}
                    className="bg-base-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all relative"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="avatar placeholder mb-3">
                        {member.photoUrl ? (
                          <div className="w-16 h-16 rounded-full">
                            <img src={member.photoUrl} alt={member.name} />
                  </div>
                        ) : (
                          <div className="bg-neutral text-neutral-content rounded-full w-16 h-16">
                            <span className="text-lg font-medium">{getInitials(member.name)}</span>
                </div>
                        )}
              </div>

                      {/* Name & Role */}
                      <h3 className="font-semibold text-base-content mb-1">
                        {member.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-base-200 text-base-content/70 mb-2">
                        {member.role}
                      </span>

                      {/* Profession */}
                      {(member.profession || member.company) && (
                        <p className="text-sm text-base-content/60 line-clamp-1 mb-2">
                          {[member.profession, member.company].filter(Boolean).join(' at ')}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-center gap-3 text-xs text-base-content/50 mt-auto">
                        {member.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {member.location}
                          </span>
                        )}
                        {(member.batch || member.gradYear) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {member.batch || member.gradYear}
                          </span>
                        )}
                      </div>
              </div>

                    {/* Admin Actions */}
              {role === "admin" && (
                      <div className="absolute top-2 right-2 dropdown dropdown-end">
                        <label 
                          tabIndex={0} 
                          className="btn btn-ghost btn-xs btn-square"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-xl w-32 border border-base-200">
                          <li>
                            <button onClick={(e) => { e.stopPropagation(); setEditingUser(member); setForm(member); setShowModal(true); }}>
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(member.id); }} className="text-error">
                              <Trash2 className="w-4 h-4" />
                    Delete
                            </button>
                          </li>
                        </ul>
                </div>
              )}
                  </motion.article>
                ))}
              </div>
            )}

            {/* Results Count */}
            {filteredUsers.length > 0 && (
              <div className="text-center mt-8 text-sm text-base-content/50">
                Showing {filteredUsers.length} of {users.length} members
                  </div>
            )}
                    </div>
                  </div>
                    </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="modal modal-open">
      <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    {selectedUser.photoUrl ? (
                      <div className="w-16 h-16 rounded-full">
                        <img src={selectedUser.photoUrl} alt={selectedUser.name} />
          </div>
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-full w-16 h-16">
                        <span className="text-xl font-medium">{getInitials(selectedUser.name)}</span>
                </div>
                    )}
              </div>
                <div>
                    <h3 className="text-xl font-bold text-base-content">{selectedUser.name}</h3>
                    <span className="text-sm text-base-content/60">{selectedUser.role}</span>
                    {selectedUser.profession && (
                      <p className="text-sm text-base-content/70 mt-1">{selectedUser.profession}</p>
                    )}
                    </div>
                    </div>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setSelectedUser(null)}>
                  <X className="w-5 h-5" />
                </button>
                </div>
                
              {/* Details */}
              <div className="space-y-4">
                {selectedUser.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-base-content/50" />
                </div>
                    <div>
                      <div className="text-xs text-base-content/50">Email</div>
                      <a href={`mailto:${selectedUser.email}`} className="text-sm text-base-content hover:text-primary">
                        {selectedUser.email}
                      </a>
              </div>
            </div>
                )}
                
                {selectedUser.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-base-content/50" />
                  </div>
                    <div>
                      <div className="text-xs text-base-content/50">Phone</div>
                      <span className="text-sm text-base-content">{selectedUser.phone}</span>
                  </div>
                  </div>
                )}
                
                {selectedUser.company && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-base-content/50" />
                    </div>
                    <div>
                      <div className="text-xs text-base-content/50">Company</div>
                      <span className="text-sm text-base-content">{selectedUser.company}</span>
                  </div>
                </div>
              )}

                {selectedUser.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-base-content/50" />
                      </div>
                    <div>
                      <div className="text-xs text-base-content/50">Location</div>
                      <span className="text-sm text-base-content">{selectedUser.location}</span>
                    </div>
                      </div>
                    )}

                {selectedUser.college && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-base-content/50" />
                  </div>
                    <div>
                      <div className="text-xs text-base-content/50">College</div>
                      <span className="text-sm text-base-content">{selectedUser.college}</span>
                  </div>
                </div>
              )}

                {(selectedUser.batch || selectedUser.gradYear) && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-base-content/50" />
                  </div>
                    <div>
                      <div className="text-xs text-base-content/50">Batch</div>
                      <span className="text-sm text-base-content">Class of {selectedUser.batch || selectedUser.gradYear}</span>
                  </div>
                </div>
              )}

                {/* Skills */}
                {selectedUser.skills?.length > 0 && (
                  <div className="pt-4 border-t border-base-200">
                    <div className="text-xs text-base-content/50 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-base-200 text-xs text-base-content/70">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-base-200 flex gap-2">
                {selectedUser.linkedin && (
                  <a
                    href={selectedUser.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm flex-1 gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                <a
                  href={`mailto:${selectedUser.email}`}
                  className="btn btn-outline btn-sm flex-1 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                </div>
    </motion.div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal modal-open">
      <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-box"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editingUser ? "Edit Member" : "Add Member"}</h3>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => { setShowModal(false); setEditingUser(null); setError(""); }}>
                  <X className="w-4 h-4" />
                  </button>
          </div>

              {error && (
                <div className="alert alert-error mb-4 py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control col-span-2">
                    <label className="label"><span className="label-text font-medium">Name *</span></label>
                    <input name="name" value={form.name || ""} onChange={handleFormChange} className="input input-bordered" required />
                </div>
                  
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Email *</span></label>
                    <input name="email" type="email" value={form.email || ""} onChange={handleFormChange} className="input input-bordered" required />
              </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Role *</span></label>
                    <select name="role" value={form.role || ""} onChange={handleFormChange} className="select select-bordered" required>
                      <option value="">Select</option>
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="admin">Admin</option>
                    </select>
            </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Profession</span></label>
                    <input name="profession" value={form.profession || ""} onChange={handleFormChange} className="input input-bordered" />
        </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Company</span></label>
                    <input name="company" value={form.company || ""} onChange={handleFormChange} className="input input-bordered" />
    </div>
                
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">College</span></label>
                    <input name="college" value={form.college || ""} onChange={handleFormChange} className="input input-bordered" />
                </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Location</span></label>
                    <input name="location" value={form.location || ""} onChange={handleFormChange} className="input input-bordered" />
            </div>
            
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Batch</span></label>
                    <input name="batch" value={form.batch || ""} onChange={handleFormChange} className="input input-bordered" placeholder="e.g. 2020" />
            </div>
            
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Grad Year</span></label>
                    <input name="gradYear" value={form.gradYear || ""} onChange={handleFormChange} className="input input-bordered" placeholder="e.g. 2024" />
                  </div>
                  </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditingUser(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingUser ? "Update" : "Add Member"}</button>
                  </div>
              </form>
            </motion.div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingUser(null); }}></div>
                    </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="modal modal-open">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-box max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Import Members</h3>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => { setShowImportModal(false); setImportData([]); }}>
                  <X className="w-4 h-4" />
                </button>
            </div>

              {importData.length === 0 ? (
                <div className="text-center py-8">
                  <FileSpreadsheet className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Upload Excel/CSV File</h4>
                  <p className="text-base-content/60 mb-6 text-sm">Supports .xlsx, .xls, .csv files</p>
                  
                  <div className="border-2 border-dashed border-base-300 rounded-2xl p-8 hover:border-primary transition-colors max-w-sm mx-auto">
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" id="importFileUpload" />
                    <label htmlFor="importFileUpload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-base-content/40 mb-3" />
                      <span className="font-medium">Click to upload</span>
                </label>
              </div>

                  <button onClick={downloadTemplate} className="btn btn-ghost btn-sm gap-2 mt-4">
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                      </div>
              ) : (
                <div className="space-y-4">
                  <div className="stats shadow w-full">
                    <div className="stat">
                      <div className="stat-title">Valid</div>
                      <div className="stat-value text-2xl">{importData.filter(u => u.valid).length}</div>
                      </div>
                    <div className="stat">
                      <div className="stat-title">Invalid</div>
                      <div className="stat-value text-2xl">{importData.filter(u => !u.valid).length}</div>
                  </div>
                    <div className="stat">
                      <div className="stat-title">Total</div>
                      <div className="stat-value text-2xl">{importData.length}</div>
                </div>
          </div>

              {isImporting && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Importing...</span>
                        <span>{importProgress}%</span>
                  </div>
                      <progress className="progress progress-primary w-full" value={importProgress} max="100"></progress>
                </div>
              )}

                  <div className="overflow-x-auto max-h-48 rounded-lg border border-base-200">
                    <table className="table table-sm">
                      <thead className="bg-base-200 sticky top-0">
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                        {importData.slice(0, 8).map((user, index) => (
                          <tr key={index}>
                            <td>{user.valid ? <Check className="w-4 h-4 text-base-content/50" /> : <X className="w-4 h-4 text-base-content/30" />}</td>
                            <td className="truncate max-w-24">{user.name}</td>
                            <td className="truncate max-w-32">{user.email}</td>
                            <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

                  <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost" onClick={() => { setShowImportModal(false); setImportData([]); }} disabled={isImporting}>Cancel</button>
            <button
                      onClick={handleImportUsers}
                      disabled={isImporting || importData.filter(u => u.valid).length === 0}
                      className="btn btn-primary gap-2"
                    >
                      {isImporting ? <span className="loading loading-spinner loading-sm"></span> : <Check className="w-4 h-4" />}
                      Import {importData.filter(u => u.valid).length}
            </button>
          </div>
        </div>
          )}
      </motion.div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm" onClick={() => { setShowImportModal(false); setImportData([]); }}></div>
    </div>
        )}
      </AnimatePresence>
    </div>
  );
}
