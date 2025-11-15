<?php
// ============================================
// Daily Quotes & Notes - PHP Backend
// ============================================

// Predefined array of motivational quotes
$quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The only impossible journey is the one you never begin. - Tony Robbins",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "Success is not final, failure is not fatal. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt"
];

// Get random quote
$randomQuote = $quotes[array_rand($quotes)];

// Path to notes file
$notesFile = __DIR__ . '/notes.txt';

// Create notes.txt if it doesn't exist
if (!file_exists($notesFile)) {
    touch($notesFile);
    chmod($notesFile, 0666);
}

// Handle form submission
$successMessage = '';
$errorMessage = '';

if (isset($_SERVER['REQUEST_METHOD']) === 'POST') {
    if (isset($_POST['note']) && !empty(trim($_POST['note']))) {
        $note = trim($_POST['note']);
        
        // Validate note is not too long
        if (strlen($note) > 500) {
            $errorMessage = "Note is too long (max 500 characters).";
        } else {
            // Create formatted note with timestamp
            $timestamp = date('Y-m-d H:i:s');
            $noteEntry = "[{$timestamp}] {$note}";
            
            // Append note to file with newline
            $bytes = file_put_contents($notesFile, $noteEntry . "\n", FILE_APPEND);
            
            if ($bytes !== false) {
                $successMessage = "✓ Note added successfully!";
            } else {
                $errorMessage = "✗ Error saving note. Please check file permissions.";
            }
        }
    } else {
        $errorMessage = "✗ Please enter a note.";
    }
}

// Read all notes from file
$allNotes = [];
if (file_exists($notesFile) && is_readable($notesFile)) {
    $notesContent = @file_get_contents($notesFile);
    if (!empty($notesContent)) {
        $allNotes = array_filter(explode("\n", $notesContent));
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Quotes & Notes</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header Section -->
    <header class="header">
        <div class="container">
            <h1> Daily Quotes & Notes</h1>
            <p class="tagline">Inspire your day, capture your thoughts</p>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            
            <!-- Quote Card -->
            <section class="quote-section">
                <div class="card quote-card">
                    <h2>Quote of the Day</h2>
                    <blockquote class="quote-text">
                        <?php echo htmlspecialchars($randomQuote); ?>
                    </blockquote>
                    <p class="quote-refresh">
                        <small>Reload the page for a new quote</small>
                    </p>
                </div>
            </section>

            <!-- Notes Form Section -->
            <section class="form-section">
                <div class="card form-card">
                    <h2>Add Your Note</h2>
                    
                    <?php if (!empty($successMessage)): ?>
                        <div class="alert alert-success">
                            <?php echo htmlspecialchars($successMessage); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($errorMessage)): ?>
                        <div class="alert alert-error">
                            <?php echo htmlspecialchars($errorMessage); ?>
                        </div>
                    <?php endif; ?>

                    <form method="POST" action="" class="note-form">
                        <div class="form-group">
                            <label for="note">Your Note:</label>
                            <textarea 
                                id="note" 
                                name="note" 
                                placeholder="Write your thoughts here... (max 500 characters)" 
                                rows="5"
                                maxlength="500"
                                required
                            ></textarea>
                            <small class="char-count">
                                <span id="charCount">0</span>/500
                            </small>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Note</button>
                    </form>
                </div>
            </section>

            <!-- Notes Display Section -->
            <section class="notes-section">
                <div class="card notes-card">
                    <h2>All Notes (<?php echo count($allNotes); ?>)</h2>
                    
                    <?php if (empty($allNotes)): ?>
                        <p class="no-notes">No notes yet. Start by adding your first note! 📝</p>
                    <?php else: ?>
                        <div class="notes-list">
                            <?php foreach (array_reverse($allNotes) as $note): ?>
                                <div class="note-item">
                                    <?php echo htmlspecialchars($note); ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </section>

        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Daily Quotes & Notes. Keep inspiring, keep creating.</p>
        </div>
    </footer>

    <!-- Character Counter Script -->
    <script>
        const textarea = document.getElementById('note');
        const charCount = document.getElementById('charCount');

        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
        <form method="POST" action="index.php">
    <textarea name="note" placeholder="Write a note"></textarea>
    <button type="submit">Save Note</button>
</form>

    </script>
</body>
</html>
