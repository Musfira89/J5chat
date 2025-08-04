import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 transition-all duration-300">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          Privacy Policy for J5.Chat
        </h1>

        <p className="text-sm text-gray-500 text-center mb-10">
          <em>Last Updated: [Insert Date]</em>
        </p>

        {/* Intro */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. This policy explains what data we
            collect, how we use it, and how we protect your information while
            using <strong>J5.Chat</strong>.
          </p>
        </section>

        {/* Sections */}
        {[
          {
            title: "1. Information We Collect",
            content: (
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>Email address (for account-related contact)</li>
                <li>
                  Phone number (optional, may be used for verification or
                  communication)
                </li>
                <li>
                  IP address and device info (for security and diagnostics)
                </li>
                <li>Display name and username</li>
                <li>Analytics data (e.g., user activity, feature usage)</li>
              </ul>
            ),
          },
          {
            title: "2. How We Use Your Data",
            content: (
              <>
                <p className="text-gray-700">We use the collected data to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Facilitate account access and communication</li>
                  <li>Monitor system performance and prevent abuse</li>
                  <li>Maintain community safety</li>
                  <li>
                    Contact users when necessary (e.g., account issues or
                    updates)
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <em>
                    Note: Contact may occur via third-party platforms like email
                    services or SMS gateways.
                  </em>
                </p>
              </>
            ),
          },
          {
            title: "3. Data Storage & Security",
            content: (
              <>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>
                    Direct messages are end-to-end encrypted per Matrix
                    standards.
                  </li>
                  <li>
                    General message history is retained based on Matrix protocol
                    norms.
                  </li>
                  <li>
                    Data is stored securely; infrastructure details are not
                    publicly disclosed for security reasons.
                  </li>
                  <li>
                    Access to user data is strictly limited to server
                    administrators.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "4. Data Sharing",
            content: (
              <>
                <p className="text-gray-700">
                  We do not sell or share your personal data with third parties,
                  except:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>If legally required to comply with applicable law</li>
                  <li>
                    If necessary to communicate with you (e.g., via messaging
                    services)
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "5. Your Rights",
            content: (
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>Request to review the data we store about you</li>
                <li>Request account deletion</li>
                <li>Report misuse or privacy violations</li>
                <li>
                  Contact a moderator or admin directly within the J5.Chat
                  server
                </li>
              </ul>
            ),
          },
        ].map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <div className="text-sm leading-relaxed">{section.content}</div>
          </section>
        ))}

        {/* Back Button */}
        <div className="mt-12 flex justify-start">
          <button
            onClick={() => (window.location.href = "https://j5.chat/custom/")}
            className="inline-flex items-center gap-4 px-4 py-2.5 rounded-md bg-black text-white text-sm font-semibold shadow hover:bg-gray-800 transition duration-300"
          >
            <ArrowBackIcon sx={{ fontSize: 12 }} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
