import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogs } from '@/lib/blog-data';
import { BlogCTA } from '@/components/BlogCTA';

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogs.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found - StudVent' };
  return {
    title: `${post.title} - StudVent Blog`,
    description: post.excerpt,
  };
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogs.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px] py-[48px]">
        <article className="max-w-none">
          <div className="mb-10">
            <Link href="/blog" className="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">
              &larr; Back to blog
            </Link>
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-text-primary tracking-tight">{post.title}</h1>
            <div className="flex items-center text-sm text-text-muted gap-3 font-medium opacity-60">
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></span>
              <span>{post.author}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* ─── Blog-to-Board CTA Funnel ─────────────── */}
          <BlogCTA />

          <div className="mt-8 pt-6 not-prose">
            <Link href="/blog" className="text-primary hover:underline flex items-center gap-2 text-sm font-medium">
              &larr; Back to all posts
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
