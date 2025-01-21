import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  step1: {
    projectType: string;
    budget: string;
    timeline: string;
  };
  step2: {
    companyName: string;
    industry: string;
    description: string;
  };
  step3: {
    name: string;
    email: string;
    phone?: string;
    preferredContact: string;
  };
};

export default function InquiryForm() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // Handle success (e.g., show success message, reset form)
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2>Project Details</h2>
            <select {...register("step1.projectType")}>
              <option value="website">Website</option>
              <option value="webapp">Web Application</option>
              <option value="mobile">Mobile App</option>
              <option value="other">Other</option>
            </select>
            {/* Add other step 1 fields */}
            <button onClick={() => setStep(2)}>Next</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2>Company Information</h2>
            <input {...register("step2.companyName")} placeholder="Company Name" />
            {/* Add other step 2 fields */}
            <button onClick={() => setStep(1)}>Previous</button>
            <button onClick={() => setStep(3)}>Next</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2>Contact Information</h2>
            <input {...register("step3.name")} placeholder="Your Name" />
            <input {...register("step3.email")} type="email" placeholder="Email" />
            {/* Add other step 3 fields */}
            <button onClick={() => setStep(2)}>Previous</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
} 