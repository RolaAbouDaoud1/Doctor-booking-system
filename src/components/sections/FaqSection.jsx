import { faqs } from "../../data/homePage";
export default function FaqSection({ setOpenFaq, openFaq, darkMode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="text-center space-y-4 mb-16">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              darkMode
                ? "bg-light-teal/20 text-light-teal hover:bg-light-teal/30"
                : "bg-light-teal/20 text-teal hover:bg-light-teal/30"
            }`}
          >
            FAQ
          </span>
          <h2
            className={`text-3xl lg:text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray"
            }`}
          >
            Frequently Asked Questions
          </h2>
          <p className={`text-lg ${darkMode ? "text-white/80" : "text-gray"}`}>
            Find answers to common questions about HealthConnect
          </p>
        </div>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white/90 dark:bg-white/95 rounded-lg"
          >
            <div className="p-0">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <h3 className="font-semibold text-gray pr-4 dark:text-white">
                  {faq.question}
                </h3>
                <span className="text-gray flex-shrink-0 dark:text-white">
                  {openFaq === index ? "▲" : "▼"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <p className="text-gray/80 ">{faq.answer}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
