import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, FileText, Search, Send, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CheckoutPreviewPanel from '@/components/admin/CheckoutPreviewPanel';

const FILTERS = [
  { key: 'all', label: 'All Records', icon: FileText },
  { key: 'draft', label: 'Draft', icon: FileText },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'paid', label: 'Paid', icon: CheckCircle2 },
  { key: 'failed', label: 'Needs Review', icon: XCircle },
];

const centsToDollars = (value = 0) => `$${(Number(value || 0) / 100).toFixed(2)}`;

const getFilteredInvoices = (invoices = [], filter = 'all') => {
  if (filter === 'draft') return invoices.filter(item => item.status === 'draft');
  if (filter === 'sent') return invoices.filter(item => item.status === 'sent');
  if (filter === 'paid') return invoices.filter(item => item.status === 'paid');
  if (filter === 'failed') return invoices.filter(item => ['failed', 'void'].includes(item.status));
  return invoices;
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

function InvoiceCard({ invoice, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(invoice)}
      className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{invoice.client_name || invoice.client_email || 'Invoice'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{invoice.service_label || 'Service not set'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(invoice.status || 'draft').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal/55 font-light mt-3">
        Balance: {centsToDollars(invoice.balance_due_cents)}
      </p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-2">
        Total {centsToDollars(invoice.total_cents)} · Paid {centsToDollars(invoice.amount_paid_cents)}
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

function InvoiceDetailPanel({ invoice }) {
  if (!invoice) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <CreditCard className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a record</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a payment record to review totals and status.</p>
      </div>
    );
  }

  const lineItems = Array.isArray(invoice.line_items) ? invoice.line_items : [];

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Payment detail</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{invoice.client_name || invoice.client_email || 'Invoice'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{invoice.service_label || 'Service not set'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Status" value={(invoice.status || 'draft').replace(/_/g, ' ')} />
        <DetailTile label="Client email" value={invoice.client_email} />
        <DetailTile label="Subtotal" value={centsToDollars(invoice.subtotal_cents)} />
        <DetailTile label="Deposit applied" value={centsToDollars(invoice.deposit_cents)} />
        <DetailTile label="Discount" value={centsToDollars(invoice.discount_cents)} />
        <DetailTile label="Tip" value={centsToDollars(invoice.tip_cents)} />
        <DetailTile label="Total" value={centsToDollars(invoice.total_cents)} />
        <DetailTile label="Balance due" value={centsToDollars(invoice.balance_due_cents)} />
      </div>

      <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-3">Line items</p>
        {lineItems.length === 0 ? (
          <p className="font-body text-sm text-charcoal/40 font-light">No line items shown.</p>
        ) : (
          <div className="space-y-2">
            {lineItems.map((item, index) => (
              <div key={`${item.description || 'item'}-${index}`} className="flex items-center justify-between gap-3 font-body text-sm text-charcoal/60 font-light">
                <span>{item.description || item.label || 'Line item'}</span>
                <span>{centsToDollars(item.amount_cents)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DetailTile label="Sent at" value={invoice.sent_at} />
      <DetailTile label="Paid at" value={invoice.paid_at} />
      <DetailTile label="Admin notes" value={invoice.admin_notes} />
    </div>
  );
}

export default function PaymentsWorkspace() {
  const [invoices, setInvoices] = useState([]);
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
        const records = await base44.entities.Invoice.list('-created_date', 300);
        if (!active) return;
        setInvoices(records || []);
      } catch (error) {
        console.error('Payments workspace load failed:', error);
        if (active) setLoadError('Could not load payment records from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map(item => [item.key, getFilteredInvoices(invoices, item.key).length])), [invoices]);

  const filteredInvoices = useMemo(() => {
    const pool = getFilteredInvoices(invoices, filter);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(invoice => [
      invoice.client_name,
      invoice.client_email,
      invoice.service_label,
      invoice.status,
      invoice.admin_notes,
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [invoices, filter, search]);

  const selectedInvoice = selected ? invoices.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Payments workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Invoices and balances</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Read-only view for invoice totals, deposits applied, paid amounts, and balances before checkout automation is enabled.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading records...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <CheckoutPreviewPanel invoice={selectedInvoice} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
              placeholder="Search records..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <FileText className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/40 font-light">No payment records in this view.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map(invoice => (
                <InvoiceCard key={invoice.id} invoice={invoice} selected={selected?.id === invoice.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <InvoiceDetailPanel invoice={selectedInvoice} />
        </div>
      </div>
    </div>
  );
}
