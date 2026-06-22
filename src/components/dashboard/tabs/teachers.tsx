import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useClasses, useSubjects, useTeachers, uid } from "@/lib/store";
import { SectionHeader } from "@/components/ui/section-header";
import { PrimaryBtn } from "@/components/ui/primary-btn";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";

export function TeachersTab() {
  const [teachers, setTeachers] = useTeachers();
  const [subjects] = useSubjects();
  const [classes] = useClasses();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", subjects: "", classes: "" });

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  const startAdd = () => {
    setEditing("new");
    setDraft({ name: "", subjects: "", classes: "" });
  };

  const startEdit = (id: string) => {
    const t = teachers.find((x) => x.id === id)!;
    setEditing(id);
    setDraft({
      name: t.name || "",
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
        className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <table className="w-full min-w-[700px] text-sm">
          {" "}
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
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
