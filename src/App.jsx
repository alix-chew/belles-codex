import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Clock3,
  Crown,
  Leaf,
  LogOut,
  MapPin,
  MailCheck,
  Menu as MenuIcon,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const navItems = [
  { label: "About", href: "#/about" },
  { label: "Menu", href: "#/menu" },
  { label: "Contact", href: "#/contact" },
  { label: "Login", href: "#/login" },
];

const roleLabels = {
  customer: "Customer",
  staff: "Staff",
  manager: "Manager",
  owner: "Owner",
};

const teamRoles = ["staff", "manager", "owner"];
const leadershipRoles = ["manager", "owner"];

// Menu data is kept as structured content so menu cards and order records stay consistent.
const menuItems = [
  {
    id: "signature-kopi",
    name: "Signature Kopi",
    price: "S$3.80",
    priceValue: 3.8,
    note: "Nanyang-style kopi with oat milk and a caramelised aroma.",
    image:
      "https://www.visitsingapore.com/vi_vn/things-to-do/dining/local-food-and-drinks/_jcr_content/root/responsivegrid/containercomponent_c/par/columncntrl/par1/image.img.jpeg/1772172552090/kopi-1148x1000.jpeg",
    alt: "A white ceramic cup of Singapore kopi on a saucer.",
  },
  {
    id: "kaya-toast-set",
    name: "Kaya Toast Set",
    price: "S$6.90",
    priceValue: 6.9,
    note: "Plant-based kaya, coconut spread, seeded toast, and kopi.",
    image:
      "https://dam.mediacorp.sg/image/upload/s--7BDWriAF--/c_fill%2Cg_auto/f_auto%2Cq_auto/v1/8world/images/2026/03/30/20260330_ls_peh-gao-kaya-toast-set.jpg?itok=6vK5eIr8",
    alt: "Kaya toast breakfast set with soft-boiled egg and kopi.",
  },
  {
    id: "uncles-laksa",
    name: "Uncle's Laksa",
    price: "S$9.80",
    priceValue: 9.8,
    note: "A creamy, plant-based laksa with tofu puffs and herbs.",
    image:
      "https://static.wixstatic.com/media/60409b_8a81539615af4d6ba2270331c04a4f29~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/60409b_8a81539615af4d6ba2270331c04a4f29~mv2.jpg",
    alt: "A bowl of Nyonya laksa with tofu puffs, prawns, fish cake and herbs.",
  },
  {
    id: "signature-teh",
    name: "Signature Teh",
    price: "S$3.80",
    priceValue: 3.8,
    note: "Silky Singapore-style milk tea with a smooth, lightly frothy finish.",
    image: "https://silveractivities.com/assets/images/singapore-drinks/teh.png",
    alt: "A cup of Singapore teh milk tea on a saucer with an orange spoon.",
  },
  {
    id: "aunties-mee-siam",
    name: "Auntie's Mee Siam",
    price: "S$9.80",
    priceValue: 9.8,
    note: "Tangy, spicy mee siam with rice vermicelli, tofu puffs, egg, and calamansi.",
    image: "https://cdn.shopify.com/s/files/1/0351/4636/7111/t/8/assets/pf-c605cdf2--Mee-Siam-Square.jpg?v=1587747219",
    alt: "A bowl of mee siam with rice vermicelli, egg, tofu puffs, greens and calamansi.",
  },
];

const openingHours = [
  "Mon-Fri: 7:30 AM - 8:30 PM",
  "Sat-Sun: 8:00 AM - 9:00 PM",
];

function getRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const [path] = hash.split("?");
  const parts = path.split("/").filter(Boolean);

  return {
    page: parts[0] || "home",
    itemId: parts[1] || null,
  };
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) {
      setProfile(null);
      return undefined;
    }

    let isCurrent = true;

    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!isCurrent) return;

      if (error) {
        setProfile({
          full_name: session.user.user_metadata?.full_name || session.user.email,
          role: session.user.user_metadata?.role || "customer",
        });
        return;
      }

      setProfile(data);
    }

    loadProfile();

    return () => {
      isCurrent = false;
    };
  }, [session]);

  const activeRole = profile?.role || session?.user?.user_metadata?.role || "customer";
  const displayName = profile?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email;

  return (
    <div className="min-h-screen bg-ocean-50 text-slate-900">
      <Header session={session} route={route} />
      <main>
        {route.page === "about" && <AboutPage />}
        {route.page === "menu" && (
          <MenuPage
            selectedItemId={route.itemId}
            session={session}
            activeRole={activeRole}
            displayName={displayName}
          />
        )}
        {route.page === "contact" && <ContactPage />}
        {route.page === "login" && (
          <LoginPage
            session={session}
            activeRole={activeRole}
            displayName={displayName}
            setProfile={setProfile}
          />
        )}
        {route.page === "customer-purchases" && (
          <PlaceholderToolPage
            session={session}
            activeRole={activeRole}
            allowedRoles={["customer", "staff", "manager", "owner"]}
            eyebrow="Customer purchases"
            title="Purchase tools are coming next."
            text="This page will hold customer order history, favourites, and booking requests. For now, orders can be placed from the Menu page."
            actionLabel="Go to menu"
            actionHref="#/menu"
          />
        )}
        {route.page === "sales" && (
          <PlaceholderToolPage
            session={session}
            activeRole={activeRole}
            allowedRoles={teamRoles}
            eyebrow="Sales"
            title="Sales tools are ready for the next build."
            text="Staff, managers, and owners will use this page to check incoming orders and daily sales activity."
            actionLabel="Back to account"
            actionHref="#/login"
          />
        )}
        {route.page === "management" && (
          <PlaceholderToolPage
            session={session}
            activeRole={activeRole}
            allowedRoles={leadershipRoles}
            eyebrow="Management"
            title="Management controls are parked here."
            text="Managers and owners will use this area for operational reports, menu updates, and staff-facing controls."
            actionLabel="Back to account"
            actionHref="#/login"
          />
        )}
        {route.page === "team" && <TeamAccessPage session={session} activeRole={activeRole} />}
        {!["about", "menu", "contact", "login", "customer-purchases", "sales", "management", "team"].includes(route.page) && <HomePage />}
      </main>
    </div>
  );
}

function Header({ session, route }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ocean-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a className="flex items-center gap-3" href="#/" aria-label="Blue Ocean Kopi & Co. home">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ocean-600 text-lg font-black text-white">
            BO
          </span>
          <span>
            <strong className="block text-lg leading-tight">Blue Ocean Kopi & Co.</strong>
            <small className="text-sm text-stone-blue">plant-based kopi at YKK Street</small>
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = route.page === item.href.replace("#/", "");

            return (
              <a
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  isActive ? "bg-ocean-100 text-ocean-600" : "text-slate-700 hover:bg-ocean-100"
                }`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          className="hidden items-center gap-2 rounded-lg bg-leaf-700 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-leaf-500 sm:flex"
          href="#/login"
        >
          {session ? "Account" : "Log in"} <ArrowRight size={17} />
        </a>

        <a
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ocean-100 bg-white text-ocean-600 md:hidden"
          href="#/login"
          aria-label="Open login"
        >
          <MenuIcon size={22} />
        </a>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <MenuPreview />
      <ContactPage />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ocean-50 via-white to-ocean-100">
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
              href="#/menu"
            >
              View menu <ArrowRight size={18} />
            </a>
            <a
              className="inline-flex items-center rounded-lg border border-ocean-100 bg-white px-6 py-4 font-black text-ocean-600 hover:bg-ocean-50"
              href="#/about"
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
            Blue Ocean Kopi & Co. keeps the heart of local breakfast culture, refreshed with a greener table.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function MenuPreview() {
  return (
    <section className="bg-soft-grey px-5 py-20 md:px-8">
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
          {menuItems.slice(0, 3).map((item) => (
            <a
              className="rounded-lg border border-ocean-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              href={`#/menu/${item.id}`}
              key={item.id}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-black text-slate-950">{item.name}</h3>
                <span className="shrink-0 rounded-full bg-ocean-100 px-3 py-1 text-sm font-black text-ocean-600">
                  {item.price}
                </span>
              </div>
              <img
                className="mt-6 aspect-[4/3] w-full rounded-lg border border-ocean-100 object-cover"
                src={item.image}
                alt={item.alt}
                loading="lazy"
              />
              <p className="mt-5 leading-7 text-slate-600">{item.note}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">About us</p>
          <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Familiar kopitiam mornings, refreshed with a greener table.
          </h1>
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

function MenuPage({ selectedItemId, session, activeRole, displayName }) {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(menuItems.map((item) => [item.id, 1]))
  );
  const [orderStatus, setOrderStatus] = useState("");
  const [orderingItemId, setOrderingItemId] = useState("");
  const selectedItem = useMemo(
    () => menuItems.find((item) => item.id === selectedItemId),
    [selectedItemId]
  );

  async function handleOrder(item) {
    if (!session?.user) {
      window.location.hash = "#/login";
      return;
    }

    const quantity = Math.max(1, Math.min(12, Number(quantities[item.id]) || 1));
    const total = Number((item.priceValue * quantity).toFixed(2));

    setOrderingItemId(item.id);
    setOrderStatus("");

    const { error } = await supabase.from("orders").insert({
      user_id: session.user.id,
      item_id: item.id,
      item_name: item.name,
      quantity,
      total_sgd: total,
      status: "pending",
    });

    setOrderingItemId("");

    if (error) {
      setOrderStatus(`We could not send that order yet: ${error.message}`);
      return;
    }

    setOrderStatus(`${quantity} x ${item.name} received. We will prepare it shortly.`);
  }

  return (
    <section className="bg-soft-grey px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-ocean-600">Full menu</p>
            <h1 className="text-4xl font-black text-slate-950 md:text-6xl">Choose your kopi break.</h1>
          </div>
          <p className="max-w-md text-slate-600">
            Select a quantity and order from this page. If you are not logged in, we will send you to the login page first.
          </p>
        </div>

        {session && (
          <div className="mb-6 rounded-lg border border-ocean-100 bg-white p-4 text-sm text-slate-600">
            Ordering as <strong className="text-slate-950">{displayName}</strong> ({roleLabels[activeRole] || activeRole}).
          </div>
        )}

        {orderStatus && <p className="mb-6 rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">{orderStatus}</p>}

        <div className="grid gap-6">
          {menuItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            const quantity = Math.max(1, Math.min(12, Number(quantities[item.id]) || 1));
            const total = item.priceValue * quantity;

            return (
              <article
                className={`grid gap-6 rounded-lg border bg-white p-5 shadow-sm md:grid-cols-[280px_1fr] ${
                  isSelected ? "border-ocean-600 ring-4 ring-ocean-100" : "border-ocean-100"
                }`}
                id={item.id}
                key={item.id}
              >
                <img className="aspect-[4/3] w-full rounded-lg object-cover" src={item.image} alt={item.alt} />
                <div className="grid gap-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-slate-950">{item.name}</h2>
                      <p className="mt-3 max-w-2xl leading-7 text-slate-600">{item.note}</p>
                    </div>
                    <span className="rounded-full bg-ocean-100 px-4 py-2 text-sm font-black text-ocean-600">
                      {item.price}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end">
                    <label className="grid gap-2 text-sm font-black text-slate-950">
                      Quantity
                      <input
                        className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                        type="number"
                        min="1"
                        max="12"
                        value={quantity}
                        onChange={(event) =>
                          setQuantities((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className="rounded-lg border border-ocean-100 bg-ocean-50 px-4 py-3">
                      <p className="text-xs font-black uppercase text-ocean-600">Total</p>
                      <p className="text-2xl font-black text-slate-950">S${total.toFixed(2)}</p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf-700 px-5 py-4 font-black text-white hover:bg-leaf-500 disabled:cursor-not-allowed disabled:opacity-60"
                      type="button"
                      disabled={orderingItemId === item.id}
                      onClick={() => handleOrder(item)}
                    >
                      <ShoppingBag size={18} />
                      {session ? "Order" : "Log in to order"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="bg-ocean-600 px-5 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.8fr] md:items-start">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-100">Contact us</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Drop by for kopi on YKK Street.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ocean-100">
            Find us at YKK Street in Singapore. Come for breakfast, a plant-based laksa lunch, or a calmer afternoon kopi.
          </p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur">
          <div className="mb-6">
            <h2 className="font-black">Address</h2>
            <p className="mt-2 text-ocean-100">YKK Street, Singapore</p>
          </div>
          <div>
            <h2 className="font-black">Opening hours</h2>
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

function LoginPage({ session, activeRole, displayName, setProfile }) {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [isBusy, setIsBusy] = useState(false);
  const isTeam = teamRoles.includes(activeRole);
  const isLeadership = leadershipRoles.includes(activeRole);

  async function handleAuthSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      setStatus({ tone: "error", message: "Login is not ready yet. Please try again later." });
      return;
    }

    setIsBusy(true);
    setStatus({ tone: "info", message: "" });

    const credentials = {
      email,
      password,
    };

    const { data, error } =
      mode === "signup"
        ? await supabase.auth.signUp({
            ...credentials,
            options: {
              data: {
                full_name: fullName,
                role: "customer",
              },
              emailRedirectTo: `${window.location.origin}/#/login`,
            },
          })
        : await supabase.auth.signInWithPassword(credentials);

    setIsBusy(false);

    if (error) {
      setStatus({ tone: "error", message: error.message });
      return;
    }

    if (mode === "signup") {
      setFullName("");
      setEmail("");
      setPassword("");
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword(credentials);

        if (signInError) {
          setStatus({
            tone: "success",
            message: "Account created. You can sign in now.",
          });
          return;
        }
      }

      setStatus({ tone: "success", message: "Account created. Taking you back to the home page." });
      window.setTimeout(() => {
        window.location.hash = "#/";
      }, 600);
      return;
    }

    setStatus({ tone: "success", message: "Signed in. Taking you back to the home page." });
    window.setTimeout(() => {
      window.location.hash = "#/";
    }, 600);
  }

  async function handleSignOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setProfile(null);
    setStatus({ tone: "info", message: "Signed out." });
  }

  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">Account</p>
          <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Log in or create an account.
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-slate-600">
            Sign in to order online, save your favourites, and request table bookings.
          </p>
        </div>

        <div className="rounded-lg border border-ocean-100 bg-ocean-50 p-6 shadow-sm">
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-lg border border-ocean-100 bg-white p-4 text-sm leading-6 text-slate-600">
              <strong className="block text-slate-950">Login is being set up</strong>
              Please check back shortly.
            </div>
          )}

          {session ? (
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
                  {activeRole === "owner" ? (
                    <Crown size={22} />
                  ) : isTeam ? (
                    <ShieldCheck size={22} />
                  ) : (
                    <UserRound size={22} />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Welcome, {displayName}</h2>
                  <p className="mt-1 text-slate-600">Signed in as {roleLabels[activeRole] || activeRole}.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <AccountPanel
                  icon={<ShoppingBag size={18} />}
                  title="Customer purchases"
                  text="Order kopi, save favourites, and request table bookings."
                  href="#/customer-purchases"
                />
                {isTeam && (
                  <AccountPanel
                    icon={<BarChart3 size={18} />}
                    title="Sales"
                    text="Staff order and sales tools will live here."
                    href="#/sales"
                  />
                )}
                {isLeadership && (
                  <AccountPanel
                    icon={<ClipboardList size={18} />}
                    title="Management"
                    text="Manager and owner controls are reserved for assigned accounts."
                    href="#/management"
                  />
                )}
                {activeRole === "owner" && (
                  <AccountPanel
                    icon={<UsersRound size={18} />}
                    title="Team access"
                    text="Assign customer, staff, manager, and owner roles."
                    href="#/team"
                  />
                )}
              </div>

              <button
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-ocean-100 bg-white px-5 py-3 font-black text-ocean-600 hover:bg-ocean-100"
                type="button"
                onClick={handleSignOut}
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          ) : (
            <form className="grid gap-4" onSubmit={handleAuthSubmit}>
              <div className="inline-grid grid-cols-2 rounded-lg bg-white p-1">
                {["signin", "signup"].map((item) => (
                  <button
                    className={`rounded-md px-4 py-3 text-sm font-black ${
                      mode === item ? "bg-ocean-600 text-white" : "text-slate-600"
                    }`}
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                  >
                    {item === "signup" ? "Create account" : "Sign in"}
                  </button>
                ))}
              </div>

              {mode === "signup" && (
                <label className="grid gap-2 text-sm font-black text-slate-950">
                  Full name
                  <input
                    className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
              )}

              <label className="grid gap-2 text-sm font-black text-slate-950">
                Email
                <input
                  className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-950">
                Password
                <input
                  className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf-700 px-5 py-4 font-black text-white shadow-sm hover:bg-leaf-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isBusy || !isSupabaseConfigured}
              >
                <MailCheck size={18} /> {mode === "signup" ? "Create account" : "Sign in"}
              </button>

              {status.message && (
                <p
                  className={`rounded-lg border p-4 text-sm font-bold leading-6 ${
                    status.tone === "success"
                      ? "border-leaf-500/30 bg-leaf-500/10 text-leaf-700"
                      : status.tone === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-ocean-100 bg-white text-slate-600"
                  }`}
                  role={status.tone === "error" ? "alert" : "status"}
                >
                  {status.message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function AccountPanel({ icon, title, text, href }) {
  const content = (
    <>
      {icon && (
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ocean-100 text-ocean-600">
          {icon}
        </div>
      )}
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </>
  );

  if (href) {
    return (
      <a
        className="rounded-lg border border-ocean-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
        href={href}
      >
        {content}
      </a>
    );
  }

  return (
    <article className="rounded-lg border border-ocean-100 bg-white p-5">
      {content}
    </article>
  );
}

function PlaceholderToolPage({ session, activeRole, allowedRoles, eyebrow, title, text, actionLabel, actionHref }) {
  if (!session?.user) {
    return <AccessMessage title="Please log in first." text="This account page is only available after sign in." href="#/login" label="Log in" />;
  }

  if (!allowedRoles.includes(activeRole)) {
    return (
      <AccessMessage
        title="This page is not available for your account."
        text="Ask the owner to update your role if you need this tool."
        href="#/login"
        label="Back to account"
      />
    );
  }

  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto max-w-4xl rounded-lg border border-ocean-100 bg-ocean-50 p-8">
        <p className="mb-3 text-sm font-black uppercase text-ocean-600">{eyebrow}</p>
        <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600">{text}</p>
        <a
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-leaf-700 px-5 py-3 font-black text-white hover:bg-leaf-500"
          href={actionHref}
        >
          {actionLabel} <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

function TeamAccessPage({ session, activeRole }) {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState("");

  const canManageTeam = session?.user && activeRole === "owner";

  useEffect(() => {
    if (!canManageTeam || !supabase) return undefined;

    let isCurrent = true;

    async function loadProfiles() {
      setIsLoading(true);
      setStatus({ tone: "info", message: "" });

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .order("created_at", { ascending: false });

      if (!isCurrent) return;

      setIsLoading(false);

      if (error) {
        setStatus({
          tone: "error",
          message: `Team list could not load yet: ${error.message}`,
        });
        return;
      }

      setProfiles(data || []);
    }

    loadProfiles();

    return () => {
      isCurrent = false;
    };
  }, [canManageTeam]);

  async function handleRoleChange(profileId, nextRole) {
    if (!supabase) return;

    setSavingId(profileId);
    setStatus({ tone: "info", message: "" });

    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", profileId);

    setSavingId("");

    if (error) {
      setStatus({ tone: "error", message: `Role was not updated: ${error.message}` });
      return;
    }

    setProfiles((current) =>
      current.map((profile) => (profile.id === profileId ? { ...profile, role: nextRole } : profile))
    );
    setStatus({ tone: "success", message: "Role updated." });
  }

  if (!session?.user) {
    return <AccessMessage title="Please log in first." text="Team access is only available to the owner account." href="#/login" label="Log in" />;
  }

  if (activeRole !== "owner") {
    return (
      <AccessMessage
        title="Owner access only."
        text="Only the owner account can assign customer, staff, manager, and owner roles."
        href="#/login"
        label="Back to account"
      />
    );
  }

  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase text-ocean-600">Team access</p>
            <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">Assign account roles.</h1>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-lg border border-ocean-100 bg-white px-5 py-3 font-black text-ocean-600 hover:bg-ocean-50"
            href="#/login"
          >
            Back to account
          </a>
        </div>

        <div className="rounded-lg border border-ocean-100 bg-ocean-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            New sign-ups start as customers. Use this page to promote trusted accounts to staff, manager, or owner when needed.
          </p>

          {status.message && (
            <p
              className={`mt-4 rounded-lg border p-4 text-sm font-bold leading-6 ${
                status.tone === "success"
                  ? "border-leaf-500/30 bg-leaf-500/10 text-leaf-700"
                  : status.tone === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-ocean-100 bg-white text-slate-600"
              }`}
              role={status.tone === "error" ? "alert" : "status"}
            >
              {status.message}
            </p>
          )}

          <div className="mt-5 overflow-hidden rounded-lg border border-ocean-100 bg-white">
            <div className="grid grid-cols-[1fr_150px] gap-4 border-b border-ocean-100 bg-ocean-100 px-4 py-3 text-sm font-black text-ocean-600 md:grid-cols-[1fr_180px_170px]">
              <span>Account</span>
              <span className="hidden md:block">Current role</span>
              <span>Assign role</span>
            </div>

            {isLoading && <p className="p-4 text-sm text-slate-600">Loading team accounts...</p>}

            {!isLoading && profiles.length === 0 && (
              <p className="p-4 text-sm leading-6 text-slate-600">
                No team profiles are visible yet. If users already exist, run the owner role policies in the setup guide.
              </p>
            )}

            {profiles.map((profile) => (
              <div
                className="grid grid-cols-[1fr_150px] gap-4 border-b border-ocean-100 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_180px_170px] md:items-center"
                key={profile.id}
              >
                <div>
                  <p className="font-black text-slate-950">{profile.full_name || "Unnamed account"}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">{profile.id}</p>
                </div>
                <p className="hidden text-sm font-bold text-slate-600 md:block">{roleLabels[profile.role] || profile.role}</p>
                <label className="sr-only" htmlFor={`role-${profile.id}`}>
                  Assign role for {profile.full_name || profile.id}
                </label>
                <select
                  className="rounded-lg border border-ocean-100 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-ocean-600 disabled:cursor-wait disabled:opacity-60"
                  id={`role-${profile.id}`}
                  value={profile.role}
                  disabled={savingId === profile.id}
                  onChange={(event) => handleRoleChange(profile.id, event.target.value)}
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AccessMessage({ title, text, href, label }) {
  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-ocean-100 bg-ocean-50 p-8">
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-4 leading-7 text-slate-600">{text}</p>
        <a
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-leaf-700 px-5 py-3 font-black text-white hover:bg-leaf-500"
          href={href}
        >
          {label} <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
