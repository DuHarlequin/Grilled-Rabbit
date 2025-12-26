import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Grid, List, Plus, Image as ImageIcon, Calendar as CalendarIcon, 
    MoreHorizontal, Clock, LayoutGrid, Move, Trash2,
    Save, X, Rabbit, ChevronLeft, ChevronRight, Filter,
    Video, Mic, Edit3, Share, CheckCircle2, Circle,
    Building2, Briefcase, Settings, LogOut, AlertTriangle, Menu, ChevronDown
} from 'lucide-react';

// --- ESTILOS GLOBALES ---
const GlobalStyles = () => (
    <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    `}</style>
);

// --- ICONOS DE REDES SOCIALES ---
const SocialIcons = {
    instagram: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    ),
    tiktok: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    ),
    facebook: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    ),
    twitter: ({ className }) => ( // X logo approximation
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
    ),
    youtube: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
    ),
    linkedin: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    )
};

const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'tiktok', label: 'TikTok', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 'youtube', label: 'YouTube', color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'twitter', label: 'X / Twitter', color: 'text-slate-200', bg: 'bg-slate-700/50' },
    { id: 'facebook', label: 'Facebook', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'linkedin', label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-400/10' }
];

const STATUS_COLUMNS = [
    { id: 'start', label: 'Por Empezar', icon: Circle, color: 'border-slate-500', textColor: 'text-slate-400' },
    { id: 'recording', label: 'Grabar', icon: Video, color: 'border-red-500', textColor: 'text-red-400' },
    { id: 'editing', label: 'Editar', icon: Edit3, color: 'border-blue-500', textColor: 'text-blue-400' },
    { id: 'publishing', label: 'Publicar', icon: Share, color: 'border-green-500', textColor: 'text-green-400' }
];

// --- DATOS INICIALES ---
const INITIAL_COMPANIES = [
    { id: 1, name: "Rabbit Corp", color: "bg-indigo-600", initials: "RC" },
    { id: 2, name: "Acme Store", color: "bg-emerald-600", initials: "AS" },
];

const INITIAL_POSTS = [
    { id: 1, companyId: 1, title: "Lanzamiento Producto", platform: 'instagram', type: "Reel", status: "publishing", image: null, date: "2025-10-25", caption: "¡Ya está aquí! 🔥 #lanzamiento" },
    { id: 2, companyId: 1, title: "Vlog Semanal", platform: 'youtube', type: "Video", status: "editing", image: null, date: "2025-10-26", caption: "Editando el vlog de la semana..." },
    { id: 3, companyId: 2, title: "Promo Verano", platform: 'tiktok', type: "Short", status: "recording", image: null, date: "2025-10-27", caption: "Descuentos locos 💃" },
    { id: 4, companyId: 2, title: "Anuncio Apertura", platform: 'facebook', type: "Post", status: "start", image: null, date: "2025-10-28", caption: "Abrimos puertas." },
];

// --- COMPONENTES AUXILIARES ---

const PlatformIcon = ({ platformId, className = "w-4 h-4" }) => {
    const Icon = SocialIcons[platformId] || SocialIcons.instagram;
    const plat = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
    return <Icon className={`${className} ${plat.color}`} />;
};

// --- COMPONENTE DE CALENDARIO ---
const CalendarView = ({ posts, onEditPost, onNewPost, currentCompany }) => {
    const [viewMode, setViewMode] = useState('month'); 
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const changeDate = (amount) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + amount);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (amount * 7));
        else if (viewMode === 'day') newDate.setDate(newDate.getDate() + amount);
        else if (viewMode === 'year') newDate.setFullYear(newDate.getFullYear() + amount);
        setCurrentDate(newDate);
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const getPostsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return posts.filter(p => p.date === dateStr);
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700 gap-4 shrink-0">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${currentCompany.color}`}>
                    {currentCompany.initials}
                </div>
                <h2 className="text-lg font-bold">
                    Calendario de {currentCompany.name}
                </h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 rounded-full px-2 py-1">
                <button onClick={() => changeDate(-1)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
                <div className="text-sm font-semibold min-w-[120px] text-center">
                    {viewMode === 'year' && currentDate.getFullYear()}
                    {viewMode === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    {viewMode === 'week' && `Semana ${currentDate.toLocaleDateString('es-ES', { day: 'numeric' })}`}
                    {viewMode === 'day' && currentDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                </div>
                <button onClick={() => changeDate(1)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"><ChevronRight size={18} /></button>
            </div>

            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                {['month', 'week', 'day'].map(m => (
                    <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition ${viewMode === m ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        {m === 'month' ? 'Mes' : m === 'week' ? 'Sem' : 'Día'}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderMonthView = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const blanks = Array(firstDay).fill(null);
        const daySlots = Array.from({ length: days }, (_, i) => i + 1);

        return (
            <div className="grid grid-cols-7 gap-px bg-slate-700 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} className="bg-slate-800 p-2 text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-900/50 min-h-[80px] md:min-h-[120px]" />)}
                {daySlots.map(day => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dayPosts = getPostsForDate(date);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                        <div 
                            key={day} 
                            onClick={() => onNewPost(date)}
                            className={`bg-slate-900/80 min-h-[80px] md:min-h-[120px] p-2 hover:bg-slate-800 transition cursor-pointer relative group ${isToday ? 'bg-indigo-900/10 ring-1 ring-indigo-500/30 inset-0' : ''}`}
                        >
                            <span className={`text-xs font-medium ${isToday ? 'bg-indigo-600 w-5 h-5 flex items-center justify-center rounded-full text-white' : 'text-slate-400'}`}>
                                {day}
                            </span>
                            <div className="mt-1 space-y-1">
                                {dayPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                                        className={`text-[9px] p-1 rounded border-l-2 flex items-center gap-1 truncate transition hover:scale-105 ${
                                            post.status === 'publishing' ? 'bg-green-500/10 border-green-500 text-green-200' :
                                            post.status === 'recording' ? 'bg-red-500/10 border-red-500 text-red-200' :
                                            post.status === 'editing' ? 'bg-blue-500/10 border-blue-500 text-blue-200' :
                                            'bg-slate-700 border-slate-500 text-slate-300'
                                        }`}
                                    >
                                        <PlatformIcon platformId={post.platform} className="w-2.5 h-2.5 flex-shrink-0" />
                                        <span className="truncate">{post.title}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-slate-700 hover:bg-indigo-600 rounded-full text-white shadow-lg transition">
                                <Plus size={10} />
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {[0,1,2,3,4,5,6].map(offset => {
                    const date = new Date(startOfWeek);
                    date.setDate(startOfWeek.getDate() + offset);
                    const dayPosts = getPostsForDate(date);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <div key={offset} className={`bg-slate-800/50 rounded-xl p-3 border ${isToday ? 'border-indigo-500' : 'border-slate-700'}`}>
                            <div className="text-center mb-3 pb-2 border-b border-slate-700">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div className={`text-lg font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                                    {date.getDate()}
                                </div>
                            </div>
                            <div className="space-y-2 min-h-[200px]">
                                {dayPosts.map(post => (
                                    <div key={post.id} onClick={() => onEditPost(post)} className="bg-slate-700/50 p-2 rounded border border-slate-700 hover:border-indigo-500 cursor-pointer text-xs">
                                        <div className="flex items-center gap-1 mb-1">
                                            <PlatformIcon platformId={post.platform} />
                                            <span className="font-semibold text-slate-200 truncate">{post.title}</span>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => onNewPost(date)} className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-white hover:border-slate-500 transition text-xs flex justify-center items-center gap-1">
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const dayPosts = getPostsForDate(currentDate);
        return (
            <div className="max-w-3xl mx-auto bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 min-h-[400px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-100">
                    <Clock size={20} className="text-indigo-400" />
                    Agenda: {currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h3>
                <div className="space-y-3">
                    {dayPosts.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                            <p className="mb-2">Día libre para {currentCompany.name}</p>
                            <button onClick={() => onNewPost(currentDate)} className="text-indigo-400 hover:underline text-sm">Crear tarea</button>
                        </div>
                    ) : (
                        dayPosts.map(post => (
                            <div key={post.id} onClick={() => onEditPost(post)} className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 transition cursor-pointer group">
                                <div className={`p-2 rounded-lg ${PLATFORMS.find(p=>p.id===post.platform)?.bg}`}>
                                    <PlatformIcon platformId={post.platform} className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-base">{post.title}</h4>
                                    <p className="text-xs text-slate-400 line-clamp-1">{post.caption || "Sin descripción"}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${STATUS_COLUMNS.find(s=>s.id === post.status)?.color} ${STATUS_COLUMNS.find(s=>s.id === post.status)?.textColor}`}>
                                    {STATUS_COLUMNS.find(s=>s.id === post.status)?.label}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            {renderHeader()}
            {/* CORRECCIÓN SCROLL: flex-1 y overflow-auto aquí permite que ESTE contenedor haga scroll, no el body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-10"> 
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
            </div>
        </div>
    );
};

// --- MODAL DE CONFIRMACIÓN ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose, isAlert }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 transform scale-100 transition-all">
                <div className="flex items-center gap-3 mb-3 text-white">
                    <div className={`p-2 rounded-full ${isAlert ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3">
                    {!isAlert && (
                        <button 
                            onClick={onClose} 
                            className="flex-1 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium"
                        >
                            Cancelar
                        </button>
                    )}
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 text-white py-2.5 rounded-lg font-bold transition shadow-lg ${isAlert ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}
                    >
                        {isAlert ? 'Entendido' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MODAL CREAR EMPRESA ---
const CompanyModal = ({ isOpen, onClose, onSave }) => {
    if(!isOpen) return null;
    const [name, setName] = useState("");
    const [color, setColor] = useState("bg-indigo-600");

    const colors = ["bg-indigo-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-cyan-600", "bg-fuchsia-600"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-4">Nueva Empresa / Cliente</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                        <input 
                            value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 outline-none"
                            placeholder="Ej. Nike, Cafetería Local..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Color Distintivo</label>
                        <div className="flex gap-2 mt-2">
                            {colors.map(c => (
                                <button 
                                    key={c} onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'} transition`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white">Cancelar</button>
                        <button 
                            disabled={!name}
                            onClick={() => onSave({ name, color })}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold disabled:opacity-50"
                        >
                            Crear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- MODAL EDITAR POST ---
const EditModal = ({ post, isOpen, onClose, onSave, onDelete }) => {
    if (!isOpen || !post) return null;
    const [formData, setFormData] = useState({ ...post });
    
    // ... lógica del modal original ...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                 <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                        <div className={`p-2 rounded-lg ${PLATFORMS.find(p => p.id === formData.platform)?.bg || 'bg-slate-700'}`}>
                            <PlatformIcon platformId={formData.platform} className="w-5 h-5" />
                        </div>
                        {formData.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Campos resumidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plataforma</label>
                             <div className="grid grid-cols-3 gap-2">
                                {PLATFORMS.map(p => (
                                    <button key={p.id} onClick={() => setFormData({...formData, platform: p.id})} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${formData.platform === p.id ? `border-${p.color.split('-')[1]}-500 bg-slate-800` : 'border-slate-700 hover:bg-slate-800'}`}>
                                        <PlatformIcon platformId={p.id} className="w-5 h-5 mb-1" />
                                        <span className="text-[10px] text-slate-400">{p.label}</span>
                                    </button>
                                ))}
                             </div>
                        </div>
                        <div className="space-y-4">
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título del Proyecto" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                                {STATUS_COLUMNS.map(s => (
                                    <button key={s.id} onClick={() => setFormData({...formData, status: s.id})} className={`flex-1 py-1 text-xs rounded transition ${formData.status === s.id ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{s.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="aspect-video bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 relative overflow-hidden group">
                                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">Subir Visual</div>}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                         </div>
                         <div className="space-y-4">
                            <textarea name="caption" rows="4" value={formData.caption} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white resize-none outline-none focus:border-indigo-500" placeholder="Copy o descripción..."></textarea>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none" />
                         </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-900/50 rounded-b-2xl">
                    <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"><Trash2 size={16} /> Eliminar</button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">Cancelar</button>
                        <button onClick={() => onSave(formData)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Save size={16} /> Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- APP PRINCIPAL ---
const App = () => {
    // ESTADOS DE DATOS
    const [companies, setCompanies] = useState(INITIAL_COMPANIES);
    const [posts, setPosts] = useState(INITIAL_POSTS);
    
    // ESTADOS DE UI
    const [selectedCompanyId, setSelectedCompanyId] = useState(1);
    const [view, setView] = useState('calendar'); 
    const [editingPost, setEditingPost] = useState(null);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); 
    const [hoveredCompany, setHoveredCompany] = useState(null); // Nuevo estado para Tooltip flotante
    
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, isAlert: false });

    // Helpers
    const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
    const filteredPosts = useMemo(() => posts.filter(p => p.companyId === selectedCompanyId), [posts, selectedCompanyId]);

    // Handlers
    const handleAddCompany = (newCompanyData) => {
        const newId = Math.max(...companies.map(c => c.id), 0) + 1;
        const initials = newCompanyData.name.substring(0,2).toUpperCase();
        const newCompany = { id: newId, ...newCompanyData, initials };
        
        setCompanies([...companies, newCompany]);
        setSelectedCompanyId(newId);
        setIsCompanyModalOpen(false);
    };

    const handleDeleteCompany = (id) => {
        if(companies.length <= 1) {
            setConfirmConfig({
                isOpen: true,
                title: "Acción no permitida",
                message: "No puedes eliminar la última empresa activa. Debes tener al menos una.",
                onConfirm: () => {},
                isAlert: true
            });
            return;
        }
        
        setConfirmConfig({
            isOpen: true,
            title: "¿Eliminar empresa?",
            message: "Esta acción borrará la empresa y TODOS sus proyectos de forma permanente. ¿Estás seguro?",
            onConfirm: () => {
                const newCompanies = companies.filter(c => c.id !== id);
                setCompanies(newCompanies);
                setPosts(posts.filter(p => p.companyId !== id));
                if(selectedCompanyId === id) setSelectedCompanyId(newCompanies[0].id);
            }
        });
    };

    const handleDeletePost = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: "¿Eliminar proyecto?",
            message: "El proyecto se eliminará permanentemente. ¿Continuar?",
            onConfirm: () => {
                setPosts(posts.filter(p => p.id !== id));
                setEditingPost(null);
            }
        });
    };

    const handleNewPost = (date = new Date()) => {
        const dateStr = date.toISOString().split('T')[0];
        setEditingPost({
            id: Date.now(), companyId: selectedCompanyId, title: "", platform: 'instagram', 
            type: "Post", status: "start", image: null, date: dateStr, caption: ""
        });
    };

    const handleSavePost = (updatedPost) => {
        if (posts.find(p => p.id === updatedPost.id)) {
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        } else {
            setPosts([...posts, updatedPost]);
        }
        setEditingPost(null);
    };

    const moveStatus = (post, direction) => {
        const currentIndex = STATUS_COLUMNS.findIndex(c => c.id === post.status);
        let newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < STATUS_COLUMNS.length) {
            const newStatus = STATUS_COLUMNS[newIndex].id;
            setPosts(posts.map(p => p.id === post.id ? {...p, status: newStatus} : p));
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            <GlobalStyles />
            
            {/* TOOLTIP FLOTANTE (Renderizado fuera del sidebar para evitar clipping) */}
            {hoveredCompany && (
                <div 
                    className="fixed left-[80px] z-[100] bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 animate-fade-in pointer-events-none"
                    style={{ top: hoveredCompany.top }}
                >
                    {hoveredCompany.name}
                </div>
            )}
            
            {/* SIDEBAR - DESKTOP ONLY */}
            <aside className="hidden md:flex w-[72px] bg-slate-900 border-r border-slate-800 flex-col items-center py-6 gap-4 z-50 flex-shrink-0">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 mb-2 shrink-0">
                    <Rabbit size={24} className="text-white" />
                </div>
                
                <div className="w-10 h-[1px] bg-slate-800 shrink-0"></div>

                {/* Lista de Empresas Desktop */}
                <div className="flex-1 flex flex-col gap-3 w-full items-center overflow-y-auto custom-scrollbar px-2" style={{ overflowX: 'visible' }}>
                    {companies.map(company => (
                        <div key={company.id} className="relative group w-full flex justify-center shrink-0">
                            {/* Indicador Activo */}
                            {selectedCompanyId === company.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                            )}
                            
                            <button 
                                onClick={() => setSelectedCompanyId(company.id)}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setHoveredCompany({ 
                                        name: company.name, 
                                        top: rect.top + (rect.height / 2) - 15 
                                    });
                                }}
                                onMouseLeave={() => setHoveredCompany(null)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 relative group-hover:scale-105 ${selectedCompanyId === company.id ? `${company.color} text-white shadow-lg` : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >
                                {company.initials}
                                {/* Botón eliminar (visible en hover, área de clic mejorada) */}
                                <div 
                                    onClick={(e) => {e.stopPropagation(); handleDeleteCompany(company.id)}}
                                    className="absolute -top-2 -right-2 p-1 opacity-0 group-hover:opacity-100 transition hover:scale-110 cursor-pointer z-50"
                                >
                                    <div className="bg-red-500 text-white rounded-full p-0.5 shadow-sm border border-slate-900">
                                        <X size={10} />
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}

                    <button 
                        onClick={() => setIsCompanyModalOpen(true)}
                        className="w-10 h-10 rounded-full bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500 hover:bg-slate-800 transition mt-2 shrink-0"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="mt-auto flex flex-col gap-4 shrink-0">
                    <button className="text-slate-500 hover:text-white transition"><Settings size={20} /></button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
                {/* Header Contextual */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-4 md:px-6 flex items-center justify-between shrink-0 relative z-40">
                    <div className="flex items-center gap-3">
                        {/* Logo Mobile Only */}
                        <div className="md:hidden bg-gradient-to-br from-orange-500 to-red-600 p-1.5 rounded-lg">
                             <Rabbit size={18} className="text-white" />
                        </div>

                        {/* Company Selector - CORREGIDO: Menú Modal Fijo en Móvil */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                                className="text-lg font-bold flex items-center gap-2 hover:bg-slate-800/50 p-2 rounded-lg transition"
                            >
                                {currentCompany.name}
                                <ChevronDown size={16} className="text-slate-500" />
                            </button>
                            
                            {/* Mobile/Desktop Company Dropdown */}
                            {isCompanyDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" onClick={() => setIsCompanyDropdownOpen(false)}></div>
                                    <div className="fixed md:absolute top-[70px] left-4 right-4 md:top-full md:left-0 md:right-auto md:w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[90] p-2 animate-fade-in">
                                        <div className="text-xs font-bold text-slate-500 uppercase px-3 py-2">Cambiar Empresa</div>
                                        {companies.map(c => (
                                            <button 
                                                key={c.id}
                                                onClick={() => { setSelectedCompanyId(c.id); setIsCompanyDropdownOpen(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-slate-800 transition ${selectedCompanyId === c.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${c.color}`}></div>
                                                {c.name}
                                            </button>
                                        ))}
                                        <div className="h-[1px] bg-slate-800 my-2"></div>
                                        <button 
                                            onClick={() => { setIsCompanyModalOpen(true); setIsCompanyDropdownOpen(false); }}
                                            className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-indigo-400 hover:bg-indigo-500/10 transition text-sm font-medium"
                                        >
                                            <Plus size={14} /> Nueva Empresa
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Switcher (Solo Calendario y Kanban ahora) */}
                        <div className="hidden md:flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition ${view === 'calendar' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                                <CalendarIcon size={16} />
                            </button>
                            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition ${view === 'kanban' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                        <div className="hidden md:block h-6 w-[1px] bg-slate-800 mx-2"></div>
                        <button 
                            onClick={() => handleNewPost()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
                        >
                            <Plus size={18} /> <span className="hidden sm:inline">Nuevo Proyecto</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-4 md:p-6 relative">
                    {/* View: Calendar */}
                    {view === 'calendar' && (
                        <CalendarView 
                            posts={filteredPosts} 
                            onEditPost={setEditingPost} 
                            onNewPost={handleNewPost} 
                            currentCompany={currentCompany}
                        />
                    )}

                    {/* View: Kanban */}
                    {view === 'kanban' && (
                        <div className="h-full overflow-x-auto custom-scrollbar pb-20 md:pb-4">
                            <div className="flex gap-4 md:gap-6 min-w-[1000px] h-full">
                                {STATUS_COLUMNS.map(col => (
                                    <div key={col.id} className="flex-1 min-w-[280px] flex flex-col h-full">
                                        <div className={`flex items-center justify-between mb-4 border-b-2 ${col.color} pb-2 flex-shrink-0`}>
                                            <div className="flex items-center gap-2 text-slate-200 font-bold">
                                                <col.icon size={18} className={col.textColor} />
                                                {col.label}
                                            </div>
                                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                                                {filteredPosts.filter(p => p.status === col.id).length}
                                            </span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                            {filteredPosts.filter(p => p.status === col.id).map(post => (
                                                <div 
                                                    key={post.id}
                                                    onClick={() => setEditingPost(post)}
                                                    className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer group relative shadow-sm transition hover:shadow-md hover:bg-slate-800/80"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className={`p-1.5 rounded-md ${PLATFORMS.find(p=>p.id===post.platform)?.bg}`}>
                                                            <PlatformIcon platformId={post.platform} />
                                                        </div>
                                                        {post.date && (
                                                            <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-400 flex items-center gap-1 border border-slate-800">
                                                                <Clock size={10} /> {new Date(post.date).toLocaleDateString('es-ES', {day: 'numeric', month: 'short'})}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{post.title || "Sin título"}</h4>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{post.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => handleNewPost()}
                                                className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 hover:border-slate-600 hover:text-slate-400 text-sm transition flex items-center justify-center gap-2 opacity-50 hover:opacity-100"
                                            >
                                                <Plus size={16} /> Añadir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modals */}
            <CompanyModal 
                isOpen={isCompanyModalOpen} 
                onClose={() => setIsCompanyModalOpen(false)} 
                onSave={handleAddCompany} 
            />
            <EditModal 
                post={editingPost} 
                isOpen={!!editingPost} 
                onClose={() => setEditingPost(null)} 
                onSave={handleSavePost}
                onDelete={handleDeletePost}
            />
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                isAlert={confirmConfig.isAlert}
            />
            
            {/* Mobile Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-around p-3 z-[60] pb-safe">
                <button onClick={() => setView('calendar')} className={`flex flex-col items-center gap-1 ${view === 'calendar' ? 'text-indigo-500' : 'text-slate-500'}`}><CalendarIcon size={20} /><span className="text-[10px]">Calendario</span></button>
                <button onClick={() => setView('kanban')} className={`flex flex-col items-center gap-1 ${view === 'kanban' ? 'text-indigo-500' : 'text-slate-500'}`}><LayoutGrid size={20} /><span className="text-[10px]">Proceso</span></button>
            </nav>
        </div>
    );
};

export default App;