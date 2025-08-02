import React from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 transition-all duration-300">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          Terms and Conditions for J5.Chat
        </h1>

        <p className="text-sm text-gray-500 text-center mb-10">
          <em>Last Updated: [Insert Date]</em>
        </p>

        {/* Section: Intro */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to <strong>J5.Chat</strong>, a Matrix-based community server designed for individuals involved in peptide research. 
            By accessing or using J5.Chat, you agree to the following terms. If you do not agree, please do not use this service.
          </p>
        </section>

        {/* Terms Sections */}
        {[
          {
            title: "1. Purpose",
            content:
              "J5.Chat is a private online platform for the peptide research community. It is not intended for the general public. The content shared within J5.Chat is for informational and research purposes only and does not constitute medical advice.",
          },
          {
            title: "2. Eligibility",
            content:
              "You must be 18 years or older to use J5.Chat. By joining, you confirm that you meet this age requirement. Access may require approval by moderators. We reserve the right to restrict membership to preserve the quality and safety of the community.",
          },
          {
            title: "3. Prohibited Conduct",
            content: (
              <>
                <p>You agree not to use J5.Chat to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Harass, threaten, or bully other users</li>
                  <li>Spread hate speech or discriminatory content</li>
                  <li>Share illegal substances or medical advice</li>
                  <li>Distribute NSFW, spam, or unsolicited promotions</li>
                  <li>Violate local or international laws</li>
                </ul>
                <p className="mt-2">
                  The moderation team enforces these rules and reserves the right to take immediate action, including banning users who violate them.
                </p>
              </>
            ),
          },
          {
            title: "4. Disclaimers",
            content:
              "All content is for educational or research purposes only. The operators of J5.Chat do not offer medical guidance or validate the accuracy of user-generated content. Use the platform at your own risk.",
          },
          {
            title: "5. Enforcement & Termination",
            content:
              "We may suspend or ban any user, at any time, for any reason deemed necessary to protect the environment of J5.Chat. This includes behavior outside the platform if it affects the safety or function of the community.",
          },
          {
            title: "6. Acceptance of Terms",
            content:
              "By creating an account or using J5.Chat, you agree to these Terms and our Privacy Policy.",
          },
          {
            title: "7. Contact",
            content:
              "Questions? Contact a moderator or administrator directly within the J5.Chat server.",
          },
        ].map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm">{section.content}</div>
          </section>
        ))}

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 transition duration-300"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
