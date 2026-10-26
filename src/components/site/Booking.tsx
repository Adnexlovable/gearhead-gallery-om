import { useMemo, useState } from "react";
import { CalendarCheck, Check, Clock, Users } from "lucide-react";
import { Reveal } from "./Reveal";
import { submitBooking } from "@/lib/inbox.functions";
import { useShopDetails } from "@/lib/shop-details";

const EXPERIENCES = [
  { id: "private", label: "Private Viewing", note: "45 min · one-to-one with a curator" },
  { id: "collector", label: "Collector Consultation", note: "60 min · sourcing & valuation talk" },
  { id: "group", label: "Group Tour", note: "90 min · up to 8 guests" },
];

const TIMES = ["10:00", "11:30", "13:00", "16:00", "17:30", "19:00"];
const PARTY = ["1", "2", "3–4", "5–8"];

function nextDays(count: number) {
  const out: Array<{ value: string; day: string; date: string; month: string }> = [];
  const today = new Date();
  for (let i = 1; out.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      value: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString("en-GB", { weekday: "short" }),
      date: String(d.getDate()),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
    });
  }
  return out;
}

export function Booking() {
  const details = useShopDetails();
  const days = useMemo(() => nextDays(7), []);
  const [experience, setExperience] = useState(EXPERIENCES[0].id);
  const [date, setDate] = useState(days[0].value);
  const [time, setTime] = useState(TIMES[0]);
  const [party, setParty] = useState(PARTY[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSending(true);
    setError("");
    let ok = false;
    try {
      const res = await submitBooking({
        data: {
          experience: chosenExperience.label,
          visitDate: date,
          visitTime: time,
          party,
          name: name.trim().slice(0, 120),
          contact: contact.trim().slice(0, 120),
          notes: notes.trim().slice(0, 2000) || undefined,
        },
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
    setSending(false);
    if (!ok) setError("Couldn't send your request — please try again or WhatsApp us.");
    else setConfirmed(true);
  }

  const chosenDay = days.find((d) => d.value === date) ?? days[0];
  const chosenExperience = EXPERIENCES.find((e) => e.id === experience) ?? EXPERIENCES[0];
  const ready = name.trim().length > 1 && contact.trim().length > 4;

  return (
    <section id="booking" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="text-center">
          <div className="pill mx-auto mb-4 inline-flex">Book a Visit</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Reserve your hour <span className="italic text-gold-gradient">under the glass</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
            The Bausher boutique receives guests by appointment. Choose an experience, a day and a time — we confirm within a few hours.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="vitrine vitrine-light p-6 md:p-8">
            <Group label="Experience">
              <div className="grid gap-3 sm:grid-cols-3">
                {EXPERIENCES.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setExperience(e.id)}
                    data-cursor="hover"
                    aria-pressed={experience === e.id}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      experience === e.id ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"
                    }`}
                  >
                    <div className="font-display text-sm font-bold text-foreground">{e.label}</div>
                    <div className="font-mono-tag mt-1 text-[9px] text-muted-foreground">{e.note}</div>
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Preferred date">
              <div className="flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    data-cursor="hover"
                    aria-pressed={date === d.value}
                    className={`w-16 rounded-xl border py-2 text-center transition-all ${
                      date === d.value ? "border-gold bg-gold text-[#0B1D15]" : "border-gold/20 text-foreground hover:border-gold/50"
                    }`}
                  >
                    <div className="font-mono-tag text-[9px] opacity-80">{d.day}</div>
                    <div className="font-display text-base font-bold leading-tight">{d.date}</div>
                    <div className="font-mono-tag text-[8px] opacity-70">{d.month}</div>
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Time">
              <Chips options={TIMES} value={time} onChange={setTime} />
            </Group>

            <Group label="Guests">
              <Chips options={PARTY} value={party} onChange={setParty} />
            </Group>

            <Group label="Your details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={name} onChange={setName} placeholder="Khalid Al-Hinai" />
                <Field label="Email or WhatsApp" value={contact} onChange={setContact} placeholder="+968 7830 8991" />
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything you'd like ready for your visit?"
                className="mt-4 w-full rounded-lg border border-gold/20 bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
              />
            </Group>
          </Reveal>

          <Reveal delay={150}>
            <div className="vitrine sticky top-28 p-6 md:p-8">
              <div className="font-mono-tag text-[10px] text-gold-soft">Your appointment</div>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">{chosenExperience.label}</h3>
              <div className="mt-6 space-y-4 border-t border-gold/15 pt-5">
                <Row icon={<CalendarCheck size={16} className="text-gold" />} label="Date">
                  {chosenDay.day} {chosenDay.date} {chosenDay.month}
                </Row>
                <Row icon={<Clock size={16} className="text-gold" />} label="Time">
                  {time} · Muscat (GST)
                </Row>
                <Row icon={<Users size={16} className="text-gold" />} label="Guests">
                  {party}
                </Row>
              </div>
              <div className="mt-6 rounded-lg border border-gold/15 bg-surface/50 p-4 text-xs text-muted-foreground">
                <div>{details.address}</div>
                {details.hours && <div className="mt-3 whitespace-pre-line"><span className="font-semibold text-foreground">Opening hours</span><br />{details.hours}</div>}
                {details.phone && <a className="mt-3 block hover:text-gold" href={`tel:${details.phone.replace(/[^+\d]/g, "")}`}>{details.phone}</a>}
              </div>

              {confirmed ? (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 p-4">
                  <Check size={18} className="mt-0.5 text-gold" />
                  <div className="text-xs text-foreground">
                    Request sent. We'll confirm your {chosenExperience.label.toLowerCase()} on {chosenDay.day} {chosenDay.date}{" "}
                    {chosenDay.month} at {time} shortly.
                  </div>
                </div>
              ) : (
                <button
                  onClick={submit}
                  disabled={!ready || sending}
                  className="btn-gold mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? "Sending…" : "Request this slot"}
                </button>
              )}
              {error && <div className="mt-3 text-center text-xs text-destructive">{error}</div>}
              {!ready && !confirmed && (
                <div className="font-mono-tag mt-3 text-center text-[9px] text-muted-foreground">
                  Add your name and contact to continue
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="font-mono-tag mb-3 text-[9px] text-gold/70">{label}</div>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          data-cursor="hover"
          aria-pressed={value === o}
          className={`font-mono-tag rounded-full border px-4 py-2 text-[10px] transition-all ${
            value === o ? "border-gold bg-gold text-[#0B1D15]" : "border-gold/25 text-muted-foreground hover:border-gold/60 hover:text-gold"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="font-mono-tag text-[10px] text-gold-soft">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gold/20 bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
      />
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="font-mono-tag text-[9px] text-gold-soft">{label}</div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
