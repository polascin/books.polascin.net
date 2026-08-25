<?php
require_once __DIR__ . '/includes/functions.php';

$pageTitle = 'Terms of Use | Bibliotheca Polascini';
$pageDescription = 'Read the terms of use for Bibliotheca Polascini, including disclaimers, intellectual property notices, and limitation of liability.';
$pageCanonical = buildAbsoluteUrl('terms.php');
$pageType = 'website';
$pageImage = getDefaultSeoImage();
$pageRobots = 'noindex, follow';

// Include common header
include __DIR__ . '/includes/header.php';
?>

<section class="w-full max-w-4xl mx-auto px-4 py-16 bg-white my-10 rounded shadow-md border border-gray-200" aria-label="Terms of Use content">
    <h1 class="font-cinzel text-3xl font-bold text-slate-800 mb-6 border-b border-gray-300 pb-4">Terms of Use</h1>

    <div class="space-y-6 text-slate-700 leading-relaxed text-justify font-sans">
        <p><strong>Effective Date:</strong> August 25, 2026</p>
        <p>These Terms of Use govern your access to and use of Bibliotheca Polascini, the personal library website of MUDr. Ľubomír Polaščín. Please read them carefully before using the website. Information on how privacy is handled here is provided in our <a href="privacy.php" class="text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-slate-800 focus:outline-none">Privacy Policy</a>.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">1. Acceptance of Terms</h2>
        <p>By accessing or using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and by the legal disclaimer contained in our Privacy Policy. If you do not agree with any part of these terms, please do not use the website.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">2. Purpose of the Website</h2>
        <p>Bibliotheca Polascini is a personal, non-commercial website presenting books, chapters, academic publications, and literary works by Dr. Lubomir Polascin, together with related bibliographic information. All content is provided for general informational and educational purposes only.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">3. Medical and Professional Disclaimer</h2>
        <p><strong>Important note:</strong> Nothing on this website constitutes medical, legal, financial, or any other professional advice. Any information relating to health, diet, lifestyle, treatment, nephrology, medicine, or medical conditions is not a substitute for professional medical examination, diagnosis, treatment, or advice from a qualified physician or other healthcare professional. Always consult your doctor or another qualified healthcare provider for any questions about your medical condition or before starting any new diet, treatment, or lifestyle change. Never disregard or delay seeking professional medical advice because of information you have read on this website.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">4. Intellectual Property</h2>
        <p>Unless stated otherwise, the content of this website, including original texts, descriptions, and the site design, is &copy; MUDr. Ľubomír Polaščín. All rights reserved. Book titles, cover images, and publication excerpts presented here may additionally be subject to the rights of their respective publishers or other rights holders. You may view and reference the content for personal, non-commercial purposes; any other use requires prior written permission from the relevant rights holder.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">5. External Links</h2>
        <p>This website may contain links to external websites, publishers, booksellers, articles, archives, or other third-party resources. Such links are provided for convenience only. We have no control over, and accept no responsibility for, the content, availability, accuracy, terms, or privacy practices of any external site. Accessing third-party resources is done at your own discretion and risk.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">6. Limitation of Liability</h2>
        <p>This website and its content are provided "as is" and "as available", without warranties of any kind, whether express or implied, including but not limited to warranties of accuracy, completeness, fitness for a particular purpose, or non-infringement. To the fullest extent permitted by applicable law, the operator of this website shall not be liable for any loss, damage, or injury, including direct, indirect, incidental, special, or consequential damages, arising out of or connected with the use of, inability to use, or reliance on this website. Use of the website is entirely at your own risk.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">7. Governing Law</h2>
        <p>These Terms of Use are governed by and construed in accordance with the laws of the Slovak Republic. Any disputes arising from or in connection with the use of this website shall be subject to the jurisdiction of the competent courts of the Slovak Republic.</p>

        <h2 class="font-cinzel text-xl font-bold text-slate-800 mt-8 mb-2">8. Contact</h2>
        <p>If you have any questions about these Terms of Use, please contact the site operator, MUDr. Ľubomír Polaščín, at: <a href="mailto:lubomir@polascin.net" class="text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-slate-800 focus:outline-none">lubomir@polascin.net</a>.</p>
    </div>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
