import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Vote, Trophy } from "lucide-react";
import "./App.css";
import vini from "./assets/vini.png";

const API_URL = "http://localhost:3001";

const BASE_FAKE_SIGNATURES = 0;
const GOAL = 100000;

function App() {
  const [votes, setVotes] = useState(BASE_FAKE_SIGNATURES);
  const [hasSigned, setHasSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  const percentage = useMemo(() => {
    return Math.min(100, ((votes / GOAL) * 100).toFixed(1));
  }, [votes]);

  useEffect(() => {
    fetchVotes();

    const signed = localStorage.getItem("vinicius_signed");

    if (signed === "1") {
      setHasSigned(true);
    }

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  async function fetchVotes() {
    try {
      const res = await fetch(`${API_URL}/api/stats`);

      if (!res.ok) {
        throw new Error("No se pudo conectar con el servidor");
      }

      const data = await res.json();

      setVotes(BASE_FAKE_SIGNATURES + Number(data.total || 0));
    } catch (err) {
      console.error("Error cargando firmas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote() {
    if (hasSigned || signing) return;

    try {
      setSigning(true);

      const res = await fetch(`${API_URL}/api/sign`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la firma");
      }

      const data = await res.json();

      setVotes(BASE_FAKE_SIGNATURES + Number(data.total || 0));

      setHasSigned(true);

      localStorage.setItem("vinicius_signed", "1");
    } catch (err) {
      console.error("Error firmando:", err);

      alert(
        "No se pudo guardar la firma. Revisa que el servidor esté encendido."
      );
    } finally {
      setSigning(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <motion.img
          src={vini}
          className="hero-image"
          alt="Vinicius Out"
          initial={{ opacity: 0, y: -25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
        />

        <motion.div
          className="stamp"
          initial={{ opacity: 0, rotate: -8, scale: 0.8 }}
          animate={{ opacity: 1, rotate: -6, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          FUERA
        </motion.div>

        <motion.div
          className="badge"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Flame size={16} />
          Movimiento viral
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          VINICIUS <span>OUT</span>
        </motion.h1>

        <p className="subtitle">
          Madridistas, hagan escuchar su voz. Firma esta petición digital y
          comparte el movimiento.
        </p>

        {/* ADSENSE */}
        <div className="adsense-container">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-3946114730779448"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        <motion.div
          className="vote-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="vote-header">
            <div>
              <h2>{loading ? "..." : votes.toLocaleString("es-GT")}</h2>

              <p>Madridistas firmaron</p>
            </div>

            <div className="goal-box">
              <Trophy size={30} />

              <strong>{GOAL.toLocaleString("es-GT")}</strong>

              <span>Meta</span>
            </div>
          </div>

          <div className="progress">
            <div style={{ width: `${percentage}%` }} />
          </div>

          <p className="percent">{percentage}% de la meta</p>

          <button
            className={hasSigned ? "vote-btn disabled" : "vote-btn"}
            onClick={handleVote}
            disabled={hasSigned || signing}
          >
            <Vote size={22} />

            {signing
              ? "Guardando..."
              : hasSigned
              ? "Ya firmaste"
              : "Firmar petición"}
          </button>

          <p className="small-note">
            No necesitas cuenta · Firma rápida · Comparte para hacerlo viral
          </p>
        </motion.div>
      </section>

      <footer>
        <p>VINICIUS OUT © 2026</p>

        <div>
          <a href="#">Privacidad</a>
          <a href="#">Contacto</a>
          <a href="#">Términos</a>
        </div>
      </footer>
    </main>
  );
}

export default App;