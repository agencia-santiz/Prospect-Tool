
import React, { useState, useEffect } from 'react';
import { Deal, Pipeline, ActivityLog, LeadPerson, DealTask } from '../types';
import { translations, Language } from '../utils/i18n';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget, getWhatsAppStatus } from '../utils/whatsappLink.js';
import { 
  X, Building2, MapPin, Phone, Trash2, Plus, 
  ChevronRight, ChevronDown, Mail, Link as LinkIcon, Briefcase, 
  CheckCircle2, Settings, FileText, CheckSquare,
  Users, Activity, Database, LayoutGrid,
  MessageSquare, AlertCircle, MessageCircle, Mic
} from 'lucide-react';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (updatedDeal: Deal) => void;
  onDelete: (dealId: string) => void;
  lang: Language;
  pipelines: Pipeline[];
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  deal, 
  onSave, 
  onDelete, 
  lang,
  pipelines 
}) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Deal | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [insightTab, setInsightTab] = useState('Pontuação');
  
  // Sidebar State
  const [expandedSections, setExpandedSections] = useState({
    companyDetails: true,
    recordDetails: true,
    tasks: true,
    deals: true
  });

  // Local Task Input State (Actual tasks are in formData.tasks)
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

  // Activity State
  const [newActivityContent, setNewActivityContent] = useState('');
  const [activityType, setActivityType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'>('NOTE');

  // People State
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonTitle, setNewPersonTitle] = useState('');

  useEffect(() => {
    if (deal) {
      setFormData({ ...deal });
      // If deal doesn't have arrays initialized (legacy data), init them
      if (!deal.activities) setFormData(prev => prev ? ({...prev, activities: []}) : null);
      if (!deal.people) setFormData(prev => prev ? ({...prev, people: []}) : null);
      if (!deal.tasks) setFormData(prev => prev ? ({...prev, tasks: []}) : null);
    }
  }, [deal]);

  if (!isOpen || !formData) return null;

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleAddTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskInput.trim()) return;
      const newTask: DealTask = {
          id: Date.now().toString(),
          text: newTaskInput,
          completed: false,
          createdAt: new Date().toISOString()
      };
      
      const updatedTasks = [...(formData.tasks || []), newTask];
      setFormData({ ...formData, tasks: updatedTasks });
      setNewTaskInput('');
      setShowTaskInput(false);
  };

  const toggleTask = (taskId: string) => {
      const updatedTasks = (formData.tasks || []).map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleLogActivity = () => {
      if (!newActivityContent.trim()) return;
      
      const newActivity: ActivityLog = {
          id: Date.now().toString(),
          type: activityType,
          content: newActivityContent,
          createdAt: new Date().toISOString(),
          user: 'Você' // Placeholder for current user
      };

      const updatedActivities = [newActivity, ...(formData.activities || [])];
      setFormData({ ...formData, activities: updatedActivities });
      setNewActivityContent('');
  };

  const handleAddPerson = () => {
      if (!newPersonName.trim()) return;
      
      const newPerson: LeadPerson = {
          id: Date.now().toString(),
          name: newPersonName,
          title: newPersonTitle,
          location: formData.contactInfo?.location || 'Desconhecido',
          department: 'Geral',
          emailRevealed: false
      };

      const updatedPeople = [...(formData.people || []), newPerson];
      setFormData({ ...formData, people: updatedPeople });
      setIsAddingPerson(false);
      setNewPersonName('');
      setNewPersonTitle('');
  };

  const removePerson = (personId: string) => {
      const updatedPeople = (formData.people || []).filter(p => p.id !== personId);
      setFormData({ ...formData, people: updatedPeople });
  };

  const revealEmail = (personId: string) => {
      const updatedPeople = (formData.people || []).map(p => {
          if (p.id === personId) {
             // Mock deterministic email based on name
             const cleanName = p.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
             const cleanCompany = formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
             const mockEmail = `${cleanName}@${cleanCompany}.com.br`;
             return { ...p, emailRevealed: true, email: mockEmail };
          }
          return p;
      });
      setFormData({ ...formData, people: updatedPeople });
  };

  const openWhatsApp = (phone: string | undefined) => {
      if (!phone) return;
      const url = buildWhatsAppChatUrl(phone);
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getActivityIcon = (type: string) => {
      switch(type) {
          case 'CALL': return <Phone className="w-4 h-4 text-purple-600" />;
          case 'EMAIL': return <Mail className="w-4 h-4 text-blue-600" />;
          case 'MEETING': return <Users className="w-4 h-4 text-orange-600" />;
          case 'NOTE': return <FileText className="w-4 h-4 text-yellow-600" />;
          default: return <Activity className="w-4 h-4 text-gray-600" />;
      }
  };

  // Dynamic Score Calculation
  const calculateScore = () => {
      let score = 0;
      if (formData.companyName) score += 10;
      if (formData.contactInfo?.phone) score += 20;
      if (formData.contactInfo?.website) score += 20;
      if (formData.contactInfo?.location) score += 10;
      if (formData.activities && formData.activities.length > 0) score += 20;
      if (formData.people && formData.people.length > 0) score += 20;
      return Math.min(score, 100);
  };
  const engagementScore = calculateScore();
  const whatsappTarget = getWhatsAppChatTarget({
      telefone: formData.contactInfo?.phone,
      website: formData.contactInfo?.website,
  });
  const whatsappStatus = getWhatsAppStatus({
      telefone: formData.contactInfo?.phone,
      website: formData.contactInfo?.website,
  });
  const whatsappBadge = (() => {
      switch (whatsappStatus) {
          case 'CONFIRMED':
              return { label: t.whatsapp_confirmed, className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
          case 'UNCONFIRMED':
              return { label: t.whatsapp_unconfirmed, className: 'bg-amber-50 text-amber-700 border-amber-100' };
          default:
              return { label: t.whatsapp_not_available, className: 'bg-slate-50 text-slate-500 border-slate-200' };
      }
  })();

  // --- RENDER HELPERS ---

  const renderTabContent = () => {
      switch (activeTab) {
          case 'Visão Geral':
              return (
                <div className="space-y-6">
                    {/* Insights Card */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm animate-fadeIn">
                        <div className="flex items-center justify-between p-4 pb-0">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-bold text-gray-800">Insights da Empresa</span>
                            </div>
                            <div className="flex gap-2">
                                <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                        </div>

                        {/* Subtabs */}
                        <div className="px-4 border-b border-gray-100 flex gap-6 mt-3 overflow-x-auto no-scrollbar">
                             {['Pontuação', 'Notícias', 'Tecnologias', 'Tendências', 'Visitantes'].map(t => (
                                 <span 
                                    key={t} 
                                    onClick={() => setInsightTab(t)} 
                                    className={`text-xs font-medium pb-2 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${insightTab === t ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                                 >
                                     {t}
                                 </span>
                             ))}
                        </div>
                        
                        <div className="p-6 bg-white min-h-[120px]">
                             {insightTab === 'Pontuação' && (
                                <div className="flex items-start gap-4 animate-fadeIn">
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-purple-100">
                                            <div 
                                                className="w-4 h-2 bg-purple-300 rounded-full transition-all duration-500"
                                                style={{ width: `${engagementScore / 6}px` }} 
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Score de Engajamento: {engagementScore}/100</h4>
                                        <p className="text-xs text-gray-500 mt-1 mb-3 leading-relaxed">Calculado com base no preenchimento do perfil, contatos e atividades recentes.</p>
                                    </div>
                                </div>
                             )}
                             {insightTab === 'Tecnologias' && (
                                 <div className="animate-fadeIn">
                                     <h4 className="font-bold text-sm text-gray-900 mb-2">Stack Tecnológica Detectada</h4>
                                     <div className="flex flex-wrap gap-2">
                                         {['Google Analytics', 'WordPress', 'jQuery'].map(tech => (
                                             <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">{tech}</span>
                                         ))}
                                     </div>
                                     <p className="text-[10px] text-gray-400 mt-2 italic">* Dados simulados baseados no segmento.</p>
                                 </div>
                             )}
                             {insightTab === 'Notícias' && (
                                 <div className="animate-fadeIn text-sm text-gray-600">
                                     <p>Nenhuma notícia recente encontrada para <strong>{formData.companyName}</strong> nos últimos 30 dias.</p>
                                 </div>
                             )}
                             {!['Pontuação', 'Tecnologias', 'Notícias'].includes(insightTab) && (
                                 <div className="flex flex-col items-center justify-center py-4 text-gray-400 animate-fadeIn">
                                     <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                     <span className="text-xs">Dados indisponíveis para {insightTab} no momento.</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
              );
          case 'Atividades':
              return (
                  <div className="space-y-6 animate-fadeIn">
                      {/* Activity Composer */}
                      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                          <div className="flex border-b border-gray-100 bg-gray-50">
                              <button 
                                onClick={() => setActivityType('NOTE')}
                                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activityType === 'NOTE' ? 'bg-white text-gray-900 border-t-2 border-t-nexus-royal' : 'text-gray-500 hover:bg-gray-100'}`}
                              >
                                  <FileText className="w-4 h-4" /> Nota
                              </button>
                              <button 
                                onClick={() => setActivityType('CALL')}
                                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activityType === 'CALL' ? 'bg-white text-gray-900 border-t-2 border-t-nexus-royal' : 'text-gray-500 hover:bg-gray-100'}`}
                              >
                                  <Phone className="w-4 h-4" /> Ligação
                              </button>
                              <button 
                                onClick={() => setActivityType('EMAIL')}
                                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activityType === 'EMAIL' ? 'bg-white text-gray-900 border-t-2 border-t-nexus-royal' : 'text-gray-500 hover:bg-gray-100'}`}
                              >
                                  <Mail className="w-4 h-4" /> Email
                              </button>
                              <button 
                                onClick={() => setActivityType('MEETING')}
                                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activityType === 'MEETING' ? 'bg-white text-gray-900 border-t-2 border-t-nexus-royal' : 'text-gray-500 hover:bg-gray-100'}`}
                              >
                                  <Users className="w-4 h-4" /> Reunião
                              </button>
                          </div>
                          <div className="p-4">
                              <textarea 
                                  className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-nexus-royal outline-none min-h-[100px] resize-y mb-3"
                                  placeholder={`Descreva a ${activityType === 'CALL' ? 'ligação' : activityType === 'NOTE' ? 'nota' : activityType === 'EMAIL' ? 'mensagem' : 'reunião'}...`}
                                  value={newActivityContent}
                                  onChange={(e) => setNewActivityContent(e.target.value)}
                              />
                              <div className="flex justify-between items-center">
                                  <div className="flex gap-2 text-gray-400">
                                      <Mic className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                      <LinkIcon className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                  </div>
                                  <button 
                                    onClick={handleLogActivity}
                                    disabled={!newActivityContent.trim()}
                                    className="bg-nexus-royal text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      Registrar
                                  </button>
                              </div>
                          </div>
                      </div>

                      {/* Timeline */}
                      <div className="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-px before:bg-gray-200">
                          {(formData.activities || []).length === 0 ? (
                              <div className="text-center py-10 text-gray-400 italic text-sm bg-gray-50 rounded border border-dashed border-gray-200">
                                  Nenhuma atividade registrada. Comece adicionando uma nota.
                              </div>
                          ) : (
                              (formData.activities || []).map((activity, idx) => (
                                  <div key={activity.id || idx} className="relative pl-8">
                                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-white z-10`}>
                                          {getActivityIcon(activity.type)}
                                      </div>
                                      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="text-xs font-bold text-gray-900">
                                                  {activity.user} registrou {activity.type === 'CALL' ? 'uma ligação' : activity.type === 'NOTE' ? 'uma nota' : activity.type === 'EMAIL' ? 'um email' : 'uma reunião'}
                                              </span>
                                              <span className="text-[10px] text-gray-400">
                                                  {new Date(activity.createdAt).toLocaleString('pt-BR')}
                                              </span>
                                          </div>
                                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{activity.content}</p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              );
          case 'Contatos':
               return (
                  <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-gray-900">Pessoas ({formData.people?.length || 0})</h3>
                          <button 
                             onClick={() => setIsAddingPerson(true)}
                             className="flex items-center gap-1 text-xs font-bold text-nexus-royal hover:bg-blue-50 px-3 py-1.5 rounded border border-transparent hover:border-blue-100 transition-all"
                          >
                              <Plus className="w-4 h-4" /> Adicionar Pessoa
                          </button>
                      </div>

                      {isAddingPerson && (
                          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 animate-slideIn">
                              <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase">Novo Contato</h4>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                  <input 
                                    type="text" 
                                    placeholder="Nome Completo" 
                                    className="p-2 border border-gray-300 rounded text-sm outline-none focus:border-nexus-royal"
                                    value={newPersonName}
                                    onChange={(e) => setNewPersonName(e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Cargo / Título" 
                                    className="p-2 border border-gray-300 rounded text-sm outline-none focus:border-nexus-royal"
                                    value={newPersonTitle}
                                    onChange={(e) => setNewPersonTitle(e.target.value)}
                                  />
                              </div>
                              <div className="flex justify-end gap-2">
                                  <button onClick={() => setIsAddingPerson(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1">Cancelar</button>
                                  <button onClick={handleAddPerson} className="text-xs font-bold bg-nexus-royal text-white px-3 py-1 rounded hover:bg-blue-700">Salvar</button>
                              </div>
                          </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                          {(formData.people || []).length === 0 ? (
                              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
                                  Nenhum contato adicionado. Clique em "Adicionar Pessoa" para começar.
                              </div>
                          ) : (
                              (formData.people || []).map(p => (
                                  <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded hover:border-nexus-royal group transition-all">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-nexus-royal/10 text-nexus-royal flex items-center justify-center font-bold text-sm">
                                              {p.name.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                              <div className="text-xs text-gray-500">{p.title}</div>
                                          </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4">
                                          <div className="text-right">
                                              {p.emailRevealed ? (
                                                  <div className="text-xs font-medium text-gray-700">{p.email}</div>
                                              ) : (
                                                  <button 
                                                      onClick={() => revealEmail(p.id)}
                                                      className="flex items-center gap-1 text-[10px] font-bold text-nexus-royal hover:underline"
                                                  >
                                                      <Mail className="w-3 h-3" /> Revelar Email
                                                  </button>
                                              )}
                                              <div className="text-[10px] text-gray-400">{p.location}</div>
                                          </div>
                                          <button 
                                            onClick={() => removePerson(p.id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-nexus-sidebar/50 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white rounded w-full max-w-[1500px] h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* TOP HEADER */}
        <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between shrink-0 bg-white shadow-sm z-20">
            <div className="flex items-center gap-4 overflow-hidden w-full max-w-3xl">
                <div className="p-2 bg-white rounded border border-gray-200 shadow-sm shrink-0">
                    <Building2 className="w-5 h-5 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-0.5 whitespace-nowrap">
                        <span className="hover:underline cursor-pointer hover:text-nexus-royal">Empresas</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-medium text-gray-700">Detalhes</span>
                    </div>
                    <div className="flex items-end gap-3">
                        <input 
                            type="text" 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="text-lg font-bold text-gray-900 leading-none bg-transparent border-b border-transparent hover:border-gray-300 focus:border-nexus-royal outline-none w-full transition-all"
                            placeholder="Nome da Empresa"
                        />
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 mb-0.5 shrink-0">
                             <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{formData.customFields.find(f => f.label === 'Industry')?.value || 'Geral'}</span>
                             <span>•</span>
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {formData.contactInfo?.location || 'Localização'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
                 {/* Action Icons */}
                 <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors shadow-sm" title="Ligar">
                     <Phone className="w-4 h-4" />
                 </button>
                 <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors shadow-sm" title="Email">
                     <Mail className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => openWhatsApp(whatsappTarget || formData.contactInfo?.phone)}
                    disabled={!whatsappTarget && !formData.contactInfo?.phone}
                    className="p-2 bg-white border border-gray-300 rounded hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors shadow-sm disabled:opacity-50" 
                    title="WhatsApp Web"
                 >
                     <MessageCircle className="w-4 h-4" />
                 </button>
                 <span className={`text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wide ${whatsappBadge.className}`}>
                    {whatsappBadge.label}
                 </span>
                 
                 <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
                 
                 {/* Save Actions Button */}
                 <button 
                    onClick={() => onSave(formData)}
                    className="hidden sm:flex px-4 py-2 bg-[#EADD0E] hover:bg-[#d8cc0d] text-gray-900 font-bold text-xs rounded shadow-sm transition-colors items-center gap-1"
                 >
                     Salvar Alterações
                 </button>
                 
                 <button onClick={onClose} className="ml-2 p-1.5 hover:bg-red-50 hover:text-red-500 rounded transition-colors">
                     <X className="w-5 h-5" />
                 </button>
            </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex flex-1 overflow-hidden font-sans bg-[#F9F9F9]">
            
            {/* LEFT SIDEBAR */}
            <div className="w-[300px] border-r border-gray-200 bg-white overflow-y-auto flex flex-col shrink-0 custom-scrollbar z-10 hidden lg:flex">
                
                {/* 1. Company Details */}
                <div className="border-b border-gray-100">
                    <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 group transition-colors"
                        onClick={() => toggleSection('companyDetails')}
                    >
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400 group-hover:text-nexus-royal" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-nexus-royal">Detalhes da empresa</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedSections.companyDetails ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {expandedSections.companyDetails && (
                        <div className="px-5 pb-5 space-y-4 animate-slideIn">
                            <div className="group">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-nexus-royal transition-colors">INDÚSTRIA</div>
                                <div className="flex flex-wrap gap-1">
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium border border-gray-200">
                                        {formData.customFields.find(f => f.label === 'Industry')?.value || 'Geral'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">FUNCIONÁRIOS</div>
                                <span className="text-sm text-gray-700 font-medium">11-50</span>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">LINKS</div>
                                <div className="flex gap-2">
                                    {formData.contactInfo?.website && (
                                        <a href={formData.contactInfo.website.startsWith('http') ? formData.contactInfo.website : `https://${formData.contactInfo.website}`} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-50 rounded hover:bg-gray-100 text-gray-500 hover:text-nexus-royal border border-gray-200">
                                            <LinkIcon className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                    <button className="p-1.5 bg-gray-50 rounded hover:bg-gray-100 text-gray-500 hover:text-nexus-royal border border-gray-200">
                                        <Briefcase className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Record Details */}
                <div className="border-b border-gray-100">
                    <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 group transition-colors"
                        onClick={() => toggleSection('recordDetails')}
                    >
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-400 group-hover:text-nexus-royal" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-nexus-royal">Detalhes do registro</span>
                        </div>
                        <Settings className="w-3.5 h-3.5 text-gray-400 hover:text-nexus-royal" />
                    </div>

                    {expandedSections.recordDetails && (
                        <div className="px-5 pb-5 space-y-4 animate-slideIn">
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ETAPA</div>
                                <span className="inline-block px-3 py-1 bg-[#F0EBE0] text-[#7A7058] text-xs rounded-full font-bold border border-[#E6DDD0]">
                                    {pipelines.find(p => p.id === formData.pipelineId)?.stages.find(s => s.id === formData.stageId)?.name || 'Cold'}
                                </span>
                            </div>
                             <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">LISTAS</div>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-bold border border-gray-200">
                                    Empresas <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
                                </span>
                            </div>
                             <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ÚLTIMA ATIVIDADE</div>
                                <span className="text-sm text-gray-600 italic">
                                    {formData.activities && formData.activities.length > 0 
                                        ? new Date(formData.activities[0].createdAt).toLocaleDateString('pt-BR') 
                                        : 'Nenhuma atividade'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Tasks */}
                <div className="border-b border-gray-100">
                     <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 group transition-colors"
                        onClick={() => toggleSection('tasks')}
                    >
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-gray-400 group-hover:text-nexus-royal" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-nexus-royal">Tarefas</span>
                        </div>
                        <Plus 
                            className="w-4 h-4 text-gray-400 hover:text-nexus-royal" 
                            onClick={(e) => { e.stopPropagation(); setShowTaskInput(true); }}
                        />
                    </div>
                    {expandedSections.tasks && (
                        <div className="px-5 pb-5 animate-slideIn">
                            {(formData.tasks || []).length === 0 && !showTaskInput ? (
                                <div className="flex gap-3 items-start opacity-60">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <div className="text-xs text-gray-500 leading-relaxed">
                                        Adicione uma tarefa para destacar os próximos passos para esta conta.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(formData.tasks || []).map(task => (
                                        <div key={task.id} className="flex items-start gap-2 group">
                                            <button onClick={() => toggleTask(task.id)}>
                                                {task.completed ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border border-gray-300 hover:border-nexus-royal"></div>
                                                )}
                                            </button>
                                            <span className={`text-xs ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showTaskInput && (
                                <form onSubmit={handleAddTask} className="mt-3">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-nexus-royal outline-none mb-2"
                                        placeholder="Digite a tarefa..."
                                        value={newTaskInput}
                                        onChange={(e) => setNewTaskInput(e.target.value)}
                                        onBlur={() => { if(!newTaskInput) setShowTaskInput(false); }}
                                    />
                                    <button type="submit" className="text-xs bg-nexus-royal text-white px-3 py-1 rounded font-bold">Adicionar</button>
                                </form>
                            )}

                             {!showTaskInput && (formData.tasks || []).length > 0 && (
                                <button 
                                    onClick={() => setShowTaskInput(true)}
                                    className="mt-3 text-xs font-bold text-gray-400 hover:text-nexus-royal flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Nova Tarefa
                                </button>
                             )}
                        </div>
                    )}
                </div>
                
                 {/* 4. Deals */}
                 <div className="border-b border-gray-100">
                     <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 group transition-colors"
                        onClick={() => toggleSection('deals')}
                    >
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400 group-hover:text-nexus-royal" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-nexus-royal">Negócios</span>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400 hover:text-nexus-royal" />
                    </div>
                    {expandedSections.deals && (
                        <div className="px-5 pb-5 animate-slideIn">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <div className="text-xs font-bold text-gray-900 mb-1 truncate">{formData.companyName} Deal</div>
                                <div className="text-[10px] text-gray-500 mb-2">Criado em {formData.createdAt.split('T')[0]}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-green-600">R$</span>
                                        <input 
                                            type="number" 
                                            value={formData.value}
                                            onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                                            className="w-20 text-xs font-bold text-green-600 bg-transparent border-b border-gray-300 focus:border-green-500 outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                                        {pipelines.find(p => p.id === formData.pipelineId)?.name || 'Pipeline'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* TABS */}
                <div className="bg-white border-b border-gray-200 px-6 pt-1 flex gap-6 shrink-0 text-sm overflow-x-auto no-scrollbar">
                    {['Visão Geral', 'Atividades', 'Contatos'].map(tab => (
                        <button 
                          key={tab} 
                          onClick={() => setActiveTab(tab)}
                          className={`py-3 font-bold border-b-[3px] transition-colors whitespace-nowrap outline-none ${activeTab === tab ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F9F9F9]">
                    {renderTabContent()}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;
