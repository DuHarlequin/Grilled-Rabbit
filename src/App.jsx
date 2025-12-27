import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Grid, List, Plus, Image as ImageIcon, Calendar as CalendarIcon, 
    MoreHorizontal, Clock, LayoutGrid, Move, Trash2, Smartphone, 
    Save, X, Rabbit, ChevronLeft, ChevronRight, Filter,
    Video, Mic, Edit3, Share, CheckCircle2, Circle,
    Building2, Briefcase, Settings, LogOut, AlertTriangle, Menu, ChevronDown, 
    Sparkles, ArrowRight, ArrowLeft, Tent, Megaphone, Hash
} from 'lucide-react';

// --- ESTILOS GLOBALES ---
const GlobalStyles = () => (
    <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .sidebar-tooltip-group:hover .sidebar-tooltip { opacity: 1; transform: translateX(0); }
    `}</style>
);

// --- ICONOS DE REDES SOCIALES ---
const SocialIcons = {
    instagram: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>),
    tiktok: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>),
    facebook: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>),
    twitter: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>),
    youtube: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>),
    whatsapp: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>)
};

// --- CONSTANTES ---
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'tiktok', label: 'TikTok', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 'youtube', label: 'YouTube', color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'twitter', label: 'X / Twitter', color: 'text-slate-200', bg: 'bg-slate-700/50' },
    { id: 'facebook', label: 'Facebook', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'whatsapp', label: 'WhatsApp', color: 'text-green-500', bg: 'bg-green-500/10' }
];

const CONTENT_TYPES = {
    instagram: ['Post', 'Reel', 'Historia', 'Carrusel', 'Live'],
    tiktok: ['Video', 'Foto', 'Story'],
    youtube: ['Video', 'Short', 'Comunidad'],
    twitter: ['Post', 'Hilo', 'Space'],
    facebook: ['Post', 'Reel', 'Historia', 'Live'],
    whatsapp: ['Estado', 'Canal', 'Mensaje Difusión']
};

const STATUS_COLUMNS = [
    { id: 'pending', label: 'Pendiente', icon: Circle, color: 'border-slate-500', textColor: 'text-slate-400' },
    { id: 'in_process', label: 'En Proceso', icon: Edit3, color: 'border-blue-500', textColor: 'text-blue-400' },
    { id: 'ready', label: 'Listo', icon: CheckCircle2, color: 'border-emerald-500', textColor: 'text-emerald-400' },
    { id: 'published', label: 'Publicado', icon: Share, color: 'border-green-600', textColor: 'text-green-600' }
];

const CAMPAIGN_COLORS = [
    { id: 'indigo', bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-400', ring: 'ring-indigo-500' },
    { id: 'emerald', bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500' },
    { id: 'rose', bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-400', ring: 'ring-rose-500' },
    { id: 'amber', bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-400', ring: 'ring-amber-500' },
    { id: 'cyan', bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-400', ring: 'ring-cyan-500' },
    { id: 'fuchsia', bg: 'bg-fuchsia-600', border: 'border-fuchsia-500', text: 'text-fuchsia-400', ring: 'ring-fuchsia-500' },
    { id: 'slate', bg: 'bg-slate-600', border: 'border-slate-500', text: 'text-slate-400', ring: 'ring-slate-500' }
];

// --- DATOS INICIALES ---
const INITIAL_COMPANIES = []; 
const INITIAL_POSTS = [];
const INITIAL_CAMPAIGNS = [];

const PlatformIcon = ({ platformId, className = "w-4 h-4" }) => {
    const Icon = SocialIcons[platformId] || SocialIcons.instagram;
    const plat = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
    return <Icon className={`${className} ${plat.color}`} />;
};

// --- COMPONENTE DE CALENDARIO ---
const CalendarView = ({ posts, onEditPost, onNewPost, currentCompany, campaigns }) => {
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

    const getPostStyle = (post) => {
        if (!post.campaignId) return 'bg-slate-700 border-slate-600 text-slate-300';
        const campaign = campaigns.find(c => c.id === parseInt(post.campaignId));
        if (!campaign) return 'bg-slate-700 border-slate-600 text-slate-300';
        const colorSet = CAMPAIGN_COLORS.find(c => c.id === campaign.colorId) || CAMPAIGN_COLORS[0];
        return `bg-slate-800 ${colorSet.border} border-l-4 text-white shadow-sm`;
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700 gap-4 shrink-0">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${currentCompany.color}`}>
                    {currentCompany.initials}
                </div>
                <h2 className="text-lg font-bold">
                    {viewMode === 'year' && currentDate.getFullYear()}
                    {viewMode === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    {viewMode === 'week' && `Semana ${currentDate.toLocaleDateString('es-ES', { day: 'numeric' })}`}
                    {viewMode === 'day' && currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                </h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 rounded-full px-2 py-1">
                <button onClick={() => changeDate(-1)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
                <div className="text-sm font-semibold min-w-[80px] text-center capitalize">
                    {viewMode === 'day' ? 'Día' : viewMode === 'week' ? 'Semana' : 'Mes'}
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
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                    <div key={d} className="bg-slate-800 p-2 text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-900/50 min-h-[100px] md:min-h-[120px]" />)}
                {daySlots.map(day => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dayPosts = getPostsForDate(date);
                    const isToday = (date.toDateString() === new Date().toDateString());
                    
                    return (
                        <div 
                            key={day} 
                            onClick={() => onNewPost(date)}
                            className={`bg-slate-900/80 min-h-[100px] md:min-h-[120px] p-1.5 hover:bg-slate-800 transition cursor-pointer relative group ${isToday ? 'bg-indigo-900/10 ring-1 ring-indigo-500/30 inset-0' : ''}`}
                        >
                            <span className={`text-xs font-medium ${isToday ? 'bg-indigo-600 w-5 h-5 flex items-center justify-center rounded-full text-white' : 'text-slate-400'}`}>
                                {day}
                            </span>
                            <div className="mt-1 space-y-1">
                                {dayPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                                        className={`text-[9px] p-1 rounded flex items-center gap-1 truncate transition hover:scale-105 border-transparent ${getPostStyle(post)}`}
                                    >
                                        <PlatformIcon platformId={post.platform} className="w-2 h-2 flex-shrink-0" />
                                        <span className="truncate font-medium">{post.title}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-slate-700 hover:bg-indigo-600 rounded-full text-white shadow-lg transition">
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
                    const isToday = (date.toDateString() === new Date().toDateString());

                    return (
                        <div key={offset} className={`bg-slate-800/50 rounded-xl p-3 border ${isToday ? 'border-indigo-500' : 'border-slate-700'}`}>
                            <div className="text-center mb-3 pb-2 border-b border-slate-700 flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                <span className={`text-lg font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>{date.getDate()}</span>
                            </div>
                            <div className="space-y-2 min-h-[200px]">
                                {dayPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => onEditPost(post)} 
                                        className={`p-2 rounded text-xs cursor-pointer ${getPostStyle(post)}`}
                                    >
                                        <div className="flex items-center gap-1 mb-1">
                                            <PlatformIcon platformId={post.platform} />
                                            <span className="font-semibold truncate">{post.title}</span>
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
                            <div 
                                key={post.id} 
                                onClick={() => onEditPost(post)} 
                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer group ${getPostStyle(post)}`}
                            >
                                <div className={`p-2 rounded-lg bg-black/20`}>
                                    <PlatformIcon platformId={post.platform} className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-base">{post.title}</h4>
                                    <p className="text-xs opacity-70 line-clamp-1">{post.caption || "Sin descripción"}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-black/20`}>
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
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-10"> 
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
            </div>
        </div>
    );
};

// --- COMPONENTE DE CAMPAÑAS ---
const CampaignsView = ({ campaigns, posts, onNewCampaign, onEditCampaign, onSelectCampaign, onNewProject, onEditPost }) => {
    const [activeCampaignId, setActiveCampaignId] = useState(null);

    if (activeCampaignId) {
        const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
        if (!activeCampaign) { setActiveCampaignId(null); return null; }

        const campaignPosts = posts.filter(p => p.campaignId == activeCampaign.id);
        const colorSet = CAMPAIGN_COLORS.find(c => c.id === activeCampaign.colorId) || CAMPAIGN_COLORS[0];

        return (
            <div className="animate-fade-in p-2 md:p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => setActiveCampaignId(null)} 
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Volver a Campañas</span>
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => onEditCampaign(activeCampaign)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"><Settings size={20}/></button>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${colorSet.bg} bg-opacity-20 border border-white/5`}>
                            <Tent className={colorSet.text} size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">{activeCampaign.name}</h2>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <span className="flex items-center gap-1"><Hash size={14}/> {campaignPosts.length} proyectos</span>
                                <span className={`w-2 h-2 rounded-full ${colorSet.bg}`}></span>
                                <span className="capitalize">{activeCampaign.colorId}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onNewProject(activeCampaign.id)}
                        className={`bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2`}
                    >
                        <Plus size={20} /> Agregar Proyecto Aquí
                    </button>
                </div>

                {campaignPosts.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                        <Tent size={48} className="mb-4 opacity-20" />
                        <p>No hay proyectos en esta campaña aún.</p>
                        <button onClick={() => onNewProject(activeCampaign.id)} className="text-indigo-400 hover:text-indigo-300 mt-2 font-medium">Crear el primero</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20 custom-scrollbar">
                        {campaignPosts.map(post => (
                            <div 
                                key={post.id} 
                                onClick={() => onEditPost(post)}
                                className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer group relative shadow-sm transition hover:shadow-md hover:bg-slate-800/80"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-1.5 rounded-md ${PLATFORMS.find(p=>p.id===post.platform)?.bg}`}>
                                        <PlatformIcon platformId={post.platform} />
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${STATUS_COLUMNS.find(s=>s.id === post.status)?.color} ${STATUS_COLUMNS.find(s=>s.id === post.status)?.textColor}`}>
                                        {STATUS_COLUMNS.find(s=>s.id === post.status)?.label}
                                    </div>
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{post.title || "Sin título"}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{post.type}</span>
                                    {post.date && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(post.date).toLocaleDateString('es-ES', {day: 'numeric', month: 'short'})}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="animate-fade-in p-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Megaphone className="text-indigo-400" /> Campañas Activas
                    </h2>
                    <p className="text-slate-400 text-sm">Organiza tus proyectos en carpetas temáticas.</p>
                </div>
                <button 
                    onClick={onNewCampaign}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
                >
                    <Plus size={18} /> Nueva Campaña
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                    <Tent size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-300">No hay campañas aún</h3>
                    <p className="text-slate-500 text-sm mb-4">Crea una campaña para agrupar tus publicaciones por color.</p>
                    <button onClick={onNewCampaign} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Crear la primera</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {campaigns.map(camp => {
                        const colorSet = CAMPAIGN_COLORS.find(c => c.id === camp.colorId) || CAMPAIGN_COLORS[0];
                        const count = posts.filter(p => p.campaignId == camp.id).length;
                        return (
                            <div 
                                key={camp.id} 
                                onClick={() => setActiveCampaignId(camp.id)}
                                className={`group bg-slate-800/50 border border-slate-700 hover:border-slate-500 p-5 rounded-xl cursor-pointer transition hover:bg-slate-800 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${colorSet.bg}`}></div>
                                <div className="flex justify-between items-start mb-3 pl-2">
                                    <Tent className={`${colorSet.text}`} size={24} />
                                    <div 
                                        onClick={(e) => {e.stopPropagation(); onEditCampaign(camp)}}
                                        className="opacity-0 group-hover:opacity-100 transition p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 hover:text-white text-slate-400"
                                    >
                                        <Settings size={14} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white pl-2 truncate">{camp.name}</h3>
                                <p className="text-xs text-slate-500 pl-2 mt-1 flex items-center gap-1">
                                    <Hash size={10} /> {count} proyectos
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- MODALES ---

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
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white mt-1 outline-none focus:border-indigo-500" placeholder="Ej. Nike..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                        <div className="flex gap-2 mt-2">
                            {colors.map(c => <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-white' : 'opacity-60'}`} />)}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button onClick={onClose} className="flex-1 py-2 text-slate-400">Cancelar</button>
                        <button disabled={!name} onClick={() => onSave({ name, color })} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold disabled:opacity-50">Crear</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CampaignModal = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
    if(!isOpen) return null;
    const [name, setName] = useState(initialData?.name || "");
    const [colorId, setColorId] = useState(initialData?.colorId || "indigo");

    useEffect(() => {
        setName(initialData?.name || "");
        setColorId(initialData?.colorId || "indigo");
    }, [initialData, isOpen]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{initialData?.id ? 'Editar Campaña' : 'Nueva Campaña'}</h3>
                    {initialData?.id && <button onClick={() => onDelete(initialData.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 size={16} /></button>}
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre de Campaña</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white mt-1 outline-none focus:border-indigo-500" placeholder="Ej. Black Friday 2025..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Color de Etiqueta</label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {CAMPAIGN_COLORS.map(c => (
                                <button key={c.id} onClick={() => setColorId(c.id)} className={`w-8 h-8 rounded-full ${c.bg} ${colorId === c.id ? 'ring-2 ring-white scale-110' : 'opacity-60'} transition`} />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button onClick={onClose} className="flex-1 py-2 text-slate-400">Cancelar</button>
                        <button disabled={!name} onClick={() => onSave({ ...initialData, name, colorId })} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold disabled:opacity-50">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditModal = ({ post, campaigns, isOpen, onClose, onSave, onDelete }) => {
    if (!isOpen || !post) return null;
    const [formData, setFormData] = useState({ ...post });
    
    useEffect(() => {
        if(post && formData.platform !== post.platform) {
            setFormData(prev => ({ ...prev, type: CONTENT_TYPES[prev.platform][0] }));
        }
    }, [formData.platform]);

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

    const availableTypes = CONTENT_TYPES[formData.platform] || [];

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
                    {/* SELECCIÓN DE CAMPAÑA */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Campaña (Opcional)</label>
                        <select 
                            name="campaignId" 
                            value={formData.campaignId || ""} 
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 appearance-none"
                        >
                            <option value="">Sin Campaña (Color por defecto)</option>
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plataforma</label>
                             <div className="grid grid-cols-3 gap-2">
                                {PLATFORMS.map(p => (
                                    <button key={p.id} onClick={() => setFormData({...formData, platform: p.id, type: CONTENT_TYPES[p.id][0]})} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${formData.platform === p.id ? `border-${p.color.split('-')[1]}-500 bg-slate-800` : 'border-slate-700 hover:bg-slate-800'}`}>
                                        <PlatformIcon platformId={p.id} className="w-5 h-5 mb-1" />
                                        <span className="text-[10px] text-slate-400">{p.label}</span>
                                    </button>
                                ))}
                             </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Contenido</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTypes.map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => setFormData({...formData, type})}
                                            className={`px-3 py-1 text-xs rounded-full border transition ${formData.type === type ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título del Proyecto" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                            
                            {/* ESTADOS */}
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
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    {!isAlert && <button onClick={onClose} className="flex-1 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium">Cancelar</button>}
                    <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 text-white py-2.5 rounded-lg font-bold transition shadow-lg ${isAlert ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}>{isAlert ? 'Entendido' : 'Eliminar'}</button>
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
const App = () => {
    const [companies, setCompanies] = useState(INITIAL_COMPANIES);
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
    
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [view, setView] = useState('calendar'); 
    const [editingPost, setEditingPost] = useState(null);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); 
    const [hoveredCompany, setHoveredCompany] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, isAlert: false });

    const isZeroState = companies.length === 0;
    const currentCompany = companies.find(c => c.id === selectedCompanyId);
    const filteredPosts = useMemo(() => posts.filter(p => p.companyId === selectedCompanyId), [posts, selectedCompanyId]);
    const filteredCampaigns = useMemo(() => campaigns.filter(c => c.companyId === selectedCompanyId), [campaigns, selectedCompanyId]);

    useEffect(() => {
        if (companies.length > 0 && selectedCompanyId === null) {
            setSelectedCompanyId(companies[0].id);
        }
    }, [companies]);

    const handleAddCompany = (newCompanyData) => {
        const newId = Date.now();
        const initials = newCompanyData.name.substring(0,2).toUpperCase();
        setCompanies([...companies, { id: newId, ...newCompanyData, initials }]);
        setSelectedCompanyId(newId);
        setIsCompanyModalOpen(false);
    };

    const handleDeleteCompany = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: "¿Eliminar empresa?",
            message: "Se borrará la empresa, todos sus proyectos y campañas.",
            onConfirm: () => {
                const newCompanies = companies.filter(c => c.id !== id);
                setCompanies(newCompanies);
                setPosts(posts.filter(p => p.companyId !== id));
                setCampaigns(campaigns.filter(c => c.companyId !== id));
                if(newCompanies.length > 0 && selectedCompanyId === id) setSelectedCompanyId(newCompanies[0].id);
                else if (newCompanies.length === 0) setSelectedCompanyId(null);
            }
        });
    };

    // Manejo de Campañas
    const handleSaveCampaign = (campData) => {
        if (campData.id) {
            setCampaigns(campaigns.map(c => c.id === campData.id ? campData : c));
        } else {
            setCampaigns([...campaigns, { ...campData, id: Date.now(), companyId: selectedCompanyId }]);
        }
        setEditingCampaign(null);
    };

    const handleDeleteCampaign = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: "¿Borrar Campaña?",
            message: "Los proyectos asociados perderán el color de la campaña pero no se borrarán.",
            onConfirm: () => {
                setCampaigns(campaigns.filter(c => c.id !== id));
                // Opcional: limpiar campaignId de los posts
                setPosts(posts.map(p => p.campaignId == id ? { ...p, campaignId: null } : p));
                setEditingCampaign(null);
            }
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

    // Updated handleNewPost to accept campaignId
    const handleNewPost = (date = new Date(), campaignId = "") => {
        if(!selectedCompanyId) return;
        const dateStr = date.toISOString().split('T')[0];
        // Por defecto Instagram y tipo Post
        setEditingPost({
            id: Date.now(), companyId: selectedCompanyId, title: "", 
            platform: 'instagram', type: 'Post', status: "pending", 
            image: null, date: dateStr, caption: "", campaignId: campaignId
        });
    };

    const handleDeletePost = (id) => {
        setConfirmConfig({
            isOpen: true, title: "¿Eliminar proyecto?", message: "No se podrá deshacer.", 
            onConfirm: () => { setPosts(posts.filter(p => p.id !== id)); setEditingPost(null); }
        });
    };

    const moveStatus = (post, direction) => {
        const currentIndex = STATUS_COLUMNS.findIndex(c => c.id === post.status);
        let newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < STATUS_COLUMNS.length) {
            setPosts(posts.map(p => p.id === post.id ? {...p, status: STATUS_COLUMNS[newIndex].id} : p));
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            <GlobalStyles />
            {hoveredCompany && <div className="fixed left-[80px] z-[100] bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none" style={{ top: hoveredCompany.top }}>{hoveredCompany.name}</div>}
            
            <aside className="hidden md:flex w-[72px] bg-slate-900 border-r border-slate-800 flex-col items-center py-6 gap-4 z-50 flex-shrink-0">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 mb-2 shrink-0"><Rabbit size={24} className="text-white" /></div>
                <div className="w-10 h-[1px] bg-slate-800 shrink-0"></div>
                
                <div className={`flex-1 flex flex-col gap-3 w-full items-center px-2 ${companies.length > 0 ? 'overflow-y-auto custom-scrollbar' : 'overflow-visible'}`} style={{ overflowX: 'visible' }}>
                    {companies.map(company => (
                        <div key={company.id} className="relative group w-full flex justify-center shrink-0">
                            {selectedCompanyId === company.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>}
                            <button 
                                onClick={() => setSelectedCompanyId(company.id)}
                                onMouseEnter={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setHoveredCompany({ name: company.name, top: rect.top + (rect.height / 2) - 15 }); }}
                                onMouseLeave={() => setHoveredCompany(null)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 relative group-hover:scale-105 ${selectedCompanyId === company.id ? `${company.color} text-white shadow-lg` : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >
                                {company.initials}
                                <div onClick={(e) => {e.stopPropagation(); handleDeleteCompany(company.id)}} className="absolute -top-2 -right-2 p-1 opacity-0 group-hover:opacity-100 transition hover:scale-110 cursor-pointer z-50"><div className="bg-red-500 text-white rounded-full p-0.5 shadow-sm border border-slate-900"><X size={10} /></div></div>
                            </button>
                        </div>
                    ))}
                    <button onClick={() => setIsCompanyModalOpen(true)} className="w-10 h-10 rounded-full bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500 hover:bg-slate-800 transition mt-2 shrink-0 group relative">
                        <Plus size={20} />
                        {isZeroState && <span className="absolute left-14 bg-indigo-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-bounce z-50 shadow-lg">¡Empieza aquí!</span>}
                    </button>
                </div>
                <div className="mt-auto flex flex-col gap-4 shrink-0"><button className="text-slate-500 hover:text-white transition"><Settings size={20} /></button></div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-slate-950/50 relative">
                {isZeroState ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in z-50 bg-slate-950">
                        <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/20 mb-8 animate-slide-up"><Rabbit size={48} className="text-white" /></div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up" style={{animationDelay: '0.1s'}}>Bienvenido a Grilled Rabbit</h1>
                        <p className="text-slate-400 max-w-md mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>Tu planificador de contenido definitivo. Crea tu primer espacio de trabajo para comenzar a organizar tus redes sociales.</p>
                        <button onClick={() => setIsCompanyModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-3 animate-slide-up hover:scale-105" style={{animationDelay: '0.3s'}}><Plus size={24} /> Crear Empresa</button>
                    </div>
                ) : (
                    <>
                        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-4 md:px-6 flex items-center justify-between shrink-0 relative z-40 animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="md:hidden bg-gradient-to-br from-orange-500 to-red-600 p-1.5 rounded-lg"><Rabbit size={18} className="text-white" /></div>
                                <div className="relative">
                                    <button onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)} className="text-lg font-bold flex items-center gap-2 hover:bg-slate-800/50 p-2 rounded-lg transition">{currentCompany?.name} <ChevronDown size={16} className="text-slate-500" /></button>
                                    {isCompanyDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" onClick={() => setIsCompanyDropdownOpen(false)}></div>
                                            <div className="fixed md:absolute top-[70px] left-4 right-4 md:top-full md:left-0 md:right-auto md:w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[90] p-2 animate-fade-in">
                                                <div className="text-xs font-bold text-slate-500 uppercase px-3 py-2">Cambiar Empresa</div>
                                                {companies.map(c => (
                                                    <button key={c.id} onClick={() => { setSelectedCompanyId(c.id); setIsCompanyDropdownOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-slate-800 transition ${selectedCompanyId === c.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}><div className={`w-2 h-2 rounded-full ${c.color}`}></div>{c.name}</button>
                                                ))}
                                                <div className="h-[1px] bg-slate-800 my-2"></div>
                                                <button onClick={() => { setIsCompanyModalOpen(true); setIsCompanyDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-indigo-400 hover:bg-indigo-500/10 transition text-sm font-medium"><Plus size={14} /> Nueva Empresa</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                                    <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition ${view === 'calendar' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><CalendarIcon size={16} /></button>
                                    <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition ${view === 'kanban' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><LayoutGrid size={16} /></button>
                                    <button onClick={() => setView('campaigns')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition ${view === 'campaigns' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><Megaphone size={16} /></button>
                                </div>
                                <button onClick={() => handleNewPost()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"><Plus size={18} /> <span className="hidden sm:inline">Nuevo Proyecto</span></button>
                            </div>
                        </header>

                        <main className="flex-1 overflow-hidden p-4 md:p-6 relative animate-fade-in">
                            {view === 'calendar' && <CalendarView posts={filteredPosts} onEditPost={setEditingPost} onNewPost={handleNewPost} currentCompany={currentCompany} campaigns={filteredCampaigns} />}
                            {view === 'kanban' && (
                                <div className="h-full overflow-x-auto custom-scrollbar pb-20 md:pb-4">
                                    <div className="flex gap-4 md:gap-6 min-w-[1000px] h-full">
                                        {STATUS_COLUMNS.map(col => (
                                            <div key={col.id} className="flex-1 min-w-[280px] flex flex-col h-full">
                                                <div className={`flex items-center justify-between mb-4 border-b-2 ${col.color} pb-2 flex-shrink-0`}>
                                                    <div className="flex items-center gap-2 text-slate-200 font-bold"><col.icon size={18} className={col.textColor} />{col.label}</div>
                                                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">{filteredPosts.filter(p => p.status === col.id).length}</span>
                                                </div>
                                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                                    {filteredPosts.filter(p => p.status === col.id).map(post => {
                                                        const campaign = campaigns.find(c => c.id == post.campaignId);
                                                        const colorSet = campaign ? CAMPAIGN_COLORS.find(c => c.id === campaign.colorId) : null;
                                                        const cardStyle = colorSet 
                                                            ? `border-l-4 ${colorSet.border} bg-slate-800` 
                                                            : 'border border-slate-700 bg-slate-800';

                                                        return (
                                                            <div key={post.id} onClick={() => setEditingPost(post)} className={`${cardStyle} p-4 rounded-xl hover:border-indigo-500 cursor-pointer group relative shadow-sm transition hover:shadow-md`}>
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div className={`p-1.5 rounded-md ${PLATFORMS.find(p=>p.id===post.platform)?.bg}`}><PlatformIcon platformId={post.platform} /></div>
                                                                    {post.date && <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-400 flex items-center gap-1 border border-slate-800"><Clock size={10} /> {new Date(post.date).toLocaleDateString('es-ES', {day: 'numeric', month: 'short'})}</span>}
                                                                </div>
                                                                <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{post.title || "Sin título"}</h4>
                                                                <div className="flex justify-between items-center mt-2">
                                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                                                        {post.type}
                                                                        {colorSet && <span className={`w-2 h-2 rounded-full ${colorSet.bg}`}></span>}
                                                                    </span>
                                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={(e) => { e.stopPropagation(); moveStatus(post, -1); }} disabled={col.id === 'pending'} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 disabled:opacity-0"><ChevronLeft size={14} /></button>
                                                                        <button onClick={(e) => { e.stopPropagation(); moveStatus(post, 1); }} disabled={col.id === 'published'} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 disabled:opacity-0"><ChevronRight size={14} /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <button onClick={() => handleNewPost()} className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 hover:border-slate-600 hover:text-slate-400 text-sm transition flex items-center justify-center gap-2 opacity-50 hover:opacity-100"><Plus size={16} /> Añadir</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {view === 'campaigns' && <CampaignsView campaigns={filteredCampaigns} posts={filteredPosts} onNewCampaign={() => setEditingCampaign({})} onEditCampaign={setEditingCampaign} onNewProject={(campId) => handleNewPost(undefined, campId)} onEditPost={setEditingPost} />}
                        </main>
                    </>
                )}
            </div>

            <CompanyModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} onSave={handleAddCompany} />
            <EditModal post={editingPost} campaigns={filteredCampaigns} isOpen={!!editingPost} onClose={() => setEditingPost(null)} onSave={handleSavePost} onDelete={handleDeletePost} />
            <CampaignModal isOpen={!!editingCampaign} initialData={editingCampaign} onClose={() => setEditingCampaign(null)} onSave={handleSaveCampaign} onDelete={handleDeleteCampaign} />
            <ConfirmModal isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onConfirm} onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })} isAlert={confirmConfig.isAlert} />
            
            {!isZeroState && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-around p-3 z-[60] pb-safe">
                    <button onClick={() => setView('calendar')} className={`flex flex-col items-center gap-1 ${view === 'calendar' ? 'text-indigo-500' : 'text-slate-500'}`}><CalendarIcon size={20} /><span className="text-[10px]">Calendario</span></button>
                    <button onClick={() => setView('kanban')} className={`flex flex-col items-center gap-1 ${view === 'kanban' ? 'text-indigo-500' : 'text-slate-500'}`}><LayoutGrid size={20} /><span className="text-[10px]">Proceso</span></button>
                    <button onClick={() => setView('campaigns')} className={`flex flex-col items-center gap-1 ${view === 'campaigns' ? 'text-indigo-500' : 'text-slate-500'}`}><Megaphone size={20} /><span className="text-[10px]">Campañas</span></button>
                </nav>
            )}
        </div>
    );
};

export default App;
