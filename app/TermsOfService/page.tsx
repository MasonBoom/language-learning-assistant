import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="p-4 md:p-8 mb-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          Terms of Service
        </h1>
        <p className="mb-4">Last updated: 3/27/2024</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to LingoListen AI. By using our website and services, you
            agree to these Terms of Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. Usage of Our Services
          </h2>
          <p>
            LingoListen AI offers language learning through conversations with
            an AI chatbot. Our services are subscription-based and require the
            use of a microphone for voice interaction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Subscription and Payment
          </h2>
          <p>
            Access to LingoListen AI requires a paid subscription. You will be
            billed in advance on a recurring basis once your free trial ends if
            applicable. Cancellation of the subscription is allowed at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. User Conduct</h2>
          <p>
            Users are expected to behave responsibly and respectfully while
            using our services. Any form of abuse, harassment, or misuse of the
            service will result in termination of the account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            LingoListen AI is not responsible for any loss or damage resulting
            from the use of our service. Our liability is limited to the extent
            permitted by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of our service after such changes constitutes acceptance of the
            new terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about these terms, please
            contact us at lingolistenail@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
