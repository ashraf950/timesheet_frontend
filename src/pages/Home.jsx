import React from 'react';
import { ArrowRight, CheckCircle2, Cloud, Code2, Cpu, Globe, Layout, Zap, BarChart3, Users, ShieldCheck, Rocket } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
// import home1 from '../assets/home1.jpeg';
// import home2 from '../assets/home2.jpeg';


const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const Home = () => {
    return (
        <div className="flex flex-col w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        // src={home1}
                        // src={home2}
                        src={home3}
                        alt="Modern Office"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/80 to-primary-dark/40 z-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                We power business growth with <br />
                                <span className="text-accent">AI innovation</span>, scalable digital solutions, <br />
                                and exceptional global tech talent.
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                                TAGS helps companies build smarter, move faster, and unlock the engineering expertise they need to lead the future.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <Button to="/contact" variant="primary" className="text-lg px-8 py-4">
                                    Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button to="/services" variant="outline" className="text-lg px-8 py-4 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10">
                                    Our Services
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Us Section (Restored & Enhanced) */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6">About Us</h2>
                            <h3 className="text-xl font-semibold text-accent mb-6">Who We Are</h3>
                            <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                                <p>
                                    At Tech Advance Global Solutions, we are a dynamic IT startup driven by innovation and passion. Our core strength lies in building scalable, future-ready products while offering expert consulting and IT services tailored to our clients' needs.
                                </p>
                                <p>
                                    We aspire to become a global leader in AI-driven solutions, strategic IT consulting, and specialized talent delivery, enabling organizations to transform challenges into opportunities.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                opacity: { duration: 0.8 },
                                scale: { duration: 0.8 },
                                y: {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            animate={{ y: [0, -20, 0] }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent to-blue-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Team Collaboration"
                                className="relative rounded-2xl shadow-2xl border border-primary-light/50 w-full object-cover hover:scale-[1.02] transition-transform duration-500"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Agile Process Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4">Our Agile Digital Transformation Process</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We follow the Agile methodology to deliver high-quality software quickly and iteratively.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Short Development Cycles",
                                desc: "Quick sprints ensure faster feedback and continuous improvement.",
                                icon: Zap
                            },
                            {
                                title: "Continuous Collaboration",
                                desc: "Partnering with clients to refine and improve solutions continuously.",
                                icon: Users
                            },
                            {
                                title: "Regular Testing",
                                desc: "Frequent reviews help identify issues early and improve performance.",
                                icon: CheckCircle2
                            },
                            {
                                title: "Faster Time to Market",
                                desc: "Streamlined processes reduce delivery time and speed up release cycles.",
                                icon: Rocket
                            },
                            {
                                title: "Flexibility to Adapt",
                                desc: "Easily accommodating changes without disrupting progress.",
                                icon: Layout
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                                    <item.icon className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-primary-dark mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-6">Our Services</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Tech Advance has translated its understanding of business perspective by investing and building best-in-class digital products and platforms.
                            </p>
                            <Button to="/services" variant="primary">
                                View All Services
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Cloud Solutions", icon: Cloud },
                                { title: "Web & Mobile Apps", icon: Globe },
                                { title: "Ecommerce", icon: BarChart3 },
                                { title: "Talent Acquisition", icon: Users },
                            ].map((service, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <service.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <span className="font-semibold text-primary-dark">{service.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Cloud",
                                desc: "Leverage high-performance, scalable, and user-friendly web applications designed for your business.",
                                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                            },
                            {
                                title: "Web & Mobile Applications",
                                desc: "Harness the power of cloud technology to deliver scalable, secure, and high-performance solutions.",
                                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop"
                            },
                            {
                                title: "Talent Acquisition",
                                desc: "We hire top-tier developers and build dedicated engineering teams for your company, ensuring you have the right expertise to scale.",
                                image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative overflow-hidden rounded-2xl h-80"
                            >
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/50 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                    <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {service.desc}
                                    </p>
                                    <span className="text-accent font-semibold text-sm flex items-center">
                                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us / Team Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-6">Our Team Makes the <span className="text-accent">DIFFERENCE</span></h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-primary-dark mb-2">We Focus On Creativity</h3>
                                    <p className="text-gray-600">At Tech Advance, every voice matters. Blending creativity with AI and technology, we craft innovative digital solutions.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-primary-dark mb-2">Growth and Innovation</h3>
                                    <p className="text-gray-600">We nurture curiosity and encourage our team to embrace new ideas, technologies, and possibilities every day.</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Team Collaboration"
                                className="relative rounded-2xl shadow-2xl w-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {/* <section className="py-20 bg-primary-dark text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "40+", label: "Years of cumulative experience" },
                            { number: "10+", label: "Projects Delivered" },
                            { number: "4+", label: "Years Business Impact" },
                            { number: "45+", label: "Talent Pool" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
                                <div className="text-gray-400 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-6">Ready to get started?</h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Let's connect one-to-one for insight-driven business results.
                    </p>
                    <Button to="/contact" variant="primary" className="text-lg px-10 py-4 shadow-xl shadow-accent/20">
                        Get In Touch
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
