const authors = [
  {
    name: "Jackson Wayne",
    image: "/authors/Jackson Wayne.png",
    bio: "Former semi-pro midfielder turned football journalist. Jackson brings tactical insight and raw passion to every piece he writes.",
  },
  {
    name: "Dent Prov",
    image: "/authors/Dent Prov.png",
    bio: "A coaching veteran with 15 years on the touchline. Dent breaks down the game from a manager\u2019s perspective.",
  },
  {
    name: "Halley Watikise",
    image: "/authors/Halley Watikise.png",
    bio: "Youth development specialist and grassroots football advocate. Halley covers the next generation of talent.",
  },
  {
    name: "Johannes Cobelt",
    image: "/authors/Johannes-Cobelt.png",
    bio: "Sports psychologist and culture writer. Johannes explores the mind behind the game.",
  },
  {
    name: "Hell Mandat",
    image: "/authors/Hell Mandat.png",
    bio: "Women\u2019s football champion and equality advocate. Hell covers the rapid growth of women\u2019s football worldwide.",
  },
  {
    name: "John Stu",
    image: "/authors/John-Stu.png",
    bio: "Community football organizer and mental health advocate. John writes about football\u2019s power to transform lives.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 dark:bg-gray-950">
      <h1 className="text-4xl font-bold text-green-900 dark:text-green-400 mb-6">About 5s Arena</h1>
      <img
        src="/posts/about.png"
        alt="About 5s Arena"
        className="w-full rounded-xl mb-8 shadow-lg"
      />
      <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-4">
        <p>
          Welcome to <strong>5s Arena Blog</strong> — your ultimate destination for football
          culture, stories, legends, and the beautiful game.
        </p>
        <p>
          We celebrate the sport from grassroots to glory. Whether it&apos;s the latest tactical
          breakdowns, legendary player profiles, or the culture surrounding 5-a-side football,
          we&apos;ve got you covered.
        </p>
        <p>
          Our team of passionate writers and football enthusiasts bring you fresh content daily,
          covering everything from match analysis to the stories behind the game that don&apos;t
          make the headlines.
        </p>
      </div>

      {/* Authors Section */}
      <h2 className="text-3xl font-bold text-green-900 dark:text-green-400 mt-16 mb-8">Meet Our Authors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {authors.map((author) => (
          <div key={author.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center">
            <img
              src={author.image}
              alt={author.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{author.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{author.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
