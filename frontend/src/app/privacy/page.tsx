export default function PrivacyPage() {
  const LAST_UPDATED = "August 2025"; // static to avoid hydration mismatch
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          How we collect, use, and protect your information.
        </p>
      </div>

      {/* Content card */}
      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 md:p-8">
          <div className="space-y-8 text-foreground ltr:text-left rtl:text-right">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium text-foreground">Personal Information:</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>Name, email address, and username</li>
                  <li>Contact information for volunteers and coordinators</li>
                  <li>Profile information and preferences</li>
                </ul>

                <p className="font-medium text-foreground">Case Information:</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>Information about children in need (with consent)</li>
                  <li>Case descriptions and media files</li>
                  <li>Communication records between users</li>
                </ul>

                <p className="font-medium text-foreground">Technical Information:</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>IP addresses and device information</li>
                  <li>Usage analytics and platform interactions</li>
                  <li>Cookies and session data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our platform services</li>
                <li>To connect volunteers with children in need</li>
                <li>To facilitate communication between users</li>
                <li>To ensure platform security and prevent abuse</li>
                <li>To improve our services and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-3">
                We are committed to protecting your privacy and do not sell, trade, or rent your personal information to third parties.
              </p>
              <p className="text-muted-foreground">Information may be shared only in the following circumstances:</p>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground mt-3">
                <li>With your explicit consent</li>
                <li>To facilitate case management between authorized users</li>
                <li>When required by law or to protect rights and safety</li>
                <li>With trusted service providers who assist our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Children's Privacy</h2>
              <p className="text-muted-foreground">
                We take special care to protect the privacy of children. Information about children is only collected with proper consent from parents or guardians, and is used solely for the purpose of providing assistance. We never knowingly collect personal information from children under 13 without parental consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. Case information may be retained longer for legal and safety purposes, but is anonymized when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. International Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the Last Updated date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this privacy policy or our data practices, please contact us at snda@hey.me
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
