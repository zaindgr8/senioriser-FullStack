import React from "react";

const AboutUsAndFAQ = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-7">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-gray-700">
          Seniorisers streamlines tasks for sales and content teams, enhancing
          their efficiency and boosting productivity. By providing content that
          supports effective sales strategies, Seniorisers makes it easier for
          teams to access, engage, nurture, and manage sales leads. Its
          cutting-edge approach delivers real-time insights, equipping sales
          teams with the necessary information to succeed, while promoting
          consistent methodologies that make organizations more agile. Serving
          over 2,100 clients, Seniorisers' alerts are driving significant
          productivity improvements by saving time and reducing costs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              How is the network promoted?
            </h3>
            <p className="text-gray-700">
              Seniorisers is promoted online through grass roots efforts via
              online social media.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is there a cost for the service providers to join?
            </h3>
            <p className="text-gray-700">
              There is no cost to join Seniorisers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is there a cost after joining Seniorisers?
            </h3>
            <p className="text-gray-700">
              Once a community or provider creates a page, they will have the
              opportunity to sign up for alerts. Alerts are optional and carry a
              nominal monthly fee.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Why do properties further from me appear first when I type in my
              zip code?
            </h3>
            <p className="text-gray-700">
              The search results are based on the number of providers and
              communities those locations have linked on their page. The more
              links a community has, the higher they appear in the search
              results. We designed it this way because people want to be
              associated with great communities, not mediocre communities, so
              search results act as survival of the fittest.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              What are some features of the Seniorisers network?
            </h3>
            <p className="text-gray-700">
              Seniorisers allows you to upload videos, photos, info, send email
              blasts, instant message consumers, or email them to answer any
              questions. Seniorisers will also update you on new providers in
              the area, and alert you if their contact info has updated.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Do I need to log in daily to receive my messages?
            </h3>
            <p className="text-gray-700">
              All correspondence will go directly to your email ID. Seniorisers
              was designed to run itself. So, unless you have an email blast or
              want to update the page, Seniorisers is self-sufficient.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsAndFAQ;
