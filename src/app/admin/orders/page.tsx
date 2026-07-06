"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Printer, Volume2, Plus, Phone, User, Utensils, X, Check, Coffee, Trash2 } from "lucide-react";
import { Order, OrderStatus } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "ord-101",
    customer_name: "Karim Benali",
    customer_phone: "0550 12 34 56",
    order_type: "click_and_collect",
    pickup_time: "Dans 15 min",
    status: "pending",
    total_amount: 1850,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    items: [
      { id: "i1", order_id: "ord-101", product_id: "p1", product_name: "Pistachio Latte", quantity: 2, unit_price: 650, total_price: 1300 },
      { id: "i2", order_id: "ord-101", product_id: "p2", product_name: "Mojito Classic", quantity: 1, unit_price: 550, total_price: 550 },
    ],
  },
  {
    id: "ord-102",
    customer_name: "Sarah Loucif",
    customer_phone: "0661 98 76 54",
    order_type: "dine_in",
    table_number: 4,
    status: "preparing",
    total_amount: 1150,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      { id: "i3", order_id: "ord-102", product_id: "p3", product_name: "Signature Burger", quantity: 1, unit_price: 1150, total_price: 1150 },
    ],
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  preparing: { label: "En préparation", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  ready: { label: "Prêt à récupérer", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  completed: { label: "Terminé", color: "text-muted dark:text-muted-dark", bg: "bg-gray-500/10 border-gray-500/20" },
  cancelled: { label: "Annulé", color: "text-danger", bg: "bg-danger/10 border-danger/20" },
};

function AdminOrdersPage() {
  const { products } = useProductStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("clear") === "true" || params.get("reset") === "true") {
          localStorage.removeItem("afnene_orders");
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
          return;
        }
      }
      
      const saved = localStorage.getItem("afnene_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only valid order objects
          const validOrders = parsed.filter(o => o && typeof o === "object" && o.id);
          setOrders(validOrders);
        } else {
          setOrders(INITIAL_MOCK_ORDERS);
        }
      } else {
        setOrders(INITIAL_MOCK_ORDERS);
        localStorage.setItem("afnene_orders", JSON.stringify(INITIAL_MOCK_ORDERS));
      }
    } catch (e) {
      console.error("Local storage error:", e);
      setOrders(INITIAL_MOCK_ORDERS);
    }
  }, []);

  // Web Audio Synthesizer for order chime
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(587.33, now, 0.2); // D5
      playNote(880, now + 0.15, 0.4); // A5
    } catch (e) {
      console.log("Audio play prevented", e);
    }
  };

  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simName, setSimName] = useState("Yassine Mansouri");
  const [simPhone, setSimPhone] = useState("0770 45 67 89");
  const [simType, setSimType] = useState<"dine_in" | "take_away" | "click_and_collect">("click_and_collect");
  const [simTable, setSimTable] = useState("1");
  const [simPickup, setSimPickup] = useState("Dans 15 min");
  const [simItems, setSimItems] = useState<{ productId: string; quantity: number }[]>([]);

  const handleOpenSimulation = () => {
    const list = products || [];
    if (list.length > 0) {
      setSimItems([{ productId: list[0].id, quantity: 1 }]);
    } else {
      setSimItems([]);
    }
    setSimulationModalOpen(true);
  };

  const handleAddSimItem = () => {
    const list = products || [];
    if (list.length > 0) {
      setSimItems([...simItems, { productId: list[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveSimItem = (index: number) => {
    setSimItems(simItems.filter((_, i) => i !== index));
  };

  const handleSimItemChange = (index: number, field: "productId" | "quantity", value: any) => {
    const next = [...simItems];
    next[index] = { ...next[index], [field]: value };
    setSimItems(next);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simItems.length === 0) {
      toast.error("Veuillez ajouter au moins un produit");
      return;
    }

    let total = 0;
    const orderItems = simItems.map((item, i) => {
      const prod = (products || []).find((p) => p.id === item.productId);
      const rawName = prod ? prod.name : "Produit inconnu";
      const name = typeof rawName === "object"
        ? ((rawName as any)?.fr || (rawName as any)?.en || Object.values(rawName)[0] || "Produit inconnu")
        : String(rawName || "Produit inconnu");
      const price = prod ? prod.price : 0;
      const itemTotal = price * item.quantity;
      total += itemTotal;
      return {
        id: `i-${Date.now()}-${i}`,
        order_id: "new",
        product_id: item.productId,
        product_name: name,
        quantity: item.quantity,
        unit_price: price,
        total_price: itemTotal,
      };
    });

    const newOrd: Order = {
      id: `ord-${Math.floor(100 + Math.random() * 900)}`,
      customer_name: simName,
      customer_phone: simPhone,
      order_type: simType,
      table_number: simType === "dine_in" ? Number(simTable) || undefined : undefined,
      pickup_time: simType !== "dine_in" ? simPickup : undefined,
      status: "pending",
      total_amount: total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
    };

    const updated = [newOrd, ...orders];
    setOrders(updated);
    localStorage.setItem("afnene_orders", JSON.stringify(updated));
    playChime();
    toast.success("🔔 NOUVELLE COMMANDE SIMULÉE ! (#" + newOrd.id.slice(-4) + ")");
    setSimulationModalOpen(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = orders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      setOrders(updated);
      localStorage.setItem("afnene_orders", JSON.stringify(updated));
      toast.info(`Statut de la commande mis à jour`);
    } catch (e) {
      console.error(e);
      toast.error("Erreur de sauvegarde locale");
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      try {
        const updated = orders.filter((o) => o.id !== orderId);
        setOrders(updated);
        localStorage.setItem("afnene_orders", JSON.stringify(updated));
        toast.success("Commande supprimée avec succès");
      } catch (e) {
        console.error(e);
        toast.error("Erreur de sauvegarde locale");
      }
    }
  };

  const handlePrint = (order: Order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!mounted) {
    return (
      <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px] text-muted">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      {/* Printable Thermal Receipt Modal Container (Visible only during window.print) */}
      {printingOrder && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-4 font-mono text-xs w-[80mm] mx-auto leading-tight">
          <div className="text-center pb-2 border-b border-black">
            <h2 className="font-bold text-base uppercase">AFNENE COFFEE</h2>
            <p className="text-[10px]">Drink • Food • Desserts</p>
            <p className="text-[9px] mt-1">Tél: 0550 00 00 00</p>
          </div>

          <div className="py-2 border-b border-black space-y-1">
            <p><strong>N° Commande :</strong> #{printingOrder.id}</p>
            <p><strong>Date :</strong> {new Date(printingOrder.created_at).toLocaleString()}</p>
            <p><strong>Client :</strong> {printingOrder.customer_name}</p>
            <p><strong>Tél :</strong> {printingOrder.customer_phone}</p>
            <p><strong>Type :</strong> {printingOrder.order_type === "click_and_collect" ? `Click & Collect (${printingOrder.pickup_time})` : `Sur Place - Table ${printingOrder.table_number || 1}`}</p>
          </div>

          <table className="w-full my-2 text-left border-b border-black pb-2">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1">Qté</th>
                <th className="py-1">Article</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {printingOrder.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-1 align-top font-bold">{item.quantity}x</td>
                  <td className="py-1 align-top">{item.product_name}</td>
                  <td className="py-1 text-right align-top">{item.total_price} DA</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-sm font-bold pt-1">
            TOTAL : {printingOrder.total_amount} DA
          </div>

          <div className="text-center pt-4 mt-4 border-t border-dashed border-black text-[10px]">
            <p>Merci pour votre visite !</p>
            <p>À bientôt chez AFNENE Coffee ☕</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Gestion des Commandes (KDS) 🔔
          </h1>
          <p className="text-sm text-muted dark:text-muted-dark mt-1">
            Suivez les commandes en direct avec signal sonore et impression ticket.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={playChime}
            className="px-3.5 py-2 rounded-xl bg-card dark:bg-card-dark border border-border/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/5 transition-colors"
            title="Tester le son de notification"
          >
            <Volume2 className="w-4 h-4 text-secondary" />
            <span>Tester Son 🔔</span>
          </button>

          <button
            onClick={handleOpenSimulation}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Simuler Commande 📥</span>
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {(["all", "pending", "preparing", "ready", "completed"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === st
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-card dark:bg-card-dark text-muted hover:text-dark dark:hover:text-white border border-border/40"
            }`}
          >
            {st === "all" ? "Toutes les commandes" : STATUS_CONFIG[st].label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted bg-card dark:bg-card-dark rounded-3xl border border-border/40">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Aucune commande pour le moment</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            if (!order || !order.id) return null;
            const statusCfg = (order.status && STATUS_CONFIG[order.status])
              ? STATUS_CONFIG[order.status]
              : { label: "Inconnu", color: "text-muted", bg: "bg-gray-500/10 border-gray-500/20" };

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-border/60 dark:border-border-dark/60 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrint(order)}
                        className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition-colors"
                        title="Imprimer le ticket de caisse"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg bg-danger/10 hover:bg-danger hover:text-white text-danger transition-colors"
                        title="Supprimer la commande"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-muted font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        #{String(order.id).slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-dark dark:text-white font-bold text-base">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <span>{String(order.customer_name || "Client")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted text-xs">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{String(order.customer_phone || "N/A")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-secondary pt-1">
                      {order.order_type === "click_and_collect" ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Click & Collect ({String(order.pickup_time || "")})</span>
                        </>
                      ) : (
                        <>
                          <Utensils className="w-3.5 h-3.5" />
                          <span>Sur place - Table {String(order.table_number || 1)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="py-3 border-y border-border/40 dark:border-border-dark/40 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-dark dark:text-white font-medium">
                        <strong className="text-primary mr-1.5">{item.quantity}x</strong>
                        {String(item.product_name || "Produit")}
                      </span>
                      <span className="text-muted font-semibold">{String(item.total_price || 0)} DA</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-bold text-dark dark:text-white pt-2">
                    <span>Total</span>
                    <span className="text-primary dark:text-secondary">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow"
                    >
                      Lancer la préparation
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow"
                    >
                      Marquer Prêt
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-light transition-colors shadow"
                    >
                      Terminer la commande
                    </button>
                  )}
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="py-2.5 px-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors font-semibold text-xs"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal Preview for Print Ticket (Screen version) */}
      <AnimatePresence>
        {printingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPrintingOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white text-black p-6 rounded-2xl shadow-2xl z-10 space-y-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/20">
                <span className="font-bold text-dark flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-primary" /> Impression Ticket
                </span>
                <button onClick={() => setPrintingOrder(null)} className="text-black/60 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ticket Preview */}
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 space-y-3">
                <div className="text-center pb-2 border-b border-black">
                  <h3 className="font-bold text-base">AFNENE COFFEE</h3>
                  <p className="text-[10px]">Drink • Food • Desserts</p>
                </div>
                <div>
                  <p>N° Commande : #{printingOrder.id}</p>
                  <p>Client : {printingOrder.customer_name}</p>
                  <p>Tél : {printingOrder.customer_phone}</p>
                </div>
                <div className="border-t border-black pt-2 space-y-1">
                  {printingOrder.items?.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity}x {it.product_name}</span>
                      <span>{it.total_price} DA</span>
                    </div>
                  ))}
                </div>
                <div className="text-right font-bold text-sm border-t border-black pt-2">
                  Total : {printingOrder.total_amount} DA
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setPrintingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700"
                >
                  Fermer
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light flex items-center justify-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  Lancer l&apos;impression
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Simulation Form Modal */}
        {simulationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSimulationModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-card dark:bg-card-dark p-6 rounded-3xl shadow-2xl border border-border/40 z-10 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <h3 className="text-lg font-bold text-dark dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Simuler une nouvelle commande 📩
                </h3>
                <button onClick={() => setSimulationModalOpen(false)} className="text-muted hover:text-dark dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSimulateSubmit} className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Nom du client</label>
                    <input
                      type="text"
                      required
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      placeholder="Ex: Yassine Mansouri"
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Téléphone</label>
                    <input
                      type="text"
                      required
                      value={simPhone}
                      onChange={(e) => setSimPhone(e.target.value)}
                      placeholder="Ex: 0770 45 67 89"
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Order Type & Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Type de commande</label>
                    <select
                      value={simType}
                      onChange={(e) => setSimType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="click_and_collect">Click & Collect</option>
                      <option value="dine_in">Sur place (Table)</option>
                      <option value="take_away">À emporter</option>
                    </select>
                  </div>
                  <div>
                    {simType === "dine_in" ? (
                      <>
                        <label className="block text-xs font-semibold text-muted mb-1">Numéro de Table</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={simTable}
                          onChange={(e) => setSimTable(e.target.value)}
                          placeholder="Ex: 4"
                          className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-xs font-semibold text-muted mb-1">Temps de récupération</label>
                        <input
                          type="text"
                          required
                          value={simPickup}
                          onChange={(e) => setSimPickup(e.target.value)}
                          placeholder="Ex: Dans 20 min"
                          className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-muted">Produits commandés</label>
                    <button
                      type="button"
                      onClick={handleAddSimItem}
                      className="text-primary hover:text-primary-light text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un produit
                    </button>
                  </div>

                  {simItems.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted text-xs">
                      Aucun produit sélectionné. Cliquez sur &quot;Ajouter un produit&quot;.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {simItems.map((item, idx) => {
                        const selectedProd = (products || []).find(p => p.id === item.productId);
                        const itemPrice = selectedProd ? selectedProd.price : 0;
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row gap-2 pb-3 sm:pb-0 border-b border-border/30 sm:border-none sm:items-center">
                            {/* Product Selector */}
                            <select
                              value={item.productId}
                              onChange={(e) => handleSimItemChange(idx, "productId", e.target.value)}
                              className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none"
                            >
                              {(products || []).map(p => {
                                const prodName = typeof p.name === "object"
                                  ? ((p.name as any)?.fr || (p.name as any)?.en || Object.values(p.name)[0] || "")
                                  : p.name || "";
                                return (
                                  <option key={p.id} value={p.id}>
                                    {prodName} ({p.price} DA)
                                  </option>
                                );
                              })}
                            </select>

                            {/* Controls Wrapper */}
                            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                              {/* Quantity Selector */}
                              <input
                                type="number"
                                required
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleSimItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
                                className="w-16 px-2.5 py-1.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm text-center focus:outline-none"
                              />

                              {/* Subtotal preview */}
                              <div className="w-20 text-right text-xs font-semibold text-dark dark:text-white">
                                {itemPrice * item.quantity} DA
                              </div>

                              {/* Delete line button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSimItem(idx)}
                                className="w-9 h-9 rounded-xl border border-danger/30 hover:bg-danger/10 text-danger flex items-center justify-center transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Total amount preview */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-sm font-bold text-dark dark:text-white">Montant Total :</span>
                  <span className="text-lg font-bold text-primary">
                    {simItems.reduce((acc, item) => {
                      const prod = (products || []).find(p => p.id === item.productId);
                      return acc + (prod ? prod.price * item.quantity : 0);
                    }, 0)} DA
                  </span>
                </div>

                {/* Action buttons */}
                <div className="pt-4 flex justify-end gap-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setSimulationModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted hover:bg-primary/5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-colors"
                  >
                    Simuler la Réception 🚀
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto my-10 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-600 dark:text-red-400 space-y-4">
          <h2 className="text-lg font-bold">Une erreur est survenue sur la page des commandes</h2>
          <p className="text-sm font-mono bg-black/10 dark:bg-white/10 p-4 rounded-xl overflow-x-auto">
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </p>
          <button
            onClick={() => {
              try {
                localStorage.removeItem("afnene_orders");
                window.location.reload();
              } catch (e) {
                console.error(e);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Réinitialiser le cache local & recharger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function SafeAdminOrdersPage() {
  return (
    <ErrorBoundary>
      <AdminOrdersPage />
    </ErrorBoundary>
  );
}
