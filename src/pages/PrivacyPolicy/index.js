const PrivacyPolicy = () => {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl text-gray-800'>
      <h1 className='text-3xl font-bold mb-4'>Privacy Policy</h1>
      <p className='text-sm text-gray-500 mb-8'>Effective Date: May 19, 2025</p>

      <p className='mb-4'>
        Welcome to LearnToStart (“Company”, “we”, “our”, or “us”). This Privacy
        Policy explains how we collect, use, disclose, and safeguard your
        information when you visit our website{' '}
        <strong>https://app.learntostart.com</strong>, including any related
        media platforms and applications (collectively, the “Site”).
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        1. Information We Collect
      </h2>
      <ul className='list-disc list-inside mb-4'>
        <li>Full name</li>
        <li>Email address</li>
        <li>Payment details (processed via Stripe)</li>
        <li>Course activity and preferences</li>
      </ul>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        2. How We Use Your Information
      </h2>
      <ul className='list-disc list-inside mb-4'>
        <li>Provide access to courses and features</li>
        <li>Process payments and transactions</li>
        <li>Communicate with you</li>
        <li>Customize your experience</li>
        <li>Improve our platform</li>
      </ul>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        3. Sharing Your Information
      </h2>
      <p className='mb-4'>
        We do <strong>not</strong> sell your personal information. We may share
        it with:
      </p>
      <ul className='list-disc list-inside mb-4'>
        <li>Third-party service providers (e.g., Stripe, analytics)</li>
        <li>Course instructors (only as needed)</li>
        <li>Legal authorities when required</li>
      </ul>

      <h2 className='text-xl font-semibold mt-6 mb-2'>4. Data Retention</h2>
      <p className='mb-4'>
        We retain your information as long as your account is active or as
        required to provide services. You may request deletion by contacting us.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>5. Your Rights</h2>
      <ul className='list-disc list-inside mb-4'>
        <li>Access, correct, or delete your data</li>
        <li>Object to certain processing</li>
        <li>Withdraw consent when applicable</li>
      </ul>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        6. Cookies and Tracking
      </h2>
      <p className='mb-4'>
        We use cookies and similar technologies to improve your experience. You
        can manage cookies through your browser settings.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>7. Children’s Privacy</h2>
      <p className='mb-4'>
        Our services are not intended for children under 13 (or under 16 in some
        regions). We do not knowingly collect their data.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        8. International Users
      </h2>
      <p className='mb-4'>
        Your data may be transferred and processed in the United States or other
        countries with different data protection laws.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>9. Third-Party Links</h2>
      <p className='mb-4'>
        Our platform may include links to third-party sites. We are not
        responsible for their content or privacy practices.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>
        10. Changes to This Policy
      </h2>
      <p className='mb-4'>
        We may update this Privacy Policy. The new version will be posted on
        this page with a revised effective date.
      </p>

      <h2 className='text-xl font-semibold mt-6 mb-2'>11. Contact Us</h2>
      <p className='mb-2'>If you have questions, contact us at:</p>
      <p>
        <strong>LearnToStart</strong>
        <br />
        Email: support@learntostart.com
        <br />
        Website: https://app.learntostart.com
      </p>
    </div>
  )
}

export default PrivacyPolicy
