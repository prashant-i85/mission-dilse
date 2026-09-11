'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Info, Heart, CheckCircle, ExternalLink, Copy, Check, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

interface ContactProps {
  email?: string | null
  phone?: string | null
  address?: string | null
  extra_info?: string | null
  heading?: string
  description?: string
  upiId?: string
  payeeName?: string
}

export default function Contact({ email, phone, address, extra_info, heading, description, upiId, payeeName }: ContactProps) {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time')
  const [selectedAmount, setSelectedAmount] = useState<number | string>(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [coverFees, setCoverFees] = useState(false)
  const [donated, setDonated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)
  const [sliderValue, setSliderValue] = useState<number>(1000)

  const presetAmounts = [500, 1000, 2500, 5000, 10000]

  const currentUpiId = upiId || 'praveenverma212005-1@okhdfcbank'
  const currentPayeeName = payeeName || 'Mission Dilse'
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount
  const amountVal = finalAmount && parseFloat(finalAmount.toString()) > 0 ? parseFloat(finalAmount.toString()) : ''
  
  // Direct UPI App Deep Link Protocol
  const upiUri = `upi://pay?pa=${currentUpiId}&pn=${encodeURIComponent(currentPayeeName)}${amountVal ? `&am=${amountVal}` : ''}&cu=INR&tn=Donation`

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(currentUpiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
    setSliderValue(amount)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setSliderValue(val)
    setCustomAmount(val.toString())
    setSelectedAmount('')
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomAmount(val)
    setSelectedAmount('')
    if (val && !isNaN(Number(val))) {
      setSliderValue(Math.min(Math.max(Number(val), 100), 25000))
    }
  }

  return (
    <section id="contact" className="py-24 bg-brand-sand-100 bg-gold-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-black font-display tracking-tight text-gold-texture uppercase mb-4">
            {heading || 'GET IN TOUCH'}
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] mx-auto rounded-full mb-6" />
          <p className="text-base text-brand-sand-900/70 leading-relaxed max-w-xl mx-auto">
            {description || 'Have questions, want to partner, or support our operations? Connect with us or support our cause below.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Contact info */}
          <div className="space-y-8 lg:pr-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold-500 uppercase block">
                CONTACT DETAILS
              </span>
              <h3 className="text-3xl font-black font-display text-gold-texture leading-tight uppercase">
                WE WOULD LOVE TO HEAR FROM YOU
              </h3>
              <p className="text-sm text-brand-sand-900/60 leading-relaxed">
                {extra_info || 'We are always looking for volunteers, donors, and organizational partners. Contact us to learn more about how you can support Mission Dilse.'}
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-brand-sand-300">
              {email && (
                <div className="flex items-start gap-4 p-3 rounded-2xl border border-transparent hover:border-brand-gold-500/20 hover:bg-white/50 hover:scale-[1.02] transition-all duration-300">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Email Us
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-base font-bold text-brand-sand-900 hover:text-brand-gold-500 transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-4 p-3 rounded-2xl border border-transparent hover:border-brand-gold-500/20 hover:bg-white/50 hover:scale-[1.02] transition-all duration-300">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Call Us
                    </h4>
                    <a
                      href={`tel:${phone}`}
                      className="text-base font-bold text-brand-sand-900 hover:text-brand-gold-500 transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4 p-3 rounded-2xl border border-transparent hover:border-brand-gold-500/20 hover:bg-white/50 hover:scale-[1.02] transition-all duration-300">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Visit Office
                    </h4>
                    <p className="text-base font-bold text-brand-sand-900 whitespace-pre-line leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram Card with gradient hover border */}
              <div className="group/insta relative rounded-2xl p-[1.5px] transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-500 hover:via-rose-500 hover:to-purple-600">
                <div className="flex items-start gap-4 p-3 rounded-[14px] bg-brand-sand-100/50 group-hover/insta:bg-white transition-all duration-300">
                  <div className="p-3 bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-purple-600/15 text-rose-600 rounded-2xl border border-rose-300/30 shrink-0 group-hover/insta:scale-110 transition-transform duration-300">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Instagram
                    </h4>
                    <a
                      href="https://www.instagram.com/missiondilse/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-brand-sand-900 group-hover/insta:text-rose-600 transition-colors"
                    >
                      @missiondilse
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Choose Donate Card with Dynamic Live UPI QR Code Generator */}
          <div className="bg-brand-sand-200 border border-brand-sand-300 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-brand-gold-500/10 -mr-8 -mt-8 pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="text-center">
                <img
                  src="/logo_donation.png"
                  alt="Mission Dilse Logo"
                  className="h-14 sm:h-16 w-auto mx-auto mb-3 object-contain hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-black font-display text-gold-texture uppercase">
                  SUPPORT OUR CAUSE
                </h3>
                <p className="text-xs text-brand-sand-800 mt-1">
                  Select or slide an amount to generate your instant Google Pay / UPI QR Code.
                </p>
              </div>

              {/* Preset Amounts Grid with Spring Scale Animation & Pop */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {presetAmounts.map((amount) => {
                  const isSelected = selectedAmount === amount && !customAmount
                  return (
                    <motion.button
                      key={amount}
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      onClick={() => handleSelectPreset(amount)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold border cursor-pointer transition-colors duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] text-primary-foreground border-brand-gold-600 shadow-md shadow-amber-500/25 font-black ring-2 ring-brand-gold-500/30'
                          : 'bg-white text-gray-700 border-brand-sand-300 hover:border-brand-gold-500/60 shadow-2xs'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </motion.button>
                  )
                })}
                <input
                  type="number"
                  placeholder="₹ Custom"
                  value={customAmount}
                  onChange={handleCustomInputChange}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold text-center border bg-white focus:outline-none transition-all ${
                    customAmount
                      ? 'border-brand-gold-500 ring-2 ring-brand-gold-500/30 scale-[1.02] shadow-sm'
                      : 'border-brand-sand-300 hover:border-brand-gold-500/50'
                  }`}
                />
              </div>

              {/* Interactive Custom Amount Slider */}
              <div className="space-y-2 bg-brand-sand-100/70 p-3.5 rounded-2xl border border-brand-sand-300">
                <div className="flex justify-between items-center text-xs font-bold text-brand-sand-800">
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold-600" />
                    Amount Slider
                  </span>
                  <span className="font-extrabold text-gold-texture text-sm">
                    ₹{Number(finalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="25000"
                  step="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full accent-[#d4af37] cursor-pointer h-2 bg-brand-sand-300 rounded-lg appearance-none transition-all"
                />
                <div className="flex justify-between text-[10px] font-bold text-brand-sand-800/60 px-0.5">
                  <span>₹100</span>
                  <span>₹12,500</span>
                  <span>₹25,000</span>
                </div>
              </div>

              {/* Dynamic QR Code Display Box with Flip/Fade Effect */}
              <div className="bg-brand-sand-100 p-5 rounded-3xl border border-brand-sand-300 flex flex-col items-center justify-center min-h-[220px] transition-all">
                <AnimatePresence mode="wait">
                  {finalAmount && parseFloat(finalAmount.toString()) > 0 ? (
                    <motion.div
                      key={`qr-${finalAmount}`}
                      initial={{ opacity: 0, rotateY: 70, scale: 0.94 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, rotateY: -70, scale: 0.94 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="flex flex-col items-center justify-center gap-3 w-full"
                    >
                      <div className="p-3 bg-white rounded-2xl border border-brand-gold-500/20 shadow-inner group hover:scale-105 transition-transform duration-300">
                        {/* Generates live UPI QR code */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`}
                          alt={`UPI QR Code to pay ₹${finalAmount}`}
                          className="w-[160px] h-[160px] object-contain select-none"
                        />
                      </div>
                      <span className="text-[10px] font-black text-gold-texture tracking-widest uppercase">
                        SCAN & PAY ₹{parseFloat(finalAmount.toString()).toLocaleString('en-IN')}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-brand-sand-900/40 text-xs font-semibold px-6 max-w-[200px] py-4"
                    >
                      Select or enter an amount to generate QR code & direct payment link
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct UPI Payment App Redirect Button & Copy ID */}
              <div className="space-y-3">
                <a
                  href={upiUri}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] text-primary-foreground font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>PAY VIA UPI APP {amountVal ? `(₹${amountVal.toLocaleString('en-IN')})` : ''}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Copy UPI ID Bar with Animated Tooltip */}
                <div className="relative">
                  <div
                    onMouseEnter={() => setShowCopyTooltip(true)}
                    onMouseLeave={() => setShowCopyTooltip(false)}
                    className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-brand-sand-300 text-xs shadow-2xs group hover:border-brand-gold-500/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-extrabold text-brand-sand-800 text-[10px] uppercase tracking-wider">UPI ID:</span>
                      <span className="font-bold text-brand-sand-900 truncate select-all">{currentUpiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpiId}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-brand-gold-600 hover:text-brand-sand-900 transition-colors pl-2 cursor-pointer active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Floating Tooltip Feedback Message */}
                  <AnimatePresence>
                    {(copied || showCopyTooltip) && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute -top-9 right-2 px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg pointer-events-none z-30 flex items-center gap-1.5 ${
                          copied
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-brand-sand-900 text-white shadow-black/20'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Copied to clipboard!</span>
                          </>
                        ) : (
                          <span>Click to copy UPI ID</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="text-[10px] text-brand-sand-900/40 text-center font-bold tracking-widest uppercase pt-2 border-t border-brand-sand-300">
                Works with Google Pay • PhonePe • Paytm • BHIM
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
