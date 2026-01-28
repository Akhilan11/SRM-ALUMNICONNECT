import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Code2, 
  Palette, 
  Shield, 
  GraduationCap,
  Heart,
  ExternalLink,
  Sparkles,
  Users,
  Cpu,
  Award,
  Zap,
  Coffee,
  GitCommit,
  Star,
  Clock,
  Rocket,
  Target,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (!isInView) return;
    
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    let start = 0;
    const increment = numValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration, isInView]);
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Team members data
const teamMembers = [
  {
    id: "abhishek-vinod",
      name: "Abhishek Vinod",
      role: "Lead Developer",
    team: "Full Stack",
    tech: ["React", "Firebase", "Framer Motion", "Node.js"],
    bio: "Full-stack developer specializing in modern web applications. Passionate about creating seamless user experiences and scalable architectures.",
      avatar: "https://abhishek-vinod.pages.dev/ak.jpeg",
      github: "https://github.com/AbhishekVinod-dev",
      linkedin: "https://linkedin.com/in/abhishek-vinod-",
    icon: Code2,
    color: "from-blue-500 to-cyan-400",
    contributions: "Architecture, Frontend, Backend, Database"
  },
  {
    id: "azhagan",
    name: "A. Azhagan",
      role: "UI/UX Designer",
      team: "Design",
    tech: ["Figma", "Tailwind CSS", "UI/UX", "Prototyping"],
    bio: "Creative designer focused on building intuitive and beautiful interfaces. Believes design should be both functional and delightful.",
    avatar: null,
      github: "http://github.com/azhaganarulselvan2-tech",
      linkedin: "https://www.linkedin.com/in/azhagan-a-962948386/",
    icon: Palette,
    color: "from-purple-500 to-pink-400",
    contributions: "UI Design, User Experience, Visual Identity"
  },
  {
    id: "vibeesh-velavan",
      name: "Vibeesh Velavan",
      role: "CyberSecurity Lead",
      team: "Security",
    tech: ["Security", "Authentication", "Firestore", "Encryption"],
    bio: "CyberSecurity specialist ensuring system reliability and data protection. Enjoys solving complex security challenges.",
    avatar: null,
      github: "https://github.com/michaelr",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
    icon: Shield,
    color: "from-emerald-500 to-teal-400",
    contributions: "Security Architecture, Auth Systems, Data Protection"
  },
  {
    id: "ashwini",
      name: "Ashwini C",
    role: "Project Mentor",
      team: "Mentorship",
    tech: ["Project Management", "Architecture", "Code Review"],
    bio: "Mentor with comprehensive understanding of software ecosystems. Guides the team to think in systems, not just components.",
    avatar: null,
    github: null,
    linkedin: null,
    icon: GraduationCap,
    color: "from-amber-500 to-orange-400",
    contributions: "Technical Guidance, Architecture Review, Mentorship"
  }
];

// Stats data
const projectStats = [
  { label: "Lines of Code", value: "50000", suffix: "+", icon: Code2 },
  { label: "Components", value: "100", suffix: "+", icon: Cpu },
  { label: "Commits", value: "500", suffix: "+", icon: GitCommit },
  { label: "Hours of Work", value: "1200", suffix: "+", icon: Clock }
];

// Technologies
const technologies = [
  { name: "React 18", icon: "⚛️", desc: "UI Framework" },
  { name: "Firebase", icon: "🔥", desc: "Backend & Auth" },
  { name: "Tailwind CSS", icon: "🎨", desc: "Styling" },
  { name: "DaisyUI", icon: "🌼", desc: "Components" },
  { name: "Framer Motion", icon: "✨", desc: "Animations" },
  { name: "Vite", icon: "⚡", desc: "Build Tool" }
];

// Project milestones
const milestones = [
  { title: "Project Kickoff", desc: "Initial planning and architecture design", icon: Rocket },
  { title: "Core Features", desc: "Authentication, directory, and events", icon: Zap },
  { title: "Advanced Features", desc: "Chat, fundraising, and mentorship", icon: Star },
  { title: "Launch Ready", desc: "Testing, optimization, and deployment", icon: Target }
];

// Get initials from name
const getInitials = (name) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// Team Member Card Component
const TeamMemberCard = ({ member, index }) => {
  const Icon = member.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-xl hover:border-base-content/10 transition-all duration-500 h-full overflow-hidden">
        {/* Gradient top bar */}
        <div className={`h-1 bg-gradient-to-r ${member.color}`} />
        
        <div className="card-body p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative">
              {member.avatar ? (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                />
              ) : (
          <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                >
                  {getInitials(member.name)}
                </motion.div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-base-100 border-2 border-base-200 flex items-center justify-center shadow-sm">
                <Icon className="w-4 h-4 text-base-content/70" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-bold text-xl text-base-content mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-base-content/70">{member.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${member.color} text-white`}>
                  {member.team}
                </span>
                    </div>
                  </div>
                </div>

          {/* Bio */}
          <p className="text-sm text-base-content/60 leading-relaxed mb-4">
            {member.bio}
          </p>

          {/* Contributions */}
          <div className="mb-4">
            <p className="text-xs text-base-content/40 uppercase tracking-wider mb-2">Contributions</p>
            <p className="text-sm text-base-content/70">{member.contributions}</p>
                    </div>

                    {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {member.tech.map((tech, i) => (
                        <span 
                          key={i}
                className="px-2.5 py-1 text-xs bg-base-200/80 text-base-content/70 rounded-lg font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
          <div className="flex items-center gap-2 pt-4 border-t border-base-200">
            {member.github && (
                        <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                className="btn btn-sm btn-circle bg-base-200 hover:bg-base-300 border-0"
                        >
                <Github className="w-4 h-4" />
                        </motion.a>
                      )}
            {member.linkedin && (
                        <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                className="btn btn-sm btn-circle bg-base-200 hover:bg-base-300 border-0"
                        >
                <Linkedin className="w-4 h-4" />
                        </motion.a>
                      )}
            {!member.github && !member.linkedin && (
              <span className="text-xs text-base-content/40 italic">Project Mentor & Guide</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
  );
};

export default function Credits() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-base-100 rounded-full border border-base-300 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-base-content/70">The Team Behind The Platform</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6 leading-tight">
              Meet the <span className="relative">
                Creators
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full origin-left"
                />
              </span>
            </h1>
            <p className="text-base-content/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              A passionate team of developers, designers, and mentors who worked together to build this alumni platform from the ground up.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {projectStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-base-100 rounded-2xl p-5 border border-base-300 text-center group hover:shadow-lg hover:border-base-content/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-base-content/60" />
                  </div>
                  <div className="text-3xl font-bold text-base-content mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
                  <div className="text-xs text-base-content/50 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-3">Our Team</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">
            Four individuals, one vision — to create an exceptional platform for our alumni community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Project Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-3">Project Journey</h2>
            <p className="text-base-content/60 max-w-lg mx-auto">
              From concept to launch — the milestones that shaped this platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-base-100 rounded-2xl p-6 border border-base-300 h-full hover:shadow-lg hover:border-base-content/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-base-content/70" />
                      </div>
                      <span className="text-xs font-bold text-base-content/30">0{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-base-content mb-2">{milestone.title}</h3>
                    <p className="text-sm text-base-content/60">{milestone.desc}</p>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-base-content/20" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-base-100 shadow-sm border border-base-300 mb-16 overflow-hidden"
        >
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-base-content/60" />
                  Tech Stack
                </h2>
                <p className="text-sm text-base-content/60 mt-1">The technologies powering this platform</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {technologies.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-2 p-5 bg-base-200/50 rounded-2xl hover:bg-base-200 transition-all duration-300 cursor-default"
                >
                  <span className="text-3xl">{tech.icon}</span>
                  <span className="text-sm font-semibold text-base-content">{tech.name}</span>
                  <span className="text-xs text-base-content/50">{tech.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            
            <div className="card-body p-8 md:p-12 relative">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6"
                >
                  <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-base-content mb-4">
                  Built with Passion & Purpose
                </h3>
                <p className="text-base-content/60 mb-8 leading-relaxed">
                  This platform was crafted with care to help connect alumni, students, and faculty. 
                  Every feature was designed with our community in mind. We hope it serves you well.
                </p>
                
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <a
                    href="https://github.com/AbhishekVinod-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-neutral gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  
                  <div className="flex items-center gap-2 text-sm text-base-content/50">
                    <Coffee className="w-4 h-4" />
                    <span>Fueled by countless cups of coffee</span>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center justify-center mt-8">
                  <div className="flex -space-x-3">
                    {teamMembers.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full border-2 border-base-100 object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full border-2 border-base-100 bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <span className="ml-4 text-sm text-base-content/50">The Team</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-base-content/40 mt-8"
        >
          © {new Date().getFullYear()} Alumni Connect Platform. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
