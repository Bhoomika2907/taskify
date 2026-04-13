// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext';
// import {
//   ArrowLeft, Plus, X, MessageSquare, Send, ChevronRight,
//   Calendar, CheckCircle2, Loader2, User as UserIcon, Users
// } from 'lucide-react';
// import { format } from 'date-fns';

// // ✅ Types and Services
// import type { Task, TaskStatus, Project, ProjectMember, Comment } from '../services/types';
// import { projectService } from '../services/projectService';
// import { taskService } from '../services/taskService';
// import { commentService } from '../services/commentService';
// import { authService } from '../services/authService';

// // ─── Constants ────────────────────────────────────────────────────────────
// const COLUMNS: { key: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
//   { key: 'todo',        label: 'To Do',      color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
//   { key: 'in_progress', label: 'In Progress', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
//   { key: 'completed',   label: 'Completed',   color: '#059669', bg: '#ECFDF5', dot: '#10B981' },
// ];

// const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
//   todo: 'in_progress',
//   in_progress: 'completed',
//   completed: null,
// };

// const STATUS_LABEL: Record<TaskStatus, string> = {
//   todo: 'Start',
//   in_progress: 'Complete',
//   completed: 'Done',
// };

// // ─── Side Discussion Panel (Drawer) ──────────────────────────────────────────
// const TaskSidePanel = ({ task, user, onClose }: { task: Task; user: any; onClose: () => void }) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     if (task) {
//       setLoading(true);
//       commentService.getByTask(task.id)
//         .then(setComments)
//         .catch(() => toast.error('Could not load comments'))
//         .finally(() => setLoading(false));
//     }
//   }, [task?.id]);

//   const send = async () => {
//     if (!text.trim()) return;
//     setSending(true);
//     try {
//       const comment = await commentService.create({ task: task.id, text });
//       setComments(prev => [...prev, { ...comment, user_name: user?.name }]);
//       setText('');
//     } catch {
//       toast.error('Failed to send comment');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
//       <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
//           <div className="flex-1 pr-4">
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Discussion</span>
//             <h2 className="text-xl font-bold text-gray-900 leading-tight">{task.name}</h2>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {loading ? (
//             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-200" /></div>
//           ) : comments.length === 0 ? (
//             <div className="text-center py-20 text-gray-400 text-sm">No messages yet.</div>
//           ) : (
//             comments.map((c, i) => (
//               <div key={c.id || i} className="flex gap-4">
//                 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase">
//                   {(c.user_name || 'U').charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-baseline justify-between mb-1">
//                     <span className="text-sm font-bold text-gray-900">{c.user_name || 'Member'}</span>
//                     <span className="text-[10px] text-gray-400">{c.created_at ? format(new Date(c.created_at), 'MMM d, p') : 'Just now'}</span>
//                   </div>
//                   <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700">{c.text}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         <div className="p-6 border-t border-gray-100">
//           <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2 pr-3">
//             <textarea
//               rows={1}
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Write a message..."
//               className="flex-1 bg-transparent border-none outline-none text-sm p-2 resize-none"
//               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
//             />
//             <button onClick={send} disabled={sending || !text.trim()} className="bg-black text-white p-2.5 rounded-xl disabled:opacity-20"><Send className="w-4 h-4" /></button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ─── Task Card ──────────────────────────────────────────────────────────────
// const TaskCard = ({ task, canAdvance, onAdvance, isAdvancing, onOpenComments }: any) => {
//   const next = NEXT_STATUS[task.status as TaskStatus];
//   return (
//     <div className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
//       <div className="flex justify-between items-start mb-2">
//         <h4 className="font-bold text-sm text-gray-800">{task.name}</h4>
//         {task.deadline && <span className="text-[10px] text-gray-400 font-bold">{format(new Date(task.deadline), 'MMM d')}</span>}
//       </div>
//       <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
//       <div className="flex items-center justify-between pt-3 border-t border-black/5">
//         <button onClick={() => onOpenComments(task)} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-black transition-colors">
//           <MessageSquare className="w-4 h-4" /> Comments
//         </button>
//         {canAdvance && next ? (
//           <button onClick={onAdvance} disabled={isAdvancing} className="bg-black text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-gray-800">
//             {isAdvancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
//             {STATUS_LABEL[task.status as TaskStatus]}
//           </button>
//         ) : task.status === 'completed' && (
//           <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> DONE</span>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── Create Task Modal ──────────────────────────────────────────────────────
// const CreateTaskModal = ({ isOpen, onClose, projectId, members, onCreated }: any) => {
//   const [form, setForm] = useState({ name: '', description: '', assigned_to: '', deadline: '' });
//   const [saving, setSaving] = useState(false);
//   if (!isOpen) return null;

//   const submit = async (e: any) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await taskService.create({ ...form, project: Number(projectId), assigned_to: Number(form.assigned_to) });
//       toast.success('Task created');
//       onCreated();
//       onClose();
//     } catch { toast.error('Error creating task'); } finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
//       <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
//         <h3 className="text-2xl font-bold mb-6">New Task</h3>
//         <form onSubmit={submit} className="space-y-4">
//           <input className="w-full p-4 bg-gray-100 rounded-2xl outline-none" placeholder="Task Name" required onChange={e => setForm({...form, name: e.target.value})} />
//           <textarea className="w-full p-4 bg-gray-100 rounded-2xl h-28 outline-none resize-none" placeholder="Description" required onChange={e => setForm({...form, description: e.target.value})} />
//           <input type="date" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" required onChange={e => setForm({...form, deadline: e.target.value})} />
//           <select className="w-full p-4 bg-gray-100 rounded-2xl outline-none appearance-none" required onChange={e => setForm({...form, assigned_to: e.target.value})}>
//             <option value="">Assign To...</option>
//             {members.map((m: any) => <option key={m.user} value={m.user}>{m.name}</option>)}
//           </select>
//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={onClose} className="flex-1 py-4 font-bold bg-gray-100 rounded-2xl">Cancel</button>
//             <button type="submit" disabled={saving} className="flex-1 py-4 font-bold bg-black text-white rounded-2xl">{saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create'}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ─── Main Project Details Page ──────────────────────────────────────────────
// const ProjectDetails = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [project, setProject] = useState<Project | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [members, setMembers] = useState<ProjectMember[]>([]);
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Team Management State
//   const [showTeamPanel, setShowTeamPanel] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
//   const [teamLead, setTeamLead] = useState<number | null>(null);
//   const [savingTeam, setSavingTeam] = useState(false);

//   // Modals / Discussion State
//   const [selectedTaskForComments, setSelectedTaskForComments] = useState<Task | null>(null);
//   const [showTaskModal, setShowTaskModal] = useState(false);
//   const [advancingId, setAdvancingId] = useState<number | null>(null);

//   const fetchData = async () => {
//     try {
//       const [proj, taskList, users, memberList] = await Promise.all([
//         projectService.getById(id!),
//         taskService.getByProject(id!),
//         authService.getUsers(),
//         projectService.getMembers(id!),
//       ]);
//       setProject(proj);
//       setTasks(taskList);
//       setAllUsers(users);
//       setMembers(memberList);
//     } catch { toast.error('Failed to load project'); } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchData(); }, [id]);

//   const toggleUserSelection = (uid: number) => {
//     setSelectedUsers(prev => prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]);
//     if (teamLead === uid) setTeamLead(null);
//   };

//   const handleAddTeam = async () => {
//     if (!selectedUsers.length || !teamLead) {
//       toast.error('Select members and a team lead');
//       return;
//     }
//     setSavingTeam(true);
//     try {
//       await projectService.addMembers({ project: Number(id), users: selectedUsers, team_lead: teamLead });
//       toast.success('Team assigned!');
//       setShowTeamPanel(false);
//       fetchData();
//     } catch { toast.error('Failed to assign team'); } finally { setSavingTeam(false); }
//   };

//   const advanceStatus = async (task: Task) => {
//     const next = NEXT_STATUS[task.status];
//     if (!next) return;
//     setAdvancingId(task.id);
//     try {
//       await taskService.updateStatus(task.id, { status: next });
//       setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
//     } catch { toast.error('Update failed'); } finally { setAdvancingId(null); }
//   };

//   const isManager = user?.role === 'manager';
//   const isTeamLead = members.some(m => m.user === user?.id && m.is_team_lead);

//   if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-gray-200" /></div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-12 pb-20">
//       <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-black font-medium transition-colors">
//         <ArrowLeft className="w-4 h-4" /> Back
//       </button>

//       <div className="flex justify-between items-end border-b border-gray-100 pb-8">
//         <div>
//           <h1 className="text-5xl font-black tracking-tight mb-4">{project?.name}</h1>
//           <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">{project?.description}</p>
//         </div>
//         <div className="flex gap-4">
//           {isManager && (
//             <button onClick={() => setShowTeamPanel(!showTeamPanel)} className="bg-white border-2 border-black text-black px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-sm hover:bg-gray-50 transition-all">
//               <Users className="w-5 h-5" /> {showTeamPanel ? 'Cancel' : 'Manage Team'}
//             </button>
//           )}
//           {isTeamLead && (
//             <button onClick={() => setShowTaskModal(true)} className="bg-black text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl hover:scale-[1.02] transition-all">
//               <Plus className="w-5 h-5" /> New Task
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Team Management Section (FOR MANAGERS) */}
//       {showTeamPanel && (
//         <section className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-xl animate-in fade-in zoom-in duration-200">
//           <h2 className="text-2xl font-bold mb-6">Assign Team Members</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//             {allUsers.filter(u => u.role === 'employee').map(u => (
//               <div 
//                 key={u.id} 
//                 onClick={() => toggleUserSelection(u.id)}
//                 className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
//                   selectedUsers.includes(u.id) ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300'
//                 }`}
//               >
//                 <div>
//                   <p className="font-bold text-sm">{u.name}</p>
//                   <p className={`text-[10px] ${selectedUsers.includes(u.id) ? 'text-gray-400' : 'text-gray-500'}`}>{u.email}</p>
//                 </div>
//                 {selectedUsers.includes(u.id) && (
//                   <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
//                     <span className="text-[10px] font-black uppercase">Lead?</span>
//                     <input 
//                       type="radio" 
//                       name="lead" 
//                       checked={teamLead === u.id} 
//                       onChange={() => setTeamLead(u.id)} 
//                       className="w-4 h-4 accent-white" 
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button 
//             onClick={handleAddTeam} 
//             disabled={savingTeam || !teamLead} 
//             className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-30 transition-all"
//           >
//             {savingTeam ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Confirm Team Assignment'}
//           </button>
//         </section>
//       )}

//       {/* Task Board */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {COLUMNS.map(col => (
//           <div key={col.key} className="flex flex-col gap-5">
//             <div className="flex items-center justify-between px-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
//                 <span className="text-xs font-black uppercase tracking-widest" style={{ color: col.color }}>{col.label}</span>
//               </div>
//               <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-lg">
//                 {tasks.filter(t => t.status === col.key).length}
//               </span>
//             </div>
//             <div className="space-y-4 min-h-[400px] p-3 rounded-[32px]" style={{ background: col.bg }}>
//               {tasks.filter(t => t.status === col.key).map((task, idx) => (
//                 <TaskCard
//                   key={task.id || idx}
//                   task={task}
//                   canAdvance={task.assigned_to === user?.id}
//                   onAdvance={() => advanceStatus(task)}
//                   isAdvancing={advancingId === task.id}
//                   onOpenComments={(t: Task) => setSelectedTaskForComments(t)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </section>

//       {selectedTaskForComments && <TaskSidePanel task={selectedTaskForComments} user={user} onClose={() => setSelectedTaskForComments(null)} />}

//       {/* Display Team Members */}
//       <section className="pt-10 border-t border-gray-100">
//         <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Project Team</h2>
//         <div className="flex flex-wrap gap-4">
//           {members.length === 0 ? <p className="text-sm text-gray-400 italic">No members assigned yet.</p> : members.map(m => (
//             <div key={m.user} className="flex items-center gap-3 bg-white p-2 pr-4 border border-black/5 rounded-2xl shadow-sm">
//               <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm uppercase">{m.name.charAt(0)}</div>
//               <div>
//                 <p className="text-sm font-bold text-gray-900 leading-none mb-1">{m.name}</p>
//                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{m.is_team_lead ? 'Team Lead' : 'Member'}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <CreateTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} projectId={id} members={members} onCreated={fetchData} />
//     </div>
//   );
// };

// export default ProjectDetails;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  DragDropContext, Droppable, Draggable,
  DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot
} from '@hello-pangea/dnd';
import {
  ArrowLeft, Plus, X, MessageSquare, Send,
  CheckCircle2, Loader2, Users, Edit3, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { Paperclip, FileText, Image as ImageIcon, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Task, TaskStatus, Project, ProjectMember, Comment, UserProfile } from '../services/types';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';

// ─── Constants & Styles ───────────────────────────────────────────────────────
const COLUMNS: { key: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { key: 'todo',        label: 'To Do',       color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
  { key: 'in_progress', label: 'In Progress',  color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  { key: 'completed',   label: 'Completed',    color: '#059669', bg: '#ECFDF5', dot: '#10B981' },
];

const PRIORITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  high:   { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  low:    { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
};

// ─── Fix for React 18/19 Strict Mode ─────────────────────────────────────────
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => { cancelAnimationFrame(animation); setEnabled(false); };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

// ─── Sub-Component: Edit Task Modal ──────────────────────────────────────────
const EditTaskModal = ({ isOpen, onClose, task, onUpdated }: any) => {
  const [form, setForm] = useState({ name: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) setForm({ 
        name: task.name || '', 
        description: task.description || '', 
        priority: task.priority || 'medium' 
    });
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await taskService.update(task.id, form);
      toast.success('Task updated');
      onUpdated();
      onClose();
    } catch { toast.error('Failed to update'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6">Edit Task</h3>
        <div className="space-y-4">
          <input className="w-full p-4 bg-gray-100 rounded-2xl outline-none text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Task name" />
          <textarea className="w-full p-4 bg-gray-100 rounded-2xl h-32 outline-none resize-none text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" />
          <select className="w-full p-4 bg-gray-100 rounded-2xl outline-none text-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 font-bold bg-gray-100 rounded-2xl text-sm">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-4 font-bold bg-black text-white rounded-2xl text-sm flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-Component: Task Side Panel (Comments) ───────────────────────────────
// ─── Sub-Component: Side Discussion Panel (With File Attachments) ──────────────
const TaskSidePanel = ({ task, user, onClose }: { task: Task; user: any; onClose: () => void }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null); // Track selected file
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Use a ref for the hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setLoading(true);
      commentService.getByTask(task.id)
        .then(setComments)
        .catch(() => toast.error('Could not load comments'))
        .finally(() => setLoading(false));
    }
  }, [task?.id]);

  const handleSend = async () => {
    // Prevent sending if both text and file are empty
    if (!text.trim() && !file) return;
    
    setSending(true);
    
    // We use FormData to send files to the backend
    const formData = new FormData();
    formData.append('task', String(task.id));
    if (text.trim()) formData.append('text', text);
    if (file) formData.append('file', file);

    try {
      const resp = await commentService.create(formData);
      // Backend returns the new comment. We add user_name locally for immediate UI update
      setComments(prev => [...prev, { ...resp, user_name: user?.name }]);
      setText('');
      setFile(null); // Clear selected file
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Helper to check file type for icon display
  const isPdf = (fileName: string) => fileName.toLowerCase().endsWith('.pdf');

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Side Drawer */}
      <div className="fixed inset-y-0 right-0 z-[90] w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header: Displays Task Name */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex-1 pr-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Discussion</span>
            <h2 className="font-bold text-gray-900 truncate leading-tight">{task.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs">Loading conversation...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="text-sm text-gray-400">No messages yet.</p>
            </div>
          ) : (
            comments.map((c: any, i) => (
              <div key={c.id || i} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase">
                  {(c.user_name || 'U').charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">{c.user_name || 'Member'}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {c.created_at ? format(new Date(c.created_at), 'p') : 'Just now'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm inline-block min-w-[100px] max-w-full">
                    {c.text && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.text}</p>}
                    
                    {/* Attachment Display */}
                    {c.file && (
                      <div className={`mt-2 flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-gray-200 ${c.text ? 'mt-3' : ''}`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          {isPdf(c.file) ? (
                            <FileText className="w-4 h-4 text-red-500" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-[11px] font-medium text-gray-600 truncate max-w-[150px]">
                            {c.file.split('/').pop()}
                          </span>
                        </div>
                        <a 
                          href={`http://127.0.0.1:8000${c.file}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100 bg-white">
          {/* File Pending Preview */}
          {file && (
            <div className="mb-3 flex items-center justify-between bg-blue-50 p-3 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                  {isPdf(file.name) ? <FileText size={16}/> : <ImageIcon size={16}/>}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-blue-700 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[9px] text-blue-500 uppercase">Ready to send</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-1 hover:bg-blue-100 rounded-full text-blue-400">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2 pr-3 focus-within:ring-2 focus-within:ring-black/5 transition-all">
            {/* Paperclip Button */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-2.5 rounded-xl transition-colors ${file ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-200'}`}
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none outline-none text-sm p-2 resize-none max-h-32"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            
            <button
              onClick={handleSend}
              disabled={sending || (!text.trim() && !file)}
              className="bg-black text-white p-2.5 rounded-xl disabled:opacity-20 hover:bg-gray-800 transition-all shadow-lg"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
// ─── Main Page ────────────────────────────────────────────────────────────────
const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]   = useState<Project | null>(null);
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [members, setMembers]   = useState<ProjectMember[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading]   = useState(true);

  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [teamLeadId, setTeamLeadId]       = useState<number | null>(null);

  const [activeComments, setActiveComments] = useState<Task | null>(null);
  const [activeEdit, setActiveEdit]         = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal]   = useState(false);

  const isManager  = user?.role === 'manager';
  const isTeamLead = members.some(m => m.user === user?.id && m.is_team_lead);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [proj, tks, usrs, mems] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        authService.getUsers(),
        projectService.getMembers(id),
      ]);
  
      setProject(proj);
      setTasks(tks);
      setAllUsers(usrs);
      setMembers(mems);
  
      // ✅ FIX: Pre-populate the team management states with existing data
      const existingUserIds = mems.map((m: ProjectMember) => m.user);
      const existingLead = mems.find((m: ProjectMember) => m.is_team_lead);
      
      setSelectedUsers(existingUserIds);
      if (existingLead) {
        setTeamLeadId(existingLead.user);
      }
  
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const task = tasks.find(t => String(t.id) === draggableId);
    if (!task) return;

    if (task.assigned_to !== user?.id && !isTeamLead) {
      toast.error('Not authorized');
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    setTasks(prev => prev.map(t => String(t.id) === draggableId ? { ...t, status: newStatus } : t));

    try { await taskService.updateStatus(task.id, { status: newStatus }); }
    catch { toast.error('Sync failed'); fetchData(); }
  };

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin w-10 h-10 text-gray-300" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 pb-20">
      
      {/* Navbar */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-black font-medium transition-all text-sm"><ArrowLeft size={18} /> Back</button>
        <div className="flex gap-3">
          {isManager && (
            <button onClick={() => setShowTeamPanel(!showTeamPanel)} className="px-5 py-2.5 border-2 border-black rounded-2xl font-bold flex items-center gap-2 text-sm">
              <Users size={18} /> {showTeamPanel ? 'Cancel' : 'Manage Team'}
            </button>
          )}
          {isTeamLead && (
            <button onClick={() => setShowTaskModal(true)} className="px-5 py-2.5 bg-black text-white rounded-2xl font-bold flex items-center gap-2 text-sm hover:bg-gray-800">
              <Plus size={18} /> New Task
            </button>
          )}
        </div>
      </div>

      <header>
        <h1 className="text-5xl font-black mb-3 tracking-tight">{project?.name}</h1>
        <p className="text-gray-500 text-lg leading-relaxed">{project?.description}</p>
      </header>

      {/* Team Manager */}
      {showTeamPanel && (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Manage Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {allUsers.filter(u => u.role === 'employee').map(u => (
              <div key={u.id} onClick={() => setSelectedUsers(p => p.includes(u.id) ? p.filter(i => i !== u.id) : [...p, u.id])}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedUsers.includes(u.id) ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-gray-300'}`}>
                <p className="font-bold text-sm">{u.name}</p>
                {selectedUsers.includes(u.id) && (
                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <input type="radio" checked={teamLeadId === u.id} onChange={() => setTeamLeadId(u.id)} className="accent-white" />
                    <span className="text-[10px] font-bold uppercase">Team Lead</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={async () => {
             await projectService.addMembers({ project: Number(id), users: selectedUsers, team_lead: teamLeadId! });
             setShowTeamPanel(false); fetchData();
          }} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm shadow-xl">Confirm Team Assignment</button>
        </div>
      )}

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLUMNS.map(col => (
            <div key={col.key} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: col.color }}>{col.label}</span>
                </div>
                <span className="bg-white text-gray-400 px-2 py-1 rounded-lg text-[10px] font-bold">{tasks.filter(t => t.status === col.key).length}</span>
              </div>

              <StrictModeDroppable droppableId={col.key}>
                {(provided: any, snapshot: any) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`p-3 rounded-[32px] min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'ring-2 ring-black/5' : ''}`} style={{ background: col.bg }}>
                    {tasks.filter(t => t.status === col.key).map((task, index) => (
                      <Draggable key={`task-card-${task.id}`} draggableId={String(task.id)} index={index}>
                        {(provided: any, snapshot: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white p-5 rounded-2xl shadow-sm mb-4 transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-black/5' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col gap-1.5">
                                  {/* Priority Badge */}
                                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider w-fit ${PRIORITY_STYLES[task.priority || 'medium'].bg} ${PRIORITY_STYLES[task.priority || 'medium'].text}`}>
                                    <span className={`w-1 h-1 rounded-full ${PRIORITY_STYLES[task.priority || 'medium'].dot}`} />
                                    {task.priority || 'medium'}
                                  </div>
                                  <h4 className="font-bold text-sm text-gray-900">{task.name}</h4>
                                </div>
                                {isTeamLead && <Edit3 size={14} className="text-gray-300 hover:text-black cursor-pointer" onClick={() => setActiveEdit(task)} />}
                            </div>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                              <button onClick={() => setActiveComments(task)} className="text-[10px] font-bold text-gray-400 hover:text-black flex items-center gap-1.5 transition-colors"><MessageSquare size={14} /> Discussion</button>
                              {col.key === 'completed' && isTeamLead ? (
                                <button onClick={async () => { await taskService.updateStatus(task.id, { status: 'in_progress' }); fetchData(); }} className="text-[10px] font-bold text-orange-500 flex items-center gap-1"><RotateCcw size={14} /> Redo</button>
                              ) : col.key === 'completed' && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14} /> Done</span>}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {activeComments && <TaskSidePanel task={activeComments} user={user} onClose={() => setActiveComments(null)} />}
      <EditTaskModal isOpen={!!activeEdit} task={activeEdit} onClose={() => setActiveEdit(null)} onUpdated={fetchData} />

      <section className="pt-10 border-t border-gray-100 dark:border-zinc-800">
  <h2 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
    Project Team
  </h2>
  <div className="flex flex-wrap gap-4">
    {members.length === 0 ? (
      <p className="text-sm text-gray-400 italic">No members assigned yet.</p>
    ) : (
      members.map(m => (
        <div key={m.id} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 pr-4 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm uppercase">
            {m.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 leading-none mb-1">{m.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
              {m.is_team_lead ? 'Team Lead' : 'Member'}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</section>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[40px] w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-6 items-center"><h3 className="text-2xl font-bold">New Task</h3><X onClick={() => setShowTaskModal(false)} className="cursor-pointer text-gray-400" /></div>
            <form onSubmit={async (e: any) => {
              e.preventDefault(); const fd = new FormData(e.currentTarget);
              await taskService.create({
                name: String(fd.get('name')), description: String(fd.get('description')),
                project: Number(id), assigned_to: Number(fd.get('assigned_to')),
                deadline: String(fd.get('deadline')), priority: String(fd.get('priority')) as any
              });
              toast.success('Created'); setShowTaskModal(false); fetchData();
            }} className="space-y-4">
              <input name="name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" placeholder="Title" required />
              <textarea name="description" className="w-full p-4 bg-gray-50 rounded-2xl h-24 outline-none resize-none text-sm" placeholder="Description" required />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Deadline</label>
                <input name="deadline" type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" required /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Priority</label>
                <select name="priority" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" defaultValue="medium">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select></div>
              </div>
              <select name="assigned_to" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" required>
                <option value="">Assign to...</option>
                {members.map(m => <option key={`m-${m.user}`} value={m.user}>{m.name}</option>)}
              </select>
              <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;