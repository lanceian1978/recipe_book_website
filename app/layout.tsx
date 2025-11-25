import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Recipe Book',
  description: 'A clean recipe book with 50+ recipes. Built for Visual Studio / Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="container">
          <div className="header">
            <div className="brand">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#2a9d8f"/>
                <path d="M7 8c1.5 0 2.5 2 3.5 2s2-2 3.5-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12v4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <div>
                <h1>Recipe Book</h1>
                <div style={{fontSize:12,color:'#6b7280'}}>50+ hand-picked recipes • easy to follow</div>
              </div>
            </div>
            <div className="searchbar">
              <input className="input" placeholder="Search recipes, e.g. pasta, soup" id="site-search" />
              <select className="select" id="tag-filter">
                <option value="">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="dessert">Dessert</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="quick">Quick & Easy</option>
              </select>
            </div>
          </div>

          {children}

          <div className="footer">Made with ❤️ — Inspired by recipetineats.com</div>
        </main>
      </body>
    </html>
  );
}
