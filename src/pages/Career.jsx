import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

const jobs = [
    {
        title: "Java Full Stack Developer",
        exp: "5-10 years",
        type: "Full Time",
        location: "Noida"
    },
    {
        title: "Mainframe COBOL Developers",
        exp: "5-10 years",
        type: "Full Time",
        location: "Noida"
    },
    {
        title: "Technical Architect",
        exp: "10-12 years",
        type: "Full Time",
        location: "Noida"
    },
    {
        title: "Business Analyst (Payments)",
        exp: "10-12 years",
        type: "Full Time",
        location: "Noida"
    },
    {
        title: "Management Trainees",
        exp: "Fresher - 2 years",
        type: "Full Time",
        location: "Noida"
    }
];

const Career = () => {
    return (
        <div className="bg-primary-dark min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-text-main mb-6"
                    >
                        Join Our Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-muted max-w-3xl mx-auto"
                    >
                        At Tech Advance Global Solutions, we’re building more than just technology—we’re building a team of thinkers, doers, and innovators.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-12">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-primary p-6 rounded-xl border border-primary-light hover:border-accent/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between group"
                        >
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-accent transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                    <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1" /> {job.exp}</span>
                                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {job.location}</span>
                                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {job.type}</span>
                                </div>
                            </div>
                            <Button to="/contact" variant="outline" className="shrink-0">
                                Apply Now
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-primary-light rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">Don't see a perfect fit?</h2>
                    <p className="text-text-muted mb-8 max-w-2xl mx-auto">
                        We are always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                    <Button to="/contact" variant="primary">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Career;
