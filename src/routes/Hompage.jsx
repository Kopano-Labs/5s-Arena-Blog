import Navbar from "../components/Navbar.jsx";

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Welcome to 5s Arena Blog</h1>
        <p>This is your homepage. Add content here.</p>
      </main>
    </div>
  );
};

export default Homepage;