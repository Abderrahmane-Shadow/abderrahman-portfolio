import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Mail, Trash2, CheckCircle2, MessageSquare, Clock, Inbox, User, ExternalLink } from 'lucide-react';

export const ContactManager: React.FC = () => {
  const { messages, markMessageRead, deleteMessage, profile, updateProfile } = useData();
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleSelectMessage = async (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await markMessageRead(msg.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      await deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setStatusNotice('Message removed.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Contact Information & Inquiries Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review visitor submissions, recruiting inquiries, and contact channel configurations
        </p>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Messages Inbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List Column */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Received Messages ({messages.length})</span>
            </h2>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px]">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectMessage(m)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border text-xs ${
                  selectedMessage?.id === m.id
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-[#111C30]/70 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="font-semibold text-slate-700 dark:text-slate-300 truncate mb-1">
                  {m.subject}
                </div>

                <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                  {m.message}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <span>No messages received yet. When visitors fill out your contact form, submissions will appear here.</span>
              </div>
            )}
          </div>
        </div>

        {/* Message Reader Column */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Received: {new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <span>Select a message from the list on the left to read its full contents.</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            Messages are stored securely in Supabase / Local Storage with Row Level Security.
          </div>
        </div>

      </div>

    </div>
  );
};
