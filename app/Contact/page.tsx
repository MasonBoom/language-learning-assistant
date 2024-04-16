"use client";
import { useState, FormEvent } from "react";
import axios from "axios";

export default function ContactForm() {
  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: "",
  });

  const onContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/contact", contactInfo);
      console.log("Response:", response.data);
      setContactInfo({ name: "", email: "", message: "" });
      alert("Message sent successfully!");
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      alert("Failed to send the message.");
    }
  };

  return (
    <form
      onSubmit={onContactSubmit}
      className="flex justify-center items-center"
    >
      <div className="w-full max-w-xl px-8 py-8 mt-12 md:mt-24 lg:mt-36 text-left shadow-lg rounded-lg bg-blue-500 mb-36">
        <h3 className="text-2xl font-bold text-center text-white">
          Contact Us
        </h3>
        <div className="mt-4">
          <label className="block text-white" htmlFor="Name">
            Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className={fieldStyles}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, name: e.target.value })
            }
          />
          <label className="block mt-4 text-white" htmlFor="Email">
            Email
          </label>
          <input
            type="email"
            placeholder="Your Email"
            className={fieldStyles}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, email: e.target.value })
            }
          />
          <label className="block mt-4 text-white">Message</label>
          <textarea
            placeholder="Your Message"
            className={`${fieldStyles} h-32`}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, message: e.target.value })
            }
          />
          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 text-sm text-white bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 duration-300">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
