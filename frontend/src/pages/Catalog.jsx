import { useEffect, useState } from "react";
import api from "../api";
import EventCard from "../components/EventCard";

export default function Catalog() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (search) => {
    setLoading(true);
    api.get("/api/events", { params: search ? { q: search } : {} })
      .then((r) => setEvents(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(""); }, []);

  return (
    <div className="container">
      <h1 className="page-title">Vivez l'evenement</h1>
      <p className="subtitle">Reservez vos billets pour les meilleurs evenements pres de chez vous.</p>
      <div className="row" style={{ marginBottom: 22 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }} />
          <input data-testid="search-input" className="input" style={{ paddingLeft: 38 }} placeholder="Rechercher un evenement"
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(q)} />
        </div>
        <button data-testid="search-button" className="btn btn-primary" onClick={() => load(q)}>Rechercher</button>
      </div>
      {loading ? (
        <p data-testid="catalog-loading" className="muted">Chargement...</p>
      ) : events.length === 0 ? (
        <p data-testid="catalog-empty" className="muted">Aucun evenement trouve.</p>
      ) : (
        <div data-testid="event-list" className="grid-events">
          {events.map((ev) => <EventCard key={ev.id} ev={ev} />)}
        </div>
      )}
    </div>
  );
}
