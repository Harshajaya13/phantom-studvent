import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - StudVent',
  description: 'Rules and guidelines for using the StudVent platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px] py-[48px]">
        <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-8 text-text-primary tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="lead">Last Updated: May 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using StudVent, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
          </p>

          <h2>2. Age Requirement</h2>
          <p>
            <strong>You must be at least 13 years of age to use this site.</strong> StudVent is not intended for children under 13.
          </p>

          <h2>3. Prohibited Content</h2>
          <p>
            While we encourage honest venting, we have zero tolerance for:
          </p>
          <ul>
            <li><strong>Bullying & Harassment:</strong> Do not use names or identifiable details of other students or individuals.</li>
            <li><strong>Illegal Content:</strong> Posts promoting violence, illegal acts, or self-harm will be removed and reported if necessary.</li>
            <li><strong>Spam:</strong> Automated or repetitive posting is strictly prohibited and blocked by our Hardware DNA security.</li>
          </ul>

          <h2>4. User Generated Content (UGC)</h2>
          <p>
            You are solely responsible for the content you post. By posting, you grant StudVent a non-exclusive, royalty-free license to display your vent on our platform. We reserve the right to remove any content that violates our guidelines without notice.
          </p>

          <h2>5. Disclaimers</h2>
          <p>
            StudVent is provided &quot;as is.&quot; We are not responsible for the truthfulness of any vents. If you are in a crisis, please contact professional emergency services immediately.
          </p>

          <h2>6. Modifications</h2>
          <p>
            We may update these terms at any time. Your continued use of the site after changes are posted constitutes acceptance of the new terms.
          </p>
        </div>
      </main>
    </div>
  );
}
