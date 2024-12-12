"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Section = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg bg-gray-100 p-4 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {isOpen && <div className="mt-2 p-4 bg-white rounded-lg">{children}</div>}
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: January 04, 2023</p>

      <Section title="1. Introduction">
        <p>
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
      </Section>

      <Section title="2. Interpretation and Definitions">
        <h3 className="font-semibold mb-2">Definitions:</h3>
        <ul className="list-disc pl-5">
          <li>
            <strong>Account:</strong> A unique account created for You to access
            our Service.
          </li>
          <li>
            <strong>Company:</strong> YourALF.com Inc, 905 E. MLK JR. DR. Suite
            216.
          </li>
          <li>
            <strong>Cookies:</strong> Small files placed on Your device by a
            website.
          </li>
          <li>
            <strong>Country:</strong> Philadelphia, United States
          </li>
          <li>
            <strong>Personal Data:</strong> Information that relates to an
            identified or identifiable individual.
          </li>
          <li>
            <strong>Service:</strong> Refers to the Website.
          </li>
          <li>
            <strong>Website:</strong> www.seniorisers.com, accessible from
            http://www.seniorisers.com
          </li>
        </ul>
      </Section>

      <Section title="3. Collecting and Using Your Personal Data">
        <h3 className="font-semibold mb-2">Types of Data Collected:</h3>
        <ul className="list-disc pl-5">
          <li>Personal Data (email, name, phone number, address)</li>
          <li>Usage Data</li>
          <li>Information from Third-Party Social Media Services</li>
        </ul>
      </Section>

      <Section title="4. Use of Your Personal Data">
        <p>We may use Your Personal Data for purposes such as:</p>
        <ul className="list-disc pl-5">
          <li>Providing and maintaining our Service</li>
          <li>Managing Your Account</li>
          <li>Contacting You</li>
          <li>Providing news and offers</li>
          <li>Managing Your requests</li>
          <li>Business transfers</li>
        </ul>
      </Section>

      <Section title="5. Retention of Your Personal Data">
        <p>
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy.
        </p>
      </Section>

      <Section title="6. Transfer of Your Personal Data">
        <p>
          Your information may be transferred to and maintained on computers
          located outside of Your state, province, country or other governmental
          jurisdiction.
        </p>
      </Section>

      <Section title="7. Disclosure of Your Personal Data">
        <p>We may disclose Your Personal Data in situations such as:</p>
        <ul className="list-disc pl-5">
          <li>Business Transactions</li>
          <li>Law enforcement</li>
          <li>Other legal requirements</li>
        </ul>
      </Section>

      <Section title="8. Security of Your Personal Data">
        <p>
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet is 100% secure.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          Our Service does not address anyone under the age of 18. We do not
          knowingly collect personally identifiable information from anyone
          under the age of 18.
        </p>
      </Section>

      <Section title="10. Links to Other Websites">
        <p>
          Our Service may contain links to other websites that are not operated
          by Us. We have no control over and assume no responsibility for the
          content, privacy policies or practices of any third-party sites or
          services.
        </p>
      </Section>

      <Section title="11. Changes to this Privacy Policy">
        <p>
          We may update Our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
        </p>
      </Section>

      <Section title="12. Contact Us">
        <p>
          If you have any questions about this Privacy Policy, you can contact
          us by visiting this page on our website:{" "}
          <a
            href="http://www.seniorisers.com/contact"
            className="text-blue-600 hover:underline"
          >
            http://www.seniorisers.com/contact
          </a>
        </p>
      </Section>
    </div>
  );
};

export default PrivacyPolicy;
