export default function Home() {
  const features = [
    { icon: "⚡", title: "Instant PDF", desc: "Generate professional PDFs in seconds, right in your browser." },
    { icon: "🔒", title: "Zero Cloud Storage", desc: "Your data never leaves your device. We can't see it even if we wanted to." },
    { icon: "🚫", title: "No Signup", desc: "Start creating invoices immediately. No email, no password, no nonsense." },
    { icon: "🎨", title: "Multiple Templates", desc: "Choose from clean, professional, and bold designs to match your brand." },
    { icon: "💱", title: "50+ Currencies", desc: "Invoice clients worldwide with support for USD, EUR, GBP, INR, JPY and more." },
    { icon: "📎", title: "Logo Upload", desc: "Add your business logo for a professional touch. Stored locally." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            100% client-side. Zero tracking.
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your invoices.<br />
            Your data.<br />
            <span className="text-emerald-500">No account needed.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Create beautiful, professional invoices in seconds. Everything runs in your browser —
            your data never touches a server. Free forever.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/create" className="btn-primary text-lg !py-4 !px-8">
              Create Your Invoice →
            </a>
            <a href="/templates" className="btn-secondary text-lg !py-4 !px-8">
              Browse Templates
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need. Nothing you don&apos;t.</h2>
        <p className="text-muted text-center mb-16 max-w-xl mx-auto">No bloated features, no vendor lock-in. Just a fast, private invoice generator that respects your time and data.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 transition-all duration-200">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-muted text-center mb-16">No subscriptions. No hidden fees.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-1">Free</h3>
            <p className="text-muted text-sm mb-6">Everything you need to get started</p>
            <div className="text-4xl font-bold mb-6">$0 <span className="text-base font-normal text-muted">forever</span></div>
            <ul className="space-y-3 text-sm mb-8">
              {["1 clean template", "Unlimited invoices", "Client-side PDF generation", "50+ currencies", "localStorage persistence"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <a href="/create" className="btn-secondary w-full text-center block">Get Started</a>
          </div>
          <div className="glass rounded-2xl p-8 border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">POPULAR</div>
            <h3 className="text-lg font-semibold mb-1">Pro</h3>
            <p className="text-muted text-sm mb-6">For freelancers and small businesses</p>
            <div className="text-4xl font-bold mb-6">$19 <span className="text-base font-normal text-muted">one-time</span></div>
            <ul className="space-y-3 text-sm mb-8">
              {["All 3+ premium templates", "Logo upload on invoices", "Custom accent colors", "Recurring invoice numbering", "CSV & JSON export", "Priority support"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full justify-center">Coming Soon</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">◈</span>
            <span>InvoiceZen</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://rushiraj.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">rushiraj.me</a>
            <a href="https://privacypage.rushiraj.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">PrivacyPage</a>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
