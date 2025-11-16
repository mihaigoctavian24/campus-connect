'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ApplyModalProps {
  opportunityTitle: string;
}

export function ApplyModal({ opportunityTitle }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    motivation: '',
    availability: '',
    experience: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the actual submission logic
    setStep('success');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('form');
      setFormData({ motivation: '', availability: '', experience: '' });
    }, 300);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg bg-[gold] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[gold]/90"
      >
        Apply Now →
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="size-5" />
        </button>

        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Apply Now</h2>
              <p className="text-gray-500">{opportunityTitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Motivation */}
              <div>
                <label
                  htmlFor="motivation"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  Why are you interested in this opportunity? *
                </label>
                <textarea
                  id="motivation"
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                  placeholder="Tell us what motivates you to apply..."
                />
              </div>

              {/* Availability */}
              <div>
                <label
                  htmlFor="availability"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  What is your availability? *
                </label>
                <textarea
                  id="availability"
                  required
                  rows={3}
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                  placeholder="e.g., Monday-Friday 2-5pm, flexible weekends..."
                />
              </div>

              {/* Relevant Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  Relevant experience (optional)
                </label>
                <textarea
                  id="experience"
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                  placeholder="Any relevant skills, coursework, or previous volunteer experience..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-[#001f3f] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[gold] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[gold]/90"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="py-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="size-10 text-green-600" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-medium text-[#001f3f]">Application Submitted!</h2>
              <p className="mb-8 text-gray-600">
                Thank you for applying to {opportunityTitle}. We&apos;ll review your application and
                get back to you within 5-7 business days.
              </p>
              <button
                onClick={handleClose}
                className="rounded-lg bg-[gold] px-8 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[gold]/90"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
