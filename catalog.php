<?php
require_once __DIR__ . '/includes/functions.php';

// Load metadata
$books = getBooks();

// Include common header
include __DIR__ . '/includes/header.php';
?>

<!-- CATALOG SECTION -->
<section id="catalog" class="w-full max-w-7xl mx-auto px-4 py-12">
    
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-gray-300">
        <div>
            <h2 class="font-cinzel text-3xl font-bold tracking-wider text-slate-800">Catalogus Librorum</h2>
            <p class="font-playfair italic text-slate-600 mt-2">The complete collection of medical, scientific, fiction, and non-fiction works.</p>
        </div>
        
        <div class="mt-6 md:mt-0 flex gap-4 w-full md:w-auto">
            <div class="relative w-full md:w-64">
                <input type="text" id="search-books" aria-label="Search catalog by title or author" placeholder="Search title or author..." class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow">
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
