"use client";
import React from "react";

function MainComponent({ title, description, buttonText, onButtonClick }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{description}</p>
        <button
          className="bg-[#357AFF] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#2E69DE] transition-colors"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent
        title="Ready to Get Started?"
        description="Join thousands of satisfied users who have already transformed their experience with our platform."
        buttonText="Try It Now"
        onButtonClick={() => alert("Button clicked!")}
      />
    </div>
  );
}

export default StoryComponent;