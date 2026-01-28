// Achievement.jsx - Product Grade Alumni Achievements
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Building, Users, Globe, Quote, Briefcase, Star, ArrowRight } from "lucide-react";

// Animated Counter Component - all counters sync to 3 seconds
const AnimatedCounter = ({ value, duration = 3000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse the value to extract number and suffix (e.g., "5000+" -> 5000, "+")
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  
  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * numericValue);
      
      setCount(currentCount);
      
      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(numericValue);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [isInView, numericValue, duration]);
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Achievement = () => {
  const alumniAchievements = [
    {
      name: "Rahul Sharma",
      achievement: "Contributed to large-scale cloud solutions at Amazon",
      company: "Amazon",
      src: "src/assets/amazon.png",
      quote: "My education here prepared me for the challenges of working at a top tech company.",
      year: "2018",
      role: "Senior Cloud Architect"
    },
    {
      name: "Priya Verma",
      achievement: "Pursuing MS in AI at Stanford University",
      company: "Stanford University",
      src: "src/assets/tcs.jpeg",
      quote: "The research opportunities I got were invaluable for my academic journey.",
      year: "2019",
      role: "Research Scholar"
    },
    {
      name: "Arjun Nair",
      achievement: "Founded a Robotics Startup (AI Innovators Pvt Ltd.)",
      company: "AI Innovators",
      src: "src/assets/oracle.png",
      quote: "The entrepreneurial ecosystem here helped me turn my ideas into reality.",
      year: "2017",
      role: "Founder & CEO"
    },
    {
      name: "Sneha Patel",
      achievement: "Awarded 'Best Innovator 2024' at TCS",
      company: "TCS",
      src: "src/assets/tcs.jpeg",
      quote: "The industry connections I made during my studies were crucial for my career.",
      year: "2020",
      role: "Innovation Lead"
    },
  ];

  const companies = [
    { name: "TCS", src: "src/assets/tcs.jpeg" },
    { name: "Amazon", src: "src/assets/amazon.png" },
    { name: "Autodesk", src: "src/assets/autodesk.png" },
    { name: "Oracle", src: "src/assets/oracle.png" },
    { name: "State Street", src: "src/assets/state street.png" },
    { name: "L&T", src: "src/assets/L&T.png" },
    { name: "TCS", src: "src/assets/tcs.jpeg" },
    { name: "Amazon", src: "src/assets/amazon.png" },
    { name: "Autodesk", src: "src/assets/autodesk.png" },
    { name: "Oracle", src: "src/assets/oracle.png" },
  ];

  const testimonials = [
    {
      name: "Vikram Mehta",
      role: "Senior Engineer at Google",
      batch: "2016",
      quote: "The alumni network has been instrumental in my career growth. The connections I made here opened doors I never imagined possible.",
      rating: 5
    },
    {
      name: "Ananya Reddy",
      role: "Data Scientist at Microsoft",
      batch: "2019",
      quote: "The practical exposure and industry collaborations during my studies gave me a competitive edge in the job market.",
      rating: 5
    },
    {
      name: "Rajiv Kapoor",
      role: "Founder of TechVentures",
      batch: "2015",
      quote: "The mentorship and resources available to students are exceptional. They truly prepare you for real-world challenges.",
      rating: 5
    },
    {
      name: "Meera Krishnan",
      role: "Product Manager at Meta",
      batch: "2018",
      quote: "The diverse curriculum and hands-on projects gave me a strong foundation for my career in tech.",
      rating: 5
    },
    {
      name: "Aditya Singh",
      role: "CTO at FinTech Startup",
      batch: "2014",
      quote: "The entrepreneurship cell and startup culture here inspired me to build my own company.",
      rating: 5
    },
    {
      name: "Pooja Sharma",
      role: "AI Research Lead at NVIDIA",
      batch: "2017",
      quote: "The research labs and faculty mentorship were crucial in shaping my career in artificial intelligence.",
      rating: 5
    },
  ];

  const stats = [
    { number: "5000+", label: "Alumni Worldwide", icon: Users, color: "primary" },
    { number: "200+", label: "Partner Companies", icon: Building, color: "secondary" },
    { number: "95%", label: "Placement Rate", icon: Award, color: "accent" },
    { number: "50+", label: "Countries", icon: Globe, color: "info" },
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Alumni Success Stories
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
              Where Our Alumni
              <br />
              <span className="text-primary">Make an Impact</span>
            </h1>
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto mb-8">
              Discover the remarkable journeys of our graduates who are leading innovation 
              and driving change across industries worldwide.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/directory" className="btn btn-primary gap-2">
                <Users className="w-4 h-4" />
                Browse Directory
              </Link>
              <button 
                onClick={() => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-ghost gap-2"
              >
                View Achievements
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-base-300 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-base-content mb-1">
                    <AnimatedCounter value={stat.number} duration={1500} />
                  </div>
                  <div className="text-sm text-base-content/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Marquee */}
      <section className="py-12 bg-base-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <p className="text-center text-base-content/50 text-sm uppercase tracking-wider">
            Our alumni work at leading companies worldwide
          </p>
        </div>
        <div className="relative">
          <div className="flex animate-marquee">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
              >
                <img
                  src={company.src}
                  alt={company.name}
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Featured Achievements */}
      <section id="achievements" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-base-content pb-2 border-b-2 border-primary inline-block">
              Featured Alumni
            </h2>
          </motion.div>

          <div className="space-y-3">
            {alumniAchievements.map((alum, index) => (
              <motion.article
                key={alum.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-base-100 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="avatar placeholder shrink-0">
                    <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                      <span className="text-sm font-medium">{getInitials(alum.name)}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base-content">{alum.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-base-200 text-base-content/70">
                        {alum.year}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 mt-0.5">
                      {alum.role} at {alum.company}
                    </p>
                  </div>

                  {/* Achievement */}
                  <div className="hidden md:block flex-1 max-w-sm">
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {alum.achievement}
                    </p>
                  </div>

                  {/* Quote on hover tooltip */}
                  <div className="tooltip tooltip-left hidden lg:block" data-tip={`"${alum.quote}"`}>
                    <div className="p-2 rounded-lg bg-base-200 text-base-content/50">
                      <Quote className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Mobile Achievement */}
                <div className="md:hidden mt-3 pt-3 border-t border-base-200">
                  <p className="text-sm text-base-content/70">{alum.achievement}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-base-content mb-2">
              What Our Alumni Say
            </h2>
            <p className="text-base-content/60">
              Hear from our graduates about their experiences and journeys
            </p>
          </motion.div>
        </div>

        {/* Testimonials Marquee - Row 1 (Left to Right) */}
        <div className="relative overflow-hidden mb-6">
          <div className="flex animate-testimonial-marquee">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 w-96 mx-3"
              >
                <div className="bg-base-200 rounded-2xl p-5 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-11 h-11">
                        <span className="text-sm font-medium">{getInitials(testimonial.name)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-base-content/60">{testimonial.role}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded bg-base-300 text-xs text-base-content/60">
                      '{testimonial.batch.slice(-2)}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Marquee - Row 2 (Right to Left) */}
        <div className="relative overflow-hidden">
          <div className="flex animate-testimonial-marquee-reverse">
            {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((testimonial, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 w-96 mx-3"
              >
                <div className="bg-base-200 rounded-2xl p-5 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-11 h-11">
                        <span className="text-sm font-medium">{getInitials(testimonial.name)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-base-content/60">{testimonial.role}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded bg-base-300 text-xs text-base-content/60">
                      '{testimonial.batch.slice(-2)}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes testimonial-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes testimonial-marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-testimonial-marquee {
            animation: testimonial-marquee 40s linear infinite;
          }
          .animate-testimonial-marquee-reverse {
            animation: testimonial-marquee-reverse 40s linear infinite;
          }
          .animate-testimonial-marquee:hover,
          .animate-testimonial-marquee-reverse:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Placement Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-base-content pb-2 border-b-2 border-primary inline-block">
              Placement Partners
            </h2>
            <p className="text-base-content/60 mt-4 max-w-2xl">
              Our alumni are placed at some of the world's most innovative companies.
            </p>
          </motion.div>

          <div className="bg-base-100 rounded-2xl p-8">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
              {companies.slice(0, 6).map((company, index) => (
                <motion.div
                  key={`partner-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-center p-4 rounded-xl hover:bg-base-200 transition-colors group"
                >
                  <img
                    src={company.src}
                    alt={company.name}
                    className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `<span class="text-base-content/40 font-medium">${company.name}</span>`;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral text-neutral-content rounded-2xl p-8 md:p-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join Our Growing Alumni Network
              </h2>
              <p className="text-neutral-content/80 mb-8 max-w-xl mx-auto">
                Connect with fellow alumni, mentor current students, and be part of a community 
                that's shaping the future.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/register" className="btn btn-primary gap-2">
                  <Users className="w-4 h-4" />
                  Register Now
                </Link>
                <Link to="/directory" className="btn btn-ghost gap-2">
                  <Briefcase className="w-4 h-4" />
                  Explore Directory
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Achievement;
