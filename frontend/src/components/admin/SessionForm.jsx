import { useState } from 'react'

const initial = { eventName: '', sessionName: '', description: '', scheduledAt: '', status: 'draft' }

function SessionForm({ session, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(session ? { ...initial, ...session, scheduledAt: session.scheduledAt?.slice(0, 16) || '' } : initial)
  const [error, setError] = useState('')

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()

    if (!form.eventName.trim() || !form.sessionName.trim() || !form.scheduledAt) {
      setError('Event name, session name, and schedule are required.')
      return
    }

    setError('')
    await onSubmit({
      eventName: form.eventName,
      sessionName: form.sessionName,
      description: form.description,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      status: form.status,
    })
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Event name
          <input className="admin-input" value={form.eventName} onChange={(e) => update('eventName', e.target.value)} />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Session name
          <input className="admin-input" value={form.sessionName} onChange={(e) => update('sessionName', e.target.value)} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Description
        <textarea className="admin-input" rows="3" value={form.description} onChange={(e) => update('description', e.target.value)} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Scheduled at
          <input className="admin-input" type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Status
          <select className="admin-input" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading} type="submit">
          {isLoading ? 'Saving...' : 'Save session'}
        </button>
      </div>
    </form>
  )
}

export default SessionForm