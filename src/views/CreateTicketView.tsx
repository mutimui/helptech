import React, { useState, useEffect } from 'react';
import { Send, Pin, Pencil, Building, Eye, CheckCircle2 } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { addTicket, editTicket, setEditingTicketId } from '../store/ticketSlice.ts';
import { setScreen } from '../store/navigationSlice.ts';
import { TicketCategory } from '../types/index.ts';

const CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Rede e Conexão',
  'Manutenção Predial / Elétrica',
  'Equipamentos de Laboratório',
  'Outros',
];

export const CreateTicketView: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const editingTicketId = useAppSelector((state) => state.tickets.editingTicketId);
  const tickets = useAppSelector((state) => state.tickets.tickets);

  const editingTicket = editingTicketId
    ? tickets.find((t) => t.id === editingTicketId)
    : null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingTicket) {
      setTitle(editingTicket.title);
      setCategory(editingTicket.category);
      setDetails(editingTicket.details);
    } else {
      setTitle('');
      setCategory('');
      setDetails('');
    }
  }, [editingTicket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do chamado.');
      return;
    }
    if (!category) {
      setErrorMessage('Por favor, selecione uma categoria para o chamado.');
      return;
    }
    if (!details.trim()) {
      setErrorMessage('Por favor, descreva os detalhes do chamado.');
      return;
    }

    if (editingTicket) {
      // EDIT EXISTING TICKET
      dispatch(
        editTicket({
          id: editingTicket.id,
          title: title.trim(),
          category,
          details: details.trim(),
        })
      );
    } else {
      // CREATE NEW TICKET
      dispatch(
        addTicket({
          title: title.trim(),
          category,
          details: details.trim(),
          author: currentUser?.name || 'Usuário',
          authorUsername: currentUser?.username || 'usuario',
        })
      );
    }

    setShowSuccessToast(true);
    setTimeout(() => {
      dispatch(setEditingTicketId(null));
      dispatch(setScreen('meus-chamados'));
    }, 1000);
  };

  const handleCancel = () => {
    dispatch(setEditingTicketId(null));
    dispatch(setScreen(editingTicket ? 'meus-chamados' : 'inicio'));
  };

  const isEditing = !!editingTicket;

  return (
    <div className="h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-row font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="abrir-chamado" />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title={isEditing ? 'Editar Chamado' : 'Abrir Novo Chamado'}
          subtitle={
            isEditing
              ? `Atualize as informações do chamado ${editingTicket?.id}.`
              : 'Preencha os dados abaixo para abrir um novo chamado de suporte.'
          }
        />

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {showSuccessToast && (
            <div className="max-w-5xl mx-auto mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                {isEditing
                  ? 'Chamado atualizado com sucesso!'
                  : 'Chamado registrado com sucesso! Redirecionando para Meus Chamados...'}
              </span>
            </div>
          )}

          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Main Form Card */}
            <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
              {errorMessage && (
                <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field 1: Título */}
                <div>
                  <label htmlFor="ticket-title" className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    Título do chamado
                  </label>
                  <input
                    id="ticket-title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Digite um breve título para seu chamado"
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors"
                  />
                </div>

                {/* Field 2: Categoria */}
                <div>
                  <label htmlFor="ticket-category" className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    Categoria do problema
                  </label>
                  <select
                    id="ticket-category"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as TicketCategory);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors"
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 3: Detalhes do chamado */}
                <div>
                  <label htmlFor="ticket-details" className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    Descrição do problema
                  </label>
                  <textarea
                    id="ticket-details"
                    rows={8}
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Digite aqui os detalhes do seu chamado..."
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors resize-y leading-relaxed"
                  />
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Salvar alterações' : 'Enviar chamado'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Dicas para um bom chamado Card */}
            <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-700 p-6 self-start transition-colors duration-300">
              {/* Header */}
              <div className="flex items-start gap-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-slate-700">
                <Pin className="w-4 h-4 text-[#990000] dark:text-red-400 mt-0.5 shrink-0 fill-[#990000] dark:fill-red-400" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight">
                    Dicas para um bom chamado
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
                    Quanto mais detalhes, mais rápido poderemos te ajudar
                  </p>
                </div>
              </div>

              {/* Tips Items */}
              <div className="space-y-5">
                {/* Tip 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/60 text-[#990000] dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Pencil className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-snug">
                      Seja claro e objetivo
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
                      Descreva o problema de forma clara e objetiva
                    </p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/60 text-[#990000] dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-snug">
                      Informe o contexto
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
                      Inclua informações como local, equipamento e o acontece
                    </p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/60 text-[#990000] dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-snug">
                      Acompanhe seu chamado
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
                      Você pode acompanhar seu chamado na seção "meus chamados"
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};
