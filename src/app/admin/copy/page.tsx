'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Check, AlertCircle, Info, Copy, ClipboardCheck } from 'lucide-react'

const defaultCopy = {
  works_heading: 'WHAT WE DO',
  works_description: 'We support communities through direct aid, sponsor education programs, and lead campaigns—translating compassionate support into real-world, lasting change.',
  gallery_heading: 'HEAR OUR STORIES',
  gallery_description: 'Real faces from the front lines of change. These are the people shaping their communities—and the future.',
  contact_heading: 'GET IN TOUCH',
  contact_description: 'Have questions, want to partner, or support our operations? Connect with us or support our cause below.',
  button_1_text: 'SUPPORT US',
  button_2_text: 'SHARE YOUR STORY',
  upi_id: 'heromaurya1613-1@oksbi',
  payee_name: 'Mission Dilse',
  metric_1_val: '5,000+',
  metric_1_label: 'Meals Distributed',
  metric_1_desc: 'Healthy meals cooked & served',
  metric_2_val: '150+',
  metric_2_label: 'Kids Educated',
  metric_2_desc: 'Sponsorships & school kits',
  metric_3_val: '25+',
  metric_3_label: 'Active Projects',
  metric_3_desc: 'Local development initiatives',
  metric_4_val: '12A / 80G',
  metric_4_label: 'Certified NGO',
  metric_4_desc: 'Tax exemption tax deductible',
}

export default function AdminCopyEditor() {
  const [worksHeading, setWorksHeading] = useState(defaultCopy.works_heading)
  const [worksDesc, setWorksDesc] = useState(defaultCopy.works_description)
  const [galleryHeading, setGalleryHeading] = useState(defaultCopy.gallery_heading)
  const [galleryDesc, setGalleryDesc] = useState(defaultCopy.gallery_description)
  const [contactHeading, setContactHeading] = useState(defaultCopy.contact_heading)
  const [contactDesc, setContactDesc] = useState(defaultCopy.contact_description)
  const [btn1Text, setBtn1Text] = useState(defaultCopy.button_1_text)
  const [btn2Text, setBtn2Text] = useState(defaultCopy.button_2_text)
  const [upiId, setUpiId] = useState(defaultCopy.upi_id)
  const [payeeName, setPayeeName] = useState(defaultCopy.payee_name)
  
  // Metrics
  const [m1Val, setM1Val] = useState(defaultCopy.metric_1_val)
  const [m1Label, setM1Label] = useState(defaultCopy.metric_1_label)
  const [m1Desc, setM1Desc] = useState(defaultCopy.metric_1_desc)
  
  const [m2Val, setM2Val] = useState(defaultCopy.metric_2_val)
  const [m2Label, setM2Label] = useState(defaultCopy.metric_2_label)
  const [m2Desc, setM2Desc] = useState(defaultCopy.metric_2_desc)
  
  const [m3Val, setM3Val] = useState(defaultCopy.metric_3_val)
  const [m3Label, setM3Label] = useState(defaultCopy.metric_3_label)
  const [m3Desc, setM3Desc] = useState(defaultCopy.metric_3_desc)
  
  const [m4Val, setM4Val] = useState(defaultCopy.metric_4_val)
  const [m4Label, setM4Label] = useState(defaultCopy.metric_4_label)
  const [m4Desc, setM4Desc] = useState(defaultCopy.metric_4_desc)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  const supabase = createClient()

  const sqlMigration = `-- Copy & Paste this SQL in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS homepage_text (
  id integer PRIMARY KEY DEFAULT 1,
  works_heading text DEFAULT 'WHAT WE DO',
  works_description text DEFAULT 'We support communities through direct aid, sponsor education programs, and lead campaigns—translating compassionate support into real-world, lasting change.',
  gallery_heading text DEFAULT 'HEAR OUR STORIES',
  gallery_description text DEFAULT 'Real faces from the front lines of change. These are the people shaping their communities—and the future.',
  contact_heading text DEFAULT 'GET IN TOUCH',
  contact_description text DEFAULT 'Have questions, want to partner, or support our operations? Connect with us or support our cause below.',
  button_1_text text DEFAULT 'SUPPORT US',
  button_2_text text DEFAULT 'SHARE YOUR STORY',
  upi_id text DEFAULT 'heromaurya1613-1@oksbi',
  payee_name text DEFAULT 'Mission Dilse',
  metric_1_val text DEFAULT '5,000+',
  metric_1_label text DEFAULT 'Meals Distributed',
  metric_1_desc text DEFAULT 'Healthy meals cooked & served',
  metric_2_val text DEFAULT '150+',
  metric_2_label text DEFAULT 'Kids Educated',
  metric_2_desc text DEFAULT 'Sponsorships & school kits',
  metric_3_val text DEFAULT '25+',
  metric_3_label text DEFAULT 'Active Projects',
  metric_3_desc text DEFAULT 'Local development initiatives',
  metric_4_val text DEFAULT '12A / 80G',
  metric_4_label text DEFAULT 'Certified NGO',
  metric_4_desc text DEFAULT 'Tax exemption tax deductible',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homepage_text ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on homepage_text" ON homepage_text
  FOR SELECT USING (true);

CREATE POLICY "Allow admin all on homepage_text" ON homepage_text
  FOR ALL TO authenticated USING (true);

INSERT INTO homepage_text (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`

  useEffect(() => {
    async function loadCopyData() {
      try {
        const { data, error } = await supabase
          .from('homepage_text')
          .select('*')
          .eq('id', 1)
          .single()

        if (error) {
          console.warn('Failed to load homepage text from database. Falling back to defaults.')
          setIsDemoMode(true)
        } else if (data) {
          setWorksHeading(data.works_heading || defaultCopy.works_heading)
          setWorksDesc(data.works_description || defaultCopy.works_description)
          setGalleryHeading(data.gallery_heading || defaultCopy.gallery_heading)
          setGalleryDesc(data.gallery_description || defaultCopy.gallery_description)
          setContactHeading(data.contact_heading || defaultCopy.contact_heading)
          setContactDesc(data.contact_description || defaultCopy.contact_description)
          setBtn1Text(data.button_1_text || defaultCopy.button_1_text)
          setBtn2Text(data.button_2_text || defaultCopy.button_2_text)
          setUpiId(data.upi_id || defaultCopy.upi_id)
          setPayeeName(data.payee_name || defaultCopy.payee_name)
          
          setM1Val(data.metric_1_val || defaultCopy.metric_1_val)
          setM1Label(data.metric_1_label || defaultCopy.metric_1_label)
          setM1Desc(data.metric_1_desc || defaultCopy.metric_1_desc)
          
          setM2Val(data.metric_2_val || defaultCopy.metric_2_val)
          setM2Label(data.metric_2_label || defaultCopy.metric_2_label)
          setM2Desc(data.metric_2_desc || defaultCopy.metric_2_desc)
          
          setM3Val(data.metric_3_val || defaultCopy.metric_3_val)
          setM3Label(data.metric_3_label || defaultCopy.metric_3_label)
          setM3Desc(data.metric_3_desc || defaultCopy.metric_3_desc)
          
          setM4Val(data.metric_4_val || defaultCopy.metric_4_val)
          setM4Label(data.metric_4_label || defaultCopy.metric_4_label)
          setM4Desc(data.metric_4_desc || defaultCopy.metric_4_desc)
        }
      } catch (err) {
        setIsDemoMode(true)
      } finally {
        setLoading(false)
      }
    }
    loadCopyData()
  }, [supabase])

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlMigration)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const payload = {
      id: 1,
      works_heading: worksHeading.trim(),
      works_description: worksDesc.trim(),
      gallery_heading: galleryHeading.trim(),
      gallery_description: galleryDesc.trim(),
      contact_heading: contactHeading.trim(),
      contact_description: contactDesc.trim(),
      button_1_text: btn1Text.trim(),
      button_2_text: btn2Text.trim(),
      upi_id: upiId.trim(),
      payee_name: payeeName.trim(),
      
      metric_1_val: m1Val.trim(),
      metric_1_label: m1Label.trim(),
      metric_1_desc: m1Desc.trim(),
      
      metric_2_val: m2Val.trim(),
      metric_2_label: m2Label.trim(),
      metric_2_desc: m2Desc.trim(),
      
      metric_3_val: m3Val.trim(),
      metric_3_label: m3Label.trim(),
      metric_3_desc: m3Desc.trim(),
      
      metric_4_val: m4Val.trim(),
      metric_4_label: m4Label.trim(),
      metric_4_desc: m4Desc.trim(),
      updated_at: new Date().toISOString()
    }

    if (isDemoMode) {
      setTimeout(() => {
        setSaving(false)
        setSuccess(true)
      }, 1000)
      return
    }

    try {
      const { error: upsertError } = await supabase
        .from('homepage_text')
        .upsert(payload, { onConflict: 'id' })

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save copy parameters. Make sure the SQL table has been created.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Website Copy Editor
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Customize all headings, text descriptions, buttons, and impact metric figures across the page
        </p>
      </div>

      {isDemoMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 text-amber-200 text-sm space-y-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-base">Database Table Required!</p>
              <p className="text-xs text-amber-200/70">
                To persist edits, copy and run the SQL migration below in your **Supabase SQL Editor** to create the new `homepage_text` table. Currently running in simulation mode.
              </p>
            </div>
          </div>
          <div className="relative bg-black/45 p-4 rounded-xl border border-amber-500/10 font-mono text-[11px] leading-normal text-amber-300 max-h-[160px] overflow-y-auto whitespace-pre">
            {sqlMigration}
            <button
              onClick={copySqlToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              {copiedSql ? <ClipboardCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-200 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Website copy saved successfully!</span>
          </div>
        )}

        {/* 1. Hero Buttons */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold font-display text-white border-b border-brand-charcoal-100/5 pb-2">
            Hero Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                required
                value={btn1Text}
                onChange={(e) => setBtn1Text(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                required
                value={btn2Text}
                onChange={(e) => setBtn2Text(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 2. Donation Gateway Settings */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold font-display text-white border-b border-brand-charcoal-100/5 pb-2">
            Donation UPI Gateway Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                UPI ID (GPay / PhonePe / BHIM destination)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Payee name (Campaign / Organization Name)
              </label>
              <input
                type="text"
                required
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Section Titles & Intro Blocks */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold font-display text-white border-b border-brand-charcoal-100/5 pb-2">
            Section Headings & Copy
          </h2>
          
          <div className="space-y-6">
            {/* Works headings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Works Heading
                </label>
                <input
                  type="text"
                  required
                  value={worksHeading}
                  onChange={(e) => setWorksHeading(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Works Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={worksDesc}
                  onChange={(e) => setWorksDesc(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Gallery headings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-charcoal-100/5">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Gallery Heading
                </label>
                <input
                  type="text"
                  required
                  value={galleryHeading}
                  onChange={(e) => setGalleryHeading(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Gallery Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={galleryDesc}
                  onChange={(e) => setGalleryDesc(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Contact headings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-charcoal-100/5">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Contact Heading
                </label>
                <input
                  type="text"
                  required
                  value={contactHeading}
                  onChange={(e) => setContactHeading(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                  Contact Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={contactDesc}
                  onChange={(e) => setContactDesc(e.target.value)}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white focus:outline-none focus:border-brand-orange-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Impact Metrics */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold font-display text-white border-b border-brand-charcoal-100/5 pb-2">
            Impact Metrics Statistics
          </h2>
          
          <div className="space-y-6">
            {/* Metric 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 1 Value
                </label>
                <input
                  type="text"
                  value={m1Val}
                  onChange={(e) => setM1Val(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 1 Label
                </label>
                <input
                  type="text"
                  value={m1Label}
                  onChange={(e) => setM1Label(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 1 Description
                </label>
                <input
                  type="text"
                  value={m1Desc}
                  onChange={(e) => setM1Desc(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-charcoal-100/5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 2 Value
                </label>
                <input
                  type="text"
                  value={m2Val}
                  onChange={(e) => setM2Val(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 2 Label
                </label>
                <input
                  type="text"
                  value={m2Label}
                  onChange={(e) => setM2Label(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 2 Description
                </label>
                <input
                  type="text"
                  value={m2Desc}
                  onChange={(e) => setM2Desc(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-charcoal-100/5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 3 Value
                </label>
                <input
                  type="text"
                  value={m3Val}
                  onChange={(e) => setM3Val(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 3 Label
                </label>
                <input
                  type="text"
                  value={m3Label}
                  onChange={(e) => setM3Label(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 3 Description
                </label>
                <input
                  type="text"
                  value={m3Desc}
                  onChange={(e) => setM3Desc(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-charcoal-100/5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 4 Value
                </label>
                <input
                  type="text"
                  value={m4Val}
                  onChange={(e) => setM4Val(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 4 Label
                </label>
                <input
                  type="text"
                  value={m4Label}
                  onChange={(e) => setM4Label(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Metric 4 Description
                </label>
                <input
                  type="text"
                  value={m4Desc}
                  onChange={(e) => setM4Desc(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-sm text-white bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving Copy...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save All Copy</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
