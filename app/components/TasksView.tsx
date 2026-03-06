"use client";

import { useState } from "react";

// ============================================
// TYPES
// ============================================
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "review" | "done";
  priority: "urgent" | "high" | "normal" | "low";
  assignee: string;
  labels: string[];
  category: string;
  createdAt: string;
  dueDate: string;
  comments: number;
  subtasks: { total: number; done: number };
}

// ============================================
// DATA
// ============================================
const teamMembers = [
  { id: "baris", name: "Barış", avatar: "BQ", color: "#D4A843" },
  { id: "ayse", name: "Ayşe", avatar: "AY", color: "#3FB950" },
  { id: "mehmet", name: "Mehmet", avatar: "MK", color: "#58A6FF" },
  { id: "zeynep", name: "Zeynep", avatar: "ZD", color: "#BC8CFF" },
  { id: "can", name: "Can", avatar: "CÖ", color: "#F0883E" },
];

const labelOptions = [
  { id: "urun", name: "Ürün", color: "#58A6FF" },
  { id: "pazarlama", name: "Pazarlama", color: "#BC8CFF" },
  { id: "kargo", name: "Kargo", color: "#F0883E" },
  { id: "musteri", name: "Müşteri", color: "#3FB950" },
  { id: "teknik", name: "Teknik", color: "#F85149" },
  { id: "finans", name: "Finans", color: "#D4A843" },
  { id: "tasarim", name: "Tasarım", color: "#FF7EB6" },
  { id: "stok", name: "Stok", color: "#79C0FF" },
];

const categoryOptions = ["Genel", "Sipariş", "Ürün", "Pazarlama", "Teknik", "İK", "Finans"];

const columns = [
  { id: "todo" as const, title: "Yapılacak", icon: "📋", color: "var(--text-muted)" },
  { id: "inprogress" as const, title: "Devam Ediyor", icon: "🔄", color: "var(--blue)" },
  { id: "review" as const, title: "İnceleme", icon: "👁", color: "var(--purple)" },
  { id: "done" as const, title: "Tamamlandı", icon: "✅", color: "var(--green)" },
];

const priorityConfig = {
  urgent: { label: "Acil", color: "#F85149", bg: "rgba(248,81,73,0.15)", icon: "🔴" },
  high: { label: "Yüksek", color: "#F0883E", bg: "rgba(240,136,62,0.15)", icon: "🟠" },
  normal: { label: "Normal", color: "#58A6FF", bg: "rgba(88,166,255,0.15)", icon: "🔵" },
  low: { label: "Düşük", color: "#8B949E", bg: "rgba(139,148,158,0.15)", icon: "⚪" },
};

const initialTasks: Task[] = [
  {
    id: "MOON-1", title: "Yeni ürün fotoğraf çekimi", description: "Premium Organik Bal ve Cilt Bakım Seti için profesyonel stüdyo çekimi planla.",
    status: "todo", priority: "high", assignee: "zeynep", labels: ["urun", "pazarlama"], category: "Ürün",
    createdAt: "2026-03-04", dueDate: "2026-03-12", comments: 3, subtasks: { total: 4, done: 1 },
  },
  {
    id: "MOON-2", title: "Instagram kampanya içerikleri", description: "Mart ayı için 12 adet Instagram post ve 8 story tasarımı hazırla.",
    status: "inprogress", priority: "urgent", assignee: "ayse", labels: ["pazarlama", "tasarim"], category: "Pazarlama",
    createdAt: "2026-03-01", dueDate: "2026-03-08", comments: 7, subtasks: { total: 20, done: 12 },
  },
  {
    id: "MOON-3", title: "Kargo anlaşması güncelleme", description: "Aras Kargo ile yeni dönem fiyat anlaşması için görüşme yap.",
    status: "todo", priority: "normal", assignee: "baris", labels: ["kargo", "finans"], category: "Finans",
    createdAt: "2026-03-05", dueDate: "2026-03-15", comments: 1, subtasks: { total: 3, done: 0 },
  },
  {
    id: "MOON-4", title: "Stok sayımı - Q1 raporu", description: "Tüm ürünlerin fiziksel stok sayımı ve sistem eşleştirmesi.",
    status: "inprogress", priority: "high", assignee: "mehmet", labels: ["stok", "finans"], category: "Genel",
    createdAt: "2026-03-02", dueDate: "2026-03-10", comments: 2, subtasks: { total: 6, done: 4 },
  },
  {
    id: "MOON-5", title: "Müşteri memnuniyet anketi", description: "Son 30 gün sipariş veren müşterilere anket gönder ve sonuçları raporla.",
    status: "review", priority: "normal", assignee: "can", labels: ["musteri"], category: "Pazarlama",
    createdAt: "2026-03-03", dueDate: "2026-03-09", comments: 4, subtasks: { total: 5, done: 5 },
  },
  {
    id: "MOON-6", title: "Qpien API entegrasyonu", description: "Admin paneline Qpien canlı mesaj entegrasyonu. API dokümantasyonu bekleniyor.",
    status: "inprogress", priority: "urgent", assignee: "baris", labels: ["teknik"], category: "Teknik",
    createdAt: "2026-03-06", dueDate: "2026-03-13", comments: 0, subtasks: { total: 3, done: 1 },
  },
  {
    id: "MOON-7", title: "Trendyol mağaza açılışı", description: "Trendyol'da Mooncorn mağazası açılması için başvuru ve ürün listeleme.",
    status: "todo", priority: "high", assignee: "baris", labels: ["urun", "pazarlama"], category: "Pazarlama",
    createdAt: "2026-03-05", dueDate: "2026-03-20", comments: 2, subtasks: { total: 8, done: 0 },
  },
  {
    id: "MOON-8", title: "Web sitesi SEO optimizasyonu", description: "Mooncorn.com için meta tag, alt text ve sayfa hızı iyileştirmeleri.",
    status: "review", priority: "normal", assignee: "ayse", labels: ["teknik", "pazarlama"], category: "Teknik",
    createdAt: "2026-02-28", dueDate: "2026-03-07", comments: 5, subtasks: { total: 10, done: 9 },
  },
  {
    id: "MOON-9", title: "Yeni ambalaj tasarımı", description: "Organik Çay Paketi için sürdürülebilir ambalaj alternatifleri araştır.",
    status: "todo", priority: "low", assignee: "zeynep", labels: ["urun", "tasarim"], category: "Ürün",
    createdAt: "2026-03-06", dueDate: "2026-03-25", comments: 0, subtasks: { total: 0, done: 0 },
  },
  {
    id: "MOON-10", title: "Muhasebe aylık kapanış", description: "Şubat ayı gelir-gider mutabakatı ve vergi beyanname hazırlığı.",
    status: "done", priority: "high", assignee: "can", labels: ["finans"], category: "Finans",
    createdAt: "2026-02-25", dueDate: "2026-03-05", comments: 3, subtasks: { total: 5, done: 5 },
  },
  {
    id: "MOON-11", title: "WhatsApp şablon mesajları", description: "Sipariş onay, kargo bilgi ve kampanya şablonları hazırla.",
    status: "done", priority: "normal", assignee: "mehmet", labels: ["musteri", "pazarlama"], category: "Pazarlama",
    createdAt: "2026-03-01", dueDate: "2026-03-06", comments: 6, subtasks: { total: 8, done: 8 },
  },
];

// ============================================
// COMPONENTS
// ============================================

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const c = priorityConfig[priority];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

function LabelBadge({ labelId }: { labelId: string }) {
  const label = labelOptions.find((l) => l.id === labelId);
  if (!label) return null;
  return (
    <span style={{
      padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: `${label.color}20`, color: label.color,
    }}>
      {label.name}
    </span>
  );
}

function AvatarBadge({ assigneeId, size = 26 }: { assigneeId: string; size?: number }) {
  const member = teamMembers.find((m) => m.id === assigneeId);
  if (!member) return null;
  return (
    <div title={member.name} style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: `${member.color}25`, color: member.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, cursor: "pointer",
    }}>
      {member.avatar}
    </div>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--border)" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 2,
          background: pct === 100 ? "var(--green)" : "var(--accent)",
          transition: "width 0.3s ease",
        }} />
      </div>
      <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" as const }}>
        {done}/{total}
      </span>
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";
  const member = teamMembers.find((m) => m.id === task.assignee);

  return (
    <div onClick={onClick} style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: 14, cursor: "pointer",
      transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
      borderLeft: `3px solid ${priorityConfig[task.priority].color}`,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.borderLeftColor = priorityConfig[task.priority].color;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header: ID + Priority */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{task.id}</span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, color: "var(--text)" }}>
        {task.title}
      </div>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const, marginBottom: 10 }}>
          {task.labels.map((l) => <LabelBadge key={l} labelId={l} />)}
        </div>
      )}

      {/* Subtask Progress */}
      {task.subtasks.total > 0 && (
        <div style={{ marginBottom: 10 }}>
          <ProgressBar done={task.subtasks.done} total={task.subtasks.total} />
        </div>
      )}

      {/* Footer: Assignee + Meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <AvatarBadge assigneeId={task.assignee} size={22} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{member?.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {task.comments > 0 && (
            <span style={{ fontSize: 10, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 3 }}>
              💬 {task.comments}
            </span>
          )}
          <span style={{
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: isOverdue ? "var(--red)" : "var(--text-dim)",
            fontWeight: isOverdue ? 600 : 400,
          }}>
            {isOverdue ? "⚠ " : ""}{new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TASK DETAIL MODAL
// ============================================
function TaskDetailModal({ task, onClose, onStatusChange }: {
  task: Task;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}) {
  const member = teamMembers.find((m) => m.id === task.assignee);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
        width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{task.id}</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{task.title}</h2>
          </div>
          <button onClick={onClose} style={{
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-muted)", fontSize: 16, fontFamily: "inherit",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Status + Priority */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Durum</div>
              <div style={{ display: "flex", gap: 6 }}>
                {columns.map((col) => (
                  <button key={col.id} onClick={() => onStatusChange(task.id, col.id)}
                    style={{
                      padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                      border: task.status === col.id ? `1px solid ${col.color}` : "1px solid var(--border)",
                      background: task.status === col.id ? `${col.color}20` : "transparent",
                      color: task.status === col.id ? col.color : "var(--text-muted)",
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    }}
                  >{col.icon} {col.title}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Açıklama</div>
            <div style={{
              fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7,
              padding: 14, borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)",
            }}>
              {task.description}
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Atanan Kişi</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
                <AvatarBadge assigneeId={task.assignee} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{member?.name}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Öncelik</div>
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Kategori</div>
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", fontSize: 13 }}>
                {task.category}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Bitiş Tarihi</div>
              <div style={{
                padding: "8px 12px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)",
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                color: new Date(task.dueDate) < new Date() && task.status !== "done" ? "var(--red)" : "var(--text)",
              }}>
                {new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Labels */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Etiketler</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {task.labels.map((l) => <LabelBadge key={l} labelId={l} />)}
            </div>
          </div>

          {/* Subtasks */}
          {task.subtasks.total > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Alt Görevler ({task.subtasks.done}/{task.subtasks.total})
              </div>
              <ProgressBar done={task.subtasks.done} total={task.subtasks.total} />
            </div>
          )}

          {/* Meta */}
          <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", gap: 16 }}>
            <span>Oluşturulma: {new Date(task.createdAt).toLocaleDateString("tr-TR")}</span>
            <span>💬 {task.comments} yorum</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NEW TASK MODAL
// ============================================
function NewTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Task) => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("normal");
  const [assignee, setAssignee] = useState("baris");
  const [category, setCategory] = useState("Genel");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `MOON-${Math.floor(Math.random() * 900) + 100}`,
      title: title.trim(),
      description: desc.trim(),
      status: "todo",
      priority,
      assignee,
      labels: selectedLabels,
      category,
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      comments: 0,
      subtasks: { total: 0, done: 0 },
    };
    onAdd(newTask);
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    background: "var(--card)", border: "1px solid var(--border)",
    color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none",
  };

  const selectStyle = {
    ...inputStyle, cursor: "pointer", appearance: "none" as const,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238B949E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
    paddingRight: 36,
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
        width: "100%", maxWidth: 560, maxHeight: "85vh", overflow: "auto",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Yeni Görev Oluştur</h2>
          <button onClick={onClose} style={{
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-muted)", fontSize: 16, fontFamily: "inherit",
          }}>✕</button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Başlık *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Görev başlığını girin..." style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Açıklama</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Detaylı açıklama..." rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }} />
          </div>

          {/* Priority + Assignee */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Öncelik</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} style={selectStyle}>
                <option value="urgent">🔴 Acil</option>
                <option value="high">🟠 Yüksek</option>
                <option value="normal">🔵 Normal</option>
                <option value="low">⚪ Düşük</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Atanan Kişi</label>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={selectStyle}>
                {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Category + Due Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Bitiş Tarihi</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Etiketler</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {labelOptions.map((l) => (
                <button key={l.id} onClick={() => toggleLabel(l.id)} style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  border: selectedLabels.includes(l.id) ? `1px solid ${l.color}` : "1px solid var(--border)",
                  background: selectedLabels.includes(l.id) ? `${l.color}20` : "transparent",
                  color: selectedLabels.includes(l.id) ? l.color : "var(--text-muted)",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}>{l.name}</button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!title.trim()} style={{
            width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
            background: title.trim() ? "var(--accent)" : "var(--border)",
            color: title.trim() ? "var(--bg)" : "var(--text-dim)",
            fontSize: 14, fontWeight: 700, cursor: title.trim() ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all 0.2s",
          }}>
            Görev Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export default function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
    if (filterLabel !== "all" && !t.labels.includes(filterLabel)) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    setSelectedTask((prev) => prev && prev.id === taskId ? { ...prev, status: newStatus } : prev);
  };

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const taskCounts = {
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    inprogress: filteredTasks.filter((t) => t.status === "inprogress").length,
    review: filteredTasks.filter((t) => t.status === "review").length,
    done: filteredTasks.filter((t) => t.status === "done").length,
  };

  const selectStyle = {
    padding: "6px 28px 6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500,
    background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)",
    cursor: "pointer", fontFamily: "inherit", outline: "none",
    appearance: "none" as const,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L4 4L7 1' stroke='%238B949E' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>Görev Yönetimi</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Tüm görevleri takip et, ata ve yönet</p>
        </div>
        <button onClick={() => setShowNewTask(true)} style={{
          padding: "10px 20px", borderRadius: 10, border: "none",
          background: "var(--accent)", color: "var(--bg)",
          fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          ＋ Yeni Görev
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const,
        padding: "12px 16px", background: "var(--card)", borderRadius: 12,
        border: "1px solid var(--border)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200,
          background: "var(--bg)", borderRadius: 8, padding: "4px 12px",
          border: "1px solid var(--border)",
        }}>
          <span style={{ color: "var(--text-dim)", fontSize: 14 }}>🔍</span>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Görev ara..." style={{
              background: "none", border: "none", outline: "none", color: "var(--text)",
              fontSize: 12, fontFamily: "inherit", width: "100%",
            }} />
        </div>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={selectStyle}>
          <option value="all">Tüm Öncelikler</option>
          <option value="urgent">🔴 Acil</option>
          <option value="high">🟠 Yüksek</option>
          <option value="normal">🔵 Normal</option>
          <option value="low">⚪ Düşük</option>
        </select>
        <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} style={selectStyle}>
          <option value="all">Tüm Kişiler</option>
          {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)} style={selectStyle}>
          <option value="all">Tüm Etiketler</option>
          {labelOptions.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 4 }}>
          {filteredTasks.length} görev
        </span>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
        flex: 1, minHeight: 0,
      }}>
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} style={{
              display: "flex", flexDirection: "column",
              background: "var(--bg)", borderRadius: 14,
              border: "1px solid var(--border)", overflow: "hidden",
            }}>
              {/* Column Header */}
              <div style={{
                padding: "14px 16px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--surface)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{col.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                  background: `${col.color}20`, color: col.color,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {taskCounts[col.id]}
                </span>
              </div>

              {/* Column Tasks */}
              <div style={{
                padding: 10, display: "flex", flexDirection: "column", gap: 10,
                overflowY: "auto" as const, flex: 1,
              }}>
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
                {colTasks.length === 0 && (
                  <div style={{
                    padding: 20, textAlign: "center" as const,
                    color: "var(--text-dim)", fontSize: 12,
                  }}>
                    Görev yok
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onStatusChange={handleStatusChange} />
      )}
      {showNewTask && (
        <NewTaskModal onClose={() => setShowNewTask(false)} onAdd={handleAddTask} />
      )}
    </div>
  );
}
