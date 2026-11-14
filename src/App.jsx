import {
  ArrowRight,
  Clock3,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  Sprout,
} from "lucide-react";

const navItems = ["About", "Menu", "Contact"];

// Menu data is kept as structured content so new pages can reuse it later.
const menuItems = [
  {
    name: "Signature Kopi",
    price: "S$3.80",
    note: "Nanyang-style kopi with oat milk and a caramelised aroma.",
    image:
      "https://www.visitsingapore.com/vi_vn/things-to-do/dining/local-food-and-drinks/_jcr_content/root/responsivegrid/containercomponent_c/par/columncntrl/par1/image.img.jpeg/1772172552090/kopi-1148x1000.jpeg",
    alt: "A white ceramic cup of Singapore kopi on a saucer.",
  },
  {
    name: "Kaya Toast Set",
    price: "S$6.90",
    note: "Plant-based kaya, coconut spread, seeded toast, and kopi.",
    image:
      "https://dam.mediacorp.sg/image/upload/s--7BDWriAF--/c_fill%2Cg_auto/f_auto%2Cq_auto/v1/8world/images/2026/03/30/20260330_ls_peh-gao-kaya-toast-set.jpg?itok=6vK5eIr8",
    alt: "Kaya toast breakfast set with soft-boiled egg and kopi.",
  },
  {
    name: "Uncle's Laksa",
    price: "S$9.80",
    note: "A creamy, plant-based laksa with tofu puffs and herbs.",
    image:
      "https://static.wixstatic.com/media/60409b_8a81539615af4d6ba2270331c04a4f29~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/60409b_8a81539615af4d6ba2270331c04a4f29~mv2.jpg",
    alt: "A bowl of Nyonya laksa with tofu puffs, prawns, fish cake and herbs.",
  },
];

const openingHours = [
  "Mon-Fri: 7:30 AM - 8:30 PM",
  "Sat-Sun: 8:00 AM - 9:00 PM",
];

export default function App() {
  return (
    <div className="min-h-screen bg-ocean-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <About />
        <MenuPreview />
        <Contact />
        <DesignReference />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ocean-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a className="flex items-center gap-3" href="#home" aria-label="Blue Ocean Kopi & Co. home">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ocean-600 text-lg font-black text-white">
            BO
          </span>
          <span>
            <strong className="block text-lg leading-tight">Blue Ocean Kopi & Co.</strong>
            <small className="text-sm text-stone-blue">plant-based kopi at YKK Street</small>
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-ocean-100"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          className="hidden items-center gap-2 rounded-lg bg-leaf-700 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-leaf-500 sm:flex"
          href="#contact"
        >
          Visit us <ArrowRight size={17} />
        </a>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ocean-100 bg-white text-ocean-600 md:hidden"
          type="button"
          aria-label="Navigation menu"
        >
          <MenuIcon size={22} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-ocean-50 via-white to-ocean-100">
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-ocean-600 shadow-sm ring-1 ring-ocean-100">
            <Leaf size={16} /> Neighbourhood plant-based cafe
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] text-slate-950 md:text-7xl">
            Blue Ocean Kopi & Co.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Warm kopi, kaya toast, and Singapore comfort food made lighter with plant-based ingredients at YKK Street.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-lg bg-leaf-700 px-6 py-4 font-black text-white shadow-lg shadow-leaf-700/15 hover:bg-leaf-500"
              href="#menu"
            >
              View menu <ArrowRight size={18} />
            </a>
            <a
              className="inline-flex items-center rounded-lg border border-ocean-100 bg-white px-6 py-4 font-black text-ocean-600 hover:bg-ocean-50"
              href="#about"
            >
              About us
            </a>
          </div>
        </div>

        <figure className="rounded-lg border border-ocean-100 bg-white p-3 shadow-2xl shadow-ocean-600/10">
          <img
            className="aspect-[16/10] w-full rounded-md object-cover"
            src="/images/kopi-site-reference.png"
            alt="PDF reference image showing kopi and kaya toast from the Kopi & Co. assignment"
          />
          <figcaption className="px-2 pt-3 text-sm text-stone-blue">
            Reused visual reference from the assignment PDF, adapted for the Blue Ocean Kopi & Co. page.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">About us</p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Familiar kopitiam mornings, refreshed with a greener table.
          </h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-slate-600">
          <p>
            Blue Ocean Kopi & Co. is a warm, modern cafe for office workers, neighbours, and weekend walkers near YKK Street. We keep the heart of local kopi culture while making the menu gentler, lighter, and plant-forward.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={<Sprout />} title="Plant-based" text="Oat milk, coconut kaya, tofu puffs, and vegetable-rich mains." />
            <InfoCard icon={<Clock3 />} title="Slow mornings" text="Designed for breakfast, quick kopi breaks, and quiet catch-ups." />
            <InfoCard icon={<MapPin />} title="YKK Street" text="A neighbourhood stop in Singapore with friendly counter service." />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <article className="rounded-lg border border-ocean-100 bg-ocean-50 p-5">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ocean-100 text-ocean-600">
        {icon}
      </div>
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}

function MenuPreview() {
  return (
    <section id="menu" className="bg-soft-grey px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-ocean-600">Menu preview</p>
            <h2 className="text-4xl font-black text-slate-950 md:text-5xl">Three favourites to start.</h2>
          </div>
          <p className="max-w-md text-slate-600">
            Prices are listed in Singapore dollars and kept prominent for quick scanning on mobile.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {menuItems.map((item) => (
            <article className="rounded-lg border border-ocean-100 bg-white p-6 shadow-sm" key={item.name}>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black text-slate-950">{item.name}</h3>
                  <span className="shrink-0 rounded-full bg-ocean-100 px-3 py-1 text-sm font-black text-ocean-600">
                    {item.price}
                  </span>
                </div>
                <p className="mt-5 leading-7 text-slate-600">{item.note}</p>
                <img
                  className="mt-6 aspect-[4/3] w-full rounded-lg border border-ocean-100 object-cover"
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-ocean-600 px-5 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.8fr] md:items-start">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-100">Contact us</p>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">Drop by for kopi on YKK Street.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ocean-100">
            Find us at YKK Street in Singapore. Come for breakfast, a plant-based laksa lunch, or a calmer afternoon kopi.
          </p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur">
          <div className="mb-6">
            <h3 className="font-black">Address</h3>
            <p className="mt-2 text-ocean-100">YKK Street, Singapore</p>
          </div>
          <div>
            <h3 className="font-black">Opening hours</h3>
            <ul className="mt-2 space-y-2 text-ocean-100">
              {openingHours.map((hours) => (
                <li key={hours}>{hours}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignReference() {
  return (
    <section className="bg-white px-5 py-16 md:px-8" aria-labelledby="reference-title">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">Build reference</p>
          <h2 id="reference-title" className="text-3xl font-black text-slate-950">
            Vite, React, and Tailwind CSS.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            This implementation follows the attached requirement photo by using the required front-end stack and a grey, light blue, and green UI palette.
          </p>
        </div>
        <img
          className="rounded-lg border border-ocean-100 shadow-xl shadow-ocean-600/10"
          src="/images/codex-build-reference.png"
          alt="PDF reference image showing the Vite React Tailwind build prompt"
        />
      </div>
    </section>
  );
}
