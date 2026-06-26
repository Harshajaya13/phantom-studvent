import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - StudVent',
  description: 'How StudVent protects your anonymity and handles data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px] py-[48px]">
        <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-8 text-text-primary tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="lead">Last Updated: May 2024</p>
          
          <h2>1. Our Commitment to Anonymity</h2>
          <p>
            StudVent was built on the principle of radical privacy. We do not require accounts, email addresses, or names. Our goal is to provide a safe space for students to speak their truth without fear of identification.
          </p>

          <h2>2. Data We Collect</h2>
          <p>
            Because we do not use accounts, we do not collect typical personal data. However, to prevent spam and abuse, we collect:
          </p>
          <ul>
            <li><strong>Hardware Fingerprints:</strong> A hashed identifier based on your device hardware (e.g., GPU/Audio signatures) to prevent spamming. This is stored as a non-reversible SHA-256 hash.</li>
            <li><strong>IP Hashing:</strong> Your IP address is hashed and salted before being stored, making it impossible to retrieve the original IP from our database.</li>
            <li><strong>Cookies:</strong> We use essential cookies for security (via Cloudflare Turnstile) and to remember your local &quot;Saved Vents.&quot;</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>
            We use a few trusted partners to keep the site running:
          </p>
          <ul>
            <li><strong>Supabase:</strong> For our encrypted database storage.</li>
            <li><strong>Cloudflare:</strong> For DDoS protection and bot detection (Turnstile).</li>
            <li><strong>Google AdSense:</strong> To show relevant advertisements. AdSense may use cookies to serve ads based on your visit to this and other sites.</li>
          </ul>

          <h2>4. Your Rights</h2>
          <p>
            Since we do not store your name or email, we cannot &quot;look up&quot; your data. However, you can delete your locally saved vents at any time by clearing your browser cache.
          </p>

          <h2>5. Contact</h2>
          <p>
            For privacy-related inquiries, please use the contact form linked in our footer.
          </p>
        </div>
      </main>
    </div>
  );
}
