
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Check, Zap, Building2, ShieldCheck, Lock } from 'lucide-react';
import ModalShell from './ModalShell';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { upgradePlan } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    // Simulate Stripe Checkout redirect
    const btn = document.getElementById('upgrade-btn');
    if(btn) btn.innerText = 'Processando...';
    
    setTimeout(() => {
        upgradePlan();
        onClose();
        alert("Pagamento processado com sucesso! Bem-vindo ao Plano PRO.");
    }, 2000);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="z-[2000] bg-nexus-sidebar/90"
      panelClassName="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col md:flex-row"
    >
         
         <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-gray-100 transition-colors">
             <X className="w-5 h-5 text-gray-500" />
         </button>

         {/* Left: Value Prop */}
         <div className="w-full md:w-2/5 bg-nexus-sidebar text-white p-8 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-nexus-royal/20 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                     <Zap className="w-3 h-3 text-yellow-400" /> Plano Recomendado
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Acelere suas vendas B2B.</h2>
                 <p className="text-slate-300 text-sm leading-relaxed mb-8">
                     Desbloqueie o poder total do Bloom Leads e pare de perder tempo com dados incompletos.
                 </p>
                 
                 <div className="space-y-4">
                     <div className="flex items-start gap-3">
                         <div className="p-1 bg-green-500/20 rounded mt-0.5"><Check className="w-3 h-3 text-green-400" /></div>
                         <span className="text-sm font-medium">Buscas Ilimitadas no Maps</span>
                     </div>
                     <div className="flex items-start gap-3">
                         <div className="p-1 bg-green-500/20 rounded mt-0.5"><Check className="w-3 h-3 text-green-400" /></div>
                         <span className="text-sm font-medium">Exportação para Excel/CSV</span>
                     </div>
                     <div className="flex items-start gap-3">
                         <div className="p-1 bg-green-500/20 rounded mt-0.5"><Check className="w-3 h-3 text-green-400" /></div>
                         <span className="text-sm font-medium">Gestão de Listas e Contatos</span>
                     </div>
                 </div>
             </div>

             <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                 <div className="flex items-center gap-3">
                     <Building2 className="w-8 h-8 text-nexus-royal" />
                     <div>
                         <p className="text-xs text-slate-400">Usado por times de alta performance</p>
                         <p className="text-sm font-bold">Salesforce, HubSpot, Pipedrive users</p>
                     </div>
                 </div>
             </div>
         </div>

         {/* Right: Pricing Tier */}
         <div className="w-full md:w-3/5 bg-white p-8 md:p-12">
             <div className="text-center mb-8">
                 <h3 className="text-xl font-bold text-nexus-dark">Plano PRO</h3>
                 <div className="flex items-end justify-center gap-1 mt-2">
                     <span className="text-4xl font-black text-nexus-dark">R$ 97</span>
                     <span className="text-gray-400 font-medium mb-1">/mês</span>
                 </div>
                 <p className="text-xs text-gray-400 mt-2">Cancelamento a qualquer momento.</p>
             </div>

             <div className="space-y-4 mb-8">
                 <button 
                    id="upgrade-btn"
                    onClick={handleUpgrade}
                    className="w-full py-4 bg-nexus-royal hover:bg-blue-700 text-white font-bold rounded shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                 >
                     Assinar Agora <ShieldCheck className="w-5 h-5" />
                 </button>
                 <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                     <Lock className="w-3 h-3" /> Pagamento seguro via Stripe. Criptografia SSL 256-bits.
                 </p>
             </div>
             
             <div className="bg-gray-50 p-4 rounded border border-gray-100 text-center">
                 <p className="text-xs font-bold text-gray-600 mb-1">Precisa de API ou Enterprise?</p>
                 <p className="text-[10px] text-gray-500">Entre em contato para planos customizados acima de 10 usuários.</p>
             </div>
         </div>

    </ModalShell>
  );
};

export default PricingModal;
