const defaultBooks = [
    {
        id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
        description: "A novel about the serious issues of rape and racial inequality told through the eyes of a child.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        category: "Sci-Fi",
        coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop",
        description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "3",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
        description: "A critique of the American Dream in the 1920s.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "4",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "Non-Fiction",
        coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop",
        description: "Explores the history of the human species from the Stone Age up to the twenty-first century.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "5",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
        description: "An easy and proven way to build good habits and break bad ones.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "6",
        title: "Dune",
        author: "Frank Herbert",
        category: "Sci-Fi",
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop",
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.",
        isBorrowed: true,
        borrowDate: new Date(Date.now() - 86400000 * 3).toISOString() // Borrowed 3 days ago
    },
    {
        id: "7",
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
        description: "A novel about a young Andalusian shepherd in his journey to the pyramids of Egypt.",
        isBorrowed: false,
        borrowDate: null
    },
    {
        id: "8",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        category: "Technology",
        coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
        description: "A book about computer programming and software engineering.",
        isBorrowed: false,
        borrowDate: null
    }
];

// Initialize LocalStorage if empty
if (!localStorage.getItem('bookLibraryData')) {
    localStorage.setItem('bookLibraryData', JSON.stringify(defaultBooks));
}

// Global data array
let booksData = JSON.parse(localStorage.getItem('bookLibraryData'));

function saveData() {
    localStorage.setItem('bookLibraryData', JSON.stringify(booksData));
}
