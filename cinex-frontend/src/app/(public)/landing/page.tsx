'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CineXLogo from '@/components/ui/CineXLogo'

const FAQ_ITEMS = [
  {
    question: 'What is CineX?',
    answer: 'CineX is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want.',
  },
  {
    question: 'How much does CineX cost?',
    answer: 'Watch CineX on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $22.99 a month. No extra costs, no contracts.',
  },
  {
    question: 'Where can I watch?',
    answer: "Watch anywhere, anytime. Sign in with your CineX account to watch instantly on the web at cinex.com from your personal computer or on any internet-connected device that offers the CineX app.",
  },
  {
    question: 'How do I cancel?',
    answer: 'CineX is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.',
  },
  {
    question: 'What can I watch on CineX?',
    answer: 'CineX has an extensive library of feature films, documentaries, TV shows, anime, award-winning CineX originals, and more. Watch as much as you want, anytime you want.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#2D2D2D] hover:bg-[#414141] text-white text-left px-6 py-5 flex items-center justify-between text-xl font-medium transition-colors duration-200"
      >
        <span>{question}</span>
        <span className="text-3xl ml-4 flex-shrink-0 transition-transform duration-200" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
          +
        </span>
      </button>
      {open && (
        <div className="bg-[#2D2D2D] border-t border-[#222] px-6 py-5 text-lg text-white">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      router.push(`/signup?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="bg-cinex-black min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/9db5d7ba-eedd-4eba-958d-54dc4e84b8d0/ed4db2f1-8867-4416-b300-05c0d26e8a56/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
        />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-6">
          <CineXLogo size="lg" />
          <Link href="/login" className="btn-primary text-sm px-5 py-2">
            Sign In
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-32">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 max-w-3xl leading-tight">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-xl md:text-2xl text-white mb-2">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="text-lg md:text-xl text-white mb-8">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-black/70 border border-[#999] text-white px-5 py-4 rounded text-base placeholder-[#999] focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="bg-cinex-red hover:bg-cinex-red-hover text-white font-bold px-10 py-4 rounded text-xl whitespace-nowrap transition-colors duration-200 flex items-center gap-2"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Feature Sections */}
      <section className="border-t-8 border-[#222] py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-5">Enjoy on your TV.</h2>
            <p className="text-xl text-[#d2d2d2]">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>
          <div className="flex-1 relative">
            <Image src="https://assets.nflxext.com/ffe/siteui/vlv3/b2bf5a6b-7ce1-4069-85c0-1e4c1c2a8de2/5e4c96e4-3a4a-4b0a-9a64-85d3d0a1bb22/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg" alt="Watch on TV" width={560} height={380} className="rounded-lg" />
          </div>
        </div>
      </section>

      <section className="border-t-8 border-[#222] py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-5">Download your shows to watch offline.</h2>
            <p className="text-xl text-[#d2d2d2]">Save your favorites easily and always have something to watch.</p>
          </div>
          <div className="flex-1 relative flex justify-center">
            <div className="relative">
              <Image src="https://assets.nflxext.com/ffe/siteui/vlv3/f73e7ac5-0f5c-4c67-a1c4-e52822f2aa84/5e4c96e4-3a4a-4b0a-9a64-85d3d0a1bb22/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg" alt="Download" width={380} height={300} className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-8 border-[#222] py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-5">Watch everywhere.</h2>
            <p className="text-xl text-[#d2d2d2]">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
          </div>
          <div className="flex-1 relative">
            <Image src="https://assets.nflxext.com/ffe/siteui/vlv3/91b8acef-6bd5-41b4-90f4-5be6b6e3aadc/5e4c96e4-3a4a-4b0a-9a64-85d3d0a1bb22/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg" alt="Watch everywhere" width={560} height={380} className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t-8 border-[#222] py-16 px-6 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} {...item} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-xl mb-6 text-[#d2d2d2]">Ready to watch? Enter your email to create or restart your membership.</p>
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-black/70 border border-[#999] text-white px-5 py-4 rounded text-base placeholder-[#999] focus:outline-none focus:border-white"
              />
              <button type="submit" className="bg-cinex-red hover:bg-cinex-red-hover text-white font-bold px-10 py-4 rounded text-xl transition-colors duration-200 flex items-center gap-2">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-8 border-[#222] py-12 px-6 md:px-16 text-[#757575]">
        <div className="max-w-5xl mx-auto">
          <p className="mb-6">Questions? Call 1-800-CINEX-00</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
            {['FAQ', 'Help Centre', 'Account', 'Media Centre', 'Investor Relations', 'Jobs', 'Redeem Gift Cards', 'Buy Gift Cards', 'Ways to Watch', 'Terms of Use', 'Privacy', 'Cookie Preferences', 'Corporate Information', 'Contact Us', 'Speed Test', 'Legal Notices'].map((link) => (
              <a key={link} href="#" className="hover:underline">{link}</a>
            ))}
          </div>
          <p className="text-sm">CineX India</p>
        </div>
      </footer>
    </div>
  )
}
