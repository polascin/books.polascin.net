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
            <p><strong>Effective Date:</strong> March 22, 2026</p>
        <p>Bibliotheca Polascini provides information about books, publications, authorship, medicine, literature, and related external resources. This page explains both how privacy is handled on this website and the legal limitations that apply to the informational material published here.</p>
        
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

        <h2 id="legal-disclaimer" class="font-cinzel text-xl font-bold text-slate-800 mt-10 mb-2">6. Legal Disclaimer</h2>
        <p><strong>Important note:</strong> The information provided on this website, including within the catalog, descriptive texts, linked resources, and any related publications referenced here, is intended for general informational and educational purposes only. It must not be construed as medical, legal, financial, or any other professional advice.</p>

        <h3 class="font-cinzel text-lg font-bold text-slate-800 mt-6 mb-2">Health and Medical Information</h3>
        <p>Any information relating to health, diet, lifestyle, treatment, nephrology, medicine, or medical conditions is not a substitute for professional medical examination, diagnosis, treatment, or advice from a qualified physician or other healthcare professional. Always consult your doctor or another qualified healthcare provider for any questions about your medical condition or before starting any new diet, treatment, or lifestyle change. Never disregard or delay seeking professional medical advice because of information you have read on this website.</p>

        <h3 class="font-cinzel text-lg font-bold text-slate-800 mt-6 mb-2">Accuracy of Information</h3>
        <p>Reasonable efforts are made to keep the information on this website accurate and up to date. However, no representation or warranty is made that all information is complete, correct, current, or free from error. Medicine, science, publishing, and online information sources evolve continuously, and new developments may change how existing information should be interpreted.</p>

        <h3 class="font-cinzel text-lg font-bold text-slate-800 mt-6 mb-2">Limitation of Liability</h3>
        <p>To the fullest extent permitted by applicable law, the author and publisher of this website shall not be liable for any loss, damage, or injury, including direct, indirect, incidental, special, or consequential damages, arising out of or connected with the use of, inability to use, or reliance on the information contained on this website. Use of the website and its content is entirely at your own risk.</p>

        <h3 class="font-cinzel text-lg font-bold text-slate-800 mt-6 mb-2">Third-Party Links</h3>
        <p>This website may include links to external websites, publishers, booksellers, articles, archives, or other third-party resources. We are not responsible for the content, availability, accuracy, terms, or privacy practices of those external sites. Accessing third-party resources is done at your own discretion and risk.</p>

        <h3 class="font-cinzel text-lg font-bold text-slate-800 mt-6 mb-2">Acceptance of This Disclaimer</h3>
        <p>By using this website and its content, you acknowledge that you have read, understood, and agreed to this legal disclaimer.</p>
    </div>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
