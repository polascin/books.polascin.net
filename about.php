<?php
require_once __DIR__ . '/includes/functions.php';

// Include common header
include __DIR__ . '/includes/header.php';
?>

<!-- ABOUT SECTION -->
<section id="about" class="w-full max-w-5xl mx-auto px-4 py-16">
    
    <div class="mb-12 pb-4 border-b border-gray-300 text-center">
        <h2 class="font-cinzel text-3xl font-bold tracking-wider text-slate-800">De Auctore</h2>
        <p class="font-playfair italic text-slate-600 mt-2">Dr. Lubomir Polascin (Walter Kyo Csoelle)</p>
    </div>

    <div class="bg-paper-texture p-8 md:p-12 rounded-lg shadow-md border border-slate-300">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            <div class="md:col-span-1 text-center md:text-left">
                <div class="w-48 h-48 mx-auto md:mx-0 bg-slate-200 rounded-full border-4 border-slate-800 overflow-hidden mb-6 flex items-center justify-center">
                    <svg class="w-24 h-24 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </div>
                <h3 class="font-cinzel text-xl font-bold text-slate-800">Lubomir Polascin</h3>
                <p class="font-playfair text-slate-600 italic mb-4">Nephrologist, Writer & Programmer</p>
                
                <div class="space-y-2 text-sm text-slate-700">
                    <a href="https://polascin.net" target="_blank" class="block hover:text-slate-900 transition-colors">🌐 polascin.net</a>
                    <a href="https://polascin.com" target="_blank" class="block hover:text-slate-900 transition-colors">🌐 polascin.com</a>
                </div>
            </div>

            <div class="md:col-span-2 space-y-6 text-slate-700 leading-relaxed text-justify">
                <p>
                    My work rests at the intersection of medicine, storytelling, and technology. As a medical doctor specializing in Nephrology (since 1995, focusing on dialysis and renal therapies), medicine sharpens my clinical precision. As a writer, I explore the human condition through fiction and non-fiction. As a self-taught programmer, technology empowers me to solve complex problems bridging the analog and digital divide.
                </p>
                <p>
                    Born in Czechoslovakia in 1971 and raised in Kyjov, my Ruthenian roots deeply inform my worldview. My passions span reading, travel, philosophy, and poetry. Over the years, I have served as Chief Medical Officer at multiple dialysis centers, lectured extensively, and engaged deeply in English-Slovak medical translations and software localization.
                </p>
                <p>
                    <strong>Literary Works:</strong> I have authored multiple books available on Amazon, writing under both my real name and my pen name, <em>Walter Kyo Csoelle</em>. Notable works include the medical non-fiction "Blood Purification" (2019), and contemporary fiction exploring the edge of life, such as "Pulse Of The Body: A Novel of Medicine, Humanity, and the Edge of Life" and "Vital Algorithm".
                </p>
                <div class="pt-4 border-t border-gray-300/50 flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="https://www.amazon.com/stores/author/B07PN436VJ" target="_blank" class="px-6 py-2 bg-slate-800 text-paper font-cinzel text-sm tracking-widest hover:bg-slate-700 transition shadow">Amazon Author Page</a>
                    <a href="https://nephrosite.polascin.net/" target="_blank" class="px-6 py-2 border border-slate-800 text-slate-800 font-cinzel text-sm tracking-widest hover:bg-slate-100 transition shadow-sm">Nephrology Projects</a>
                </div>
            </div>

        </div>
    </div>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
