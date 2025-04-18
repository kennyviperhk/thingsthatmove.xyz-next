'use client';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Things That Move Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 