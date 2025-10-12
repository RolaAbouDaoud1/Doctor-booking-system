
export default function CTASection() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold text-balance">
        Ready to transform your healthcare experience?
      </h2>
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        Join thousands of patients and healthcare providers who trust
        HealthConnect for their medical needs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 bg-[#E29578] hover:bg-[#E29578]/90 text-white rounded-md transition-colors">
          Get Started Today
        </button>
        <button className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-teal bg-transparent rounded-md transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}
