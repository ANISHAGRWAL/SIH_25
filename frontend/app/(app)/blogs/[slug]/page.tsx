import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Sample blog data - in a real app, this would come from a database
const blogPosts = {
  "why-Talking-About-Mental-Health-Matters": {
    title: "WHY TALKING ABOUT MENTAL HEALTH MATTERS?",
    date: "March 15, 2024",
    category: "Mental Health",
    image: "/Mental.png",
    content: `
      <p>Mental health is as important as physical health, yet for years, it has been surrounded by silence, stigma, and misconceptions. Many people struggling with anxiety, depression, stress, or other challenges often keep their struggles hidden out of fear of being judged or misunderstood. But talking about mental health is not just important; it can be life-changing.</p>
      <br>
      <h2><strong>1. Breaking the Stigma</strong></h2>
      <p>One of the biggest reasons people hesitate to seek help is the stigma surrounding mental health. Open conversations help normalize the idea that mental health struggles are common and nothing to be ashamed of. Just as we talk about fever or diabetes, we should be able to talk about anxiety or depression.</p>
      <br>
      <h2><strong>2. Encouraging Support and Connection</strong></h2>
      <p>When someone opens up about what they are going through, it creates space for empathy and support. Talking about your struggles can help others understand you better, and it may even inspire someone else who's suffering in silence to seek help too. Sharing experiences reminds us that "We are not alone".</p>
      <br>
      <h2><strong>3. Early Intervention Saves Lives</strong></h2>
      <p>Mental health issues often grow silently until they feel overwhelming. By talking about them early, individuals can access resources, therapy, or coping strategies before the situation worsens. Just as early treatment helps physical illnesses, timely conversations about mental health can prevent severe outcomes.</p>
      <br>
      <h2><strong>4. Promoting Healing and Self-Acceptance</strong></h2>
      <p>Bottling up emotions increases stress, shame, and self-criticism. Expressing feelings, whether with friends, family, or professionals, allows individuals to process what they are experiencing. Talking can feel like a weight lifted off the shoulders and is often the first step toward healing.</p>
      <br>
      <h2><strong>5. Creating a Culture of Care</strong></h2>
      <p>When we openly discuss mental health at home, in schools, and at workplaces, we create safer environments where people feel understood and valued. This culture of care ensures that support systems are always available for anyone in need.</p>
      <br>
      <h2><strong>6. Helping Others Who May Be Struggling</strong></h2>
      <p>Sometimes, people battling mental health issues don't have the words to explain what they are going through. By talking about it openly, you can validate their feeling and show them that seeking help is not a weakness but a strength.</p>
      <br>
      <p>Key takeaway- Talking about mental health is not just about sharing struggles - it is about creating hope, fostering understanding, and reminding people that they are not alone. For someone battling mental health challenges, a simple, open conversation can be the first step toward recovery.</p>
    `,
  },
  "digital-detox": {
    title: "Digital Detox: How to Reset Your Mind",
    date: "March 10, 2024",
    category: "Wellness",
    image: "/Detox.png",
    content: `
      <p>These days, it feels like our phones are glued to our hands. From the moment we wake up to the second we fall asleep, we're scrolling, checking notifications, or switching between apps. It's almost second nature. But here's the truth—while technology connects us to the world, it can also overwhelm our minds. Constant pings, endless comparisons on social media, and the pressure to always be "online" slowly drain our mental energy.</p>
      <p>That's where a digital detox comes in—not as a punishment, but as a reset button for your mind.</p>
      <br>
      <h1><strong>Simple Ways to Start Your Digital Detox:</strong></h1>
      <br>
      <ul>
        <li>
          <strong>Set Boundaries with Your Devices:</strong>
          Decide small windows of time where you'll be offline—maybe during meals or the first hour after waking up. Even short breaks make a big difference.
        </li>
        <li>
          <strong>Turn Off Non-Essential Notifications:</strong>
          Every ping pulls your attention. Ask yourself: Do I really need to be notified of this? Chances are, most apps can wait.
        </li>
        <li>
          <strong>Replace Screen Time with Real Activities:</strong>
          Read a book, go for a walk, write in a journal, or even sit quietly with your thoughts. Offline activities help your brain slow down and recharge.
        </li>
        <li>
          <strong>Practice "No-Phone Zones":</strong>
          Keep your bedroom or dining table phone-free. This creates sacred spaces where your mind can rest without distractions.
        </li>
        <li>
          <strong>Reconnect with Yourself:</strong>
          Notice how you feel when you step away from screens. Do you feel calmer? More present? More in control? That awareness is part of the healing process.
        </li>
      </ul>
      
      <br>
      <h2>The Mental Health Benefits</h2>
      <p>A digital detox doesn't mean giving up technology forever. It simply reminds you that you're in control—not your phone. By unplugging, you reduce stress, improve sleep, boost focus, and create more room for genuine connections—with yourself and the people around you.</p>
      <br>
      <p><strong>The takeaway:</strong> A digital detox isn't about disconnecting from the world—it's about reconnecting with yourself. If you're struggling with your mental health, even a short break from screens can feel like a deep breath for your mind.</p>
      

    `,
  },
  "simple-habit-to-boost-your-mind": {
    title: "Simple Habits to Boost Your Mental Wellness Daily",
    date: "March 5, 2024",
    category: "Community",
    image: "/peaceful-meditation.png",
    content: `
      <p>Taking care of your mind doesn't always mean big changes—it's often the small, everyday habits that make the biggest difference. Just like brushing your teeth or eating breakfast, building a few simple practices into your day can do wonders for your mental wellness. Here are five habits you can start right now:</p>
      
      <h2><strong>1. Start Your Day with Gratitude</strong></h2>
      <p>Before you dive into emails or social media, take a minute to notice one thing you're grateful for. It could be as simple as the morning sunshine, your favorite cup of tea, or a kind text from a friend. Gratitude shifts your mindset and sets a positive tone for the rest of the day.</p>
      <br>
      <h2><strong>2. Move Your Body (Even Just a Little)</strong></h2>
      <p>You don't need a full workout routine to feel the benefits. A short walk, stretching, or even a few minutes of dancing in your room can release feel-good chemicals that instantly lift your mood. Movement is like medicine for the mind.</p>
      <br>
      <h2><strong>3. Practice Mindful Breaks</strong></h2>
      <p>Instead of scrolling during every free moment, try pausing for a few deep breaths. Close your eyes, breathe in slowly, and let yourself fully exhale. Just 2–3 minutes of mindful breathing can calm racing thoughts and reduce stress.</p>
      <br>
      <h2><strong>4. Stay Connected</strong></h2>
      <p>Call a friend, check in with a family member, or simply say hello to someone in your day. Human connection is a powerful antidote to loneliness. Even short, genuine interactions can make you feel more grounded and supported.</p>
      <br>
      <h2><strong>5. Prioritize Sleep</strong></h2>
      <p>Your mind can't function well if you're running on empty. Create a bedtime routine—dim the lights, put your phone aside, and give yourself the gift of rest. Quality sleep restores not just your body but also your emotional balance.</p>
      <br>
      <h2><strong>Final Thought </strong></h2>
      <p>Boosting mental wellness doesn't require huge lifestyle overhauls. These five habits may seem small, but practiced daily, they create steady and lasting improvements in how you feel. Remember—taking care of your mind is just as important as taking care of your body.</p>
      <br>
      
    `,
  },
  "sleep-secret-mental-health": {
    title: "Sleep: The Secret Pillar of Mental Health",
    date: "March 12, 2024",
    category: "Wellness",
    image: "/Sleep.png",
    content: `
    <p>We often think of sleep as just "rest" after a long day, but the truth is—it's so much more than that. Sleep isn't a luxury; it's a foundation. Just like food and exercise, good sleep is one of the strongest pillars of mental health.</p>
    
    <h2><strong>Why Sleep Matters for the Mind</strong></h2>
    <p>When you sleep, your brain does its own kind of housekeeping. It processes the day's experiences, strengthens memories, balances your emotions, and clears out mental "clutter." Without enough sleep, stress feels heavier, problems seem bigger, and emotions hit harder.</p>
    <p>Ever noticed how everything feels worse after a night of tossing and turning? That's because poor sleep directly affects mood, focus, and even how well you handle anxiety or sadness.</p>
    <br>

    <h2><strong>The Link Between Sleep and Mental Health</strong></h2>
    <ul>
      <li><strong>Stress and Anxiety:</strong> Lack of sleep makes the brain more reactive, which means stress feels harder to manage.</li>
      <li><strong>Depression:</strong> Poor sleep patterns are often linked with low mood and emotional exhaustion.</li>
      <li><strong>Focus and Clarity:</strong> Without rest, concentration drops, and even simple tasks feel overwhelming.</li>
    </ul>
    <p>Sleep doesn't just "fix tiredness"—it strengthens resilience, giving your mind the tools to handle daily challenges better.</p>
    <br>

    <h2><strong>Tips for Better Sleep</strong></h2>
    <ul>
      <li><strong>Keep a Routine –</strong> Try to sleep and wake up at the same time each day. Your body loves consistency.</li>
      <li><strong>Limit Screen Time at Night –</strong> The blue light from phones tricks your brain into thinking it's still daytime.</li>
      <li><strong>Create a Calm Environment –</strong> A cool, dark, and quiet room makes it easier for your body to slip into deep rest.</li>
      <li><strong>Wind Down Gently –</strong> Swap late-night scrolling for a book, calming music, or light stretching.</li>
      <li><strong>Watch Caffeine and Sugar –</strong> Especially in the evening, as they keep your brain wired.</li>
    </ul>
    <br>

    <h2><strong>Final Thought</strong></h2>
    <p>Sleep isn't just "time off." It's an active, essential process that keeps your mind balanced, emotions steady, and thoughts clear. If you're working on improving your mental health, start with sleep—it's the secret pillar that supports everything else.</p>
    <br>
  `,
  },
  "journaling-for-clarity": {
    title: "Journaling for Clarity: Turning Thoughts Into Healing Words",
    date: "March 19, 2024",
    category: "Self-Care",
    image: "/chatjournal.jpeg",
    content: `
    <p>Have you ever felt like your mind was carrying too many tabs open at once? Thoughts jumping from one worry to another, making it hard to focus or breathe? That's where journaling quietly steps in—not as a fancy self-help trick, but as a simple, grounding practice that gives your thoughts a home outside your head.</p>
    
    <h2><strong>Why Journaling Works</strong></h2>
    <p>Our minds are powerful, but they can also be messy. When we keep everything inside—stress, emotions, ideas, fears—they pile up and often feel heavier than they actually are. Writing things down allows you to untangle that mental knot. Suddenly, what felt overwhelming becomes words on paper, something you can see, read, and process more clearly.</p>
    <p>Think of it this way: journaling doesn't erase your problems, but it gives them structure. Once written, thoughts stop running in circles and start making sense.</p>
    <br>

    <h2><strong>The Healing Power of Words</strong></h2>
    <p>Journaling isn't just about documenting your day; it's about healing through honesty. When you write without judgment, you create a safe space to release emotions you may not feel comfortable sharing aloud. Anger, sadness, confusion, hope—everything has a place on the page.</p>
    <p>Over time, this practice helps you notice patterns in your thoughts and feelings. Maybe you see how certain habits fuel your stress or how small victories bring unexpected joy. Awareness is the first step toward change, and journaling helps you get there gently.</p>
    <br>

    <h2><strong>How to Start (Without Overthinking It)</strong></h2>
    <ul>
      <li><strong>Start small –</strong> Even a few sentences a day can work wonders.</li>
      <li><strong>Be honest –</strong> This journal is yours; no one else is reading it.</li>
      <li><strong>Don't edit yourself –</strong> Let the words flow; clarity comes later.</li>
      <li><strong>Write how you feel –</strong> Not how you think you should feel.</li>
    </ul>
    <p>It could be as simple as: "I'm stressed today, but writing this makes me feel lighter." That's enough.</p>
    <br>

    <h2><strong>Journaling as Self-Care</strong></h2>
    <p>Think of journaling as talking to a kind friend—only that friend is you. With time, your journal becomes a safe record of your growth, your struggles, and your healing. On difficult days, you can look back and see how far you've come. On good days, it reminds you to celebrate small joys.</p>
    <p>Clarity doesn't always come immediately, but with every word, you're moving closer to understanding yourself better.</p>
    <br>
  `,
  },
  "creativity-mental-health-link": {
    title: "The Hidden Link Between Creativity and Mental Health",
    date: "March 26, 2024",
    category: "Expression",
    image: "/Creativity.jpeg",
    content: `
    <p>When people think of creativity, they often imagine art, music, or writing. But creativity isn't limited to artists—it's the way we solve problems, express emotions, and bring new ideas to life. What's fascinating is how deeply creativity connects to our mental health. Sometimes, it acts like a bridge between what we feel and how we heal.</p>
    
    <h2><strong>Creativity as Emotional Release</strong></h2>
    <p>Have you ever noticed how doodling on a page, humming a tune, or even cooking something new makes you feel lighter? That's because creativity offers an outlet. When emotions—stress, sadness, even joy—don't have a clear place to go, they build up inside us. Creative expression releases that pressure in a safe and meaningful way.</p>
    <p>For many, painting a picture, writing in a journal, or simply rearranging a room isn't about the result—it's about the relief that comes during the process. It's a conversation between your inner world and the outer one.</p>
    <br>

    <h2><strong>The Mental Health Benefits of Creative Expression</strong></h2>
    <p>Science has started to back up what many of us already feel: creativity is good for the brain. Activities like drawing, playing music, or writing reduce stress hormones and can even boost dopamine, the chemical that helps regulate mood and motivation.</p>
    <ul>
      <li><strong>Reduces anxiety and stress:</strong> Creative tasks shift focus away from constant worries.</li>
      <li><strong>Improves self-awareness:</strong> When you express yourself, you uncover feelings you might not have realized were there.</li>
      <li><strong>Boosts resilience:</strong> Engaging in creativity builds patience, adaptability, and problem-solving skills—qualities essential for mental well-being.</li>
    </ul>
    <br>

    <h2><strong>But There's Another Side</strong></h2>
    <p>It's no secret that many great artists, writers, and innovators have battled mental health struggles. While creativity can be healing, it can also sometimes reflect inner turmoil. The important thing to understand is that mental health challenges don't create creativity—rather, creativity becomes a way to cope with or understand them.</p>
    <br>

    <h2><strong>How to Use Creativity for Your Own Well-Being</strong></h2>
    <p>You don't have to be an "artist" to benefit from creativity. The point is not perfection; it's expression. Here are simple ways to tap into it:</p>
    <ul>
      <li><strong>Keep a doodle or idea journal –</strong> No rules, just let thoughts and sketches flow.</li>
      <li><strong>Try mindful creativity –</strong> Paint, cook, or craft with full attention on the process.</li>
      <li><strong>Mix creativity with routine –</strong> Write a poem instead of a to-do list, or add a splash of color to your notes.</li>
      <li><strong>Share, if you feel ready –</strong> Sometimes, letting others see your work adds connection and validation.</li>
    </ul>
    <br>

    <h2><strong>Final Thoughts</strong></h2>
    <p>Creativity isn't a cure-all, but it's a powerful companion in the journey toward better mental health. It helps you process emotions, discover hidden strengths, and find meaning in moments that feel overwhelming.</p>
    <p>So the next time life feels heavy, pick up a pen, brush, or instrument—not to impress anyone, but simply to heal.</p>
    <br>
  `,
  },
  "resilience-building": {
    title: "Resilience Building: How to Bounce Back from Setbacks Stronger",
    date: "April 2, 2024",
    category: "Growth",
    image: "/Resilience.png",
    content: `
    <p>No matter who we are, life throws challenges our way. Sometimes it's a personal struggle, a career setback, a failed relationship, or simply a time when things don't go as planned. In those moments, it's easy to feel stuck, defeated, or even hopeless. But the truth is—setbacks are not the end of the story. They are chapters that shape us, test us, and give us the chance to grow. The skill that helps us rise again is called resilience.</p>
    
    <h2><strong>What Exactly Is Resilience?</strong></h2>
    <p>Resilience is not about being "tough" all the time or pretending pain doesn't exist. It's the ability to adapt, recover, and find a way forward, even when life knocks us down. Think of resilience like a rubber band—it stretches, bends, and sometimes feels pulled to the limit, but it bounces back.</p>
    <p>Just like a muscle, resilience can be built and strengthened. The more you practice it, the better you become at handling challenges without losing hope.</p>
    <br>

    <h2><strong>Why Setbacks Hurt But Help</strong></h2>
    <p>It's natural to dislike failure or loss. But what if setbacks are not roadblocks, but detours that lead us to better places?</p>
    <p>Here's what setbacks can teach us:</p>
    <ul>
      <li><strong>Growth comes from discomfort –</strong> We learn more from failure than from easy success.</li>
      <li><strong>Self-discovery –</strong> Hard times often reveal strengths we didn't know we had.</li>
      <li><strong>Problem-solving skills –</strong> Every challenge forces us to think in new ways.</li>
      <li><strong>Perspective –</strong> What feels like the end today may look like a turning point tomorrow.</li>
    </ul>
    <p>Think of a seed: it has to push through the dark soil before it can reach the sunlight. Setbacks work the same way—they prepare us for growth.</p>
    <br>

    <h2><strong>Practical Ways to Build Resilience</strong></h2>
    <ul>
      <li><strong>Shift Your Mindset –</strong> Instead of asking, "Why is this happening to me?" try asking, "What can this teach me?" This small change helps you move from feeling powerless to feeling capable of growth.</li>
      <li><strong>Stay Connected –</strong> Humans aren't meant to go through struggles alone. Talking to friends, family, or mentors gives comfort, perspective, and support when you need it most. Even sharing small worries helps lighten the load.</li>
      <li><strong>Take Care of Your Body –</strong> It may sound simple, but sleep, exercise, and nutrition affect how well we handle stress. A healthy body gives you a stronger foundation for a healthy mind.</li>
      <li><strong>Set Small, Achievable Goals –</strong> When life feels overwhelming, focus on the next small step instead of the entire mountain. Step by step, progress adds up—and builds confidence along the way.</li>
      <li><strong>Practice Gratitude and Mindfulness –</strong> Even during tough times, pausing to notice small positives (a kind word, a quiet walk, a good meal) can shift your mindset. Gratitude reminds you that life still has balance.</li>
      <li><strong>Accept What You Can't Control –</strong> Not everything is in your hands—and that's okay. Resilience grows when we stop fighting uncontrollable situations and instead focus on what is within our power.</li>
    </ul>
    <br>

    <h2><strong>Bouncing Back Stronger</strong></h2>
    <p>Resilience doesn't erase pain or hardship—it helps us carry it differently. It allows us to turn wounds into wisdom and setbacks into stepping stones. Each time you face difficulty and rise again, you build inner strength and confidence that will carry you through future challenges.</p>
    <p>Remember: resilience doesn't mean never falling. It means refusing to stay down.</p>
    <br>
  `,
  },
  "mental-health-and-connection": {
    title: "When Mental Health Makes Connections Harder: Anxiety, Overthinking, and Social Awkwardness",
    date: "April 9, 2024",
    category: "Anxiety",
    image: "/Connections.jpeg",
    content: `
    <p>Mental health doesn't always shout loudly. Sometimes, it shows up in the quiet little habits we don't even talk about.</p>
    <p>Like when you avoid answering calls because typing a message feels safer. Or when a harmless joke from a friend keeps playing in your mind again and again, even though they probably forgot about it five minutes later. Or when you step into a group and suddenly don't know what to say, so you stay quiet and hope nobody notices.</p>
    <p>These moments may seem small, but they're not. They add up. And when they keep repeating, they can make life feel heavier than it should be.</p>
    <br>

    <h2><strong>Why We Feel This Way</strong></h2>
    <p>For many people, social situations create pressure. Our brain starts overanalyzing simple things — "Did I sound weird?" "Was that laugh too much?" "Do they even like me?" Instead of enjoying the moment, we end up fighting an inner storm of thoughts.</p>
    <p>It's not that we dislike people. It's just that connection feels risky, and our minds sometimes make everyday interactions feel like challenges. Over time, we might even look "introverted" or "reserved," when in reality, we're just trying to protect our peace.</p>
    <br>

    <h2><strong>The Hidden Toll on Mental Health</strong></h2>
    <ul>
      <li><strong>Anxiety builds up –</strong> answering a call feels harder than it should, meeting new people feels like climbing a mountain.</li>
      <li><strong>Loneliness grows –</strong> avoiding connections means missing out on bonds we secretly crave.</li>
      <li><strong>Overthinking drains energy –</strong> replaying small moments keeps us stuck, even when nothing bad really happened.</li>
      <li><strong>Self-doubt creeps in –</strong> we start believing we're "too awkward" or "not enough."</li>
    </ul>
    <p>And all of this isn't just "being shy" — it's a real mental health struggle that many face silently.</p>
    <br>

    <h2><strong>Gentle Ways to Cope</strong></h2>
    <p>The good news is, you don't need to change overnight or force yourself into uncomfortable situations. Healing can start with the smallest steps:</p>
    <ul>
      <li><strong>Choose texts if calls feel heavy –</strong> it's okay to communicate in ways that feel safer. Progress is progress.</li>
      <li><strong>Challenge the loop –</strong> when your brain replays a joke or comment, remind yourself: "People move on faster than I think."</li>
      <li><strong>Celebrate tiny wins –</strong> speaking up once, joining a conversation, or answering a call — these are victories.</li>
      <li><strong>Find your safe people –</strong> one or two friends who feel comfortable can be enough to remind you that connection can be easy.</li>
      <li><strong>Be kind to yourself –</strong> social awkwardness doesn't make you less worthy. It makes you human.</li>
    </ul>
    <br>

    <h2><strong>The Hopeful Truth</strong></h2>
    <p>If you ever feel anxious about calls, hesitant to meet new people, or stuck replaying small interactions, you're not alone. Many go through the same, even if they don't show it.</p>
    <p>Your mental health journey doesn't mean avoiding connections forever. It means learning how to take care of your mind while slowly, gently opening up to the world around you.</p>
    <p>So take it slow. Send that text. Share that thought. Laugh even if it feels awkward.</p>
    <p>Because connection isn't about being perfect — it's about being real. And the right people will always see you for who you are, not for the doubts running through your head.</p>
    <br>
  `,
  },
  "silence-and-solitude": {
    title: "Silence and Solitude: Why Doing Nothing is Sometimes Everything",
    date: "April 16, 2024",
    category: "Mindfulness",
    image: "/Silence.png",
    content: `
    <p>In today's world, we are always rushing. Notifications ping, deadlines pile up, and even our free time often gets filled with scrolling, streaming, or multitasking. Somewhere in this noise, silence and solitude have started to feel uncomfortable—even strange. But here's the truth: taking time to be alone, doing absolutely nothing, is not wasted time. In fact, it might be one of the most healing things you can give yourself.</p>
    <br>

    <h2><strong>Why Silence Feels So Unusual</strong></h2>
    <p>Most of us are so used to constant stimulation that silence feels awkward. When we sit quietly, our mind starts racing: What should I be doing? Am I wasting time? But this restlessness is exactly why we need silence. It gives us the chance to step away from the noise of the outside world and listen to what's happening inside.</p>
    <br>

    <h2><strong>The Hidden Power of Solitude</strong></h2>
    <p>Solitude isn't loneliness. Loneliness is the pain of feeling disconnected from others, while solitude is the gift of reconnecting with yourself.</p>
    <p>In solitude, you can:</p>
    <ul>
      <li><strong>Hear your own thoughts</strong> without interruption.</li>
      <li><strong>Reflect</strong> on your feelings and choices.</li>
      <li><strong>Recharge your energy</strong> without outside pressure.</li>
      <li><strong>Discover clarity</strong> that often gets lost in the busyness of life.</li>
    </ul>
    <p>Think of solitude as a quiet room where your mind can finally breathe.</p>
    <br>

    <h2><strong>Why Doing Nothing Is Actually Productive</strong></h2>
    <p>It may sound strange, but "doing nothing" can be deeply productive for your mind. When you stop forcing yourself to always act, create, or respond, your brain gets a chance to reset.</p>
    <p>Here's what happens in moments of stillness:</p>
    <ul>
      <li><strong>Stress levels drop –</strong> Silence calms your nervous system.</li>
      <li><strong>Ideas surface –</strong> Some of the best insights come when you're not actively thinking.</li>
      <li><strong>Emotions process –</strong> Quiet time lets you face feelings instead of running from them.</li>
      <li><strong>Focus improves –</strong> After solitude, you return to tasks with more clarity.</li>
    </ul>
    <p>In other words, rest is not the opposite of productivity—it fuels it.</p>
    <br>

    <h2><strong>How to Embrace Silence and Solitude in Daily Life</strong></h2>
    <p>You don't have to escape to the mountains to find solitude. Even small moments of stillness can make a difference:</p>
    <ul>
      <li><strong>Morning pause –</strong> Before picking up your phone, sit quietly for a few minutes and breathe.</li>
      <li><strong>Tech-free breaks –</strong> Put your devices away and just be with yourself.</li>
      <li><strong>Solo walks –</strong> A short walk without music or podcasts lets your thoughts settle.</li>
      <li><strong>Mindful sitting –</strong> Sit by a window or in your room and notice the world without judgment.</li>
      <li><strong>Evening reflection –</strong> Write down a thought, a feeling, or simply sit in silence before bed.</li>
    </ul>
    <br>

    <h2><strong>Final Thoughts</strong></h2>
    <p>Silence and solitude are not empty—they are full. They hold space for healing, reflection, and growth. In a world that celebrates busyness, choosing stillness is a radical act of self-care.</p>
    <p>So next time you feel guilty for "doing nothing," remind yourself: sometimes, doing nothing is exactly what your mind and heart need the most.</p>
    <br>
  `,
  },

}

// Generate static paths
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

// Blog Post Page Component
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  // Related blogs (excluding current)
  // Get all other blogs excluding the current one
const allOtherBlogs = Object.entries(blogPosts)
  .filter(([slug]) => slug !== params.slug)
  .map(([slug, blog]) => ({
    id: slug,
    title: blog.title,
    image: blog.image,
    date: blog.date,
  }));

// Shuffle the blogs randomly and take only 3
const relatedBlogs = allOtherBlogs
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

  return (
     <div className="min-h-screen bg-gray-50">
    {/* Reduced container padding significantly for mobile */}
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 lg:gap-6">
        {/* Blog Article */}
        <article className="bg-white rounded-lg lg:rounded-2xl shadow-sm overflow-hidden">
          {/* Hero Image - Reduced aspect ratio on mobile */}
          <div className="aspect-[16/9] sm:aspect-video relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content - Significantly reduced padding on mobile */}
          <div className="p-3 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
              <span>{post.date}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              {post.title}
            </h1>

            <div
              className="prose prose-sm sm:prose lg:prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-p:mb-3 prose-headings:mb-3 prose-headings:mt-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Social Share Buttons - Reduced spacing */}
            <div className="flex items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
              <span className="text-sm text-slate-600">Share:</span>
              <div className="flex gap-2">
                <a href="https://www.facebook.com/" className="w-8 h-8 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-600 transition-colors">
                  f
                </a>
                <a href="https://twitter.com/" className="w-8 h-8 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center hover:bg-gray-800 transition-colors">
                  x
                </a>
                <a href="https://www.linkedin.com/" className="w-8 h-8 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-700 transition-colors">
                  in
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar: Other Blogs - Hidden on mobile, compact on desktop */}
        <aside className="hidden lg:block space-y-4">
          {/* Other Blogs Section */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Other Blogs</h3>
            <div className="space-y-3">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border hover:border-blue-400"
                >
                  <div className="w-full h-32 relative">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-1">{blog.date}</p>
                    <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                      {blog.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Back to All Blogs Button */}
          <Link
            href="/blogs"
            className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-center font-medium text-sm hover:shadow-lg transition-shadow"
          >
            ← Back to All Blogs
          </Link>
        </aside>
      </div>

      {/* Mobile-only related blogs section */}
      <div className="lg:hidden mt-4 bg-white rounded-lg shadow-sm p-3">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Other Blogs</h3>
        <div className="grid grid-cols-1 gap-3">
          {relatedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="flex gap-3 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border hover:border-blue-400 p-2"
            >
              <div className="w-20 h-16 relative flex-shrink-0">
                <Image
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{blog.date}</p>
                <h4 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
                  {blog.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile Back Button */}
        <Link
          href="/blogs"
          className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-center font-medium text-sm hover:shadow-lg transition-shadow mt-4"
        >
          ← Back to All Blogs
        </Link>
      </div>
    </div>
    </div>
  );
}