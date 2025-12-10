import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic to send to backend would go here
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-800 mb-4">Get in Touch</h1>
          <p className="text-gray-600">Have questions about our AI models or need enterprise support?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Contact Info */}
          <div className="bg-agro-600 p-10 text-white">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <p className="text-agro-100 mb-8 leading-relaxed">
              We are dedicated to helping farmers worldwide. Reach out to us for direct support or partnership inquiries.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-agro-200 mt-1" />
                <div>
                  <p className="text-sm text-agro-200 uppercase font-semibold tracking-wider">Email</p>
                  <p className="text-lg">mitobiastech@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-agro-200 mt-1" />
                <div>
                  <p className="text-sm text-agro-200 uppercase font-semibold tracking-wider">Headquarters</p>
                  <p className="text-lg">Erode, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-agro-600 font-medium hover:text-agro-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input type="text" className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-3 focus:ring-2 focus:ring-agro-500 outline-none transition-shadow" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-3 focus:ring-2 focus:ring-agro-500 outline-none transition-shadow" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-3 focus:ring-2 focus:ring-agro-500 outline-none transition-shadow" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;