import Link from 'next/link'
import CineXLogo from '@/components/ui/CineXLogo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cinex-black flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <CineXLogo size="lg" href="/landing" />
      </div>
      <h1 className="text-[#E50914] text-8xl font-black mb-4">404</h1>
      <h2 className="text-white text-3xl font-bold mb-4">Lost Your Way?</h2>
      <p className="text-[#b3b3b3] text-lg max-w-md mb-8">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link href="/home" className="btn-primary text-white bg-cinex-red hover:bg-cinex-red-hover font-bold px-8 py-3 text-lg rounded">
        CineX Home
      </Link>
    </div>
  )
}
