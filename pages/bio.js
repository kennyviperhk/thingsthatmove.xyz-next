
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Bio() {
  return (
    <>
      <Header />
      <main style={{ padding: '2rem', color: 'white' }}>
        <h1>Bio Page</h1>
        <p>This is the bio content.</p>
      </main>
      <Footer />
    </>
  );
}
