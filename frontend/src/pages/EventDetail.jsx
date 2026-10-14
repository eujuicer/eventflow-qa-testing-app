import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api, { euros, fmtDate, errMessage } from "../api";
import { useAuth } from "../auth";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState({});
  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get(`/api/events/${id}`).then((r) => setEvent(r.data));
  useEffect(() => { load(); }, [id]);

  if (!event) return <div className="container"><p className="muted" style={{ marginTop: 30 }}>Chargement...</p></div>;

  const setCat = (cid, n, max) => setQty({ ...qty, [cid]: Math.max(0, Math.min(max, n)) });
  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const totalCents = event.categories.reduce((sum, c) => sum + (qty[c.id] || 0) * c.price_cents, 0);

  const reserve = async () => {
    setError("");
    if (!user) { nav("/login"); return; }
    const items = event.categories
      .filter((c) => qty[c.id] > 0)
      .map((c) => ({ category_id: c.id, quantity: qty[c.id] }));
    if (items.length === 0) { setError("Selectionnez au moins un billet."); return; }
    setBusy(true);
    try {
      const order = await api.post("/api/orders", {
        event_id: event.id, items, promo_code: promo || null,
      });
      nav(`/checkout/${order.data.id}`);
    } catch (e) {
      setError(errMessage(e));
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start", marginTop: 28 }}>
      <div>
        <div style={{ height: 200, borderRadius: 20, background: event.cover_color, marginBottom: 20 }} />
        <h1 data-testid="event-title" className="page-title" style={{ marginTop: 0 }}>{event.title}</h1>
        <div className="row" style={{ gap: 18, marginBottom: 16 }}>
          <span className="meta"><i className="fa-solid fa-location-dot" /> {event.venue}, {event.city}</span>
          <span className="meta"><i className="fa-regular fa-calendar" /> {fmtDate(event.starts_at)}</span>
        </div>
        <p className="muted">{event.description}</p>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: 6 }}>Billets</h3>
        {event.categories.map((c) => (
          <div className="cat-row" key={c.id} data-testid="category-row" data-category-id={c.id} data-price-cents={c.price_cents} data-available={c.available}>
            <div>
              <div data-testid="category-name" style={{ fontWeight: 600 }}>{c.name}</div>
              <div data-testid="category-info" className="muted" style={{ fontSize: 13 }}>
                {euros(c.price_cents)} &middot; {c.available > 0 ? `${c.available} dispo` : "complet"}
              </div>
            </div>
            <div className="qty">
              <button data-testid="category-minus" onClick={() => setCat(c.id, (qty[c.id] || 0) - 1, c.available)} disabled={!qty[c.id]}>-</button>
              <span data-testid="category-qty" className="mono" style={{ minWidth: 18, textAlign: "center" }}>{qty[c.id] || 0}</span>
              <button data-testid="category-plus" onClick={() => setCat(c.id, (qty[c.id] || 0) + 1, c.available)} disabled={c.available <= (qty[c.id] || 0) || totalQty >= 6}>+</button>
            </div>
          </div>
        ))}

        <div className="field" style={{ marginTop: 16 }}>
          <label>Code promo</label>
          <input data-testid="promo-input" className="input" placeholder="WELCOME10" value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} />
        </div>

        <div className="row" style={{ justifyContent: "space-between", margin: "10px 0 16px" }}>
          <span className="muted" data-testid="cart-total-label" data-quantity={totalQty}>Total ({totalQty} billet{totalQty > 1 ? "s" : ""})</span>
          <span className="price" data-testid="cart-total-price" data-cents={totalCents}>{euros(totalCents)}</span>
        </div>

        {error && <div data-testid="cart-error" className="notice notice-err" style={{ marginBottom: 12 }}>{error}</div>}

        <button data-testid="reserve-button" className="btn btn-primary" style={{ width: "100%" }} onClick={reserve} disabled={busy || totalQty === 0}>
          <i className="fa-solid fa-ticket" /> {busy ? "Traitement..." : "Continuer vers le paiement"}
        </button>
        <p className="muted" style={{ fontSize: 12, marginTop: 10, textAlign: "center" }}>
          Maximum 6 billets par commande.
        </p>
      </div>
    </div>
  );
}
