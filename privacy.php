<?php
require_once __DIR__ . '/includes/functions.php';

$pageTitle = 'Privacy Policy | Bibliotheca Polascini';
$pageDescription = 'Read the privacy policy for Bibliotheca Polascini, including information on cookies, consent, and data protection.';
$pageCanonical = buildAbsoluteUrl('privacy.php');
$pageType = 'website';
$pageImage = getDefaultSeoImage();
$pageRobots = 'noindex, follow';

// Include common header
include __DIR__ . '/includes/header.php';
?>

<section class="w-full max-w-4xl mx-auto px-4 py-16 bg-white my-10 rounded shadow-md border border-gray-200" aria-label="Privacy Policy content">
    <h1 class="font-cinzel text-3xl font-bold text-slate-800 mb-6 border-b border-gray-300 pb-4">Privacy Policy</h1>
    
    <div class="space-y-6 text-slate-700 leading-relaxed text-justify font-sans">
        <p><strong>Effective Date:</strong> <?php echo date('F j, Y'); ?></p>
        
        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">1. Introduction</h2>
        <p>Welcome to Bibliotheca Polascini. We respect your privacy and are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws. This policy explains how we collect, use, and safeguard your information when you visit our website.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">2. Information We Collect</h2>
        <p>We collect basic technical information to ensure the website functions securely and continuously. When you interact with our cookie consent banner, we store your preference locally in your browser's local storage to prevent prompting you repeatedly. We do not collect personally identifiable information unless you explicitly volunteer it by contacting us.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">3. How We Use Cookies</h2>
        <p>Cookies and similar technologies (like browser local storage) help us understand how you use our site and maintain your preferences. Our website utilizes strictly necessary data storage for consent features. Analytics or other non-essential tracking mechanisms are only deployed if you explicitly choose "Accept All" on our consent banner.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">4. Your Rights under GDPR</h2>
        <p>As a user located in the European Union or accessing European infrastructure, you possess several core privacy rights under the GDPR:</p>
        <ul class="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>The right to be informed about how your data is used.</li>
            <li>The right to access the personal data we hold about you.</li>
            <li>The right to rectification of any inaccurate or incomplete data.</li>
            <li>The right to erasure ("right to be forgotten").</li>
            <li>The right to restrict processing of your personal data.</li>
        </ul>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">5. Contact Information</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out via email at: <a href="mailto:lubomir@polascin.net" class="text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-slate-800 focus:outline-none">lubomir@polascin.net</a>.</p>
    </div>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
