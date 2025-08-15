import './globals.css';
import Header from './components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>AI Campus Assignment</title>
        <meta name="description" content="Expenses app with auth, CRUD, pagination, filter, search, sorting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Header />
          
          <main className="fade-in">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Made with ❤️ for <span className="text-blue-400 font-medium">Shipsy</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                © 2024 AI Campus. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
