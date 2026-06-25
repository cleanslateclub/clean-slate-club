import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Mail, MessageSquare, Search, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MessageDraftPreview from '@/components/admin/MessageDraftPreview';

const FILTERS = [
  { key: 'all', label: 'All Messages', icon: MessageSquare },
  { key: 'sent', label: 'Sent', icon: CheckCircle2 },
  { key: 'failed', label: 'Failed', icon: XCircle },
  { key: 'queued', label: 'Queued', icon: Bell },
];

const getFilteredMessages = (messages = [], filter = 'all') => {
  if (filter === 'sent') return messages.filter(item => ['sent', 'delivered'].includes(item.status));
  if (filter === 'failed') return messages.filter(item => item.status === 'failed');
  if (filter === 'queued') return messages.filter(item => ['draft', 'queued'].includes(item.status));
  return messages;
};

function FilterButton({ item, active, count, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition-all ${active ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-coral' : 'text-charcoal/35'}`} />
        <span className="font-heading text-2xl text-charcoal">{count}</span>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35 mt-3">{item.label}</p>
    </button>
  );
}

function MessageCard({ message, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(message)}
      className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{message.subject || message.template_key || 'Message'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{message.recipient_name || message.recipient_email || message.recipient_phone || 'No recipient shown'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(message.status || 'draft').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal/55 font-light mt-3 line-clamp-2">
        {message.body_preview || 'No preview available'}
      </p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-2">
        {message.channel || 'channel'} · {message.event_type || 'event not set'}
      </p>
    </button>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
    </div>
  );
}

function MessageDetailPanel({ message }) {
  if (!message) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <Mail className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a message</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a message to review status, channel, recipient, and preview.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Message detail</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{message.subject || message.template_key || 'Message'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{message.recipient_email || message.recipient_phone || 'No recipient shown'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Status" value={(message.status || 'draft').replace(/_/g, ' ')} />
        <DetailTile label="Channel" value={message.channel} />
        <DetailTile label="Direction" value={message.direction} />
        <DetailTile label="Event" value={message.event_type} />
        <DetailTile label="Template" value={message.template_key} />
        <DetailTile label="Sent at" value={message.sent_at} />
      </div>

      <DetailTile label="Recipient" value={message.recipient_name || message.recipient_email || message.recipient_phone} />
      <DetailTile label="Preview" value={message.body_preview} />
      {message.error_message && <DetailTile label="Error" value={message.error_message} />}
    </div>
  );
}

export default function MessagesWorkspace() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.MessageLog.list('-created_date', 300);
        if (!active) return;
        setMessages(records || []);
      } catch (error) {
        console.error('Messages workspace load failed:', error);
        if (active) setLoadError('Could not load message records from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map(item => [item.key, getFilteredMessages(messages, item.key).length])), [messages]);

  const filteredMessages = useMemo(() => {
    const pool = getFilteredMessages(messages, filter);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(message => [
      message.subject,
      message.template_key,
      message.recipient_name,
      message.recipient_email,
      message.recipient_phone,
      message.status,
      message.channel,
      message.body_preview,
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [messages, filter, search]);

  const selectedMessage = selected ? messages.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Messages workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Communication history</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Centralizes sent, failed, and queued communication records so follow-up does not get lost.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading messages...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <MessageDraftPreview />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FILTERS.map(item => (
          <FilterButton key={item.key} item={item} active={filter === item.key} count={counts[item.key] || 0} onClick={() => { setFilter(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredMessages.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <MessageSquare className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/40 font-light">No messages in this view.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map(message => (
                <MessageCard key={message.id} message={message} selected={selected?.id === message.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <MessageDetailPanel message={selectedMessage} />
        </div>
      </div>
    </div>
  );
}
