<?php
require_once __DIR__ . '/includes/functions.php';

// Include common header
include __DIR__ . '/includes/header.php';
?>

<!-- HERDER / EX LIBRIS SECTION -->
<section class="w-full flex flex-col items-center justify-center pt-8 pb-16">
    <!-- Ex Libris Card from Original source -->
    <div class="paper-texture w-80 shadow-2xl relative flex flex-col items-center border border-gray-300 pt-5 px-4 pb-5">
        
        <!-- Outer Border (8px from edge) -->
        <div class="absolute inset-2 border-2 border-slate-800 pointer-events-none"></div>
        <!-- Inner Border (12px from edge) -->
        <div class="absolute inset-3 border border-slate-800 pointer-events-none"></div>
        
        <!-- Corner decorations -->
        <div class="absolute top-2 left-2 w-4 h-4 border-b-2 border-r-2 border-slate-800 pointer-events-none"></div>
        <div class="absolute top-2 right-2 w-4 h-4 border-b-2 border-l-2 border-slate-800 pointer-events-none"></div>
        <div class="absolute bottom-2 left-2 w-4 h-4 border-t-2 border-r-2 border-slate-800 pointer-events-none"></div>
        <div class="absolute bottom-2 right-2 w-4 h-4 border-t-2 border-l-2 border-slate-800 pointer-events-none"></div>

        <!-- HORNÁ ČASŤ (Názov, Rok, Symbol, Meno) -->
        <div class="relative z-10 flex flex-col items-center w-full text-slate-800 mt-1">
            
            <div class="text-center w-full">
                <h1 class="font-cinzel text-3xl tracking-widest mt-1">EX LIBRIS</h1>
                <div class="flex items-center justify-center gap-2 mt-2">
                    <div class="h-px bg-slate-800 w-12"></div>
                    <span class="font-cinzel text-xs tracking-widest text-slate-700">MCMLXXI</span>
                    <div class="h-px bg-slate-800 w-12"></div>
                </div>
            </div>

            <!-- Highly Detailed Seal Symbol -->
            <div class="my-6 w-44 h-44 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" class="w-full h-full text-slate-800">
                    <!-- Circular Border -->
                    <circle cx="110" cy="110" r="105" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4"/>
                    <circle cx="110" cy="110" r="98" fill="none" stroke="currentColor" stroke-width="2"/>

                    <!-- BACKGROUND LAYER -->
                    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round">
                        <path d="M 140 85 Q 130 70 115 75"/>
                        <path d="M 150 45 Q 140 30 120 35"/>
                    </g>
                    <g fill="none" stroke="#f4f1ea" stroke-width="1" stroke-dasharray="2,2">
                        <path d="M 140 85 Q 130 70 115 75"/>
                        <path d="M 150 45 Q 140 30 120 35"/>
                    </g>

                    <!-- MIDDLE LAYER (Book, Inkwell, Quill) -->
                    <path d="M 50 180 Q 80 160 110 170 Q 140 160 170 180 L 160 195 Q 140 175 110 185 Q 80 175 60 195 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M 55 185 Q 80 165 105 175 M 60 190 Q 80 170 105 180" fill="none" stroke="currentColor" stroke-width="1"/>
                    <path d="M 165 185 Q 140 165 115 175 M 160 190 Q 140 170 115 180" fill="none" stroke="currentColor" stroke-width="1"/>
                    <line x1="110" y1="170" x2="110" y2="185" stroke="currentColor" stroke-width="2"/>

                    <!-- Inkwell & Nephrology Shield -->
                    <path d="M 95 170 C 95 160, 85 150, 90 140 L 130 140 C 135 150, 125 160, 125 170 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M 100 140 L 100 130 C 100 125, 120 125, 120 130 L 120 140" fill="none" stroke="currentColor" stroke-width="2"/>
                    <ellipse cx="110" cy="128" rx="12" ry="4" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M 100 145 L 120 145 L 120 155 C 120 165, 110 172, 110 172 C 110 172, 100 165, 100 155 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M 107 150 C 114 148, 116 160, 110 164 C 105 160, 108 155, 110 155 C 111 155, 111 155, 110 155 C 108 155, 105 152, 107 150 Z" fill="currentColor"/>

                    <!-- Quill -->
                    <path d="M 110 128 Q 120 80 170 30" fill="none" stroke="currentColor" stroke-width="3"/>
                    <path d="M 170 30 C 140 35, 100 60, 105 100 C 110 100, 115 105, 110 128" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M 170 30 C 170 50, 160 90, 120 115 C 115 115, 115 120, 110 128" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <g fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M 165 35 Q 150 40 140 55 M 160 45 Q 140 50 130 70 M 150 55 Q 130 60 120 85 M 140 65 Q 120 70 115 95 M 130 75 Q 115 80 110 105 M 120 85 Q 110 90 105 110"/>
                        <path d="M 165 35 Q 165 50 155 65 M 155 45 Q 155 60 145 75 M 145 55 Q 145 75 135 90 M 135 65 Q 135 85 125 100 M 125 75 Q 125 95 115 110"/>
                    </g>

                    <!-- FOREGROUND LAYER -->
                    <g fill="none" stroke="#f4f1ea" stroke-width="10" stroke-linecap="round">
                        <path d="M 90 110 Q 130 100 140 85"/>
                        <path d="M 115 75 Q 135 60 150 45"/>
                    </g>
                    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round">
                        <path d="M 90 110 Q 130 100 140 85"/>
                        <path d="M 115 75 Q 135 60 150 45"/>
                    </g>
                    <g fill="none" stroke="#f4f1ea" stroke-width="1" stroke-dasharray="2,2">
                        <path d="M 90 110 Q 130 100 140 85"/>
                        <path d="M 115 75 Q 135 60 150 45"/>
                    </g>

                    <!-- Snake Head -->
                    <path d="M 120 35 C 110 30, 105 40, 115 45 C 120 47, 125 42, 120 35 Z" fill="currentColor"/>
                    <circle cx="116" cy="38" r="1" fill="#f4f1ea"/>
                    <path d="M 108 38 L 100 35 M 103 36 L 100 39" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
            </div>

            <!-- Meno Majiteľa -->
            <div class="text-center w-full">
                <p class="font-playfair italic text-lg text-slate-600 mb-0 leading-tight">ex bibliotheca</p>
                <h2 class="font-playfair font-bold text-xl tracking-wide text-slate-900">Dr. Lubomiri Polascini</h2>
            </div>
            
        </div>

        <!-- SPODNÁ ČASŤ (Varovania) -->
        <div class="relative z-10 text-center w-full flex flex-col items-center gap-3 px-2 mt-14 mb-0">
            <!-- LATINČINA -->
            <div> 
                <p class="font-cinzel text-[13px] font-bold tracking-widest text-slate-900 leading-tight">
                    TOLLE MANUS<br>AB ISTO LIBRO!
                </p>
            </div>
            <div class="h-px bg-slate-400 w-1/3 my-0.5"></div>
            <!-- STAROGRÉČTINA -->
            <div>
                <p class="font-greek text-[13px] tracking-widest text-slate-800 leading-tight">
                    ΜΗ ΑΠΤΟΥ<br>ΤΟΥ ΒΙΒΛΙΟΥ ΤΟΥΤΟΥ
                </p>
            </div>
            <div class="h-px bg-slate-400 w-1/4 my-0.5"></div>
            <!-- STAROSLOVIENČINA (HLAHOLIKA) -->
            <div>
                <p class="font-glagolitic text-[13px] tracking-widest text-slate-900 leading-none" title="Ne prikasaj sę sijej kъńigě">
                    ⰐⰅ ⰒⰓⰋⰍⰀⰔⰀⰊ ⰔⰤ<br>ⰔⰋⰊⰅⰊ ⰍⰟⰐⰋⰃⰡ
                </p>
            </div>
        </div>
    </div>
    
    <!-- Link to the separated Catalog Page -->
    <div class="mt-8 mb-4 text-center">
        <a href="catalog.php" class="inline-block border border-slate-800 text-slate-800 px-8 py-3 font-cinzel tracking-widest text-lg hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
            View Catalogus Librorum
        </a>
    </div>

</section>

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
