<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ex Libris & Catalog - Dr. Lubomiri Polascini</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Glagolitic&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'paper': '#f4f1ea',
                        'ink': '#1e293b'
                    }
                }
            }
        }
    </script>
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-gray-200 min-h-screen text-slate-800 antialiased flex flex-col font-sans">
    
    <!-- Main Header Area - Could contain navigation if needed later -->
    <header class="w-full bg-slate-900 text-paper py-4 shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 flex justify-between items-center">
            <div class="text-xl font-cinzel tracking-widest">Bibliotheca Polascini</div>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="index.php" class="hover:text-gray-300 transition-colors font-playfair italic">Home</a></li>
                    <li><a href="catalog.php" class="hover:text-gray-300 transition-colors font-playfair italic">Catalog</a></li>
                    <li><a href="#about" class="hover:text-gray-300 transition-colors font-playfair italic">About</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="flex-grow flex flex-col items-center pt-10 pb-20 w-full relative">
