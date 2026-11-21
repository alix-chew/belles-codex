import {
  ArrowRight,
  ClipboardList,
  Clock3,
  Crown,
  Leaf,
  LockKeyhole,
  LogOut,
  MapPin,
  MailCheck,
  Menu as MenuIcon,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase, supabaseProjectUrl } from "./lib/supabase";

const navItems = ["About", "Menu", "Order", "Contact", "Login"];

const accountTypes = [
  {
    value: "customer",
    label: "Customer",
    detail: "Public customer account for purchases, favourites, and bookings.",
  },
  {
    value: "staff",
    label: "Staff",
    detail: "Cafe counter account for viewing order and booking records.",
  },
  {
    value: "manager",
    label: "Manager",
    detail: "Manager account for daily operations and menu updates.",
  },
  {
    value: "owner",
    label: "Owner",
    detail: "Owner account for full site and business control.",
  },
];

const roleLabels = {
  customer: "Customer",
  staff: "Staff",
  manager: "Manager",
  owner: "Owner",
};

const adminRoles = ["staff", "manager", "owner"];
const managerRoles = ["manager", "owner"];

// Menu data is kept as structured content so new pages can reuse it later.
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
];

const openingHours = [
  "Mon-Fri: 7:30 AM - 8:30 PM",
  "Sat-Sun: 8:00 AM - 9:00 PM",
];

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

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
      <Header session={session} />
      <main>
        <Hero />
        <About />
        <MenuPreview />
        <OrderSection session={session} activeRole={activeRole} displayName={displayName} />
        <Contact />
        <AuthSection
          session={session}
          profile={profile}
          activeRole={activeRole}
          displayName={displayName}
          setProfile={setProfile}
        />
        <DesignReference />
      </main>
    </div>
  );
}

function Header({ session }) {
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
          href="#login"
        >
          {session ? "Account" : "Log in"} <ArrowRight size={17} />
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
              href="#order"
            >
              Order online <ArrowRight size={18} />
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
                <img
                  className="mt-6 aspect-[4/3] w-full rounded-lg border border-ocean-100 object-cover"
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                />
                <p className="mt-5 leading-7 text-slate-600">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderSection({ session, activeRole, displayName }) {
  const [selectedItemId, setSelectedItemId] = useState(menuItems[0].id);
  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const selectedItem = menuItems.find((item) => item.id === selectedItemId) || menuItems[0];
  const total = selectedItem.priceValue * quantity;

  async function handleOrderSubmit(event) {
    event.preventDefault();

    if (!session?.user) {
      setOrderStatus("Please log in before making a purchase.");
      return;
    }

    setIsOrdering(true);
    setOrderStatus("");

    const orderPayload = {
      user_id: session.user.id,
      item_id: selectedItem.id,
      item_name: selectedItem.name,
      quantity,
      total_sgd: Number(total.toFixed(2)),
      status: "pending",
    };

    if (supabase) {
      const { error } = await supabase.from("orders").insert(orderPayload);

      setIsOrdering(false);

      if (error) {
        setOrderStatus(`Order could not be saved yet: ${error.message}`);
        return;
      }

      setOrderStatus("Order received. Staff will prepare it shortly.");
      return;
    }

    setIsOrdering(false);
    setOrderStatus("Supabase key needed before live purchases can be saved.");
  }

  return (
    <section id="order" className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">Order page</p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Log in before you purchase.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-slate-600">
            Public customers, staff, managers, and the owner all enter through Supabase login. Purchases unlock only after the account is confirmed and signed in.
          </p>
        </div>

        <div className="rounded-lg border border-ocean-100 bg-ocean-50 p-6 shadow-sm">
          {!session ? (
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-white">
                  <LockKeyhole size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Purchases are login-gated</h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    Create an account or sign in first. Supabase email confirmation protects the checkout flow.
                  </p>
                </div>
              </div>
              <a
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-leaf-700 px-5 py-3 font-black text-white hover:bg-leaf-500"
                href="#login"
              >
                Log in to purchase <ArrowRight size={18} />
              </a>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={handleOrderSubmit}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Ready to order, {displayName}</h3>
                  <p className="mt-1 text-slate-600">Signed in as {roleLabels[activeRole] || activeRole}.</p>
                </div>
              </div>

              <label className="grid gap-2 text-sm font-black text-slate-950">
                Choose item
                <select
                  className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                  value={selectedItemId}
                  onChange={(event) => setSelectedItemId(event.target.value)}
                >
                  {menuItems.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name} - {item.price}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black text-slate-950">
                Quantity
                <input
                  className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                  type="number"
                  min="1"
                  max="12"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                />
              </label>

              <div className="rounded-lg border border-ocean-100 bg-white p-5">
                <p className="text-sm font-black uppercase text-ocean-600">Order total</p>
                <p className="mt-2 text-3xl font-black text-slate-950">S${total.toFixed(2)}</p>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf-700 px-5 py-4 font-black text-white shadow-sm hover:bg-leaf-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isOrdering}
              >
                <ShoppingBag size={18} /> Place purchase request
              </button>

              {orderStatus && <p className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">{orderStatus}</p>}
            </form>
          )}
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

function AuthSection({ session, profile, activeRole, displayName, setProfile }) {
  const [mode, setMode] = useState("signup");
  const [role, setRole] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const isAdmin = adminRoles.includes(activeRole);
  const isManager = managerRoles.includes(activeRole);

  async function handleAuthSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Add your Supabase publishable key first, then restart the dev server.");
      return;
    }

    setIsBusy(true);
    setStatus("");

    const credentials = {
      email,
      password,
    };

    const { error } =
      mode === "signup"
        ? await supabase.auth.signUp({
            ...credentials,
            options: {
              data: {
                full_name: fullName,
                role,
              },
              emailRedirectTo: `${window.location.origin}/#login`,
            },
          })
        : await supabase.auth.signInWithPassword(credentials);

    setIsBusy(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus(
      mode === "signup"
        ? "Account created. Please check your email and confirm before signing in."
        : "Signed in successfully."
    );
  }

  async function handleSignOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setProfile(null);
    setStatus("Signed out.");
  }

  return (
    <section id="login" className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="mb-3 text-sm font-black uppercase text-ocean-600">Supabase login</p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            One account door for every role.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-slate-600">
            Public customers, staff, managers, and the owner log in here. New accounts receive a Supabase confirmation email before they can purchase or manage records.
          </p>
        </div>

        <div className="rounded-lg border border-ocean-100 bg-ocean-50 p-6 shadow-sm">
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-lg border border-ocean-100 bg-white p-4 text-sm leading-6 text-slate-600">
              <strong className="block text-slate-950">Supabase key needed</strong>
              Add <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> for project <code>{supabaseProjectUrl}</code>.
            </div>
          )}

          {session ? (
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
                  {activeRole === "owner" ? (
                    <Crown size={22} />
                  ) : isAdmin ? (
                    <ShieldCheck size={22} />
                  ) : (
                    <UserRound size={22} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Welcome, {displayName}</h3>
                  <p className="mt-1 text-slate-600">Signed in as {roleLabels[activeRole] || activeRole}.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <AccountPanel
                  icon={<ShoppingBag size={18} />}
                  title="Customer purchases"
                  text="Order kopi, save favourites, and request table bookings."
                />
                {isAdmin && (
                  <AccountPanel
                    icon={<ClipboardList size={18} />}
                    title="Staff records"
                    text="View order requests, booking records, and daily cafe work."
                  />
                )}
                {isManager && (
                  <AccountPanel
                    icon={<ShieldCheck size={18} />}
                    title="Manager tools"
                    text="Manage menu updates, order status, and staff workflows."
                  />
                )}
                {activeRole === "owner" && (
                  <AccountPanel
                    icon={<Crown size={18} />}
                    title="Owner control"
                    text="Full business overview for accounts, staff roles, and site settings."
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
                {["signup", "signin"].map((item) => (
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
                <>
                  <label className="grid gap-2 text-sm font-black text-slate-950">
                    Full name
                    <input
                      className="rounded-lg border border-ocean-100 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-ocean-600"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your name"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {accountTypes.map((type) => (
                      <label
                        className={`cursor-pointer rounded-lg border bg-white p-4 ${
                          role === type.value ? "border-ocean-600 ring-2 ring-ocean-100" : "border-ocean-100"
                        }`}
                        key={type.value}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="role"
                          value={type.value}
                          checked={role === type.value}
                          onChange={() => setRole(type.value)}
                        />
                        <span className="font-black text-slate-950">{type.label}</span>
                        <span className="mt-2 block text-sm leading-6 text-slate-600">{type.detail}</span>
                      </label>
                    ))}
                  </div>
                </>
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
                <MailCheck size={18} /> {mode === "signup" ? "Send confirmation email" : "Sign in"}
              </button>

              {status && <p className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">{status}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function AccountPanel({ icon, title, text }) {
  return (
    <article className="rounded-lg border border-ocean-100 bg-white p-5">
      {icon && (
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ocean-100 text-ocean-600">
          {icon}
        </div>
      )}
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
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
