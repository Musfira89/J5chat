import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PrivacyPolicy = () => {
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
            Your privacy is important to us. This policy explains what data we
            collect, how we use it, and how we protect your information while
            using <strong>J5.Chat</strong>.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Sections */}
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
          <div className="space-y-2">
            <p>• Email address (for account-related contact)</p>
            <p>• Phone number (optional, may be used for verification or communication)</p>
            <p>• IP address and device info (for security and diagnostics)</p>
            <p>• Display name and username</p>
            <p>• Analytics data (e.g., user activity, feature usage)</p>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">2. How We Use Your Data</h2>
          <div className="space-y-2">
            <p>• Facilitate account access and communication</p>
            <p>• Monitor system performance and prevent abuse</p>
            <p>• Maintain community safety</p>
            <p>• Contact users when necessary (e.g., account issues or updates)</p>
            <p className="text-sm text-gray-500">
              <em>Note: Contact may occur via third-party platforms like email services or SMS gateways.</em>
            </p>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Data Storage & Security</h2>
          <div className="space-y-2">
            <p>• Direct messages are end-to-end encrypted per Matrix standards.</p>
            <p>• General message history is retained based on Matrix protocol norms.</p>
            <p>• Data is stored securely; infrastructure details are not publicly disclosed.</p>
            <p>• Access to user data is strictly limited to server administrators.</p>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
          <div className="space-y-2">
            <p>• We do not sell or share your personal data with third parties, except:</p>
            <p>– If legally required to comply with law</p>
            <p>– If necessary to communicate with you via messaging services</p>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
          <div className="space-y-2">
            <p>• Request to review the data we store about you</p>
            <p>• Request account deletion</p>
            <p>• Report misuse or privacy violations</p>
            <p>• Contact a moderator or admin directly within the J5.Chat server</p>
          </div>
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

export default PrivacyPolicy;
