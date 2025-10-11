import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Mail, Linkedin, Github } from "lucide-react";
import Newsletter from "../components/Newsletter";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen pt-16 px-4 sm:px-8">
      
      {/* Page Header */}
      <div className="text-center pt-12 border-t border-gray-200">
        <Title text1="GET IN" text2="TOUCH" />
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          We’d love to hear from you! Reach out for collaborations, feedback, or general inquiries.
        </p>
      </div>

      {/* Contact & Newsletter Section */}
     {/* Contact & Newsletter Section */}
<div className="my-12 flex flex-col md:flex-row items-start gap-12 px-6">
  {/* Contact Image */}
  <img
    src={assets.contact_img}
    alt="Contact Us"
    className="w-full md:max-w-[400px] rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
  />

  {/* Info & Newsletter */}
  <div className="flex flex-col gap-8 w-full">
    {/* Address */}
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition w-full">
      <h3 className="font-semibold text-xl text-gray-800">Our Office</h3>
      <p className="text-gray-600 mt-2 leading-relaxed">
        149-A Sheetal Nagar, Behind Radisson Blu Hotel <br />
        Indore, Madhya Pradesh, India 452010
      </p>
      <p className="text-gray-600 mt-2">
        Phone: +91 9876543210 <br />
        Email: contact@artisanbazaar.com
      </p>
    </div>

    {/* Newsletter - full width */}
    <div className="bg-orange-50 p-6 rounded-xl shadow-md hover:shadow-lg transition w-full">
      <h3 className="text-lg font-semibold text-gray-800">Stay Updated</h3>
      <p className="text-gray-600 text-sm mt-1">
        Join our newsletter to explore artisan stories, latest collections, and exclusive offers.
      </p>
      <div className="mt-4 w-full">
        <Newsletter className="w-full" />
      </div>
    </div>
  </div>
</div>


      {/* Developers Section */}
      <div className="text-center pt-10 border-t border-gray-200">
        <Title text1="MEET" text2="THE TEAM" />
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
          Behind <span className="font-semibold text-orange-600">Artisan Bazaar</span>, our team blends creativity and technology to bring local craftsmanship online. Each developer contributes unique expertise in design, frontend, backend, and UX innovation.
        </p>
      </div>

      {/* Developer Cards */}
      <div className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
        {assets.developers.map((dev, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 p-6"
          >
            <img
              src={dev.img}
              alt={dev.name}
              className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-orange-200 mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800">{dev.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{dev.role}</p>

            {/* Contact Links */}
            <div className="flex gap-5 mt-2">
              <a href={`mailto:${dev.email}`} title="Email">
                <Mail className="w-5 h-5 text-orange-600 hover:text-orange-800 transition" />
              </a>
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-blue-600 hover:text-blue-800 transition" />
              </a>
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-gray-700 hover:text-black transition" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
