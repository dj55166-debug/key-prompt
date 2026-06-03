import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { CATEGORY_IDS, TOOL_IDS } from '../lib/constants'

const STEPS = ['Type', 'Details', 'Content', 'Pricing']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? 'bg-violet-600 text-white' : i === current ? 'bg-violet-600 text-white ring-4 ring-violet-900/50' : 'bg-gray-800 text-gray-600'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${i === current ? 'text-violet-400' : 'text-gray-600'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-10 h-0.5 mx-1 mb-4 ${i < current ? 'bg-violet-600' : 'bg-gray-800'}`} />}
        </div>
      ))}
    </div>
  )
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')
  const addTag = () => {
    const t = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t) && tags.length < 6) { onChange([...tags, t]); setInput('') }
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-8">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-violet-900/40 text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full border border-violet-700/50">
            #{tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-white ms-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Type a tag and press Enter (max 6)"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
        />
        <button onClick={addTag} className="px-3 py-2.5 bg-violet-900/50 text-violet-300 rounded-xl text-xs font-semibold hover:bg-violet-800/50 border border-violet-700/50">
          Add
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1">{tags.length}/6 tags</p>
    </div>
  )
}

const VIDEO_TYPES = [
  { id: 'AI Video', label: 'AI Video Prompt', icon: '🎬', desc: 'A cinematic or creative video prompt for Veo 3, Kling, Runway, etc.' },
  { id: 'Prompt', label: 'Text Prompt', icon: '💬', desc: 'A text prompt for writing scripts, descriptions, concepts.' },
]

export default function SubmitPromptForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    type: 'AI Video',
    title: '',
    description: '',
    category: '',
    models: [],
    content: '',
    tags: [],
    isFree: true,
    price: '',
    mediaFile: null,
    mediaPreview: null,
  })

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const toggleModel = (m) => update('models', form.models.includes(m) ? form.models.filter(x => x !== m) : [...form.models, m])

  const validateStep = () => {
    if (step === 0 && !form.type) return false
    if (step === 1 && (!form.title.trim() || !form.description.trim() || !form.category)) return false
    if (step === 2 && (!form.content.trim() || form.content.length < 20)) return false
    if (step === 3 && !form.isFree && (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0)) return false
    return true
  }

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)) }
  const back = () => setStep(s => Math.max(s - 1, 0))

  const submit = async () => {
    if (!validateStep()) return
    setSubmitting(true)
    setError(null)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }

    let preview_url = null
    if (form.mediaFile) {
      setUploading(true)
      const ext = form.mediaFile.name.split('.').pop()
      const filePath = `${session.user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('prompt-media')
        .upload(filePath, form.mediaFile, { upsert: true })
      if (uploadErr) { setError(uploadErr.message); setSubmitting(false); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('prompt-media').getPublicUrl(filePath)
      preview_url = publicUrl
      setUploading(false)
    }

    const { error: err } = await supabase.from('prompts').insert({
      title: form.title,
      description: form.description,
      content: form.content,
      type: form.type,
      category: form.category,
      tags: form.tags,
      ai_models: form.models,
      price: form.isFree ? 0 : parseFloat(form.price),
      is_free: form.isFree,
      is_published: true,
      author_id: session.user.id,
      preview_url,
      thumbnail_url: preview_url,
    })
    setSubmitting(false)
    if (err) { setError(err.message); return }
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white mb-2">{t('submit.published')}</h2>
        <p className="text-sm text-gray-400 mb-5">"{form.title}" {t('submit.publishedDesc')}</p>
        <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90">
          {t('submit.viewMarketplace')}
        </button>
        <button
          onClick={() => { setSubmitted(false); setStep(0); setForm({ type: 'AI Video', title: '', description: '', category: '', models: [], content: '', tags: [], isFree: true, price: '', mediaFile: null, mediaPreview: null }) }}
          className="w-full mt-2 text-sm text-violet-400 font-medium hover:underline"
        >
          {t('submit.submitAnother')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {step > 0 && (
            <button onClick={back} className="text-gray-500 hover:text-gray-300 p-1 -ms-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <div onClick={() => navigate('/')} className="flex items-center gap-2 flex-1 cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-white">{t('submit.title')}</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">{step + 1} / 4</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        <StepIndicator current={step} />

        {/* Step 0: Type */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-black text-white mb-1">{t('submit.step0.title')}</h2>
            <p className="text-sm text-gray-500 mb-5">{t('submit.step0.sub')}</p>
            <div className="space-y-3">
              {VIDEO_TYPES.map(vt => (
                <button
                  key={vt.id}
                  onClick={() => update('type', vt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    form.type === vt.id ? 'border-violet-500 bg-violet-900/20' : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                  }`}
                >
                  <span className="text-3xl">{vt.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{vt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{vt.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.type === vt.id ? 'border-violet-500 bg-violet-500' : 'border-gray-600'}`}>
                    {form.type === vt.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white mb-1">{t('submit.step1.title')}</h2>
              <p className="text-sm text-gray-500">{t('submit.step1.sub')}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step1.titleLabel')} <span className="text-rose-400">*</span></label>
              <input
                value={form.title}
                onChange={e => update('title', e.target.value)}
                placeholder="e.g. Cinematic Sunset Chase Scene — Veo 3"
                maxLength={80}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
              />
              <p className="text-xs text-gray-600 mt-1 text-end">{form.title.length}/80</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step1.descLabel')} <span className="text-rose-400">*</span></label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Describe what this prompt creates and what AI tool it works best with..."
                rows={3}
                maxLength={300}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none placeholder-gray-600"
              />
            </div>
            {/* Media Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Preview Video / Image <span className="text-gray-600 font-normal">(optional)</span></label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-violet-500 transition-colors bg-gray-900/50">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files[0]
                    if (!file) return
                    setForm(f => ({ ...f, mediaFile: file, mediaPreview: URL.createObjectURL(file) }))
                  }}
                />
                {form.mediaPreview ? (
                  form.mediaFile?.type?.startsWith('video') ? (
                    <video src={form.mediaPreview} className="w-full max-h-40 rounded-lg object-cover" muted />
                  ) : (
                    <img src={form.mediaPreview} className="w-full max-h-40 rounded-lg object-cover" alt="preview" />
                  )
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <span className="text-sm text-gray-500">Click to upload image or video</span>
                    <span className="text-xs text-gray-600">Max 50MB · image or video</span>
                  </>
                )}
              </label>
              {form.mediaPreview && (
                <button onClick={() => setForm(f => ({ ...f, mediaFile: null, mediaPreview: null }))} className="text-xs text-red-400 hover:text-red-300 self-start">
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step1.categoryLabel')} <span className="text-rose-400">*</span></label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_IDS.filter(c => c !== 'All').map(cat => (
                  <button
                    key={cat}
                    onClick={() => update('category', cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      form.category === cat
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step1.toolsLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {TOOL_IDS.map(m => (
                  <button
                    key={m}
                    onClick={() => toggleModel(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      form.models.includes(m)
                        ? 'bg-violet-900/60 text-violet-300 border-violet-600'
                        : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-violet-500/50 hover:text-gray-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step1.tagsLabel')}</label>
              <TagInput tags={form.tags} onChange={tags => update('tags', tags)} />
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white mb-1">{t('submit.step2.title')}</h2>
              <p className="text-sm text-gray-500">{t('submit.step2.sub')}</p>
            </div>
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-3 flex gap-2.5">
              <span className="text-amber-400 text-base flex-shrink-0 mt-0.5">💡</span>
              <p className="text-xs text-amber-300/80">
                {t('submit.step2.tip')} <span className="font-mono bg-amber-900/40 px-1 rounded">[SUBJECT]</span>, <span className="font-mono bg-amber-900/40 px-1 rounded">[STYLE]</span>, <span className="font-mono bg-amber-900/40 px-1 rounded">[MOOD]</span>
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400">{t('submit.step2.contentLabel')} <span className="text-rose-400">*</span></label>
                <span className="text-xs text-gray-600">{form.content.length} chars</span>
              </div>
              <textarea
                value={form.content}
                onChange={e => update('content', e.target.value)}
                placeholder="Write your video prompt here. Example: A [SUBJECT] moving through [ENVIRONMENT], shot in [STYLE], [MOOD] lighting, cinematic 4K, slow motion..."
                rows={12}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none font-mono leading-relaxed placeholder-gray-600"
              />
            </div>
          </div>
        )}

          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Preview Media URL <span className="text-gray-600">(mp4, webm, mov or image)</span></label>
            <input
              value={form.preview_url}
              onChange={e => update('preview_url', e.target.value)}
              placeholder="https://... paste a video or image URL for the card thumbnail"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
            />
          </div>
        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white mb-1">{t('submit.step3.title')}</h2>
              <p className="text-sm text-gray-500">{t('submit.step3.sub')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ free: true, icon: '🆓', label: t('submit.step3.free'), sub: t('submit.step3.freeSub') }, { free: false, icon: '💰', label: t('submit.step3.paid'), sub: t('submit.step3.paidSub') }].map(({ free, icon, label, sub }) => (
                <button
                  key={label}
                  onClick={() => update('isFree', free)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    form.isFree === free ? 'border-violet-500 bg-violet-900/20' : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="font-bold text-sm text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
            {!form.isFree && (
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1.5">{t('submit.step3.priceLabel')} <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    min="0.99"
                    max="99"
                    step="0.01"
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    placeholder="4.99"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl ps-8 pe-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{t('submit.step3.keepPercent')}</p>
                {form.price && !isNaN(form.price) && parseFloat(form.price) > 0 && (
                  <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3 mt-3 flex justify-between items-center">
                    <span className="text-xs text-emerald-400">{t('submit.step3.earnings')}</span>
                    <span className="text-sm font-black text-emerald-400">${(parseFloat(form.price) * 0.8).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('submit.step3.summary')}</p>
              {[
                [t('submit.step3.typeLabel'), form.type],
                [t('submit.step3.titleLabel'), form.title || '—'],
                [t('submit.step3.categoryLabel'), form.category || '—'],
                [t('submit.step3.priceLabel2'), form.isFree ? t('common.free') : form.price ? `$${form.price}` : '—'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-xs text-gray-600">{l}</span>
                  <span className="text-xs font-medium text-gray-300">{v}</span>
                </div>
              ))}
            </div>
            {error && (
              <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3">
                <p className="text-xs text-rose-400">{error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button onClick={back} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-all">
              {t('submit.back')}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={next}
              disabled={!validateStep()}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 disabled:opacity-40 transition-all"
            >
              {t('submit.continue')}
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || uploading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {(submitting || uploading) ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {uploading ? 'Uploading media…' : t('submit.publishing')}
                </>
              ) : t('submit.publish')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
