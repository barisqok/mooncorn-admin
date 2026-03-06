"use client";

import { useState, useEffect } from "react";
import "./globals.css";

// ============================================
// MOCK DATA
// ============================================
const mockConversations = [
  { id: 1, customer: "Ayşe Yılmaz", channel: "WhatsApp", message: "Siparişim ne zaman gelecek?", time: "2 dk", status: "waiting", avatar: "AY" },
  { id: 2, customer: "Mehmet Kaya", channel: "Instagram", message: "Bu ürün stokta var mı?", time: "5 dk", status: "waiting", avatar: "MK" },
  { id: 3, customer: "Zeynep Demir", channel: "Web Chat", message: "İade süreciniz nasıl işliyor?", time: "12 dk", status: "active", avatar: "ZD" },
  { id: 4, customer: "Can Öztürk", channel: "E-mail", message: "Toptan fiyat almak istiyorum", time: "28 dk", status: "active", avatar: "CÖ" },
  { id: 5, customer: "Elif Arslan", channel: "WhatsApp", message: "Kargom hasarlı geldi", time: "45 dk", status: "resolved", avatar: "EA" },
  { id: 6, customer: "Ali Şahin", channel: "Telegram", message: "Ödeme yapamıyorum", time: "1 sa", status: "waiting", avatar: "AŞ" },
];

const mockOrders = [
  { id: "#MC-4821", customer: "Ayşe Yılmaz", total: "₺2,450", items: 3, status: "shipped", date: "Bugün" },
  { id: "#MC-4820", customer: "Burak Aydın", total: "₺890", items: 1, status: "processing", date: "Bugün" },
  { id: "#MC-4819", customer: "Selin Koç", total: "₺5,120", items: 7, status: "delivered", date: "Dün" },
  { id: "#MC-4818", customer: "Emre Tan", total: "₺1,680", items: 2, status: "processing", date: "Dün" },
  { id: "#MC-4817", customer: "Deniz Çelik", total: "₺3,240", items: 4, status: "returned", date: "2 gün önce" },
  { id: "#MC-4816", customer: "Gül Erdem", total: "₺760", items: 1, status: "delivered", date: "2 gün önce" },
];

const mockProducts = [
  { name: "Premium Organik Bal", stock: 12, sold: 847, revenue: "₺42,350", trend: "up" },
  { name: "Doğal Cilt Bakım Seti", stock: 3, sold: 623, revenue: "₺93,450", trend: "up" },
  { name: "El Yapımı Sabun Koleksiyonu", stock: 45, sold: 412, revenue: "₺20,600", trend: "down" },
  { name: "Aromatik Mum Seti", stock: 0, sold: 389, revenue: "₺31,120", trend: "up" },
  { name: "Organik Çay Paketi", stock: 28, sold: 356, revenue: "₺17,800", trend: "down" },
];

const weeklyRevenue = [
  { day: "Pzt", value: 12400 },
  { day: "Sal", value: 18200 },
  { day: "Çar", value: 15600 },
  { day: "Per", value: 22100 },
  { day: "Cum", value: 28900 },
  { day: "Cmt", value: 34200 },
  { day: "Paz", value: 19800 },
];

const channelData = [
  { name: "WhatsApp", value: 42, color: "var(--green)" },
  { name: "Instagram", value: 28, color: "var(--purple)" },
  { name: "Web Chat", value: 18, color: "var(--blue)" },
  { name: "E-mail", value: 8, color: "var(--orange)" },
  { name: "Telegram", value: 4, color: "var(--accent)" },
];

const integrations = [
  { name: "Qpien", desc: "Çok kanallı müşteri iletişim", status: "connected", color: "var(--green)" },
  { name: "Trendyol", desc: "Marketplace entegrasyonu", status: "pending", color: "var(--orange)" },
  { name: "Hepsiburada", desc: "Marketplace entegrasyonu", status: "disconnected", color: "var(--red)" },
  { name: "İyzico", desc: "Ödeme altyapısı", status: "connected", color: "var(--green)" },
  { name: "Aras Kargo", desc: "Kargo takip", status: "connected", color: "var(--green)" },
  { name: "Google Analytics", desc: "Trafik analizi", status: "pending", color: "var(--orange)" },
];

// ============================================
// STATUS CONFIG
// ============================================
const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  waiting: { label: "Bekliyor", bg: "var(--orange-dim)", color: "var(--orange)" },
  active: { label: "Aktif", bg: "var(--blue-dim)", color: "var(--blue)" },
  resolved: { label: "Çözüldü", bg: "var(--green-dim)", color: "var(--green)" },
  shipped: { label: "Kargoda", bg: "var(--blue-dim)", color: "var(--blue)" },
  processing: { label: "Hazırlanıyor", bg: "var(--orange-dim)", color: "var(--orange)" },
  delivered: { label: "Teslim Edildi", bg: "var(--green-dim)", color: "var(--green)" },
  returned: { label: "İade", bg: "var(--red-dim)", color: "var(--red)" },
  connected: { label: "Bağlı", bg: "var(--green-dim)", color: "var(--green)" },
  pending: { label: "Bekliyor", bg: "var(--orange-dim)", color: "var(--orange)" },
  disconnected: { label: "Bağlı Değil", bg: "var(--red-dim)", color: "var(--red)" },
};

const channelColors: Record<string, string> = {
  WhatsApp: "var(--green)",
  Instagram: "var(--purple)",
  "Web Chat": "var(--blue)",
  "E-mail": "var(--orange)",
  Telegram: "var(--accent)",
};

// ============================================
// SMALL COMPONENTS
// ============================================
function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.waiting;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color }} />
      {c.label}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const color = channelColors[channel] || "var(--text-dim)";
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 12,
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      color: color,
    }}>
      {channel}
    </span>
  );
}

function BarChart({ data }: { data: typeof weeklyRevenue }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 150, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            {(d.value / 1000).toFixed(1)}k
          </span>
          <div style={{
            width: "100%", height: (d.value / max) * 120,
            background: "linear-gradient(180deg, var(--accent) 0%, var(--accent-dim) 100%)",
            borderRadius: "4px 4px 2px 2px", minHeight: 4,
            transition: "height 0.6s cubic-bezier(.4,0,.2,1)",
          }} />
          <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 500 }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: typeof channelData }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const size = 130;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const startAngle = (cumulative / total) * 360 - 90;
        cumulative += d.value;
        const endAngle = (cumulative / total) * 360 - 90;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
        return (
          <path key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={d.color} opacity="0.85" stroke="var(--card)" strokeWidth="2"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--card)" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize="18" fontWeight="700">{total}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10">Dağılım</text>
    </svg>
  );
}

function MiniChart({ color }: { color: string }) {
  const points = "0,28 17,20 34,24 51,12 68,16 85,6 102,10 120,2";
  return (
    <svg width={120} height={32} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g-${color.replace(/[^a-z]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${points} 120,32`} fill={`url(#g-${color.replace(/[^a-z]/gi, "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================
// NAV ITEMS
// ============================================
const navItems = [
  { id: "dashboard", label: "Genel Bakış", icon: "📊" },
  { id: "qpien", label: "Qpien Mesajlar", icon: "💬", badge: 3 },
  { id: "orders", label: "Siparişler", icon: "📦" },
  { id: "products", label: "Ürünler", icon: "🛒" },
  { id: "reports", label: "Raporlar", icon: "📈" },
  { id: "integrations", label: "Entegrasyonlar", icon: "🔗" },
  { id: "settings", label: "Ayarlar", icon: "⚙️" },
];

// ============================================
// PAGE VIEWS
// ============================================

function DashboardView({ setTab }: { setTab: (t: string) => void }) {
  const stats = [
    { label: "Toplam Gelir", value: "₺151,200", change: "+12.4%", positive: true, color: "var(--accent)" },
    { label: "Sipariş", value: "284", change: "+8.2%", positive: true, color: "var(--blue)" },
    { label: "Yeni Müşteri", value: "1,240", change: "+23.1%", positive: true, color: "var(--green)" },
    { label: "Dönüşüm Oranı", value: "%3.4", change: "+0.6%", positive: true, color: "var(--purple)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>Genel Bakış</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Hoş geldin! İşte bugünkü özet.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Bugün", "Bu Hafta", "Bu Ay"].map((l, i) => (
            <button key={l} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: i === 1 ? "var(--accent-glow)" : "transparent",
              color: i === 1 ? "var(--accent)" : "var(--text-muted)",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: `color-mix(in srgb, ${s.color} 15%, transparent)`, fontSize: 16,
              }}>
                {s.label === "Toplam Gelir" ? "💰" : s.label === "Sipariş" ? "📦" : s.label === "Yeni Müşteri" ? "👥" : "📊"}
              </div>
              <MiniChart color={s.color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: s.positive ? "var(--green)" : "var(--red)" }}>
                {s.positive ? "↑" : "↓"} {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Haftalık Gelir</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Son 7 gün</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>₺151.2k</div>
          </div>
          <BarChart data={weeklyRevenue} />
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Kanal Dağılımı</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Qpien üzerinden gelen mesajlar</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DonutChart data={channelData} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {channelData.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: ch.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{ch.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>%{ch.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Messages */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>💬 Son Mesajlar</span>
              <span style={{
                background: "var(--red-dim)", color: "var(--red)", fontSize: 10, fontWeight: 700,
                padding: "2px 7px", borderRadius: 10,
              }}>3 bekliyor</span>
            </div>
            <button onClick={() => setTab("qpien")} style={{
              background: "none", border: "none", color: "var(--accent)",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>Tümünü Gör →</button>
          </div>
          {mockConversations.slice(0, 4).map((c) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "var(--accent)", flexShrink: 0,
              }}>{c.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.customer}</span>
                  <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{c.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <ChannelBadge channel={c.channel} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</span>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>📦 Son Siparişler</span>
            <button onClick={() => setTab("orders")} style={{
              background: "none", border: "none", color: "var(--accent)",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>Tümünü Gör →</button>
          </div>
          {mockOrders.slice(0, 5).map((o) => (
            <div key={o.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: "var(--accent)", minWidth: 72 }}>{o.id}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{o.customer}</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", minWidth: 70, textAlign: "right" as const }}>{o.total}</span>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Stock Alerts */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          ⚠️ Stok Uyarıları
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
          {mockProducts.filter((p) => p.stock <= 12).map((p) => (
            <div key={p.name} style={{
              padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)",
              background: p.stock === 0 ? "var(--red-dim)" : "var(--orange-dim)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: p.stock === 0 ? "var(--red)" : "var(--orange)", fontWeight: 600, marginTop: 2 }}>
                {p.stock === 0 ? "Stokta yok!" : `${p.stock} adet kaldı`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QpienView() {
  const [selected, setSelected] = useState<typeof mockConversations[0] | null>(null);
  const [reply, setReply] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Qpien Mesajlar</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Tüm kanallardan gelen müşteri mesajları</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, minHeight: 480 }}>
        {/* List */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <input placeholder="Konuşma ara..." style={{
              width: "100%", padding: "8px 12px", borderRadius: 8,
              background: "var(--bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 12, fontFamily: "inherit", outline: "none",
            }} />
          </div>
          <div style={{ overflowY: "auto" as const, maxHeight: 430 }}>
            {mockConversations.map((c) => (
              <div key={c.id} onClick={() => setSelected(c)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                cursor: "pointer", borderBottom: "1px solid var(--border)",
                background: selected?.id === c.id ? "var(--accent-glow)" : "transparent",
                transition: "background 0.15s",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: "var(--accent-glow)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "var(--accent)", flexShrink: 0,
                }}>{c.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.customer}</span>
                    <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{c.message}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <ChannelBadge channel={c.channel} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", flexDirection: "column" }}>
          {selected ? (
            <>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: "var(--accent-glow)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "var(--accent)",
                  }}>{selected.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.customer}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                      <ChannelBadge channel={selected.channel} />
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>
                </div>
                {selected.status !== "resolved" && (
                  <button style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid color-mix(in srgb, var(--green) 40%, transparent)",
                    background: "var(--green-dim)", color: "var(--green)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>✓ Çözüldü</button>
                )}
              </div>
              <div style={{ flex: 1, padding: 20, overflowY: "auto" as const }}>
                <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "var(--card-hover)" }}>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>{selected.message}</div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 6 }}>{selected.time} önce</div>
                </div>
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Yanıt yaz..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      background: "var(--bg)", border: "1px solid var(--border)",
                      color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none",
                    }}
                  />
                  <button style={{
                    padding: "0 16px", borderRadius: 10, border: "none",
                    background: "var(--accent)", color: "var(--bg)",
                    fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    opacity: reply ? 1 : 0.5,
                  }}>Gönder →</button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Bir konuşma seçin</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Sol panelden bir müşteri konuşması seçerek başlayın</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Siparişler</h1>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 1fr 100px 80px 120px 100px",
          padding: "12px 20px", borderBottom: "1px solid var(--border)",
          fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase" as const, letterSpacing: "0.05em",
        }}>
          <span>Sipariş No</span><span>Müşteri</span><span>Tutar</span><span>Ürün</span><span>Durum</span><span>Tarih</span>
        </div>
        {mockOrders.map((o) => (
          <div key={o.id} style={{
            display: "grid", gridTemplateColumns: "100px 1fr 100px 80px 120px 100px",
            padding: "14px 20px", borderBottom: "1px solid var(--border)", alignItems: "center",
            cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: "var(--accent)" }}>{o.id}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{o.customer}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 }}>{o.total}</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{o.items} ürün</span>
            <StatusBadge status={o.status} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Ürünler</h1>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 80px 100px 120px 100px",
          padding: "12px 20px", borderBottom: "1px solid var(--border)",
          fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase" as const, letterSpacing: "0.05em",
        }}>
          <span>Ürün Adı</span><span>Stok</span><span>Satış</span><span>Gelir</span><span>Trend</span>
        </div>
        {mockProducts.map((p) => (
          <div key={p.name} style={{
            display: "grid", gridTemplateColumns: "1fr 80px 100px 120px 100px",
            padding: "14px 20px", borderBottom: "1px solid var(--border)", alignItems: "center",
            cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
              color: p.stock === 0 ? "var(--red)" : p.stock <= 12 ? "var(--orange)" : "var(--text)",
            }}>{p.stock}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{p.sold}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 }}>{p.revenue}</span>
            <span style={{ color: p.trend === "up" ? "var(--green)" : "var(--red)", fontSize: 12, fontWeight: 600 }}>
              {p.trend === "up" ? "↑ Yükseliş" : "↓ Düşüş"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsView() {
  const metrics = [
    { label: "Ortalama Sipariş Değeri", value: "₺532", change: "+₺42" },
    { label: "Müşteri Memnuniyeti", value: "%94.2", change: "+1.3%" },
    { label: "Yanıt Süresi (Ort.)", value: "4.2 dk", change: "-1.8 dk" },
    { label: "İade Oranı", value: "%2.8", change: "-0.4%" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Raporlar</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Haftalık Gelir Grafiği</div>
          <BarChart data={weeklyRevenue} />
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Kanal Performansı</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
            <DonutChart data={channelData} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {channelData.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: ch.color }} />
                  <span style={{ fontSize: 13, color: "var(--text-muted)", width: 80 }}>{ch.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>%{ch.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Temel Metrikler</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ padding: 16, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card-hover)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{m.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, marginTop: 6 }}>{m.change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Entegrasyonlar</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {integrations.map((ig) => (
          <div key={ig.name} style={{
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20,
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `color-mix(in srgb, ${ig.color} 15%, transparent)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ig.color, fontWeight: 800, fontSize: 16,
              }}>{ig.name[0]}</div>
              <StatusBadge status={ig.status} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{ig.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{ig.desc}</div>
            </div>
            <button style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
              background: ig.status === "connected" ? "transparent" : "var(--accent-glow)",
              color: ig.status === "connected" ? "var(--text-muted)" : "var(--accent)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: "auto",
            }}>
              {ig.status === "connected" ? "Ayarlar" : ig.status === "pending" ? "Kurulumu Tamamla" : "Bağlan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Ayarlar</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Genel Ayarlar</div>
          {[
            { label: "Mağaza Adı", value: "Mooncorn" },
            { label: "E-posta", value: "admin@mooncorn.com" },
            { label: "Dil", value: "Türkçe" },
            { label: "Zaman Dilimi", value: "UTC+3 (İstanbul)" },
          ].map((s) => (
            <div key={s.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Bildirim Tercihleri</div>
          {[
            { label: "Yeni sipariş bildirimi", on: true },
            { label: "Stok uyarıları", on: true },
            { label: "Qpien yeni mesaj", on: true },
            { label: "Haftalık rapor", on: false },
          ].map((n) => (
            <div key={n.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{n.label}</span>
              <div style={{
                width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                background: n.on ? "var(--accent)" : "var(--border-light)",
                display: "flex", alignItems: "center", padding: 2,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transform: n.on ? "translateX(18px)" : "translateX(0)",
                  transition: "transform 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  const sidebarW = sidebarOpen ? 240 : 64;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW, minWidth: sidebarW, height: "100%",
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? "20px 20px 16px" : "20px 0 16px",
          display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid var(--border)",
          justifyContent: sidebarOpen ? "flex-start" : "center",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "var(--bg)", flexShrink: 0,
          }}>M</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>mooncorn</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>admin panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" as const }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: sidebarOpen ? "10px 12px" : "10px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: activeTab === item.id ? "var(--accent-glow)" : "transparent",
              color: activeTab === item.id ? "var(--accent)" : "var(--text-muted)",
              fontSize: 13, fontWeight: 500, position: "relative",
              transition: "background 0.15s, color 0.15s",
            }}>
              <span style={{ flexShrink: 0, fontSize: 16 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span style={{
                  marginLeft: "auto", background: "var(--red)", color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10,
                }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            width: "100%", padding: 8, borderRadius: 8, border: "none",
            background: "var(--card-hover)", color: "var(--text-muted)",
            cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          }}>
            {sidebarOpen ? "◀ Daralt" : "▶"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header style={{
          height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", borderBottom: "1px solid var(--border)",
          background: "var(--surface)", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg)", borderRadius: 10, padding: "6px 14px",
            border: "1px solid var(--border)",
          }}>
            <span style={{ color: "var(--text-dim)" }}>🔍</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ara... (müşteri, sipariş, ürün)"
              style={{
                background: "none", border: "none", outline: "none",
                color: "var(--text)", fontSize: 13, width: 240, fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>{currentTime}</span>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
              borderRadius: 8, background: "var(--green-dim)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--green)" }}>Qpien</span>
            </div>
            <div style={{ position: "relative", cursor: "pointer", fontSize: 18 }}>
              🔔
              <span style={{
                position: "absolute", top: -4, right: -4, width: 16, height: 16,
                borderRadius: "50%", background: "var(--red)", color: "#fff",
                fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              }}>3</span>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "var(--accent)", cursor: "pointer",
            }}>B</div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {activeTab === "dashboard" && <DashboardView setTab={setActiveTab} />}
          {activeTab === "qpien" && <QpienView />}
          {activeTab === "orders" && <OrdersView />}
          {activeTab === "products" && <ProductsView />}
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "integrations" && <IntegrationsView />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
