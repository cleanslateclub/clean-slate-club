import React, { useState } from 'react';
import { X, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProviderDetailPanel({ provider, onClose, onUpdate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(provider);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const complianceScore = [
    provider.background_check_cleared,
    provider.drivers_license_on_file,
    provider.vehicle_insurance_on_file,
    provider.cpr_certification_on_file,
    provider.w9_on_file,
    provider.contractor_agreement_signed
  ].filter(Boolean).length;

  const isCompliant = complianceScore === 6;

  const handleSave = async () => {
    await onUpdate(provider.id, form);
    setEditMode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-warm-white rounded-3xl border border-taupe/15 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-coral/10 to-peach/10 border-b border-taupe/15 px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl shrink-0"
            style={{
              background:
                provider.role === 'owner'
                  ? '#EB9486'
                  : provider.role === 'assistant'
                    ? '#EFB988'
                    : '#CAE7B9'
            }}
          >
            {provider.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-charcoal">{provider.full_name}</h2>
            <p className="font-body text-xs text-charcoal/70 mt-0.5">
              {provider.role} • {provider.status}
            </p>
            {provider.territory && (
              <p className="font-body text-xs text-charcoal/70 mt-1">{provider.territory}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-taupe/10 rounded-lg transition-colors text-charcoal/50 hover:text-charcoal shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream rounded-xl p-3 text-center">
            <p className="font-heading text-lg font-semibold text-charcoal">
              {provider.jobs_completed || 0}
            </p>
            <p className="font-body text-xs text-charcoal font-light mt-1">Jobs</p>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center">
            <p className="font-heading text-lg font-semibold text-charcoal">
              {provider.rating_average?.toFixed(1) || '—'}
            </p>
            <p className="font-body text-xs text-charcoal font-light mt-1">Rating</p>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center">
            <p className="font-heading text-lg font-semibold text-charcoal">
              {provider.hours_available_per_week || 0}h
            </p>
            <p className="font-body text-xs text-charcoal font-light mt-1">Weekly Hrs</p>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="border-t border-taupe/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-sm font-semibold text-charcoal">Compliance Status</p>
            <div
              className={`px-3 py-1 rounded-full text-xs font-body font-light border ${
                isCompliant
                  ? 'bg-sage/10 border-sage/40 text-sage'
                  : 'bg-butter/10 border-butter/40 text-charcoal/60'
              }`}
            >
              {complianceScore}/6 Complete
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Background Check', value: provider.background_check_cleared, expiry: provider.background_check_expiry },
              { label: 'Driver\'s License', value: provider.drivers_license_on_file },
              { label: 'Vehicle Insurance', value: provider.vehicle_insurance_on_file },
              { label: 'CPR Certification', value: provider.cpr_certification_on_file, expiry: provider.cpr_expiry },
              { label: 'W9 Form', value: provider.w9_on_file },
              { label: 'Contractor Agreement', value: provider.contractor_agreement_signed, date: provider.contract_signed_date }
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg bg-cream/50 border border-taupe/10"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    item.value
                      ? 'bg-sage border-sage'
                      : 'border-taupe/30'
                  }`}
                >
                  {item.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-charcoal font-light font-medium">{item.label}</p>
                  {item.expiry && (
                     <p className="font-body text-xs text-charcoal/70 font-light">
                       Expires: {new Date(item.expiry).toLocaleDateString()}
                     </p>
                   )}
                   {item.date && (
                     <p className="font-body text-xs text-charcoal/70 font-light">
                       Signed: {new Date(item.date).toLocaleDateString()}
                     </p>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Credentials */}
        {!editMode && (
          <div className="border-t border-taupe/10 pt-4">
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Portal Access</p>
            <div className="space-y-2">
              {provider.login_username && (
                <div className="bg-cream rounded-lg p-3 border border-taupe/10">
                  <p className="font-body text-[10px] text-charcoal/50 font-light mb-1">Username</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono text-sm text-charcoal">{provider.login_username}</code>
                    <button
                      onClick={() => handleCopy(provider.login_username)}
                      className="p-1.5 hover:bg-taupe/10 rounded transition-colors text-charcoal/50"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-sage" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {provider.login_password && (
                <div className="bg-cream rounded-lg p-3 border border-taupe/10">
                  <p className="font-body text-[10px] text-charcoal/50 font-light mb-1">Password</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono text-sm text-charcoal">
                      {showPassword ? provider.login_password : '••••••••'}
                    </code>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 hover:bg-taupe/10 rounded transition-colors text-charcoal/50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar Settings */}
        {editMode && (
          <div className="border-t border-taupe/10 pt-4">
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Calendar Settings</p>
            <div className="space-y-3">
              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Weekly Hours Available</label>
                <input
                  type="number"
                  value={form.hours_available_per_week || 0}
                  onChange={(e) => setForm({ ...form, hours_available_per_week: Number(e.target.value) })}
                  placeholder="20"
                  className="w-full px-3 py-2 rounded-lg border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal font-light block mb-2">Calendar Color</label>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Coral', hex: '#EB9486' },
                    { name: 'Peach', hex: '#EFB988' },
                    { name: 'Sage', hex: '#CAE7B9' },
                    { name: 'Olive', hex: '#DFE3A2' },
                    { name: 'Mauve', hex: '#B58A90' },
                    { name: 'Slate', hex: '#7E7F9A' }
                  ].map(color => (
                    <button
                      key={color.hex}
                      onClick={() => setForm({ ...form, calendar_color: color.hex })}
                      title={color.name}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        form.calendar_color === color.hex ? 'border-charcoal' : 'border-taupe/20'
                      }`}
                      style={{ background: color.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hours & Automation */}
        <div className="border-t border-taupe/10 pt-4">
          <p className="font-heading text-sm font-semibold text-charcoal mb-3">Availability & Automation</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.auto_assign_enabled || false}
                onChange={(e) => setForm({ ...form, auto_assign_enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-charcoal font-light">Auto-assign matching bookings</p>
                <p className="font-body text-xs text-charcoal/70 font-light">When hours available</p>
              </div>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.calendar_sync_enabled !== false}
                onChange={(e) => setForm({ ...form, calendar_sync_enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-charcoal font-light">Sync to provider calendar</p>
                <p className="font-body text-xs text-charcoal/70 font-light">Auto-update bookings</p>
              </div>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sms_notifications_enabled !== false}
                onChange={(e) => setForm({ ...form, sms_notifications_enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-charcoal font-light">SMS notifications</p>
                <p className="font-body text-xs text-charcoal/70 font-light">New bookings & reminders</p>
              </div>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.email_notifications_enabled !== false}
                onChange={(e) => setForm({ ...form, email_notifications_enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-charcoal font-light">Email notifications</p>
                <p className="font-body text-xs text-charcoal/70 font-light">Booking confirmations</p>
              </div>
            </label>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-taupe/10 pt-4">
          <p className="font-heading text-sm font-semibold text-charcoal mb-3">Contact</p>
          <div className="space-y-2">
            <a
              href={`mailto:${provider.email}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cream hover:bg-cream border border-taupe/10 text-charcoal/60 font-body text-xs font-light transition-colors"
            >
              📧 {provider.email}
            </a>
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cream hover:bg-cream border border-taupe/10 text-charcoal/60 font-body text-xs font-light transition-colors"
              >
                📱 {provider.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-taupe/10 px-6 py-4 bg-cream/30 flex gap-2">
        {editMode ? (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 py-2 rounded-lg border border-taupe/20 text-charcoal/50 font-body text-xs font-light hover:border-coral/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-coral text-white font-body text-xs tracking-wide hover:bg-coral/90 transition-colors"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex-1 py-2 rounded-lg bg-coral text-white font-body text-xs tracking-wide hover:bg-coral/90 transition-colors"
          >
            Edit & Manage
          </button>
        )}
      </div>
    </motion.div>
  );
}