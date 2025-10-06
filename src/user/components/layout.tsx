import React from 'react';
import Header from './header.tsx';
import Footer from './footer.jsx';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 min-h-[80vh] page-padding-x py-4'>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

