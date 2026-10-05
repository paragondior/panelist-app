import { useMemo, useState } from 'react'
import { uploadPanelistImage } from '../../services/uploads.api'

function PanelistForm({ panelist, sessionId, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({ fullName: '', profileImage: '', role: '', company: '', location: '', email: '', topic: '', bio: '', linkedIn: '', speakingOrder: 1, status: 'upcoming', ...panelist })
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile)
    }

    return form.profileImage || ''
  }, [form.profileImage, selectedFile])

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()

    if (!form.fullName.trim() || Number(form.speakingOrder) < 1) {
      setError('Full name and a speaking order of at least 1 are required.')
      return
    }

    setError('')
    setUploading(true)

    try {
      let profileImage = form.profileImage?.trim() || ''

      if (selectedFile) {
        profileImage = await uploadPanelistImage(selectedFile)
      }

      await onSubmit({
        session: sessionId,
        fullName: form.fullName,
        profileImage,
        role: form.role,
        company: form.company,
        location: form.location,
        email: form.email,
        topic: form.topic,
        bio: form.bio,
        linkedIn: form.linkedIn,
        speakingOrder: Number(form.speakingOrder),
        status: form.status,
      })
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return <form className="space-y-4" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Full name<input className="admin-input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></label><label className="text-sm font-semibold">Profile image<input className="admin-input" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; setSelectedFile(file || null); if (!file) { update('profileImage', ''); } }} /></label>{previewUrl && <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><img className="h-16 w-16 rounded-lg object-cover" src={previewUrl} alt="Profile preview" /><span className="text-sm text-slate-600">{selectedFile ? selectedFile.name : 'Current image'}</span></div>}<label className="text-sm font-semibold">Or paste image URL<input className="admin-input" placeholder="https://..." value={form.profileImage || ''} onChange={(e) => { update('profileImage', e.target.value); if (e.target.value) setSelectedFile(null) }} /></label><label className="text-sm font-semibold">Speaking order<input className="admin-input" min="1" type="number" value={form.speakingOrder} onChange={(e) => update('speakingOrder', e.target.value)} /></label><label className="text-sm font-semibold">Role<input className="admin-input" value={form.role} onChange={(e) => update('role', e.target.value)} /></label><label className="text-sm font-semibold">Company<input className="admin-input" value={form.company} onChange={(e) => update('company', e.target.value)} /></label><label className="text-sm font-semibold">Location<input className="admin-input" value={form.location} onChange={(e) => update('location', e.target.value)} /></label><label className="text-sm font-semibold">Email<input className="admin-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label><label className="text-sm font-semibold">Topic<input className="admin-input" value={form.topic} onChange={(e) => update('topic', e.target.value)} /></label><label className="text-sm font-semibold">Status<select className="admin-input" value={form.status} onChange={(e) => update('status', e.target.value)}><option value="upcoming">Upcoming</option><option value="next">Next</option><option value="speaking">Speaking</option><option value="completed">Completed</option></select></label></div><label className="block text-sm font-semibold">Biography<textarea className="admin-input" rows="3" value={form.bio} onChange={(e) => update('bio', e.target.value)} /></label>{error && <p className="text-sm text-rose-600">{error}</p>}<div className="flex justify-end gap-3"><button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold" onClick={onCancel} type="button">Cancel</button><button className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={isLoading || uploading} type="submit">{uploading ? 'Uploading image...' : isLoading ? 'Saving...' : 'Save panelist'}</button></div></form>
}

export default PanelistForm