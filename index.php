<?php
require_once __DIR__ . '/includes/functions.php';

// Load metadata
$books = getBooks();

// Include common header
include __DIR__ . '/includes/header.php';
?>

<!-- HERDER / EX LIBRIS SECTION -->
<section class="w-full flex items-center justify-center pt-8 pb-16">
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
</section>

<!-- CATALOG SECTION -->
<section id="catalog" class="w-full max-w-7xl mx-auto px-4 py-12">
    
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-gray-300">
        <div>
            <h2 class="font-cinzel text-3xl font-bold tracking-wider text-slate-800">Catalogus Librorum</h2>
            <p class="font-playfair italic text-slate-600 mt-2">The complete collection of medical and scientific works.</p>
        </div>
        
        <div class="mt-6 md:mt-0 flex gap-4 w-full md:w-auto">
            <div class="relative w-full md:w-64">
                <input type="text" id="search-books" placeholder="Search title or author..." class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow">
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
    </div>

    <?php if (empty($books)): ?>
        <div class="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <h3 class="font-cinzel text-xl text-slate-700">No Books Found</h3>
            <p class="font-playfair text-slate-500 mt-2 italic">The catalog is currently empty. Please add books to the data source.</p>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="book-grid">
            <?php foreach ($books as $book): ?>
                <div class="book-item book-card bg-paper-texture rounded-lg overflow-hidden flex flex-col transition-all duration-300 transform" 
                     data-title="<?php echo esc_html($book['title']); ?>" 
                     data-author="<?php echo esc_html($book['author']); ?>"
                     data-category="<?php echo esc_html($book['category'] ?? ''); ?>">
                    
                    <div class="book-card-inner paper-texture h-full flex flex-col border border-transparent hover:border-slate-300 rounded-lg overflow-hidden">
                        
                        <!-- Book Cover placeholder -> we can use an image if provided, else a stylized div -->
                        <?php if(!empty($book['cover_image'])): ?>
                            <div class="h-64 overflow-hidden relative border-b border-gray-300">
                                <img src="<?php echo esc_html($book['cover_image']); ?>" alt="Cover of <?php echo esc_html($book['title']); ?>" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div class="absolute bottom-4 left-4 right-4">
                                     <span class="inline-block bg-slate-800 text-paper text-xs px-2 py-1 rounded font-cinzel tracking-widest shadow">
                                        <?php echo esc_html($book['year']); ?>
                                     </span>
                                </div>
                            </div>
                        <?php else: ?>
                            <div class="h-64 bg-slate-800 flex items-center justify-center p-6 border-b border-gray-300 relative overflow-hidden">
                                <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
                                <h3 class="font-cinzel text-white text-center text-xl z-10 opacity-80"><?php echo esc_html($book['title']); ?></h3>
                            </div>
                        <?php endif; ?>

                        <!-- Book Details -->
                        <div class="p-6 flex-grow flex flex-col">
                            <div class="mb-4">
                                <h3 class="font-cinzel font-bold text-xl text-slate-800 mb-1 leading-tight"><?php echo esc_html($book['title']); ?></h3>
                                <p class="font-playfair italic text-slate-600 text-sm"><?php echo esc_html($book['author']); ?></p>
                            </div>
                            
                            <p class="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                                <?php echo esc_html($book['description']); ?>
                            </p>
                            
                            <div class="mt-auto pt-4 border-t border-gray-300/50 flex flex-wrap gap-y-2 text-xs font-mono text-slate-500 justify-between items-center">
                                <span>ISBN: <?php echo esc_html($book['isbn']); ?></span>
                                <?php if(!empty($book['language'])): ?>
                                    <span class="bg-gray-200 px-2 py-1 rounded-sm text-slate-600 uppercase tracking-wide text-[10px]"><?php echo esc_html($book['language']); ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
