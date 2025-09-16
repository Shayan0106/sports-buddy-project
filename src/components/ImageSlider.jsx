import React, { useState, useEffect } from 'react'; // The word "in" was removed from this line

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
    }, 5000); // Change image every 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [currentIndex, images.length]);

  if (!images || images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-xl mb-8">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div> {/* Dark overlay for text readability */}
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;