import { useState } from "react";

const CATEGORIES = [
  "Business", "Marketing", "Sales", "Development", "Design",
  "Writing", "Research", "Productivity", "Health", "Education",
  "Finance", "Legal", "HR", "Social Media", "SEO", "Fun"
];

const PROMPT_TYPES = [
  { id: "prompt", label: "Prompt", icon: "💬", desc: "A text prompt for ChatGPT, Claude, etc." },
  { id: "image", label: "AI Image", icon: "🎨", desc: "A prompt for Midjourney, DALL-E, etc." },
  { id: "automation", label: "Automation", icon: "⚡", desc: "A workflow or automation template" },
];

const AI_MODELS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL-E", "Stable Diffusion", "Llama", "Other"];

const STEPS = ["Type", "Details", "Content", "Pricing"];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? "bg-violet-600 text-white" :
              i === current ? "bg-violet-600 text-white ring-4 ring-violet-100" :
              "bg-gray-100 text-gray-400"
            }`}>
              {i < current ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${i === current ? "text-violet-600" : "text-gray-400"}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 h-0.5 mx-1 mb-4 transition-all ${i < current ? "bg-violet-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const t = input.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 6) {
      onChange([...tags, t]);
      setInput("");
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-8">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full">
            #{tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-violet-900 ml-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Type a tag and press Enter (max 6)"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400"
        />
        <button onClick={addTag} className="px-3 py-2.5 bg-violet-100 text-violet-700 rounded-xl text-xs font-semibold hover:bg-violet-200 transition-colors">
          Add
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">{tags.length}/6 tags</p>
    </div>
  );
}

export default function SubmitPromptForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    category: "",
    models: [],
    content: "",
    tags: [],
    isFree: true,
    price: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleModel = (m) => {
    update("models", form.models.includes(m) ? form.models.filter(x => x !== m) : [...form.models, m]);
  };

  const validateStep = () => {
    const e = {};
    if (step === 0 && !form.type) e.type = "Please select a type";
    if (step === 1) {
      if (!form.title.trim()) e.title = "Title is required";
      if (form.title.length > 80) e.title = "Max 80 characters";
      if (!form.description.trim()) e.description = "Description is required";
      if (!form.category) e.category = "Select a category";
    }
    if (step === 2) {
      if (!form.content.trim()) e.content = "Prompt content is required";
      if (form.content.length < 20) e.content = "At least 20 characters";
    }
    if (step === 3) {
      if (!form.isFree && (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0)) {
        e.price = "Enter a valid price";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const back = () => { setStep(s => Math.max(s - 1, 0)); setErrors({}); };
  const submit = () => { if (validateStep()) setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5 font-sans">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Prompt submitted!</h2>
          <p className="text-sm text-gray-500 mb-2">Your prompt <span className="font-semibold text-gray-700">"{form.title}"</span> is now live on Key Prompt.</p>
          <div className="bg-gray-50 rounded-xl p-3 mb-5 text-left space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-gray-400">Type</span><span className="font-medium text-gray-700 capitalize">{form.type}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-400">Category</span><span className="font-medium text-gray-700">{form.category}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-400">Price</span><span className="font-medium text-gray-700">{form.isFree ? "Free" : `$${form.price}`}</span></div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm({ type: "", title: "", description: "", category: "", models: [], content: "", tags: [], isFree: true, price: "" }); }}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-all"
          >
            Submit another prompt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {step > 0 && (
            <button onClick={back} className="text-gray-400 hover:text-gray-700 p-1 -ml-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Submit a Prompt</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">{step + 1} of 4</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        <StepIndicator current={step} />

        {/* STEP 0 — Type */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-1">What are you sharing?</h2>
            <p className="text-sm text-gray-500 mb-5">Choose the type of prompt you want to submit.</p>
            <div className="space-y-3">
              {PROMPT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => update("type", t.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    form.type === t.id
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 bg-white hover:border-violet-200"
                  }`}
                >
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{t.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    form.type === t.id ? "border-violet-500 bg-violet-500" : "border-gray-300"
                  }`}>
                    {form.type === t.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-rose-500 mt-2">{errors.type}</p>}
          </div>
        )}

        {/* STEP 1 — Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Prompt details</h2>
              <p className="text-sm text-gray-500">Give your prompt a clear title and description.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => update("title", e.target.value)}
                placeholder="e.g. Ultimate Cold Email Generator"
                maxLength={80}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400"
              />
              <div className="flex justify-between mt-1">
                {errors.title ? <p className="text-xs text-rose-500">{errors.title}</p> : <span />}
                <p className="text-xs text-gray-400">{form.title.length}/80</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => update("description", e.target.value)}
                placeholder="Describe what this prompt does and who it's for..."
                rows={3}
                maxLength={300}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400 resize-none"
              />
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-xs text-rose-500">{errors.description}</p> : <span />}
                <p className="text-xs text-gray-400">{form.description.length}/300</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => update("category", c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.category === c
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                    }`}
                  >{c}</button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-rose-500 mt-2">{errors.category}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Works with (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {AI_MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => toggleModel(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.models.includes(m)
                        ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                        : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200"
                    }`}
                  >{m}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Tags</label>
              <TagInput tags={form.tags} onChange={tags => update("tags", tags)} />
            </div>
          </div>
        )}

        {/* STEP 2 — Content */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Prompt content</h2>
              <p className="text-sm text-gray-500">Write the actual prompt. Use [BRACKETS] for variables users should replace.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
              <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">💡</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Use <span className="font-mono bg-amber-100 px-1 rounded">[BRACKETS]</span> for variables — e.g. <span className="font-mono bg-amber-100 px-1 rounded">[INDUSTRY]</span>, <span className="font-mono bg-amber-100 px-1 rounded">[COMPANY_NAME]</span>. This helps users customize the prompt.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Prompt text <span className="text-rose-400">*</span>
                </label>
                <span className="text-xs text-gray-400">{form.content.length} chars</span>
              </div>
              <textarea
                value={form.content}
                onChange={e => update("content", e.target.value)}
                placeholder={`Write your prompt here...\n\nExample:\nYou are an expert [ROLE]. Your task is to [TASK].\n\nContext:\n- [VARIABLE_1]\n- [VARIABLE_2]\n\nProvide a detailed response that includes...`}
                rows={12}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400 resize-none font-mono leading-relaxed"
              />
              {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
            </div>

            {/* Live preview */}
            {form.content.length > 10 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preview (first 150 chars shown to non-buyers)
                </p>
                <div className="bg-gray-900 rounded-xl p-4 relative overflow-hidden">
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    {form.content.slice(0, 150)}{form.content.length > 150 ? "..." : ""}
                  </p>
                  {form.content.length > 150 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-2">
                      <span className="text-xs text-gray-500">🔒 Rest locked until purchased</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Pricing */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Set your price</h2>
              <p className="text-sm text-gray-500">Free prompts get more exposure. Paid prompts earn you money.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => update("isFree", true)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  form.isFree ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:border-violet-200"
                }`}
              >
                <div className="text-2xl mb-2">🆓</div>
                <p className="font-bold text-sm text-gray-900">Free</p>
                <p className="text-xs text-gray-500 mt-0.5">More visibility, more uses</p>
              </button>
              <button
                onClick={() => update("isFree", false)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  !form.isFree ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:border-violet-200"
                }`}
              >
                <div className="text-2xl mb-2">💰</div>
                <p className="font-bold text-sm text-gray-900">Paid</p>
                <p className="text-xs text-gray-500 mt-0.5">Earn on every purchase</p>
              </button>
            </div>

            {!form.isFree && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Price (USD) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    min="0.99"
                    max="99"
                    step="0.01"
                    value={form.price}
                    onChange={e => update("price", e.target.value)}
                    placeholder="4.99"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
                <p className="text-xs text-gray-400 mt-1.5">Suggested: $1.99 – $9.99. You keep 80% of each sale.</p>
                {form.price && !isNaN(form.price) && parseFloat(form.price) > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-3 flex justify-between items-center">
                    <span className="text-xs text-emerald-700">Your earnings per sale</span>
                    <span className="text-sm font-black text-emerald-700">${(parseFloat(form.price) * 0.8).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submission summary</p>
              {[
                { label: "Type", value: PROMPT_TYPES.find(t => t.id === form.type)?.label || "—" },
                { label: "Title", value: form.title || "—" },
                { label: "Category", value: form.category || "—" },
                { label: "Models", value: form.models.length ? form.models.join(", ") : "Not specified" },
                { label: "Tags", value: form.tags.length ? form.tags.map(t => `#${t}`).join(" ") : "None" },
                { label: "Price", value: form.isFree ? "Free" : form.price ? `$${form.price}` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3">
                  <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
                  <span className="text-xs font-medium text-gray-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button onClick={back} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={next} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-violet-200">
              Continue →
            </button>
          ) : (
            <button onClick={submit} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Publish Prompt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}