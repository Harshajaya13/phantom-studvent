import { AdminMessageForm } from '@/components/AdminMessageForm';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Admin - StudVent',
  description: 'Send a direct, anonymous message to the StudVent administration.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-24 bg-background">
      <main className="max-w-[600px] mx-auto px-[24px] md:px-[40px] pt-[60px]">
        <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-4 text-text-primary tracking-tight">Need a Hand?</h1>
        <p className="text-text-secondary text-lg mb-10 leading-relaxed">
          If you need a word of assurance, have a concern, or just need to talk to someone, you can reach the Admin anonymously here.
        </p>

        <AdminMessageForm />

        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
            <span>🛡️</span> Your Privacy First
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your message is forwarded directly to the admin via an encrypted bot. No names, emails, or accounts are linked to your message. We aim to respond as quickly as possible.
          </p>
        </div>
      </main>
    </div>
  );
}
