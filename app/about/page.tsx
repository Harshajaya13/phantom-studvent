
export default function Page() {
  return (
    <div className="min-h-screen pb-16 bg-background">

      <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px] py-[32px] prose prose-sm md:prose-base prose-purple">
        <h1 className="text-2xl font-bold mb-6">About StudVent</h1>

        <p>Studvent was built by students, for students. Academic pressure, placement stress, and hostel life can be overwhelming. We realized there was no dedicated, safe space to share these shared experiences without the pressure of social media identities. Our mission is to provide a moderated, anonymous platform where students can feel heard, find solidarity, and realize they aren&apos;t alone in their academic journey. We strictly enforce community guidelines to maintain a safe and supportive environment.</p>

        <hr className="my-8 border-border" />

        <h2 className="text-xl font-bold mb-4">Who Am I?</h2>
        <p>Hi, I&apos;m the creator of StudVent. I&apos;m a curious student navigating the chaotic world of college life in India, just like you.</p>
        <p>I built this platform because I wanted to pinpoint the real, unfiltered issues that students face every day. My vision is to evolve this space into a genuine &quot;student advisor&quot;—a place that actually listens and helps us become better versions of ourselves amidst the pressure of exams, placements, and outdated rules.</p>
        <p>On a personal level, I am an aspiring Python developer. I don&apos;t have all the answers, and I&apos;m figuring things out as a self-taught programmer learning side-by-side with my AI partner. Building StudVent is my way of solving my own problems while hopefully making college life just a little bit easier for you. I hope this platform helps you feel heard and understood!</p>

        <hr className="my-8 border-border" />

        <h2 className="text-xl font-bold mb-4">Read My Open Letter</h2>
        <p>I wrote an unfiltered piece questioning the government, the education system, the colleges, and even us students. It covers GDP, unemployment, AI dependency, gaming addiction, parenting gaps, and the mindset shift we all need.</p>
        <p><a href="/blog/letter-to-government-colleges-students" className="text-primary font-semibold hover:underline">Read: A Letter to the Government, the Colleges, and the Students &rarr;</a></p>

      </main>
    </div>
  );
}