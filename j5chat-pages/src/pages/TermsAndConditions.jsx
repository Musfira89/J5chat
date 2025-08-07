import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2">
          Terms and Conditions for J5.Chat
        </h1>
        <p className="text-sm text-gray-500 text-center">
          <em>Last Updated: [Insert Date]</em>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto space-y-10 text-gray-800">
        {/* Intro */}
        <section>
          <p className="text-base leading-relaxed">
            Welcome to <strong>J5.Chat</strong>, a Matrix-based community server
            designed for individuals involved in peptide research. By accessing
            or using J5.Chat, you agree to the following terms. If you do not
            agree, please do not use this service.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Terms Sections */}
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Purpose</h2>
          <p className="text-base leading-relaxed">
            J5.Chat is a private online platform for the peptide research
            community. It is not intended for the general public. The content
            shared within J5.Chat is for informational and research purposes
            only and does not constitute medical advice.
          </p>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
          <p className="text-base leading-relaxed">
            You must be 18 years or older to use J5.Chat. By joining, you
            confirm that you meet this age requirement. Access may require
            approval by moderators. We reserve the right to restrict membership
            to preserve the quality and safety of the community.
          </p>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Prohibited Conduct</h2>
          <div className="space-y-2 text-base leading-relaxed">
            <p>You agree not to use J5.Chat to:</p>
            <p>Harass, threaten, or bully other users</p>
            <p>Spread hate speech or discriminatory content</p>
            <p>Share illegal substances or medical advice</p>
            <p>Distribute NSFW, spam, or unsolicited promotions</p>
            <p>Violate local or international laws</p>
            <p>
              The moderation team enforces these rules and reserves the right to
              take immediate action, including banning users who violate them.
            </p>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Disclaimers</h2>
          <p className="text-base leading-relaxed">
            All content is for educational or research purposes only. The
            operators of J5.Chat do not offer medical guidance or validate the
            accuracy of user-generated content. Use the platform at your own
            risk.
          </p>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Enforcement & Termination</h2>
          <p className="text-base leading-relaxed">
            We may suspend or ban any user, at any time, for any reason deemed
            necessary to protect the environment of J5.Chat. This includes
            behavior outside the platform if it affects the safety or function
            of the community.
          </p>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Acceptance of Terms</h2>
          <p className="text-base leading-relaxed">
            By creating an account or using J5.Chat, you agree to these Terms
            and our Privacy Policy.
          </p>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
          <p className="text-base leading-relaxed">
            Questions? Contact a moderator or administrator directly within the
            J5.Chat server.
          </p>
        </section>

        {/* Back Button */}
        <div className="pt-10">
          <button
            onClick={() => (window.location.href = "https://j5.chat/custom/")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            <ArrowBackIcon className="text-white" fontSize="small" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
