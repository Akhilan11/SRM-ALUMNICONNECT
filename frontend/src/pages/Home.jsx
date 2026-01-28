import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Briefcase, Calendar, Target, BookOpen, Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Seamless Networking",
      description: "Connect with fellow alumni, mentors, and industry professionals effortlessly.",
      icon: Users
    },
    {
      title: "Career Opportunities",
      description: "Find job postings, internships, and career guidance from experienced alumni.",
      icon: Briefcase
    },
    {
      title: "Event Management",
      description: "Stay updated with alumni events, reunions, and networking sessions.",
      icon: Calendar
    },
    {
      title: "Mentorship Programs",
      description: "Give back by mentoring current students and recent graduates.",
      icon: Target
    },
    {
      title: "Knowledge Sharing",
      description: "Share experiences, insights, and industry knowledge with the community.",
      icon: BookOpen
    },
    {
      title: "Fundraising Support",
      description: "Contribute to student scholarships and institutional development.",
      icon: Wallet
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Alumni" },
    { number: "500+", label: "Job Postings" },
    { number: "200+", label: "Events Hosted" },
    { number: "50+", label: "Mentorships" }
  ];

  return (
    <main className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-base-100">
        <div className="hero-content text-center py-16">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AlumniConnect
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-6 text-lg text-base-content/70 max-w-2xl mx-auto"
            >
              A modern platform built to strengthen the bond between graduates, students, 
              and institutions. Stay connected, network, and support the next generation 
              with ease.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <Link to="/directory" className="btn btn-primary btn-lg gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AlumniConnect?
              </span>
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
              Discover the features that make us the preferred platform for alumni communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="card-body">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary-content" />
                    </div>
                    <h3 className="card-title text-xl">{feature.title}</h3>
                    <p className="text-base-content/60">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl"
          >
            <div className="card-body p-10">
              <h2 className="text-3xl font-bold text-center mb-4">
                Why{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AlumniConnect?
                </span>
              </h2>
              <p className="text-base-content/70 leading-relaxed text-center max-w-3xl mx-auto mb-12">
                AlumniConnect provides a vibrant space for networking, mentorship, 
                and collaboration, making it easier for alumni to stay engaged with 
                their alma mater while empowering students with valuable insights.
              </p>
              
              <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="stat place-items-center"
                  >
                    <div className="stat-value bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="stat-desc text-base-content/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl"
          >
            <div className="card-body items-center text-center p-12">
              <h2 className="card-title text-3xl font-bold mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="mb-8 opacity-90 max-w-xl">
                Join thousands of alumni who are already connecting, sharing, and growing together.
              </p>
              <div className="card-actions flex-wrap justify-center gap-4">
                <Link to="/register" className="btn btn-lg bg-white text-primary hover:bg-white/90">
                  Sign Up Now
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline border-base-content text-base-content hover:bg-base-content/20">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
