import { testimonials } from "../../data/homePage"
export default function TestimonialSection({darkMode}) {
  return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block bg-light-teal/20 text-teal hover:bg-light-teal/30 dark:bg-light-teal/20 dark:text-light-teal dark:hover:bg-light-teal/30 px-3 py-1 rounded-full text-sm font-medium">
              Testimonials
            </span>
            <h2
              className={`text-3xl lg:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray"
              }`}
            >
              What our users say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm dark:bg-white/95 rounded-lg border border-gray-200"
              >
                <div className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="text-[#E29578] dark:text-light-teal"
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray/80 italic ">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray/70 ">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
