import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Table,
  School,
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import {
  useClasses,
  usePeriods,
  useSchool,
  useSubjects,
  useTeachers,
  uid,
} from "@/lib/store";
import { DAYS, type Timetable } from "@/lib/defaults";
import { generateTimetable } from "@/lib/generator";
import { exportTimetableExcel } from "@/lib/excel";

type Tab =
  | "overview"
  | "teachers"
  | "classes"
  | "subjects"
  | "periods"
  | "timetable";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [school, setSchool] = useSchool();

  const nav: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "periods", label: "Period Slots", icon: Clock },
    { id: "timetable", label: "Generate Timetable", icon: Table },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r md:flex"
        style={{
          background: "var(--sidebar-bg)",
          color: "var(--sidebar-fg)",
          borderColor: "transparent",
        }}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <School className="h-3.5 w-3.5" /> School
          </div>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full bg-transparent font-serif text-xl font-semibold text-white outline-none focus:border-b focus:border-white/40"
          />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((n) => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                style={
                  active ? { background: "var(--gradient-hero)" } : undefined
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-white/40">
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
          <div className="mt-2">Designed by Divyansh Jain</div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="border-b bg-card/50 px-6 py-4 backdrop-blur md:hidden">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as Tab)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2"
          >
            {nav.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          {tab === "overview" && <Overview onJump={setTab} />}
          {tab === "teachers" && <TeachersTab />}
          {tab === "classes" && <ClassesTab />}
          {tab === "subjects" && <SubjectsTab />}
          {tab === "periods" && <PeriodsTab />}
          {tab === "timetable" && <TimetableTab />}
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function PrimaryBtn({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50 ${props.className ?? ""}`}
      style={{
        background: "var(--gradient-hero)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {children}
    </div>
  );
}

function Overview({ onJump }: { onJump: (t: Tab) => void }) {
  const [teachers] = useTeachers();
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();
  const stats = [
    {
      label: "Teachers",
      value: teachers.length,
      icon: Users,
      tab: "teachers" as Tab,
    },
    {
      label: "Classes",
      value: classes.length,
      icon: GraduationCap,
      tab: "classes" as Tab,
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      tab: "subjects" as Tab,
    },
    {
      label: "Period Slots",
      value: periods.length,
      icon: Clock,
      tab: "periods" as Tab,
    },
  ];
  return (
    <>
      <SectionHeader
        title="Welcome back"
        desc="Everything you need to plan your week."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onJump(s.tab)}
            className="rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-serif text-4xl font-semibold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </button>
        ))}
      </div>
      <div
        className="mt-8 rounded-2xl p-8 text-primary-foreground"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Ready to generate?
            </h2>
            <p className="mt-1 text-white/80">
              Auto-build a clash-free timetable and export to Excel.
            </p>
          </div>
          <button
            onClick={() => onJump("timetable")}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-white/90"
          >
            Open Generator →
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- Teachers ---------- */
function TeachersTab() {
  const [teachers, setTeachers] = useTeachers();
  const [subjects] = useSubjects();
  const [classes] = useClasses();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", subjects: "", classes: "" });

  const startAdd = () => {
    setEditing("new");
    setDraft({ name: "", subjects: "", classes: "" });
  };
  const startEdit = (id: string) => {
    const t = teachers.find((x) => x.id === id)!;
    setEditing(id);
    setDraft({
      name: t.name || "",
      // Safely handle arrays to prevent .join crash
      subjects: (t.subjects || []).join(", "),
      classes: (t.classes || []).join(", "),
    });
  };
  const save = () => {
    const payload = {
      name: draft.name.trim(),
      subjects: draft.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      classes: draft.classes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (!payload.name) return;
    if (editing === "new")
      setTeachers([...teachers, { id: uid(), ...payload }]);
    else
      setTeachers(
        teachers.map((t) => (t.id === editing ? { ...t, ...payload } : t)),
      );
    setEditing(null);
  };
  const remove = (id: string) =>
    setTeachers(teachers.filter((t) => t.id !== id));

  return (
    <>
      <SectionHeader
        title="Teachers"
        desc="Add staff and the subjects & classes they teach."
        action={
          <PrimaryBtn onClick={startAdd}>
            <Plus className="h-4 w-4" /> Add Teacher
          </PrimaryBtn>
        }
      />
      {editing && (
        <Card>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. Anjali Mam"
              />
            </Field>
            <Field
              label={`Subjects (comma) · options: ${subjects.map((s) => s.name).join(", ")}`}
            >
              <input
                value={draft.subjects}
                onChange={(e) =>
                  setDraft({ ...draft, subjects: e.target.value })
                }
                className={inputCls}
                placeholder="Sanskrit, Hindi"
              />
            </Field>
            <Field
              label={`Classes (comma) · options: ${classes.map((c) => c.name).join(", ")}`}
            >
              <input
                value={draft.classes}
                onChange={(e) =>
                  setDraft({ ...draft, classes: e.target.value })
                }
                className={inputCls}
                placeholder="VI, VII, VIII"
              />
            </Field>
            <div className="md:col-span-3 flex gap-2">
              <PrimaryBtn onClick={save}>Save</PrimaryBtn>
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}
      <div
        className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Subjects</th>
              <th className="px-5 py-3">Classes</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{t.name}</td>
                {/* Safely handle rendering arrays */}
                <td className="px-5 py-3 text-muted-foreground">
                  {(t.subjects || []).join(", ")}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {(t.classes || []).join(", ")}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => startEdit(t.id)}
                    className="mr-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- Classes / Subjects / Periods (CRUD) ---------- */
const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SimpleListTab<T extends { id: string }>({
  title,
  desc,
  items,
  setItems,
  columns,
  blank,
}: {
  title: string;
  desc: string;
  items: T[];
  setItems: (v: T[]) => void;
  columns: { key: keyof T; label: string; type?: "text" | "number" }[];
  blank: Omit<T, "id">;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [draft, setDraft] = useState<any>(blank);

  const startAdd = () => {
    setEditing("new");
    setDraft(blank);
  };
  const startEdit = (id: string) => {
    setEditing(id);
    setDraft(items.find((x) => x.id === id)!);
  };
  const save = () => {
    if (editing === "new") setItems([...items, { ...draft, id: uid() } as T]);
    else
      setItems(items.map((i) => (i.id === editing ? { ...i, ...draft } : i)));
    setEditing(null);
  };
  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <>
      <SectionHeader
        title={title}
        desc={desc}
        action={
          <PrimaryBtn onClick={startAdd}>
            <Plus className="h-4 w-4" /> Add
          </PrimaryBtn>
        }
      />
      {editing && (
        <Card>
          <div
            className="grid gap-4 p-6"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))`,
            }}
          >
            {columns.map((c) => (
              <Field key={String(c.key)} label={c.label}>
                <input
                  type={c.type ?? "text"}
                  value={draft[c.key] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft({
                      ...draft,
                      // Fix: Empty value handle kiya gaya hai taaki number input 0 par na atke
                      [c.key]:
                        c.type === "number"
                          ? val === ""
                            ? ""
                            : Number(val)
                          : val,
                    });
                  }}
                  className={inputCls}
                />
              </Field>
            ))}
            <div className="col-span-full flex gap-2">
              <PrimaryBtn onClick={save}>Save</PrimaryBtn>
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}
      <div
        className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-5 py-3">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-border">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-5 py-3">
                    {String(i[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => startEdit(i.id)}
                    className="mr-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ClassesTab() {
  const [classes, setClasses] = useClasses();
  return (
    <SimpleListTab
      title="Classes"
      desc="Manage class names."
      items={classes}
      setItems={setClasses}
      columns={[{ key: "name", label: "Class Name" }]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank={{ name: "" } as any}
    />
  );
}
function SubjectsTab() {
  const [subjects, setSubjects] = useSubjects();
  return (
    <SimpleListTab
      title="Subjects"
      desc="Subjects and weekly period count."
      items={subjects}
      setItems={setSubjects}
      columns={[
        { key: "name", label: "Subject" },
        { key: "periodsPerWeek", label: "Periods / Week", type: "number" },
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank={{ name: "", periodsPerWeek: 6 } as any}
    />
  );
}
function PeriodsTab() {
  const [periods, setPeriods] = usePeriods();
  return (
    <SimpleListTab
      title="Period Slots"
      desc="Daily period schedule (7 periods, Mon–Sat)."
      items={periods}
      setItems={setPeriods}
      columns={[
        { key: "label", label: "Period" },
        { key: "time", label: "Time" },
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank={{ label: "", time: "" } as any}
    />
  );
}

/* ---------- Timetable ---------- */
function TimetableTab() {
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();
  const [teachers] = useTeachers();
  const [school] = useSchool();
  const [tt, setTt] = useState<Timetable | null>(null);
  const [selected, setSelected] = useState<string>("");

  // Naya state export format ko track karne ke liye
  const [exportFormat, setExportFormat] = useState<"class" | "master">("class");

  const generate = () => {
    const next = generateTimetable(classes, subjects, periods, teachers);
    setTt(next);
    setSelected(classes[0]?.name ?? "");
  };

  const download = () => {
    if (!tt) return;
    // Download karte time format variable bhi pass kar rahe hain
    exportTimetableExcel(school, tt, classes, periods, exportFormat);
  };

  const activeGrid = useMemo(
    () => (tt && selected ? tt[selected] : null),
    [tt, selected],
  );

  return (
    <>
      <SectionHeader
        title="Generate Timetable"
        desc="Auto-build a clash-free schedule for all classes."
        action={
          <div className="flex flex-wrap gap-3 items-center">
            <PrimaryBtn onClick={generate}>
              <Sparkles className="h-4 w-4" /> {tt ? "Regenerate" : "Generate"}
            </PrimaryBtn>

            {/* New Download Controls */}
            <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as "class" | "master")
                }
                className="bg-transparent text-sm font-medium text-foreground outline-none px-3 py-1.5 cursor-pointer rounded-lg hover:bg-secondary"
              >
                <option value="class">Class-wise Format</option>
                <option value="master">Master Format (Day-wise)</option>
              </select>
              <div className="w-[1px] h-5 bg-border mx-1"></div>
              <button
                onClick={download}
                disabled={!tt}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold hover:bg-secondary disabled:opacity-40 rounded-lg text-foreground transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        }
      />

      {!tt && (
        <Card>
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Table className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-semibold">
              No timetable yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Click Generate to build a six-day, seven-period schedule from your
              teachers and subjects.
            </p>
          </div>
        </Card>
      )}

      {tt && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.name)}
                className={`rounded-xl px-3.5 py-1.5 text-sm font-medium ${selected === c.name ? "text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
                style={
                  selected === c.name
                    ? { background: "var(--gradient-hero)" }
                    : undefined
                }
              >
                Class {c.name}
              </button>
            ))}
          </div>

          {activeGrid && (
            <div
              className="overflow-x-auto rounded-2xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Day / Period</th>
                    {periods.map((p) => (
                      <th key={p.id} className="px-4 py-3">
                        <div className="font-semibold text-foreground">
                          {p.label}
                        </div>
                        <div className="font-mono text-[10px]">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((d, di) => (
                    <tr key={d} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold">{d}</td>
                      {periods.map((p, pi) => {
                        const cell = activeGrid[di]?.[pi];
                        return (
                          <td key={p.id} className="px-4 py-3 align-top">
                            {cell ? (
                              <div className="rounded-lg bg-accent/40 px-2 py-1.5">
                                <div className="font-medium text-foreground">
                                  {cell.subject}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  {cell.teacher}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
