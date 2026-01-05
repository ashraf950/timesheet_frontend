import React from 'react';
import { motion } from 'framer-motion';
import { Code, Settings, Briefcase, Layout, Users, Cloud, Brain, Bot, Sparkles, Database, Shield, Globe } from 'lucide-react';

const services = [
    {
        icon: <Brain className="h-8 w-8" />,
        title: "AI & Machine Learning",
        desc: "Custom AI models that learn from your data to predict trends, automate decisions, and optimize operations.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        icon: <Bot className="h-8 w-8" />,
        title: "Intelligent Automation",
        desc: "Deploy smart bots and RPA solutions to handle repetitive tasks, freeing your team for strategic work.",
        color: "text-accent",
        bg: "bg-accent/10"
    },
    {
        icon: <Sparkles className="h-8 w-8" />,
        title: "Generative AI Solutions",
        desc: "Leverage LLMs for content generation, code assistance, and personalized customer experiences.",
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    },
    {
        icon: <Code className="h-8 w-8" />,
        title: "Custom Software Development",
        desc: "Tailored software solutions designed to meet your unique business requirements and challenges.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: <Cloud className="h-8 w-8" />,
        title: "Cloud & DevOps",
        desc: "Modernizing infrastructure and streamlining development workflows for maximum efficiency and scalability.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
    },
    {
        icon: <Shield className="h-8 w-8" />,
        title: "Cybersecurity & Compliance",
        desc: "Protecting your digital assets with advanced security protocols and AI-driven threat detection.",
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        icon: <Database className="h-8 w-8" />,
        title: "Data Engineering",
        desc: "Building robust data pipelines and warehouses to turn raw data into actionable business intelligence.",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "Staffing & Augmentation",
        desc: "Connecting you with top-tier tech talent to scale your teams and capabilities on demand.",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        icon: <Globe className="h-8 w-8" />,
        title: "Digital Transformation",
        desc: "Holistic strategies to digitize your business processes and enhance customer engagement.",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const Services = () => {
    return (
        <div className="bg-primary-dark min-h-screen py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

                <div className="text-center mb-20 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-text-main mb-6"
                    >
                        Our <span className="text-accent">Expertise</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-muted max-w-3xl mx-auto"
                    >
                        Comprehensive technology solutions powered by AI and innovation to drive your business forward.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-primary/40 backdrop-blur-md p-8 rounded-2xl border border-primary-light hover:border-accent/50 transition-all duration-300 group shadow-lg hover:shadow-accent/10"
                        >
                            <div className={`h-16 w-16 ${service.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <div className={service.color}>{service.icon}</div>
                            </div>
                            <h3 className="text-2xl font-bold text-text-main mb-4 group-hover:text-accent transition-colors">{service.title}</h3>
                            <p className="text-text-muted leading-relaxed text-lg">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
