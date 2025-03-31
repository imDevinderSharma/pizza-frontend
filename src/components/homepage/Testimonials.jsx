import { useState } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      location: 'Meerut',
      comment: 'Best pizza in town! The crust is perfectly crispy and the toppings are always fresh. My go-to place for pizza nights with family.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Patel',
      location: 'Delhi',
      comment: 'The delivery is always on time and the pizzas arrive hot. The Chicken Tikka pizza is my favorite - a perfect blend of Indian and Italian flavors!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Amit Kumar',
      location: 'Meerut',
      comment: 'Great value for money. The portions are generous and taste is authentic. Love their new stuffed crust option!',
      rating: 4,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex < testimonials.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Customers Say</h2>
        
        <div className="testimonials-carousel">
          <div className="testimonial-card">
            <div className="rating">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <p className="comment">"{testimonials[activeIndex].comment}"</p>
            <div className="customer-info">
              <p className="name">{testimonials[activeIndex].name}<span className="location">{testimonials[activeIndex].location}</span></p>
            </div>
          </div>
          
          <div className="carousel-controls">
            <button className="control-btn prev" onClick={handlePrev}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                ></span>
              ))}
            </div>
            <button className="control-btn next" onClick={handleNext}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 