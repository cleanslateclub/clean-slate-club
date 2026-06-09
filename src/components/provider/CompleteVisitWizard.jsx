import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  X, MapPin, Camera, CheckSquare, FileText, DollarSign, Check,
  Clock, ChevronRight, ChevronLeft, Plus, AlertTriangle, AlertCircle,
  Smartphone, Upload, Trash2, Package, User, Home, Send,
  Wifi, SkipForward, RefreshCw, PawPrint, Key, Heart, Info,
  Pause, Play, PenLine, Gift, Shield, Star
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'arrival',  label: 'Arrival'  },
  { id: 'pre',      label: 'Pre-Visit'},
  { id: 'service',  label: 'Service'  },
  { id: 'wrapup',   label: 'Wrap-Up'  },
  { id: 'checkout', label: 'Checkout' },
  { id: 'sign',     label: 'Sign'     },
  { id: 'done',     label: 'Done'     },
];
const DEPOSIT         = 50;
const IRS_RATE        = 0.67;
const REFERRAL_VALUE  = 25;

const fmt  = n => `$${(parseFloat(n) || 0).toFixed(2)}`;
const fmtT = ms => {
  if (!ms || ms < 0) return '0s';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
};

// ─── Inner: PhotoGrid ─────────────────────────────────────────────────────────
function PhotoGrid({ photos, onAdd, onRemove, label }) {
  const ref = useRef();
  return (
    <div>
      <p className="font-body text-xs text-charcoal/50 font-light mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map(p => (
          <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-taupe/20">
            <img src={p.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 bg-black/40 rounded px-1">
              <p className="text-white text-[8px] font-mono">{p.ts}</p>
            </div>
            <button onClick={() => onRemove(p.id)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {photos.length < 8 && (
          <button onClick={() => ref.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-taupe/30 flex flex-col items-center justify-center hover:border-coral/40 transition-colors">
            <Upload className="w-5 h-5 text-charcoal/25 mb-1" />
            <span className="font-body text-[10px] text-charcoal/25">Add</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]; if (!file) return;
          const reader = new FileReader();
          const ts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          reader.onload = ev => onAdd({ id: crypto.randomUUID(), url: ev.target.result, ts });
          reader.readAsDataURL(file); e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Inner: SignatureCanvas ───────────────────────────────────────────────────
function SignatureCanvas({ onSign, onClear, hasSigned }) {
  const cvs = useRef(); const drawing = useRef(false); const last = useRef(null);
  const pos = (e, c) => {
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const src = e.touches?.[0] || e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };
  const start = useCallback(e => { e.preventDefault(); drawing.current = true; last.current = pos(e, cvs.current); }, []);
  const move  = useCallback(e => {
    e.preventDefault(); if (!drawing.current) return;
    const c = cvs.current, ctx = c.getContext('2d'), p = pos(e, c);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y); ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
    last.current = p; onSign(c.toDataURL('image/png'));
  }, [onSign]);
  const stop = useCallback(() => { drawing.current = false; }, []);
  const clear = () => { cvs.current.getContext('2d').clearRect(0, 0, cvs.current.width, cvs.current.height); onClear(); };
  return (
    <div>
      <div className="relative border-2 border-taupe/25 rounded-xl overflow-hidden bg-white" style={{ touchAction: 'none' }}>
        <canvas ref={cvs} width={560} height={180} className="w-full" style={{ height: '130px', cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        />
        {!hasSigned && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center"><PenLine className="w-5 h-5 text-charcoal/15 mx-auto mb-1" />
              <p className="font-body text-sm text-charcoal/15 font-light">Sign here</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-4 right-4 border-t border-taupe/20" />
      </div>
      {hasSigned && <button onClick={clear} className="mt-1.5 font-body text-xs text-charcoal/30 hover:text-coral transition-colors">↺ Clear & re-sign</button>}
    </div>
  );
}

// ─── Inner: IncidentModal ─────────────────────────────────────────────────────
function IncidentModal({ booking, providerData, onClose, onSubmitted }) {
  const [type, setType]           = useState('');
  const [desc, setDesc]           = useState('');
  const [severity, setSeverity]   = useState('low');
  const [saving, setSaving]       = useState(false);
  const [done, setDone]           = useState(false);
  const TYPES = ['Broken / damaged item','Safety concern','Access issue','Pet incident','Client behavior','Provider injury','Supply problem','Other'];
  const submit = async () => {
    if (!type || !desc) return; setSaving(true);
    try {
      await base44.entities.Incident.create({
        booking_id: booking.id, client_name: booking.client_name,
        client_email: booking.client_email, client_address: booking.client_address || '',
        provider_email: providerData?.email || '', provider_name: providerData?.full_name || '',
        incident_type: type, description: desc, severity,
        service_date: booking.scheduled_date, reported_date: new Date().toISOString(), status: 'reported',
      });
      base44.integrations.Core.SendEmail({
        to: 'cleanslateclubpa@gmail.com',
        subject: `⚠️ Incident: ${type} — ${booking.client_name}`,
        body: `Provider: ${providerData?.full_name}\nClient: ${booking.client_name}\nDate: ${booking.scheduled_date}\nType: ${type}\nSeverity: ${severity}\n\n${desc}\n\nhttps://cleanslateclub.co/admin`,
      }).catch(() => {});
      setDone(true); onSubmitted();
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-cream rounded-2xl shadow-2xl p-6">
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-sage" /></div>
            <p className="font-heading text-base font-semibold text-charcoal mb-1">Report Submitted</p>
            <p className="font-body text-sm text-charcoal/40 font-light mb-4">Admin notified immediately.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-charcoal text-white font-body text-sm tracking-wide">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading text-base font-semibold text-charcoal">Report an Issue</h3></div>
              <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal/70"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-2">What happened?</label>
                <div className="grid grid-cols-2 gap-1.5">{TYPES.map(t => (
                  <button key={t} onClick={() => setType(t)} className={`px-3 py-2 rounded-xl font-body text-xs font-light text-left transition-all ${
                    type === t ? 'bg-coral/10 border border-coral/30 text-coral' : 'bg-warm-white border border-taupe/15 text-charcoal/60 hover:border-coral/20'}`}>{t}</button>
                ))}</div>
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Severity</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[['low','🟡 Minor'],['medium','🟠 Moderate'],['high','🔴 Serious']].map(([v,l]) => (
                    <button key={v} onClick={() => setSeverity(v)} className={`py-2 rounded-xl font-body text-xs font-light transition-all ${
                      severity === v ? 'bg-coral/10 border border-coral/30 text-coral' : 'bg-warm-white border border-taupe/15 text-charcoal/60'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what happened..." rows={3}
                className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
              <button onClick={submit} disabled={!type || !desc || saving}
                className="w-full py-3 rounded-xl bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-50 transition-all">
                {saving ? 'Submitting...' : 'Submit Report to Admin'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Toggle helper ────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-all relative ${on ? 'bg-sage' : 'bg-taupe/30'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CompleteVisitWizard({ booking, providerData, onComplete, onClose }) {
  const [step, setStep] = useState(0);

  // Timer
  const [clockIn,    setClockIn]    = useState(null);
  const [clockOut,   setClockOut]   = useState(null);
  const [paused,     setPaused]     = useState(false);
  const [pausedMs,   setPausedMs]   = useState(0);
  const [pauseStart, setPauseStart] = useState(null);
  const [elapsed,    setElapsed]    = useState(0);
  const timerRef = useRef();

  // Client / household
  const [clientPresent, setClientPresent] = useState(true);
  const [household,     setHousehold]     = useState(null);
  const [prevVisit,     setPrevVisit]     = useState(null);
  const [showPrev,      setShowPrev]      = useState(false);

  // Photos
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos,  setAfterPhotos]  = useState([]);

  // Work items
  const [tasks,         setTasks]         = useState([]);
  const [addons,        setAddons]        = useState([]);
  const [extraTasks,    setExtraTasks]    = useState([]);
  const [supplies,      setSupplies]      = useState([]);

  // Notes
  const [conditionNote, setConditionNote] = useState('');
  const [clientNote,    setClientNote]    = useState('');
  const [adminNote,     setAdminNote]     = useState('');

  // Pricing
  const [finalPrice,  setFinalPrice]  = useState('');
  const [depositPaid, setDepositPaid] = useState(true);
  const [tipType,     setTipType]     = useState('none');
  const [customTip,   setCustomTip]   = useState('');
  const [credits,     setCredits]     = useState(0);
  const [useCredit,   setUseCredit]   = useState(false);
  const [okayed,      setOkayed]      = useState(false);
  const [payMethod,   setPayMethod]   = useState(null);
  const [payStatus,   setPayStatus]   = useState(null);
  const [payErr,      setPayErr]      = useState(null);
  const [nfcBusy,     setNfcBusy]     = useState(false);
  const [canNFC,      setCanNFC]      = useState(false);

  // Signature
  const [signed,    setSigned]    = useState(false);
  const [sigData,   setSigData]   = useState(null);

  // Incident
  const [showIncident,  setShowIncident]  = useState(false);
  const [incidentCount, setIncidentCount] = useState(0);

  // Done
  const [reviewChoice,  setReviewChoice]  = useState(null);
  const [reviewSent,    setReviewSent]    = useState(false);
  const [mileChoice,    setMileChoice]    = useState(null);
  const [mileInput,     setMileInput]     = useState('');
  const [mileLogged,    setMileLogged]    = useState(false);
  const [scheduleNext,  setScheduleNext]  = useState(false);

  // Submit
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [submitErr, setSubmitErr] = useState(null);

  // ── Init ──
  useEffect(() => {
    const rawTasks  = booking?.intake_answers?._tasks || [];
    const rawAddons = booking?.addons || [];
    setTasks(rawTasks.map(l => ({ id: crypto.randomUUID(), label: l, done: false, skipped: false, note: '' })));
    setAddons(rawAddons.map(id => ({
      id, label: id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
      done: true, skipped: false, skipReason: '',
    })));
    if (booking?.client_email) {
      base44.entities.HouseholdProfile.filter({ guest_email: booking.client_email })
        .then(p => { if (p?.length) { setHousehold(p[0]); if ((p[0].referral_credits_available||0)>0) { setCredits(p[0].referral_credits_available * REFERRAL_VALUE); setUseCredit(true); } } })
        .catch(()=>{});
      base44.entities.Booking.filter({ client_email: booking.client_email, status: 'completed' })
        .then(b => { const s = (b||[]).filter(x=>x.id!==booking.id).sort((a,b)=>new Date(b.scheduled_date)-new Date(a.scheduled_date)); if(s.length) setPrevVisit(s[0]); })
        .catch(()=>{});
    }
    if ('PaymentRequest' in window) {
      try { new PaymentRequest([{supportedMethods:'https://google.com/pay'}],{total:{label:'t',amount:{currency:'USD',value:'0.01'}}})
        .canMakePayment().then(c=>setCanNFC(!!c)).catch(()=>{}); } catch {}
    }
  }, [booking]);

  // ── Timer ──
  useEffect(() => {
    if (clockIn && !clockOut && !paused) {
      timerRef.current = setInterval(() => setElapsed(Date.now()-clockIn-pausedMs), 1000);
    } else { clearInterval(timerRef.current); if(clockIn&&clockOut) setElapsed(clockOut-clockIn-pausedMs); }
    return () => clearInterval(timerRef.current);
  }, [clockIn, clockOut, paused, pausedMs]);

  const doPause  = () => { setPaused(true);  setPauseStart(Date.now()); };
  const doResume = () => { if(pauseStart) setPausedMs(p=>p+(Date.now()-pauseStart)); setPauseStart(null); setPaused(false); };

  // ── Pricing ──
  const base       = parseFloat(finalPrice) || 0;
  const supTotal   = supplies.reduce((s,c)=>s+(parseFloat(c.price)||0), 0);
  const creditOff  = useCredit ? Math.min(credits, base+supTotal) : 0;
  const sub        = base + supTotal - creditOff;
  const tip = tipType==='none' ? 0 : tipType==='15' ? Math.round(sub*.15*100)/100
    : tipType==='20' ? Math.round(sub*.20*100)/100 : tipType==='25' ? Math.round(sub*.25*100)/100
    : (parseFloat(customTip)||0);
  const dep        = depositPaid ? DEPOSIT : 0;
  const balance    = Math.max(0, sub + tip - dep);

  // ── Handlers ──
  const doClockIn  = () => setClockIn(Date.now());
  const doClockOut = () => setClockOut(Date.now());
  const toggleTask   = id => setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done,skipped:false}:t));
  const skipTask     = id => setTasks(p=>p.map(t=>t.id===id?{...t,skipped:!t.skipped,done:false}:t));
  const taskNote     = (id,v) => setTasks(p=>p.map(t=>t.id===id?{...t,note:v}:t));
  const addExtra     = () => setExtraTasks(p=>[...p,{id:crypto.randomUUID(),label:'',done:true}]);
  const upExtra      = (id,f,v) => setExtraTasks(p=>p.map(t=>t.id===id?{...t,[f]:v}:t));
  const rmExtra      = id => setExtraTasks(p=>p.filter(t=>t.id!==id));
  const toggleAddon  = id => setAddons(p=>p.map(a=>a.id===id?{...a,done:!a.done,skipped:!a.done}:a));
  const addonNote    = (id,v) => setAddons(p=>p.map(a=>a.id===id?{...a,skipReason:v}:a));
  const addSup       = () => setSupplies(p=>[...p,{id:crypto.randomUUID(),label:'',price:''}]);
  const upSup        = (id,f,v) => setSupplies(p=>p.map(s=>s.id===id?{...s,[f]:v}:s));
  const rmSup        = id => setSupplies(p=>p.filter(s=>s.id!==id));

  const doNFCPay = async () => {
    if (!('PaymentRequest' in window)) { setPayErr('Tap to Pay not supported on this device.'); return; }
    setNfcBusy(true); setPayErr(null);
    try {
      const pr = new PaymentRequest(
        [{supportedMethods:'https://google.com/pay',data:{merchantName:'Clean Slate Club',merchantId:'YOUR_MERCHANT_ID'}},
         {supportedMethods:'https://apple.com/apple-pay'},
         {supportedMethods:'basic-card',data:{supportedNetworks:['visa','mastercard','amex','discover']}}],
        { total:{label:`Clean Slate Club — ${booking.client_name}`,amount:{currency:'USD',value:balance.toFixed(2)}},
          displayItems:[
            {label:'Service',amount:{currency:'USD',value:base.toFixed(2)}},
            ...(supTotal>0?[{label:'Supplies',amount:{currency:'USD',value:supTotal.toFixed(2)}}]:[]),
            ...(creditOff>0?[{label:'Referral credit',amount:{currency:'USD',value:(-creditOff).toFixed(2)}}]:[]),
            ...(dep>0?[{label:'Deposit paid',amount:{currency:'USD',value:(-dep).toFixed(2)}}]:[]),
            ...(tip>0?[{label:'Tip',amount:{currency:'USD',value:tip.toFixed(2)}}]:[]),
          ]
        }
      );
      const resp = await pr.show();
      await resp.complete('success');
      setPayMethod('nfc'); setPayStatus('success');
    } catch(e) { if(e.name!=='AbortError') { setPayErr('Payment not completed. Try another method.'); setPayStatus('failed'); } }
    finally { setNfcBusy(false); }
  };

  const doSendLink = async () => {
    setPayStatus('sending'); setPayErr(null);
    try {
      // Fire-and-forget: in production wire to createVisitPaymentIntent
      await new Promise(r => setTimeout(r, 800));
      setPayMethod('link_sent'); setPayStatus('link_sent');
    } catch { setPayErr('Could not send link. Try another method.'); setPayStatus('failed'); }
  };

  const doReview = async () => {
    base44.functions.invoke('sendClientSmsConfirmation', {
      data: { ...booking, override_message:
        `Hi ${booking.client_name}! Thank you for choosing Clean Slate Club ✨ We’d love your review: https://g.page/r/cleanslateclub/review 💛 Reply STOP to opt out.` }
    }).catch(()=>{}); setReviewSent(true);
  };

  const doMileage = async () => {
    const m = parseFloat(mileInput); if(!m||m<=0) return;
    base44.entities.MileageLog.create({
      provider_email: providerData?.email||'', provider_name: providerData?.full_name||'',
      date: booking.scheduled_date, year: new Date().getFullYear(),
      booking_id: booking.id, client_name: booking.client_name,
      trip_purpose: 'job_travel', start_address: providerData?.territory||'Provider location',
      end_address: booking.client_address||'', round_trip: true,
      miles: m, total_miles: m*2,
      estimated_deduction: Math.round(m*2*IRS_RATE*100)/100, irs_rate_used: IRS_RATE,
      is_reimbursable: false, reimbursement_status: 'not_applicable',
    }).catch(()=>{}); setMileLogged(true);
  };

  // ── Step guards ──
  const canNext = () => {
    if (step===0) return !!clockIn;
    if (step===4) return !!payMethod && finalPrice!=='';
    if (step===5) return signed || !clientPresent;
    return true;
  };
  const next = () => { if(canNext()&&step<STEPS.length-1) setStep(s=>s+1); };
  const prev = () => { if(step>0) setStep(s=>s-1); };

  // NOTE: handleSubmit and all JSX for steps 4–6 are in Part 2 below.
  // Paste Part 2 immediately after this closing bracket.
  // ── Submit ──
  const handleSubmit = async () => {
    setSaving(true); setSubmitErr(null);
    try {
      const now = new Date();
      const doneTasks  = [...tasks.filter(t=>t.done).map(t=>t.label), ...extraTasks.filter(t=>t.done&&t.label).map(t=>t.label)];
      const skipTasks  = tasks.filter(t=>t.skipped).map(t=>`${t.label}${t.note?` (${t.note})`:''}`).join(', ');
      const doneAddons = addons.filter(a=>a.done).map(a=>a.label).join(', ');
      const skipAddons = addons.filter(a=>a.skipped).map(a=>`${a.label}${a.skipReason?` (${a.skipReason})`:''}`).join(', ');
      const log = [
        `\n✓ Visit completed ${now.toLocaleDateString('en-US')} at ${now.toLocaleTimeString('en-US')}`,
        clockIn  ? `  Clock in:  ${new Date(clockIn).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}` : null,
        clockOut ? `  Clock out: ${new Date(clockOut).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}` : null,
        elapsed  ? `  Active time: ${fmtT(elapsed)}${pausedMs>60000?` (⏸ ${fmtT(pausedMs)} paused)`:''}` : null,
        `  Client present: ${clientPresent?'Yes':'No'}`,
        doneTasks.length  ? `  Tasks done: ${doneTasks.join(', ')}` : null,
        skipTasks         ? `  Tasks skipped: ${skipTasks}` : null,
        doneAddons        ? `  Add-ons done: ${doneAddons}` : null,
        skipAddons        ? `  Add-ons skipped: ${skipAddons}` : null,
        supplies.length   ? `  Supplies: ${supplies.map(s=>`${s.label} ${fmt(s.price)}`).join(', ')}` : null,
        `  Charged: ${fmt(base+supTotal)} | Balance: ${fmt(balance)} via ${payMethod}`,
        tip>0             ? `  Tip: ${fmt(tip)}` : null,
        creditOff>0       ? `  Credit applied: -${fmt(creditOff)}` : null,
        incidentCount>0   ? `  ⚠️ ${incidentCount} incident(s) reported` : null,
        adminNote         ? `  Admin note: ${adminNote}` : null,
        'REFUND_HANDLED_BY_CANCELLATION_FUNCTION',
      ].filter(Boolean).join('\n');

      await base44.entities.Booking.update(booking.id, {
        status: 'completed',
        admin_notes: (booking.admin_notes||'') + log,
        intake_answers: {
          ...booking.intake_answers,
          before_photos:         beforePhotos.map(p=>p.url),
          after_photos:          afterPhotos.map(p=>p.url),
          provider_client_notes: clientNote,
          client_signature:      sigData||null,
          client_was_present:    clientPresent,
          completion_timestamp:  now.toISOString(),
        },
      });

      if (base>0) {
        await base44.entities.ProviderPayout.create({
          provider_email: providerData?.email||booking.provider_email||'',
          booking_id: booking.id, client_name: booking.client_name,
          service_date: booking.scheduled_date,
          gross_amount: base+supTotal, payout_rate: providerData?.payout_rate||0.5,
          net_payout: (base+supTotal)*(providerData?.payout_rate||0.5),
          tip_amount: tip, status: 'pending',
          payment_method: payMethod||'unknown', notes: adminNote||'',
        });
      }

      if (creditOff>0 && household?.id) {
        const used = Math.ceil(creditOff/REFERRAL_VALUE);
        base44.entities.HouseholdProfile.update(household.id, {
          referral_credits_available: Math.max(0,(household.referral_credits_available||0)-used),
          referral_credits_used: (household.referral_credits_used||0)+used,
        }).catch(()=>{});
      }

      // Itemized receipt to client
      if (booking.client_email) {
        const rows = [
          {l:'Service',v:fmt(base)},
          ...supplies.filter(s=>s.label&&s.price).map(s=>({l:s.label,v:fmt(s.price)})),
          ...(creditOff>0?[{l:'Referral credit',v:`-${fmt(creditOff)}`}]:[]),
          ...(tip>0?[{l:'Tip ✨',v:fmt(tip)}]:[]),
          ...(dep>0?[{l:'Deposit paid at booking',v:`-${fmt(dep)}`}]:[]),
        ].map(r=>`<tr><td style="padding:8px 0;font-size:14px;font-weight:300;color:#555;">${r.l}</td><td style="padding:8px 0;font-size:14px;font-weight:400;color:#333;text-align:right;">${r.v}</td></tr>`).join('');
        const receipt = `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>body{margin:0;background:#fdfcfb;font-family:'Lato',sans-serif;}.w{max-width:560px;margin:0 auto;background:#fdfcfb;}.h{background:linear-gradient(135deg,#EB9486,#fcd5ce,#ece4db);padding:36px 40px;text-align:center;}.bn{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#fff;margin:0 0 2px;}.bs{font-family:'Montserrat',sans-serif;font-size:24px;font-weight:300;color:#fff;margin:0;}.b{padding:36px 40px;}.g{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:600;color:#333;margin:0 0 12px;}p{font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}.c{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:20px 24px;margin:20px 0;}.cl{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#EB9486;margin:0 0 12px;}.tr{border-top:2px solid #f0e8e4;padding-top:12px;margin-top:8px;}.f{background:#f9f4f2;padding:24px 40px;text-align:center;border-top:1px solid #f0e8e4;}.f p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 3px;}</style>
</head><body><div class="w"><div class="h"><p class="bn">Clean Slate</p><p class="bs">Club™</p></div>
<div class="b"><p class="g">Thank you, ${booking.client_name}! ✨</p>
<p>Here’s your itemized receipt for today’s visit.</p>
<div class="c"><p class="cl">Visit Summary</p><table width="100%" cellpadding="0" cellspacing="0">${rows}
<tr class="tr"><td style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#333;">Total</td><td style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:600;color:#EB9486;text-align:right;">${fmt(balance+dep)}</td></tr>
</table>${clientNote?`<p style="margin-top:16px;padding-top:12px;border-top:1px solid #f0e8e4;font-size:14px;font-weight:300;color:#777;font-style:italic;">“${clientNote}”</p>`:''}</div>
<p style="font-size:13px;color:#aaa;margin-top:24px;font-weight:300;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;">Masha &amp; the Clean Slate Team</strong></p></div>
<div class="f"><p>Questions? Text us at (206) 825-4061</p><p>cleanslateclubpa@gmail.com · cleanslateclub.co</p></div></div></body></html>`;
        base44.integrations.Core.SendEmail({ to: booking.client_email, subject: `Your Clean Slate Club receipt — ${now.toLocaleDateString('en-US',{month:'long',day:'numeric'})}`, body: receipt }).catch(()=>{});
      }

      // Admin notification
      base44.integrations.Core.SendEmail({
        to: 'cleanslateclubpa@gmail.com',
        subject: `✓ Visit done — ${booking.client_name} — ${fmt(base+supTotal)} collected`,
        body: [`Visit completed.`,``,`Client: ${booking.client_name}`,`Provider: ${providerData?.full_name||'Unknown'}`,`Date: ${booking.scheduled_date}`,elapsed?`Active time: ${fmtT(elapsed)}`:null,`Charged: ${fmt(base+supTotal)} | Balance: ${fmt(balance)} via ${payMethod}`,tip>0?`Tip: ${fmt(tip)}`:null,creditOff>0?`Credit applied: -${fmt(creditOff)}`:null,incidentCount>0?`⚠️ ${incidentCount} incident(s) — review dashboard`:null,``,clientNote?`Client note:\n${clientNote}`:null,adminNote?`Admin note:\n${adminNote}`:null,``,`https://cleanslateclub.co/admin`].filter(Boolean).join('\n'),
      }).catch(()=>{});

      setSaved(true);
      setTimeout(()=>onComplete(), 3000);
    } catch(err) {
      console.error(err);
      setSubmitErr('Something went wrong. Please try again.');
    } finally { setSaving(false); }
  };

  // ── Render ──
  return (
    <>
      <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:40}}
          className="w-full sm:max-w-xl bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[96vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-taupe/15 shrink-0">
            <div>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-coral/60 font-light">Complete Visit</p>
              <h2 className="font-heading text-lg font-semibold text-charcoal">{booking?.client_name}</h2>
              <p className="font-body text-xs text-charcoal/40 font-light">{booking?.service_category?.replace(/_/g,' ')} · {booking?.scheduled_date}</p>
            </div>
            <div className="flex items-center gap-2">
              {step>=1&&step<=4&&(
                <button onClick={()=>setShowIncident(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs transition-all ${incidentCount>0?'border-amber-400 bg-amber-50 text-amber-600':'border-taupe/20 text-charcoal/40 hover:border-amber-300 hover:text-amber-500'}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />{incidentCount>0?`${incidentCount} reported`:'Report Issue'}
                </button>
              )}
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-taupe/10 flex items-center justify-center hover:bg-taupe/20"><X className="w-4 h-4 text-charcoal/50" /></button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-2.5 border-b border-taupe/10 shrink-0">
            <div className="flex gap-1">
              {STEPS.map((s,i)=>(
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-1 rounded-full transition-all ${i<step?'bg-coral':i===step?'bg-coral/60':'bg-taupe/20'}`}/>
                  <span className={`font-body text-[9px] font-light ${i<=step?'text-coral':'text-charcoal/25'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timer strip */}
          {clockIn&&step>0&&step<6&&(
            <div className={`px-6 py-2.5 border-b flex items-center justify-between shrink-0 ${paused?'bg-amber-50 border-amber-200':'bg-sage/10 border-sage/20'}`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${paused?'text-amber-500':'text-charcoal/50'}`}/>
                <span className={`font-body text-xs font-light ${paused?'text-amber-600':'text-charcoal/60'}`}>{paused?'Timer paused':`In: ${new Date(clockIn).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-heading text-sm font-semibold ${paused?'text-amber-600':'text-charcoal'}`}>{fmtT(elapsed)}</span>
                {!clockOut&&(paused
                  ?<button onClick={doResume} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-white font-body text-xs"><Play className="w-3 h-3"/>Resume</button>
                  :<button onClick={doPause}  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-white font-body text-xs"><Pause className="w-3 h-3"/>Pause</button>
                )}
                {step===3&&!clockOut&&<button onClick={doClockOut} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral text-white font-body text-xs"><Check className="w-3 h-3"/>Out</button>}
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.15}} className="space-y-5">

                {/* STEP 0: ARRIVAL */}
                {step===0&&(
                  <>
                    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-1"><User className="w-4 h-4 text-coral"/><p className="font-heading text-sm font-semibold text-charcoal">Client</p></div>
                      <p className="font-body text-sm text-charcoal font-light">{booking?.client_name}</p>
                      <p className="font-body text-xs text-charcoal/50 font-light">{booking?.client_phone} · {booking?.client_email}</p>
                      {booking?.client_address&&<a href={`https://maps.google.com/?q=${encodeURIComponent(booking.client_address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-body text-xs text-coral hover:underline"><MapPin className="w-3 h-3"/>{booking.client_address}</a>}
                    </div>
                    <div className="bg-butter/20 border border-butter/40 rounded-2xl p-4">
                      <p className="font-body text-[10px] text-charcoal/40 uppercase tracking-widest font-light mb-1">Quote Range</p>
                      <p className="font-heading text-3xl font-semibold text-charcoal">${booking?.estimated_price_low} – ${booking?.estimated_price_high}</p>
                    </div>
                    {household&&(
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4 space-y-2">
                        <div className="flex items-center gap-2 mb-1"><Home className="w-4 h-4 text-charcoal/50"/><p className="font-heading text-sm font-semibold text-charcoal">Household</p></div>
                        {household.pets&&<div className="flex gap-2 items-start"><PawPrint className="w-3.5 h-3.5 text-charcoal/40 mt-0.5 shrink-0"/><p className="font-body text-xs text-charcoal/60 font-light">{household.pets}</p></div>}
                        {household.access_notes&&<div className="flex gap-2 items-start"><Key className="w-3.5 h-3.5 text-charcoal/40 mt-0.5 shrink-0"/><p className="font-body text-xs text-charcoal/60 font-light">{household.access_notes}</p></div>}
                        {household.supply_preferences&&<div className="flex gap-2 items-start"><Package className="w-3.5 h-3.5 text-charcoal/40 mt-0.5 shrink-0"/><p className="font-body text-xs text-charcoal/60 font-light">{household.supply_preferences}</p></div>}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {household.shoe_policy&&<span className="font-body text-xs text-charcoal/50 px-3 py-1 rounded-full border border-taupe/20 bg-cream">👟 Shoes off</span>}
                          {household.seniors_present&&<span className="font-body text-xs text-charcoal/50 px-3 py-1 rounded-full border border-sage/30 bg-sage/10">💚 Senior in home</span>}
                          {household.mobility_concerns&&<span className="font-body text-xs text-charcoal/50 px-3 py-1 rounded-full border border-amber-200 bg-amber-50">⚠️ Mobility</span>}
                        </div>
                      </div>
                    )}
                    {prevVisit&&(
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4">
                        <button onClick={()=>setShowPrev(p=>!p)} className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-charcoal/40"/><p className="font-heading text-sm font-semibold text-charcoal">Last Visit</p></div>
                          <span className="font-body text-xs text-charcoal/30">{prevVisit.scheduled_date} {showPrev?'▲':'▼'}</span>
                        </button>
                        {showPrev&&(
                          <div className="mt-3 pt-3 border-t border-taupe/10">
                            <p className="font-body text-xs text-charcoal/60 font-light">{prevVisit.service_category?.replace(/_/g,' ')}</p>
                            {prevVisit.intake_answers?.provider_client_notes&&<p className="font-body text-xs text-charcoal/50 font-light italic mt-1">“{prevVisit.intake_answers.provider_client_notes}”</p>}
                            {(prevVisit.intake_answers?.after_photos?.length>0)&&<div className="flex gap-1.5 mt-2">{prevVisit.intake_answers.after_photos.slice(0,3).map((u,i)=><img key={i} src={u} alt="" className="w-14 h-14 rounded-lg object-cover border border-taupe/20"/>)}</div>}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-warm-white rounded-2xl border border-taupe/15 p-4">
                      <div><p className="font-body text-sm text-charcoal font-light">Client is present</p><p className="font-body text-[10px] text-charcoal/30 font-light">Toggle off for unoccupied visit</p></div>
                      <Toggle on={clientPresent} onToggle={()=>setClientPresent(p=>!p)}/>
                    </div>
                    {booking?.special_notes&&<div className="bg-coral/5 border border-coral/15 rounded-xl px-4 py-3 flex gap-2"><Info className="w-4 h-4 text-coral shrink-0 mt-0.5"/><p className="font-body text-xs text-charcoal/60 font-light">{booking.special_notes}</p></div>}
                    {!clockIn
                      ?<button onClick={doClockIn} className="w-full py-4 rounded-2xl bg-coral text-white font-heading text-base font-semibold hover:bg-coral/90 transition-all flex items-center justify-center gap-3"><Clock className="w-5 h-5"/>Tap to Clock In</button>
                      :<div className="w-full py-4 rounded-2xl bg-sage/15 border border-sage/30 flex items-center justify-center gap-3"><Check className="w-5 h-5 text-sage"/><span className="font-heading text-base font-semibold text-charcoal">Clocked in — {new Date(clockIn).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span></div>
                    }
                  </>
                )}

                {/* STEP 1: PRE-VISIT */}
                {step===1&&(
                  <>
                    <PhotoGrid photos={beforePhotos} onAdd={p=>setBeforePhotos(v=>[...v,p])} onRemove={id=>setBeforePhotos(v=>v.filter(p=>p.id!==id))} label="Before Photos — tap to snap (auto-timestamped)"/>
                    <div><label className="font-body text-xs text-charcoal/50 font-light block mb-2">Arrival / condition notes</label>
                    <textarea value={conditionNote} onChange={e=>setConditionNote(e.target.value)} placeholder="e.g. Client met me at door, dog in backyard..." rows={3} className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"/></div>
                  </>
                )}

                {/* STEP 2: SERVICE */}
                {step===2&&(
                  <>
                    <div className="flex items-center justify-between bg-butter/15 border border-butter/30 rounded-xl px-4 py-2.5">
                      <span className="font-body text-xs text-charcoal/50 font-light">Quote range</span>
                      <span className="font-heading text-sm font-semibold text-charcoal">${booking?.estimated_price_low}–${booking?.estimated_price_high}</span>
                    </div>
                    {tasks.length>0&&(
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-heading text-sm font-semibold text-charcoal">Tasks</p>
                          <span className="font-body text-xs text-charcoal/40 font-light">{tasks.filter(t=>t.done).length}/{tasks.length} done</span>
                        </div>
                        <div className="space-y-2">
                          {tasks.map(t=>(
                            <div key={t.id} className={`rounded-xl border p-3.5 transition-all ${t.done?'bg-sage/10 border-sage/25':t.skipped?'bg-taupe/5 border-taupe/15 opacity-60':'bg-warm-white border-taupe/15'}`}>
                              <div className="flex items-center gap-3">
                                <button onClick={()=>toggleTask(t.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${t.done?'bg-sage border-sage':'border-taupe/40'}`}>{t.done&&<Check className="w-3 h-3 text-white"/>}</button>
                                <span className={`font-body text-sm flex-1 font-light ${t.skipped?'line-through text-charcoal/30':'text-charcoal'}`}>{t.label}</span>
                                <button onClick={()=>skipTask(t.id)} className={`flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] ${t.skipped?'bg-charcoal/15 text-charcoal/50':'bg-taupe/10 text-charcoal/30 hover:bg-taupe/20'}`}><SkipForward className="w-3 h-3"/>Skip</button>
                              </div>
                              {t.skipped&&<input value={t.note} onChange={e=>taskNote(t.id,e.target.value)} placeholder="Reason (optional)" className="mt-2 ml-8 w-[calc(100%-2rem)] px-3 py-1.5 rounded-lg border border-taupe/20 bg-cream font-body text-xs text-charcoal placeholder-charcoal/20 focus:outline-none"/>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {addons.length>0&&(
                      <div>
                        <p className="font-heading text-sm font-semibold text-charcoal mb-3">Booked Add-Ons</p>
                        <div className="space-y-2">
                          {addons.map(a=>(
                            <div key={a.id} className={`rounded-xl border p-3.5 transition-all ${a.done?'bg-sage/10 border-sage/25':'bg-taupe/5 border-taupe/15'}`}>
                              <div className="flex items-center gap-3">
                                <button onClick={()=>toggleAddon(a.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${a.done?'bg-sage border-sage':'border-taupe/40'}`}>{a.done&&<Check className="w-3 h-3 text-white"/>}</button>
                                <span className="font-body text-sm text-charcoal font-light flex-1">{a.label}</span>
                                <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${a.done?'bg-sage/30 text-charcoal/60':'bg-red-50 text-red-400'}`}>{a.done?'Done ✓':'Skipped'}</span>
                              </div>
                              {a.skipped&&<input value={a.skipReason} onChange={e=>addonNote(a.id,e.target.value)} placeholder="Reason (optional)" className="mt-2 ml-8 w-[calc(100%-2rem)] px-3 py-1.5 rounded-lg border border-taupe/20 bg-cream font-body text-xs focus:outline-none"/>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-heading text-sm font-semibold text-charcoal">Extras Done</p>
                        <button onClick={addExtra} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-coral/30 text-coral font-body text-xs hover:bg-coral/5"><Plus className="w-3 h-3"/>Add Extra</button>
                      </div>
                      {extraTasks.length===0&&<p className="font-body text-xs text-charcoal/25 font-light">Tap “Add Extra” if you did something not on the list.</p>}
                      <div className="space-y-2">{extraTasks.map(t=>(
                        <div key={t.id} className="flex items-center gap-2">
                          <input value={t.label} onChange={e=>upExtra(t.id,'label',e.target.value)} placeholder="What did you do?" className="flex-1 px-3 py-2.5 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"/>
                          <button onClick={()=>rmExtra(t.id)} className="w-8 h-8 flex items-center justify-center text-red-400"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-heading text-sm font-semibold text-charcoal">Supply / Product Charges</p>
                        <button onClick={addSup} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-taupe/20 text-charcoal/50 font-body text-xs hover:border-coral/30 hover:text-coral"><Package className="w-3 h-3"/>Add</button>
                      </div>
                      {supplies.length===0&&<p className="font-body text-xs text-charcoal/25 font-light">Specialty supplies purchased or used that aren’t included.</p>}
                      <div className="space-y-2">{supplies.map(s=>(
                        <div key={s.id} className="flex items-center gap-2">
                          <input value={s.label} onChange={e=>upSup(s.id,'label',e.target.value)} placeholder="Item name" className="flex-1 px-3 py-2.5 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"/>
                          <div className="relative w-24"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-charcoal/40">$</span><input type="number" value={s.price} onChange={e=>upSup(s.id,'price',e.target.value)} placeholder="0" className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"/></div>
                          <button onClick={()=>rmSup(s.id)} className="w-8 h-8 flex items-center justify-center text-red-400"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}</div>
                    </div>
                  </>
                )}

                {/* STEP 3: WRAP-UP */}
                {step===3&&(
                  <>
                    {!clockOut
                      ?<button onClick={doClockOut} className="w-full py-3.5 rounded-2xl bg-charcoal text-white font-heading text-sm font-semibold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2"><Clock className="w-4 h-4"/>Clock Out Now</button>
                      :<div className="bg-sage/10 border border-sage/30 rounded-2xl p-4 text-center">
                          <p className="font-body text-xs text-charcoal/40 font-light mb-1">Active time on-site</p>
                          <p className="font-heading text-3xl font-semibold text-charcoal">{fmtT(elapsed)}</p>
                          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{new Date(clockIn).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} → {new Date(clockOut).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}{pausedMs>60000?` · ${fmtT(pausedMs)} paused`:''}</p>
                        </div>
                    }
                    <PhotoGrid photos={afterPhotos} onAdd={p=>setAfterPhotos(v=>[...v,p])} onRemove={id=>setAfterPhotos(v=>v.filter(p=>p.id!==id))} label="After Photos"/>
                    <div><label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">💬 Note for Client <span className="text-coral">(visible in dashboard + receipt)</span></label>
                    <textarea value={clientNote} onChange={e=>setClientNote(e.target.value)} placeholder="e.g. Everything looks amazing! I reorganized the pantry..." rows={3} className="w-full px-4 py-3 rounded-xl border border-coral/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"/></div>
                    <div><label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">🔒 Admin Note <span className="text-charcoal/30">(internal only)</span></label>
                    <textarea value={adminNote} onChange={e=>setAdminNote(e.target.value)} placeholder="e.g. Fridge needs attention, client wants recurring support..." rows={3} className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-taupe/40 resize-none"/></div>
                  </>
                )}

                {/* STEP 4: CHECKOUT */}
                {step===4&&(
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-butter/20 border border-butter/30 rounded-2xl p-4"><p className="font-body text-[10px] text-charcoal/40 uppercase tracking-widest font-light mb-1">Quote Range</p><p className="font-heading text-xl font-semibold text-charcoal">${booking?.estimated_price_low}–${booking?.estimated_price_high}</p></div>
                      {elapsed>0&&<div className="bg-sage/10 border border-sage/20 rounded-2xl p-4"><p className="font-body text-[10px] text-charcoal/40 uppercase tracking-widest font-light mb-1">Time On-Site</p><p className="font-heading text-xl font-semibold text-charcoal">{fmtT(elapsed)}</p></div>}
                    </div>
                    <div><label className="font-body text-xs text-charcoal/50 font-light block mb-2">Set Final Service Price</label>
                      <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading text-xl font-semibold text-charcoal/30">$</span>
                      <input type="number" min="0" step="5" value={finalPrice} onChange={e=>{setFinalPrice(e.target.value);setOkayed(false);}} placeholder="0" className="w-full pl-9 pr-4 py-4 rounded-xl border-2 border-coral/30 bg-warm-white font-heading text-3xl font-semibold text-charcoal placeholder-charcoal/15 focus:outline-none focus:border-coral/60"/></div>
                      {finalPrice&&parseFloat(finalPrice)<(booking?.estimated_price_low||0)&&<p className="font-body text-xs text-amber-500 font-light mt-1">⚠️ Below quote — admin will be notified</p>}
                      {finalPrice&&parseFloat(finalPrice)>(booking?.estimated_price_high||0)&&<p className="font-body text-xs text-amber-500 font-light mt-1">⚠️ Above quote — confirm client agreed</p>}
                    </div>
                    {credits>0&&(
                      <div className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${useCredit?'border-sage/40 bg-sage/10':'border-taupe/20 bg-warm-white'}`}>
                        <div className="flex items-center gap-3"><Gift className={`w-5 h-5 ${useCredit?'text-sage':'text-charcoal/30'}`}/>
                          <div><p className="font-body text-sm text-charcoal font-light">Referral credit</p><p className="font-body text-xs text-charcoal/40 font-light">{fmt(credits)} available</p></div>
                        </div><Toggle on={useCredit} onToggle={()=>setUseCredit(p=>!p)}/>
                      </div>
                    )}
                    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4">
                      <p className="font-body text-xs text-charcoal/50 font-light mb-3">Tip</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['none','15','20','25','custom'].map(o=>(
                          <button key={o} onClick={()=>setTipType(o)} className={`py-2 rounded-xl font-body text-xs font-light transition-all ${tipType===o?'bg-coral text-white':'bg-cream border border-taupe/20 text-charcoal/60 hover:border-coral/30'}`}>{o==='none'?'None':o==='custom'?'Other':`${o}%`}</button>
                        ))}
                      </div>
                      {tipType==='custom'&&<div className="mt-2 relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-charcoal/40">$</span><input type="number" value={customTip} onChange={e=>setCustomTip(e.target.value)} placeholder="0.00" className="w-full pl-6 pr-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm focus:outline-none focus:border-coral/40"/></div>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div><p className="font-body text-sm text-charcoal font-light">$50 deposit collected at booking</p><p className="font-body text-[10px] text-charcoal/30">Toggle off if deposit was not paid</p></div>
                      <Toggle on={depositPaid} onToggle={()=>setDepositPaid(p=>!p)}/>
                    </div>
                    {base>0&&(
                      <div className="bg-coral/5 border border-coral/20 rounded-2xl p-5">
                        <p className="font-body text-[10px] text-charcoal/40 uppercase tracking-widest font-light mb-3">Summary</p>
                        <div className="space-y-2">
                          {[{l:'Service',v:fmt(base)},{...(supTotal>0&&{l:'Supplies',v:`+${fmt(supTotal)}`})},{...(creditOff>0&&{l:'Referral credit',v:`-${fmt(creditOff)}`})},{...(tip>0&&{l:'Tip ✨',v:`+${fmt(tip)}`})},{...(dep>0&&{l:'Deposit paid',v:`-${fmt(dep)}`})},]
                            .filter(r=>r.l).map((r,i)=>(
                              <div key={i} className="flex justify-between"><span className="font-body text-sm text-charcoal/60 font-light">{r.l}</span><span className={`font-body text-sm ${r.v?.startsWith('-')?'text-sage':'text-charcoal'}`}>{r.v}</span></div>
                            ))}
                          <div className="h-px bg-coral/20 my-2"/>
                          <div className="flex justify-between items-center">
                            <span className="font-heading text-base font-semibold text-charcoal">Balance due today</span>
                            <span className="font-heading text-2xl font-semibold text-coral">{fmt(balance)}</span>
                          </div>
                        </div>
                        <button onClick={()=>setOkayed(p=>!p)} className={`w-full mt-4 flex items-center gap-3 p-3 rounded-xl border transition-all ${okayed?'bg-sage/15 border-sage/30':'bg-white/60 border-taupe/20 hover:border-sage/30'}`}>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${okayed?'bg-sage border-sage':'border-taupe/40'}`}>{okayed&&<Check className="w-3 h-3 text-white"/>}</div>
                          <span className="font-body text-sm font-light text-charcoal text-left">I confirm this total is correct</span>
                        </button>
                      </div>
                    )}
                    {okayed&&(
                      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-2">
                        <p className="font-heading text-sm font-semibold text-charcoal">{balance>0?`Collect ${fmt(balance)} via:`:'Confirm payment'}</p>
                        {balance>0&&(
                          <>
                            <button onClick={doNFCPay} disabled={nfcBusy||payStatus==='success'} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${payMethod==='nfc'&&payStatus==='success'?'border-sage bg-sage/10':'border-coral/25 bg-warm-white hover:border-coral/50'}`}>
                              <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">{nfcBusy?<RefreshCw className="w-5 h-5 text-coral animate-spin"/>:<Wifi className="w-5 h-5 text-coral"/>}</div>
                              <div className="text-left flex-1"><p className="font-heading text-sm font-semibold text-charcoal">NFC / Tap to Pay</p><p className="font-body text-xs text-charcoal/40 font-light">Apple Pay · Google Pay · Contactless</p></div>
                              {payMethod==='nfc'&&payStatus==='success'&&<Check className="w-5 h-5 text-sage"/>}
                              {!payMethod&&canNFC&&<span className="font-body text-[10px] text-sage bg-sage/15 px-2 py-0.5 rounded-full">Available</span>}
                            </button>
                            <button onClick={doSendLink} disabled={payStatus==='link_sent'||payStatus==='success'} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${payStatus==='link_sent'?'border-sage bg-sage/10':'border-taupe/20 bg-warm-white hover:border-coral/30'}`}>
                              <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0"><Send className="w-5 h-5 text-charcoal/50"/></div>
                              <div className="text-left flex-1"><p className="font-heading text-sm font-semibold text-charcoal">Send Payment Link</p><p className="font-body text-xs text-charcoal/40 font-light">Text a link to {booking?.client_phone}</p></div>
                              {payStatus==='link_sent'&&<Check className="w-5 h-5 text-sage"/>}
                            </button>
                            <button onClick={()=>{setPayMethod('cash');setPayStatus('success');}} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${payMethod==='cash'?'border-sage bg-sage/10':'border-taupe/20 bg-warm-white hover:border-sage/30'}`}>
                              <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center shrink-0"><DollarSign className="w-5 h-5 text-charcoal/50"/></div>
                              <div className="text-left flex-1"><p className="font-heading text-sm font-semibold text-charcoal">Cash</p><p className="font-body text-xs text-charcoal/40 font-light">Collected in person</p></div>
                              {payMethod==='cash'&&<Check className="w-5 h-5 text-sage"/>}
                            </button>
                          </>
                        )}
                        {balance<=0&&<button onClick={()=>{setPayMethod('deposit_covered');setPayStatus('success');}} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${payMethod==='deposit_covered'?'border-sage bg-sage/10':'border-taupe/20 bg-warm-white hover:border-sage/30'}`}><div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center shrink-0"><Check className="w-5 h-5 text-sage"/></div><div className="text-left"><p className="font-heading text-sm font-semibold text-charcoal">Deposit Covers It</p><p className="font-body text-xs text-charcoal/40 font-light">No balance due today</p></div></button>}
                        {payErr&&<div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"><AlertCircle className="w-4 h-4 text-red-400 shrink-0"/><p className="font-body text-sm text-red-500 font-light">{payErr}</p></div>}
                      </motion.div>
                    )}
                  </>
                )}

                {/* STEP 5: SIGNATURE */}
                {step===5&&(
                  <>
                    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5 text-center">
                      <p className="font-heading text-2xl font-semibold text-coral mb-0.5">{fmt(balance+dep)}</p>
                      <p className="font-body text-xs text-charcoal/40 font-light">Total · {fmt(balance)} collected today via {payMethod}</p>
                    </div>
                    {clientPresent
                      ?<div>
                          <p className="font-heading text-sm font-semibold text-charcoal mb-1">Client Signature</p>
                          <p className="font-body text-xs text-charcoal/40 font-light mb-3">Hand your phone to {booking?.client_name} to sign and confirm the work and total.</p>
                          <SignatureCanvas onSign={d=>{setSigned(true);setSigData(d);}} onClear={()=>{setSigned(false);setSigData(null);}} hasSigned={signed}/>
                          <p className="font-body text-[10px] text-charcoal/25 font-light mt-2">By signing, client confirms work was completed and total is approved.</p>
                        </div>
                      :<div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
                          <div><p className="font-heading text-sm font-semibold text-charcoal">Client Not Present</p><p className="font-body text-xs text-charcoal/50 font-light mt-1">No signature required. Receipt will be emailed to {booking?.client_email}.</p></div>
                        </div>
                    }
                    <div className="bg-sage/10 border border-sage/20 rounded-xl px-4 py-3"><p className="font-body text-xs text-charcoal/60 font-light text-center">📧 Itemized receipt auto-sends to {booking?.client_email} after submission.</p></div>
                  </>
                )}

                {/* STEP 6: DONE */}
                {step===6&&(
                  saved
                  ?<div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-sage"/></div>
                      <h3 className="font-heading text-2xl font-semibold text-charcoal mb-1">Visit Complete! ✨</h3>
                      <p className="font-logo text-lg text-coral">Another clean slate.</p>
                    </div>
                  :<div className="space-y-4">
                      <p className="font-heading text-sm font-semibold text-charcoal">Review & Submit</p>
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 divide-y divide-taupe/10">
                        {[['Client',booking?.client_name],['Service',booking?.service_category?.replace(/_/g,' ')],['Time on-site',fmtT(elapsed)],['Charged',fmt(base+supTotal)],['Balance',`${fmt(balance)} via ${payMethod||'—'}`],['Tip',tip>0?fmt(tip):'None'],['Before photos',`${beforePhotos.length}`],['After photos',`${afterPhotos.length}`],['Signed',signed?'Yes ✓':'No (client not present)'],].map(([l,v])=>(
                          <div key={l} className="flex justify-between items-center px-4 py-3">
                            <span className="font-body text-xs text-charcoal/40 font-light">{l}</span>
                            <span className="font-body text-sm text-charcoal font-light">{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Review request */}
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4">
                        <p className="font-heading text-sm font-semibold text-charcoal mb-1">Send a review request?</p>
                        <p className="font-body text-xs text-charcoal/40 font-light mb-3">SMS {booking?.client_name} a Google review link.</p>
                        {reviewSent
                          ?<p className="font-body text-xs text-sage font-light">✓ Review request sent!</p>
                          :<div className="flex gap-2">
                              <button onClick={()=>{setReviewChoice(true);doReview();}} className={`flex-1 py-2.5 rounded-xl font-body text-sm font-light transition-all ${reviewChoice===true?'bg-coral text-white':'bg-cream border border-taupe/20 text-charcoal/60 hover:border-coral/30'}`}>Yes, send it</button>
                              <button onClick={()=>setReviewChoice(false)} className={`flex-1 py-2.5 rounded-xl font-body text-sm font-light transition-all ${reviewChoice===false?'bg-charcoal/10 text-charcoal':'bg-cream border border-taupe/20 text-charcoal/60 hover:border-taupe/30'}`}>Not now</button>
                            </div>
                        }
                      </div>

                      {/* Mileage log */}
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4">
                        <p className="font-heading text-sm font-semibold text-charcoal mb-1">Log mileage for this job?</p>
                        <p className="font-body text-xs text-charcoal/40 font-light mb-3">One-way miles (system doubles for round trip). IRS rate: ${IRS_RATE}/mi</p>
                        {mileLogged
                          ?<p className="font-body text-xs text-sage font-light">✓ Mileage logged! Est. deduction: ${(parseFloat(mileInput||0)*2*IRS_RATE).toFixed(2)}</p>
                          :<div className="flex gap-2">
                              <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-charcoal/40">mi</span><input type="number" value={mileInput} onChange={e=>setMileInput(e.target.value)} placeholder="e.g. 8.5" className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"/></div>
                              <button onClick={doMileage} disabled={!mileInput||parseFloat(mileInput)<=0} className="px-4 py-2.5 rounded-xl bg-coral text-white font-body text-sm font-light hover:bg-coral/90 disabled:opacity-40 transition-all">Log</button>
                              <button onClick={()=>setMileLogged(true)} className="px-3 py-2.5 rounded-xl border border-taupe/20 text-charcoal/40 font-body text-sm font-light hover:border-taupe/40">Skip</button>
                            </div>
                        }
                      </div>

                      {/* Schedule next */}
                      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-4">
                        <p className="font-heading text-sm font-semibold text-charcoal mb-1">Schedule their next visit?</p>
                        <p className="font-body text-xs text-charcoal/40 font-light mb-3">Pre-fills the same service and client info.</p>
                        <div className="flex gap-2">
                          <a href={`/book?service=${booking?.service_category}&client_name=${encodeURIComponent(booking?.client_name||'')}&client_email=${encodeURIComponent(booking?.client_email||'')}&client_phone=${encodeURIComponent(booking?.client_phone||'')}&client_address=${encodeURIComponent(booking?.client_address||'')}`} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-coral text-white font-body text-sm font-light text-center hover:bg-coral/90 transition-all">Book Next Visit →</a>
                          <button onClick={()=>setScheduleNext(false)} className="px-4 py-2.5 rounded-xl border border-taupe/20 text-charcoal/40 font-body text-sm font-light hover:border-taupe/40">Skip</button>
                        </div>
                      </div>

                      {submitErr&&<div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"><AlertCircle className="w-4 h-4 text-red-400 shrink-0"/><p className="font-body text-sm text-red-500 font-light">{submitErr}</p></div>}

                      <button onClick={handleSubmit} disabled={saving}
                        className="w-full py-4 rounded-2xl bg-coral text-white font-heading text-base font-semibold hover:bg-coral/90 disabled:opacity-60 transition-all flex items-center justify-center gap-3">
                        {saving?<><RefreshCw className="w-5 h-5 animate-spin"/>Submitting...</>:<><Check className="w-5 h-5"/>Confirm &amp; Submit Visit</>}
                      </button>
                    </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          {!saved&&(
            <div className="flex items-center gap-3 px-6 py-4 border-t border-taupe/15 shrink-0">
              {step>0&&<button onClick={prev} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-taupe/20 font-body text-sm text-charcoal/50 font-light hover:border-coral/30"><ChevronLeft className="w-4 h-4"/>Back</button>}
              {step<STEPS.length-1&&(
                <button onClick={next} disabled={!canNext()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-40 transition-all">
                  {step===0&&!clockIn?'Clock in first':'Continue'}<ChevronRight className="w-4 h-4"/>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {showIncident&&(
        <IncidentModal booking={booking} providerData={providerData} onClose={()=>setShowIncident(false)} onSubmitted={()=>setIncidentCount(c=>c+1)}/>
      )}
    </>
  );
}
