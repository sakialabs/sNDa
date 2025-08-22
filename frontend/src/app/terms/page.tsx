export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using sNDa (Sudan Network for Development and Aid), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              sNDa is a platform that connects volunteers, coordinators, and donors to help children in need. Our service facilitates the submission, management, and resolution of cases involving children requiring assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and truthful information</li>
              <li>Respect the privacy and dignity of children and families</li>
              <li>Maintain confidentiality of sensitive information</li>
              <li>Act in the best interest of children at all times</li>
              <li>Report any concerns or violations immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Privacy and Data Protection</h2>
            <p className="text-muted-foreground">
              We are committed to protecting the privacy of all users, especially children. All personal information is collected, used, and stored in accordance with our Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Prohibited Activities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Sharing false or misleading information</li>
              <li>Using the platform for commercial purposes without authorization</li>
              <li>Harassing or intimidating other users</li>
              <li>Attempting to gain unauthorized access to the system</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              sNDa provides this platform as a service to facilitate community support. We are not responsible for the actions of individual users or the outcomes of cases. Users participate at their own risk and discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these terms, please contact us at legal@snda.org
            </p>
          </section>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
