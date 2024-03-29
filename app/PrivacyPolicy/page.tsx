import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-4 md:p-8 mb-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          Privacy Policy
        </h1>
        <p className="mb-4">Last updated: 3/27/2024</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to LingoListen AI. This privacy policy outlines how we
            collect, use, and protect your personal information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Data Collection</h2>
          <p>
            We collect information necessary for providing our services, such as
            your name, email address, and payment details. Audio recordings are
            used for conversation improvement purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Use of Information</h2>
          <p>
            Your information is used to manage your account, process payments,
            and improve our services. We may use data for research and analysis
            with the aim of enhancing user experience.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
          <p>
            We do not sell or share your personal information with third parties
            except as necessary to provide our services or as required by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement appropriate measures to ensure the security of your
            data against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. Please contact us to make such requests.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. The latest version will
            always be posted on our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this policy, please
            contact us at lingolistenai@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
