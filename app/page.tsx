export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
        <div className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-green-600">Accueil</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Annonces</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Contact</a>
          <a href="#" className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700">Publier</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-green-600 text-white text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Trouvez votre logement à Ziguinchor</h2>
        <p className="text-lg mb-8">Chambres, appartements, maisons — simple, rapide et gratuit</p>
        <div className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Quartier, type de logement..."
            className="flex-1 px-4 py-3 rounded-l-full text-gray-800 outline-none"
          />
          <button className="bg-white text-green-600 font-bold px-6 py-3 rounded-r-full hover:bg-gray-100">
            Rechercher
          </button>
        </div>
      </section>

      {/* FILTRES */}
      <section className="flex justify-center gap-4 py-6 flex-wrap">
        {["Tous", "Chambre", "Appartement", "Maison", "Studio"].map((type) => (
          <button key={type} className="border border-green-600 text-green-600 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition">
            {type}
          </button>
        ))}
      </section>

      {/* ANNONCES */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { titre: "Chambre meublée", quartier: "Lyndiane", prix: "25 000", type: "Chambre" },
          { titre: "Appartement 2 pièces", quartier: "Boucotte", prix: "60 000", type: "Appartement" },
          { titre: "Maison 4 pièces", quartier: "Kandialang", prix: "120 000", type: "Maison" },
          { titre: "Studio moderne", quartier: "Santhiaba", prix: "35 000", type: "Studio" },
          { titre: "Chambre simple", quartier: "Tilène", prix: "15 000", type: "Chambre" },
          { titre: "Appartement meublé", quartier: "Diabir", prix: "80 000", type: "Appartement" },
        ].map((annonce, i) => (
          <div key={i} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
            <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-4xl">🏠</div>
            <div className="p-4">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{annonce.type}</span>
              <h3 className="font-bold text-lg mt-2">{annonce.titre}</h3>
              <p className="text-gray-500 text-sm">📍 {annonce.quartier}, Ziguinchor</p>
              <p className="text-green-600 font-bold mt-2">{annonce.prix} FCFA / mois</p>
              <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                Voir le logement
              </button>
            </div>
          </div>
        ))}
      </section>

    </main>
  );
}