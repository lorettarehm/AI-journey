import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/ui/FadeIn';

const AboutPrivacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Information
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            </div>

            <div>
              <p>
                <b>1. Introduction</b>
              </p>
              <p>
                We, the developers of audhd.ai, are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our AI-powered neurodivergence support application. We understand the sensitive nature of the information you entrust to us, and we take our responsibility to protect it seriously. If you have any questions or concerns about our privacy practices, please  contact us via the Support section of the app.
              </p>

              <p>
                <b>2. Information Collection</b>
              </p>
              <p>
                We collect the following types of information:
              </p>
              <p>
                <i>Account Data:</i>  When you create an account, we collect your email address, username, and password. This information is used to authenticate you, manage your account, and provide you with access to the app's features.
              </p>
              <p>
                <i>Usage Data:</i>  We automatically collect data on how you interact with our app, such as the features you use, the frequency and duration of your sessions, and your engagement patterns. This data helps us understand user behaviour, improve app functionality and user experience, and personalise content delivery.
              </p>
              <p>
                <i>AI Interaction Data:</i>  If you use our app's AI-powered features (e.g., chatbot, personalised recommendations), we collect your inputs and the AI's responses. This data is used to provide the AI functionality, improve the AI model, and personalise support and insights.
              </p>
              <p>
                <i>Device Information:</i>  We collect device-specific information such as your IP address (if applicable), device type, and operating system version. This helps us provide technical support, analyse app performance, and ensure security.
              </p>
              <p>
                <i>Optional Information:</i>  You may choose to provide additional information like demographic data (e.g., age range, gender identity) or specific interests related to neurodiversity. This is used to further personalise your experience or for anonymised research (with your explicit consent).
              </p>

              <p>
                <b>3. Data Usage</b>
              </p>
              <p>
                We use your data for the following purposes:
              </p>
              <p>
                <i>Service Provision and Personalisation:</i>  To deliver the core features of the app and tailor your experience.
              </p>
              <p>
                <i>App Improvement and Development:</i>  To analyse usage patterns, identify bugs, and develop new features.
              </p>
              <p>
                <i>Research and Analytics:</i>  To conduct research and analyse trends (with anonymised data and your consent for identifiable data).
              </p>
              <p>
                <i>Communication:</i>  To send you notifications, updates, and respond to your inquiries.
              </p>
              <p>
                <i>Security and Fraud Prevention:</i>  To monitor for suspicious activity and ensure platform security.
              </p>

              <p>
                <b>4. Data Protection and Security Measures</b>
              </p>
              <p>
                We implement robust security measures to protect your data, including:
              </p>
              <p>
                <i>Encryption:</i>  Data is encrypted both in transit (HTTPS) and at rest.
              </p>
              <p>
                <i>Access Controls:</i>  Access to personal data is limited to authorised personnel.
              </p>
              <p>
                <i>Secure Storage:</i>  We use secure servers and data centres.
              </p>
              <p>
                <i>Regular Security Assessments:</i>  We conduct regular security audits.
              </p>
              <p>
                <i>Data Minimisation:</i> We only collect necessary data to minimise risk.
              </p>
              <p>
                We are committed to protecting your data, but please be aware that no online system is completely secure.
              </p>

              <p>
                <b>5. Data Retention Policies</b>
              </p>
              <p>
                We retain your data for as long as necessary to provide services, maintain your account, comply with legal obligations, and for legitimate business needs. You can request deletion of your data by contacting us.
              </p>

              <p>
                <b>6. User Rights Regarding Their Data</b>
              </p>
              <p>
                You have the following rights regarding your data:
              </p>
              <p>
                <i>Right to Access:</i>  You can request a copy of your data.
              </p>
              <p>
                <i>Right to Rectification:</i>  You can correct inaccurate data.
              </p>
              <p>
                <i>Right to Erasure:</i>  You can request deletion of your data.
              </p>
              <p>
                <i>Right to Restrict Processing:</i>  You can limit how we use your data.
              </p>
              <p>
                <i>Right to Object:</i>  You can object to certain processing activities.
              </p>
              <p>
                <i>Right to Data Portability:</i>  You can receive your data in a machine-readable format.
              </p>
              <p>
                <i>Right to Withdraw Consent:</i>  You can withdraw your consent at any time.
              </p>
              <p>
                To exercise these rights, please  contact us via the Support section of the app . You also have the right to lodge a complaint with a data protection authority.
              </p>

              <p>
                <b>7. Disclaimer Regarding Medical Guidance</b>
              </p>
              <p>
                audhd.ai is not intended to provide medical guidance, diagnosis, or treatment. It is essential to consult with a qualified healthcare professional for any medical concerns.
              </p>

              <p>
                <b>8. User Discretion and Risk Statement</b>
              </p>
              <p>
                Any advice or recommendations provided by audhd.ai are for informational purposes only and should be used at your own discretion and risk.  We  shall not be liable for any consequences resulting from your reliance on the app's output.
              </p>

              <p>
                <b>9. Third-Party Services and Links</b>
              </p>
              <p>
                Our app may integrate with or provide links to third-party services. These services have their own privacy policies, and we encourage you to review them before interacting with them.
              </p>

              <p>
                <b>10. Policy Updates</b>
              </p>
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will post updates within the app or on our website with a "Last Updated" date. We may also notify you of significant changes. Please review this policy periodically.
              </p>

              <p>
                <b>11. Contact Information</b>
              </p>
              <p>
                If you have any questions, concerns, or requests related to privacy, please contact us  via the Support section of the app.
              </p>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPrivacy;