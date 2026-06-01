'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Info, Heart, CheckCircle } from 'lucide-react'

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

  const presetAmounts = [500, 1000, 2500, 5000, 10000]

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDonated(true)
    setTimeout(() => {
      setDonated(false)
      setCustomAmount('')
    }, 4000)
  }

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount

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
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25">
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
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25">
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
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25">
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

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl border border-brand-gold-500/25">
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
                    className="text-base font-bold text-brand-sand-900 hover:text-brand-gold-500 transition-colors"
                  >
                    @missiondilse
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Choose Donate Card with Dynamic Live UPI QR Code Generator */}
          <div className="bg-brand-sand-200 border border-brand-sand-300 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_35px_rgba(212,175,55,0.1)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-gold-500/10 -mr-8 -mt-8" />
            
            <div className="space-y-6 relative z-10">
              <div className="text-center">
                <img
                  src="/logo_donation.png"
                  alt="Mission Dilse Logo"
                  className="h-16 w-auto mx-auto mb-3 object-contain"
                />
                <h3 className="text-xl font-black font-display text-gold-texture uppercase">
                  SUPPORT OUR CAUSE
                </h3>
                <p className="text-xs text-brand-sand-800 mt-1">
                  Select or enter an amount to generate your instant Google Pay / UPI QR Code.
                </p>
              </div>

              {/* Preset Amounts Grid */}
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((amount) => {
                  const isSelected = selectedAmount === amount && !customAmount
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-brand-gold-500 text-primary-foreground border-brand-gold-500 shadow-md'
                          : 'bg-white text-gray-700 border-brand-sand-300 hover:border-brand-gold-500/50'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  )
                })}
                <input
                  type="number"
                  placeholder="₹ Custom"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount('')
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center border bg-white focus:outline-none focus:border-brand-gold-500 transition-all ${
                    customAmount ? 'border-brand-gold-500 ring-1 ring-brand-gold-500' : 'border-brand-sand-300'
                  }`}
                />
              </div>

              {/* Dynamic QR Code Display Box */}
              <div className="bg-brand-sand-100 p-5 rounded-3xl border border-brand-sand-300 flex flex-col items-center justify-center min-h-[220px] transition-all">
                {finalAmount && parseFloat(finalAmount.toString()) > 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 animate-fade-in">
                    <div className="p-3 bg-white rounded-2xl border border-brand-gold-500/20 shadow-inner">
                      {/* Generates live UPI QR code */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `upi://pay?pa=${upiId || 'heromaurya1613-1@oksbi'}&pn=${encodeURIComponent(
                            payeeName || 'Mission Dilse'
                          )}&am=${finalAmount}&cu=INR&tn=Donation`
                        )}`}
                        alt={`UPI QR Code to pay ₹${finalAmount}`}
                        className="w-[160px] h-[160px] object-contain select-none"
                      />
                    </div>
                    <span className="text-[10px] font-black text-gold-texture tracking-widest uppercase">
                      SCAN & PAY ₹{parseFloat(finalAmount.toString()).toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-brand-sand-900/40 text-xs font-semibold px-6 max-w-[200px]">
                    Select or enter an amount to view QR code
                  </div>
                )}
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
