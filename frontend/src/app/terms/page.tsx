export default function TermsPage() {
  const LAST_UPDATED = "August 2025"; // static to avoid hydration mismatch
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="mt-3 text-base text-muted-foreground">The rules for using the sNDa platform.</p>
      </div>

      {/* Content card */}
      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 md:p-8">
          <div className="space-y-8 text-foreground ltr:text-left rtl:text-right">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using sNDa (Sudan Network for Development and Aid), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                sNDa is a platform that connects volunteers, coordinators, and donors to help children in need. Our service facilitates the submission, management, and resolution of cases involving children requiring assistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information</li>
                <li>Respect the privacy and dignity of children and families</li>
                <li>Maintain confidentiality of sensitive information</li>
                <li>Act in the best interest of children at all times</li>
                <li>Report any concerns or violations immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Privacy and Data Protection</h2>
              <p className="text-muted-foreground">
                We are committed to protecting the privacy of all users, especially children. All personal information is collected, used, and stored in accordance with our Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Prohibited Activities</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>Sharing false or misleading information</li>
                <li>Using the platform for commercial purposes without authorization</li>
                <li>Harassing or intimidating other users</li>
                <li>Attempting to gain unauthorized access to the system</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                sNDa provides this platform as a service to facilitate community support. We are not responsible for the actions of individual users or the outcomes of cases. Users participate at their own risk and discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at snda@hey.me
              </p>
            </section>

            <div className="mt-2 pt-6 border-t">
              <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
