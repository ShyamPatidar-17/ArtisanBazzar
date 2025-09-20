import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Mail, Linkedin, Github } from "lucide-react";

const developers = [
  {
    name: "Aashish Sencha",
    role: "Frontend Developer",
    img: assets.profile_img,
    email: "aashish.sencha@example.com",
    linkedin: "https://www.linkedin.com/in/aashish-sencha",
    github: "https://github.com/aashish-sencha",
  },
  {
    name: "Shyam Patidar",
    role: "Fullstack Developer",
    img: assets.profile_img,
    email: "shyampatidar672@gmail.com",
    linkedin: "https://www.linkedin.com/in/shyam-patidar-736b77257/",
    github: "https://github.com/ShyamPatidar-17",
  },
  {
    name: "Aditi Sharma",
    role: "UI/UX Designer",
    img: assets.profile_img,
    email: "aditi.sharma@example.com",
    linkedin: "https://www.linkedin.com/in/aditi-sharma",
    github: "https://github.com/aditi-sharma",
  },
  {
    name: "Dhruv Gour",
    role: "Backend Developer",
    img: assets.profile_img,
    email: "dhruv.gour@example.com",
    linkedin: "https://www.linkedin.com/in/dhruv-gour",
    github: "https://github.com/dhruv-gour",
  },
];

const Contact = () => {
  return (
    <div>
      {/* Contact Section */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row items-center gap-12 px-6">
        {/* Left: Contact Image */}
        <img
          src={assets.contact_img}
          alt="CONTACT"
          className="w-full md:max-w-[400px] rounded-lg shadow-lg"
        />

        {/* Right: Address + Newsletter */}
        <div className="flex flex-col gap-8 w-full max-w-lg">
          {/* Address Section */}
          <div>
            <p className="font-semibold text-xl text-gray-700">Our Office:</p>
            <p className="text-gray-600 mt-2">
              149-A Sheetal Nagar Behind Radission Blu Hotel <br />
              Indore, Madhya Pradesh, India 452010
            </p>
            <p className="text-gray-600 mt-2">
              Tel: +91 9876543210 <br />
              Email: contact@artisanbazaar.com
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="bg-orange-50 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Stay Connected
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Subscribe to our newsletter to receive updates about new arrivals,
              artisan stories, and exclusive offers.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"OUR"} text2={"DEVELOPERS"} />
      </div>

      <div className="max-w-3xl mx-auto text-center mt-6 px-4">
        <p className="text-gray-600 text-lg leading-relaxed">
          We are a passionate team of developers, designers, and innovators
          behind{" "}
          <span className="font-semibold text-orange-600">Artisan Bazaar</span>.
          Our mission is to empower local artisans and bring their unique crafts
          to the digital marketplace. Together, we’ve built a seamless
          MERN-powered e-commerce experience.
        </p>
      </div>

      {/* Developer Cards */}
      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
        {developers.map((dev, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 hover:scale-105 p-6"
          >
            <img
              src={dev.img}
              alt={dev.name}
              className="w-40 h-40 object-cover rounded-full shadow-lg mb-4 border-4 border-orange-200"
            />
            <h2 className="text-xl font-bold text-gray-800">{dev.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{dev.role}</p>

            {/* Contact Links */}
            <div className="flex gap-4 mt-2">
              {/* Mail */}
              <a href={`mailto:${dev.email}`} title="Email">
                <Mail className="w-5 h-5 text-orange-600 hover:text-orange-800 transition" />
              </a>

              {/* LinkedIn */}
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-blue-600 hover:text-blue-800 transition" />
              </a>

              {/* GitHub */}
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
