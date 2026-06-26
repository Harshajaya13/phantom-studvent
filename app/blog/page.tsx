import Link from 'next/link';
import { blogs } from '@/lib/blog-data';

export const metadata = {
  title: 'Blog - StudVent',
  description: 'Read the latest thoughts, tips, and stories from the StudVent team and community.',
};

export default function BlogPage() {
  const featuredPost = blogs[0];
  const regularPosts = blogs.slice(1);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <main className="max-w-[1000px] mx-auto px-[24px] md:px-[40px] pt-[40px]">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-text-primary">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">StudVent</span> Blog
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto md:mx-0">
            Real stories, actionable tips, and unfiltered thoughts on surviving college life in India.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="group relative overflow-hidden rounded-[2rem] glass shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                <div className="relative p-8 md:p-12 flex flex-col justify-end h-full min-h-[300px]">
                  <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full w-max">
                    Featured
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-primary group-hover:text-primary transition-colors duration-300">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text-secondary md:text-lg mb-8 line-clamp-2 max-w-3xl leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-text-muted gap-3 font-medium">
                    <span>{featuredPost.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/10"></span>
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="h-full flex flex-col p-6 md:p-8 rounded-3xl glass shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="flex-1 relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-primary transition-colors duration-200 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center text-xs text-text-muted gap-2 font-medium mt-auto pt-4 relative z-10 border-t border-black/[0.04]">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-black/10"></span>
                  <span>{post.author}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
