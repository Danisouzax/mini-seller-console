import React, { useEffect, useState } from 'react'
import { isValidEmail } from '../utils/validators'

const statuses = ['New','Contacted','Qualified','Unqualified']

export default function LeadDetailPanel({ lead, open, onClose, onSave, onConvert }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('New')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [stage, setStage] = useState('Prospecting')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (lead) {
      setEmail(lead.email || ''); setStatus(lead.status || 'New')
      setStage('Prospecting'); setAmount(''); setError('')
      setSaving(false)
    }
  }, [lead])

  if (!open || !lead) return null

  async function handleSave() {
    setError('')
    if (!isValidEmail(email)) {
      setError('Email inválido.')
      return
    }
    setSaving(true)
    try {
      await onSave(lead.id, { email: email.trim(), status })
      onClose()
    } catch (e) {
      setError(e.message || 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  async function handleConvert() {
    setError('')
    setSaving(true)
    try {
      await onConvert(lead, { stage, amount: amount ? Number(amount) : undefined })
      onClose()
    } catch (e) {
      setError(e.message || 'Erro ao converter.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* panel */}
      <div className="relative ml-auto h-full w-full sm:max-w-md bg-white shadow-xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Lead Detail</h3>
          <button className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-50" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-sm text-slate-500">Name</div>
            <div className="font-semibold">{lead.name}</div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="pt-2">
            <div className="text-sm font-semibold mb-2">Convert to Opportunity</div>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-medium">Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Prospecting</option>
                <option>Qualification</option>
                <option>Proposal</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
              <label className="text-sm font-medium">Amount (optional)</label>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
                min="0"
                className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 2500"
              />
            </div>
          </div>

          {error && <div className="text-sm text-rose-600">{error}</div>}
        </div>
        <div className="p-4 border-t border-slate-200 flex gap-3 justify-end">
          <button
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            onClick={onClose}
            disabled={saving}
          >Cancel</button>
          <button
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >Save</button>
          <button
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            onClick={handleConvert}
            disabled={saving}
          >Convert Lead</button>
        </div>
      </div>
    </div>
  )
}
