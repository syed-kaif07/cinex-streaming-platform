import CineXLogo from '@/components/ui/CineXLogo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-black bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/9db5d7ba-eedd-4eba-958d-54dc4e84b8d0/ed4db2f1-8867-4416-b300-05c0d26e8a56/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="px-6 md:px-16 py-6">
          <CineXLogo size="lg" />
        </nav>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          {children}
        </div>
        <footer className="text-center py-6 text-[#757575] text-sm">
          <p>© 2024 CineX. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
