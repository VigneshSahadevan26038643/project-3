const defaultBooks = [
    {
        id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
        description: "A novel about the serious issues of rape and racial inequality told through the eyes of a child.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Chapter 1</h2><p>When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        category: "Sci-Fi",
        coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop",
        description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Part 1, Chapter 1</h2><p>It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "3",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
        description: "A critique of the American Dream in the 1920s.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Chapter 1</h2><p>In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.</p><p>'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "4",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "Non-Fiction",
        coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop",
        description: "Explores the history of the human species from the Stone Age up to the twenty-first century.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Part 1: The Cognitive Revolution</h2><p>About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang. The story of these fundamental features of our universe is called physics...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "5",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
        description: "An easy and proven way to build good habits and break bad ones.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Introduction: My Story</h2><p>On the final day of my sophomore year of high school, I was hit in the face with a baseball bat. As my classmate took a full swing, the bat slipped out of his hands...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "6",
        title: "Dune",
        author: "Frank Herbert",
        category: "Sci-Fi",
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop",
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.",
        isBorrowed: true,
        borrowDate: new Date(Date.now() - 86400000 * 3).toISOString(), // Borrowed 3 days ago
        borrowerName: "Jane Doe",
        content: "<h2>Book One: Dune</h2><p>A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "7",
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
        description: "A novel about a young Andalusian shepherd in his journey to the pyramids of Egypt.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Part One</h2><p>The boy's name was Santiago. Dusk was falling as the boy arrived with his herd at an abandoned church. The roof had fallen in long ago...</p><p>This is simulated reading content for NexLib.</p>"
    },
    {
        id: "8",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        category: "Technology",
        coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
        description: "A book about computer programming and software engineering.",
        isBorrowed: false,
        borrowDate: null,
        borrowerName: null,
        content: "<h2>Chapter 1: A Pragmatic Philosophy</h2><p>What makes a Pragmatic Programmer? We feel it's an attitude, a style, a philosophy of approaching problems and their solutions...</p><p>This is simulated reading content for NexLib.</p>"
    }
];

// Initialize LocalStorage if empty
if (!localStorage.getItem('bookLibraryData')) {
    localStorage.setItem('bookLibraryData', JSON.stringify(defaultBooks));
}

if (!localStorage.getItem('bookLibraryRevenue')) {
    localStorage.setItem('bookLibraryRevenue', "0");
}

// Global data variables
let booksData = JSON.parse(localStorage.getItem('bookLibraryData'));
let totalRevenue = parseFloat(localStorage.getItem('bookLibraryRevenue'));

function saveData() {
    localStorage.setItem('bookLibraryData', JSON.stringify(booksData));
    localStorage.setItem('bookLibraryRevenue', totalRevenue.toString());
}
