'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Info, Heart, CheckCircle } from 'lucide-react'

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
    <section id="contact" className="py-24 bg-brand-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-black font-display tracking-tight text-brand-sand-900 uppercase mb-4">
            {heading || 'GET IN TOUCH'}
          </h2>
          <div className="w-12 h-1 bg-brand-emerald-600 mx-auto rounded-full mb-6" />
          <p className="text-base text-brand-sand-900/70 leading-relaxed max-w-xl mx-auto">
            {description || 'Have questions, want to partner, or support our operations? Connect with us or support our cause below.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Contact info */}
          <div className="space-y-8 lg:pr-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest text-brand-emerald-600 uppercase block">
                CONTACT DETAILS
              </span>
              <h3 className="text-3xl font-black font-display text-brand-sand-900 leading-tight uppercase">
                WE WOULD LOVE TO HEAR FROM YOU
              </h3>
              <p className="text-sm text-brand-sand-900/60 leading-relaxed">
                {extra_info || 'We are always looking for volunteers, donors, and organizational partners. Contact us to learn more about how you can support Mission Dilse.'}
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-brand-sand-300">
              {email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-emerald-50 text-brand-emerald-600 rounded-2xl border border-brand-emerald-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Email Us
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-base font-bold text-brand-sand-900 hover:text-brand-emerald-600 transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-emerald-50 text-brand-emerald-600 rounded-2xl border border-brand-emerald-100">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sand-900/40 mb-1">
                      Call Us
                    </h4>
                    <a
                      href={`tel:${phone}`}
                      className="text-base font-bold text-brand-sand-900 hover:text-brand-emerald-600 transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-emerald-50 text-brand-emerald-600 rounded-2xl border border-brand-emerald-100">
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
            </div>
          </div>

          {/* Right Column: Interactive Choose Donate Card with Dynamic Live UPI QR Code Generator */}
          <div className="bg-brand-sand-50 border border-brand-sand-300 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-emerald-600/5 -mr-8 -mt-8" />
            
            <div className="space-y-6 relative z-10">
              <div className="text-center">
                <Heart className="h-8 w-8 text-brand-emerald-600 fill-brand-emerald-600/10 mx-auto mb-2" />
                <h3 className="text-xl font-black font-display text-brand-sand-900 uppercase">
                  SUPPORT OUR CAUSE
                </h3>
                <p className="text-xs text-brand-sand-900/50 mt-1">
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
                          ? 'bg-brand-emerald-600 text-white border-brand-emerald-600 shadow-md'
                          : 'bg-white text-brand-sand-900/80 border-brand-sand-300 hover:border-brand-emerald-600/50'
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
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center border bg-white focus:outline-none focus:border-brand-emerald-600 transition-all ${
                    customAmount ? 'border-brand-emerald-600 ring-1 ring-brand-emerald-600' : 'border-brand-sand-300'
                  }`}
                />
              </div>

              {/* Dynamic QR Code Display Box */}
              <div className="bg-brand-sand-100 p-5 rounded-3xl border border-brand-sand-300 flex flex-col items-center justify-center min-h-[220px] transition-all">
                {finalAmount && parseFloat(finalAmount.toString()) > 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 animate-fade-in">
                    <div className="p-3 bg-white rounded-2xl border border-brand-sand-300 shadow-inner">
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
                    <span className="text-[10px] font-black text-brand-emerald-700 tracking-widest uppercase">
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
