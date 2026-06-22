import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PrimaryBtn } from "@/components/ui/primary-btn";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { uid } from "@/lib/store";

export function SimpleListTab<T extends { id: string }>({
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
  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

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
        className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <table className="w-full min-w-[600px] text-sm">
          {" "}
          {/* min-w add kiya taaki zyada squish na ho */}
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            {/* baki ka thead code same rahega */}
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
