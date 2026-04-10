import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { resumesApi } from "../api/resumes";
import { Skeleton, SkeletonText } from "../components/Skeleton";
import type {
  EducationEntryDto,
  ExperienceEntryDto,
  ProjectEntryDto,
  ResumeStructuredDocument,
  SkillGroupDto,
} from "../types/resumeStructured";
import {
  DEFAULT_SECTION_ORDER,
  SKILL_CATEGORY_LABELS,
  emptyResumeStructured,
} from "../types/resumeStructured";

function AiGlowBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-teal-400 to-violet-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm shadow-teal-500/25">
      AI
    </span>
  );
}

/** Nested block inside a sortable section (skills group, job card, etc.) */
const NESTED_CARD_CLASS =
  "rounded-xl border border-white/[0.08] bg-black/30 p-4 ring-1 ring-white/[0.05] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const SECTION_SHELL_CLASS =
  "relative rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--orio-elevated)]/95 via-[#12121c]/90 to-[#08080f]/95 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl ring-1 ring-teal-500/10 md:p-6";

const AI_TEXTAREA_CORNER_BTN =
  "group absolute right-2 top-2 grid h-8 items-center overflow-hidden rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 text-xs font-bold text-white shadow-lg shadow-black/35 ring-1 ring-white/10 transition-[width,filter,transform] duration-200 ease-out hover:brightness-110 active:scale-[0.98] disabled:opacity-60";

function AiSparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2l1.2 4.2L17.4 7.4l-4.2 1.2L12 12l-1.2-3.4L6.6 7.4l4.2-1.2L12 2z" />
      <path d="M19 10l.7 2.4 2.3.6-2.3.7L19 16l-.7-2.3-2.3-.7 2.3-.6L19 10z" />
      <path d="M4.5 12.5l.5 1.6 1.5.4-1.5.5-.5 1.5-.4-1.5-1.6-.5 1.6-.4.4-1.6z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 16h10l1-16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function DeleteIconButton({
  onClick,
  label = "Delete",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-200"
      aria-label={label}
      title={label}
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}

function WriteWithAiCornerButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${AI_TEXTAREA_CORNER_BTN} w-8 hover:w-[132px]`}
      aria-label="Write with AI"
    >
      <span className="col-start-1 row-start-1 flex h-8 w-8 items-center justify-center">
        <AiSparklesIcon className="h-4 w-4" />
      </span>
      <span className="col-start-1 row-start-1 ml-8 pr-2 text-center max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-200 group-hover:max-w-[108px] group-hover:opacity-100">
        Write with AI
      </span>
    </button>
  );
}

function SortableSectionShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.88 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${SECTION_SHELL_CLASS} transition-shadow ${
        isDragging
          ? "z-20 ring-2 ring-teal-400/35 shadow-[0_28px_72px_rgba(0,0,0,0.55)]"
          : ""
      }`}
    >
      <button
        type="button"
        className="absolute left-3 top-4 cursor-grab rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-teal-300 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        title="Drag to reorder section"
        aria-label="Drag to reorder"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="9" cy="8" r="1.5" />
          <circle cx="15" cy="8" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="16" r="1.5" />
          <circle cx="15" cy="16" r="1.5" />
        </svg>
      </button>
      <div className="pl-9 md:pl-10">{children}</div>
    </div>
  );
}

type Props = {
  resumeId: string;
  onBack: () => void;
};

export default function ResumeEditorPage({ resumeId, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [docTitle, setDocTitle] = useState("");
  const [structured, setStructured] = useState<ResumeStructuredDocument>(
    emptyResumeStructured,
  );
  const structuredRef = useRef(structured);
  structuredRef.current = structured;
  const [aiPaths, setAiPaths] = useState<Set<string>>(new Set());
  const [insights, setInsights] = useState<{
    missingFields: string[];
    improvementTips: string[];
  } | null>(null);
  const [improveBusy, setImproveBusy] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const hasInsightsSidebar =
    insights != null &&
    (insights.missingFields.length > 0 || insights.improvementTips.length > 0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const clearAi = useCallback((path: string) => {
    setAiPaths((prev) => {
      const n = new Set(prev);
      n.delete(path);
      return n;
    });
  }, []);

  /** Tracks fields the user explicitly refined with "Improve with AI" (not initial PDF parse). */
  const markAiEnhanced = useCallback((path: string) => {
    setAiPaths((prev) => new Set(prev).add(path));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const d = await resumesApi.getDetail(resumeId);
        if (cancelled) return;
        setDocTitle(d.title);
        setStructured({
          ...emptyResumeStructured(),
          ...d.structured,
          personal: {
            ...emptyResumeStructured().personal,
            ...d.structured.personal,
          },
          sectionOrder:
            d.structured.sectionOrder?.length > 0
              ? d.structured.sectionOrder
              : [...DEFAULT_SECTION_ORDER],
        });
        setAiPaths(new Set());
        const ins = await resumesApi.getInsights(resumeId);
        if (!cancelled) setInsights(ins);
      } catch {
        if (!cancelled) onBackRef.current();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  useEffect(() => {
    if (!previewModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewModalOpen]);

  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      setSaveState("saving");
      resumesApi
        .saveStructured(resumeId, structuredRef.current)
        .then(() => {
          setSaveState("saved");
          window.setTimeout(() => setSaveState("idle"), 2000);
        })
        .catch(() => {
          setSaveState("error");
        });
    }, 2500);
    return () => window.clearTimeout(t);
  }, [structured, resumeId, loading]);

  const loadingView = (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-52" rounded="full" />
          <Skeleton className="h-3.5 w-32" rounded="full" />
        </div>
        <Skeleton className="h-9 w-24" rounded="full" />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <Skeleton className="h-4 w-44" rounded="full" />
              <div className="mt-4">
                <SkeletonText lines={4} />
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Skeleton className="h-4 w-32" rounded="full" />
            <div className="mt-4">
              <SkeletonText lines={6} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Skeleton className="h-4 w-40" rounded="full" />
            <div className="mt-4">
              <SkeletonText lines={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const persistTitle = useCallback(async () => {
    const next = docTitle.trim();
    if (!next) return;
    try {
      await resumesApi.patchTitle(resumeId, next);
      window.dispatchEvent(
        new CustomEvent("resume:title-updated", {
          detail: { id: resumeId, title: next },
        }),
      );
    } catch {
      // best-effort; editor still keeps local state
    }
  }, [docTitle, resumeId]);

  const lastPatchedTitleRef = useRef<string>("");
  useEffect(() => {
    const next = docTitle.trim();
    if (!next) return;
    if (next === lastPatchedTitleRef.current) return;
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          await resumesApi.patchTitle(resumeId, next);
          lastPatchedTitleRef.current = next;
          window.dispatchEvent(
            new CustomEvent("resume:title-updated", {
              detail: { id: resumeId, title: next },
            }),
          );
        } catch {
          /* best-effort */
        }
      })();
    }, 700);
    return () => window.clearTimeout(t);
  }, [docTitle, resumeId]);

  const order = useMemo(() => {
    const allowed = new Set<string>(
      DEFAULT_SECTION_ORDER as unknown as string[],
    );
    const o = structured.sectionOrder.filter((x) => allowed.has(x));
    const missing = (DEFAULT_SECTION_ORDER as unknown as string[]).filter(
      (k) => !o.includes(k),
    );
    return [...o, ...missing];
  }, [structured.sectionOrder]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setStructured((s) => {
      const oldIndex = s.sectionOrder.indexOf(String(active.id));
      const newIndex = s.sectionOrder.indexOf(String(over.id));
      if (oldIndex < 0 || newIndex < 0) return s;
      return {
        ...s,
        sectionOrder: arrayMove(s.sectionOrder, oldIndex, newIndex),
      };
    });
  };

  const improve = async (key: string, target: string, text: string) => {
    if (!text.trim()) return;
    setImproveBusy(key);
    try {
      const { text: out } = await resumesApi.improve(resumeId, {
        target,
        text,
      });
      return out;
    } finally {
      setImproveBusy(null);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 outline-none transition";
  const labelClass =
    "text-[11px] font-bold uppercase tracking-[0.14em] text-violet-300/90";
  const primaryBtnSm =
    "rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 transition hover:brightness-110 active:scale-[0.98]";
  const improveWithAiBtn =
    "rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-teal-500/20 transition hover:brightness-110 disabled:opacity-50";

  const renderSection = (sid: string) => {
    switch (sid) {
      case "personal":
        return (
          <>
            <h3 className="orio-font-display flex items-center text-lg font-bold text-slate-100">
              <span className="mr-2 text-teal-400">◎</span> Personal details
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["fullName", "Name", "personal.fullName"],
                  ["email", "Email", "personal.email"],
                  ["phone", "Phone", "personal.phone"],
                  ["location", "Location", "personal.location"],
                ] as const
              ).map(([field, label, path]) => (
                <div key={field}>
                  <label className={labelClass}>
                    {label}
                    <AiGlowBadge show={aiPaths.has(path)} />
                  </label>
                  <input
                    className={`${inputClass} mt-1`}
                    value={structured.personal[field]}
                    onChange={(e) => {
                      clearAi(path);
                      setStructured((s) => ({
                        ...s,
                        personal: { ...s.personal, [field]: e.target.value },
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        );
      case "summary":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display flex items-center text-lg font-bold text-slate-100">
                <span className="mr-2 text-violet-400">💬</span> Introduction
                <AiGlowBadge show={aiPaths.has("summary")} />
              </h3>
              <button
                type="button"
                disabled={improveBusy === "summary"}
                onClick={async () => {
                  const t = structured.summary;
                  const out = await improve("summary", "summary", t);
                  if (out) {
                    markAiEnhanced("summary");
                    setStructured((s) => ({ ...s, summary: out }));
                  }
                }}
                className={improveWithAiBtn}
              >
                <span className="inline-flex items-center gap-2">
                  <AiSparklesIcon className="h-4 w-4" />
                  {improveBusy === "summary" ? "Writing…" : "Write with AI"}
                </span>
              </button>
            </div>
            <textarea
              className={`${inputClass} mt-3 min-h-[140px] resize-y`}
              value={structured.summary}
              onChange={(e) => {
                clearAi("summary");
                setStructured((s) => ({ ...s, summary: e.target.value }));
              }}
            />
          </>
        );
      case "skills":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">⚡</span> Skills
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    skills: [...s.skills, { category: "other", items: [] }],
                  }))
                }
                className={primaryBtnSm}
              >
                Add group
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.skills.map((g, gi) => (
                <SkillGroupEditor
                  key={gi}
                  group={g}
                  inputClass={inputClass}
                  labelClass={labelClass}
                  onChange={(next) =>
                    setStructured((s) => {
                      const skills = [...s.skills];
                      skills[gi] = next;
                      return { ...s, skills };
                    })
                  }
                  onRemove={() =>
                    setStructured((s) => ({
                      ...s,
                      skills: s.skills.filter((_, i) => i !== gi),
                    }))
                  }
                />
              ))}
            </div>
          </>
        );
      case "experience":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">💼</span> Job experience
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    experience: [
                      ...s.experience,
                      {
                        company: "",
                        role: "",
                        duration: "",
                        location: "",
                        description: "",
                        bullets: [],
                      },
                    ],
                  }))
                }
                className={primaryBtnSm}
              >
                Add job
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.experience.map((job, ji) => (
                <ExperienceCard
                  key={ji}
                  job={job}
                  ji={ji}
                  aiPaths={aiPaths}
                  clearAi={clearAi}
                  markAiEnhanced={markAiEnhanced}
                  improve={improve}
                  improveBusy={improveBusy}
                  inputClass={inputClass}
                  labelClass={labelClass}
                  onChange={(next) =>
                    setStructured((s) => {
                      const experience = [...s.experience];
                      experience[ji] = next;
                      return { ...s, experience };
                    })
                  }
                  onRemove={() =>
                    setStructured((s) => ({
                      ...s,
                      experience: s.experience.filter((_, i) => i !== ji),
                    }))
                  }
                />
              ))}
            </div>
          </>
        );
      case "education":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">🎓</span> Education
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    education: [
                      ...s.education,
                      {
                        school: "",
                        degree: "",
                        timePeriod: "",
                        location: "",
                        description: "",
                      },
                    ],
                  }))
                }
                className={primaryBtnSm}
              >
                Add education
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.education.map((ed, ei) => (
                <EducationCard
                  key={ei}
                  ed={ed}
                  ei={ei}
                  inputClass={inputClass}
                  labelClass={labelClass}
                  onChange={(next) =>
                    setStructured((s) => {
                      const education = [...s.education];
                      education[ei] = next;
                      return { ...s, education };
                    })
                  }
                  onRemove={() =>
                    setStructured((s) => ({
                      ...s,
                      education: s.education.filter((_, i) => i !== ei),
                    }))
                  }
                />
              ))}
            </div>
          </>
        );
      case "projects":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">🚀</span> Projects
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    projects: [
                      ...s.projects,
                      { title: "", description: "", technologies: "" },
                    ],
                  }))
                }
                className={primaryBtnSm}
              >
                Add project
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.projects.map((p, pi) => (
                <ProjectCard
                  key={pi}
                  p={p}
                  pi={pi}
                  aiPaths={aiPaths}
                  clearAi={clearAi}
                  markAiEnhanced={markAiEnhanced}
                  improve={improve}
                  improveBusy={improveBusy}
                  inputClass={inputClass}
                  labelClass={labelClass}
                  onChange={(next) =>
                    setStructured((s) => {
                      const projects = [...s.projects];
                      projects[pi] = next;
                      return { ...s, projects };
                    })
                  }
                  onRemove={() =>
                    setStructured((s) => ({
                      ...s,
                      projects: s.projects.filter((_, i) => i !== pi),
                    }))
                  }
                />
              ))}
            </div>
          </>
        );
      case "certifications":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">🏅</span> Certifications
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    certifications: [
                      ...s.certifications,
                      { title: "", issuer: "", date: "", description: "" },
                    ],
                  }))
                }
                className={primaryBtnSm}
              >
                Add certification
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.certifications.map((c, ci) => (
                <div key={ci} className={NESTED_CARD_CLASS}>
                  <div className="flex justify-end">
                    <DeleteIconButton
                      onClick={() =>
                        setStructured((s) => ({
                          ...s,
                          certifications: s.certifications.filter(
                            (_, i) => i !== ci,
                          ),
                        }))
                      }
                      label="Delete certification"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Title"
                      className={labelClass}
                      inputClass={inputClass}
                      value={c.title}
                      onChange={(v) =>
                        setStructured((s) => {
                          const certifications = [...s.certifications];
                          certifications[ci] = { ...c, title: v };
                          return { ...s, certifications };
                        })
                      }
                    />
                    <Field
                      label="Issuer"
                      className={labelClass}
                      inputClass={inputClass}
                      value={c.issuer}
                      onChange={(v) =>
                        setStructured((s) => {
                          const certifications = [...s.certifications];
                          certifications[ci] = { ...c, issuer: v };
                          return { ...s, certifications };
                        })
                      }
                    />
                    <Field
                      label="Date"
                      className={labelClass}
                      inputClass={inputClass}
                      value={c.date}
                      onChange={(v) =>
                        setStructured((s) => {
                          const certifications = [...s.certifications];
                          certifications[ci] = { ...c, date: v };
                          return { ...s, certifications };
                        })
                      }
                    />
                  </div>
                  <label className={`${labelClass} mt-2 block`}>
                    Description
                  </label>
                  <textarea
                    className={`${inputClass} mt-1 min-h-[72px]`}
                    value={c.description}
                    onChange={(e) =>
                      setStructured((s) => {
                        const certifications = [...s.certifications];
                        certifications[ci] = {
                          ...c,
                          description: e.target.value,
                        };
                        return { ...s, certifications };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </>
        );
      case "other":
        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="orio-font-display text-lg font-bold text-slate-100">
                <span className="mr-2">🎉</span> Other experience
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStructured((s) => ({
                    ...s,
                    otherSections: [
                      ...s.otherSections,
                      { title: "", description: "" },
                    ],
                  }))
                }
                className={primaryBtnSm}
              >
                Add other
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {structured.otherSections.map((o, oi) => (
                <div key={oi} className={NESTED_CARD_CLASS}>
                  <div className="flex justify-end">
                    <DeleteIconButton
                      onClick={() =>
                        setStructured((s) => ({
                          ...s,
                          otherSections: s.otherSections.filter(
                            (_, i) => i !== oi,
                          ),
                        }))
                      }
                      label="Delete section"
                    />
                  </div>
                  <label className={labelClass}>Title</label>
                  <input
                    className={`${inputClass} mt-1`}
                    value={o.title}
                    onChange={(e) =>
                      setStructured((s) => {
                        const otherSections = [...s.otherSections];
                        otherSections[oi] = { ...o, title: e.target.value };
                        return { ...s, otherSections };
                      })
                    }
                  />
                  <label className={`${labelClass} mt-2 block`}>
                    Description
                  </label>
                  <textarea
                    className={`${inputClass} mt-1 min-h-[88px]`}
                    value={o.description}
                    onChange={(e) =>
                      setStructured((s) => {
                        const otherSections = [...s.otherSections];
                        otherSections[oi] = {
                          ...o,
                          description: e.target.value,
                        };
                        return { ...s, otherSections };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return loading ? (
    loadingView
  ) : (
    <div
      className={`mx-auto flex max-w-[1400px] flex-col gap-6 p-4 text-slate-200 md:p-6 ${hasInsightsSidebar ? "lg:flex-row" : ""}`}
    >
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              void persistTitle();
              onBack();
            }}
            className="text-sm font-semibold text-teal-400/90 transition hover:text-teal-300"
          >
            ← Back to resumes
          </button>
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-violet-200 shadow-sm transition hover:border-violet-400/35 hover:bg-white/[0.1] hover:text-white"
              title="Preview"
              aria-label="Preview resume"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
            {saveState === "saving" && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 font-medium text-amber-100">
                Saving…
              </span>
            )}
            {saveState === "saved" && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 font-medium text-emerald-100">
                Auto-saved
              </span>
            )}
            {saveState === "error" && (
              <span className="rounded-full border border-red-500/35 bg-red-500/15 px-3 py-1 font-medium text-red-200">
                Save failed
              </span>
            )}
            {structured.parseMeta?.overallConfidence != null &&
              structured.parseMeta.overallConfidence > 0 && (
                <span className="rounded-full border border-violet-500/35 bg-violet-500/15 px-3 py-1 font-medium text-violet-100">
                  Parse confidence ~
                  {Math.round(
                    (structured.parseMeta.overallConfidence ?? 0) * 100,
                  )}
                  %
                </span>
              )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 md:text-left">
          The contents of the resume will be used to generate interview answers.
        </p>

        <div
          className={`${SECTION_SHELL_CLASS} !p-4 ring-1 ring-violet-500/10 md:!p-5`}
        >
          <label className={labelClass}>Title</label>
          <input
            className={`${inputClass} mt-1`}
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            onBlur={persistTitle}
          />
          <p className="mt-1 text-xs text-slate-500">
            Usually your file name — editable.
          </p>
        </div>

        {structured.parseMeta?.warnings &&
          structured.parseMeta.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-50">
              <p className="font-semibold">Parser notes</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {structured.parseMeta.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="space-y-5">
              {order.map((sid) => (
                <SortableSectionShell key={sid} id={sid}>
                  {renderSection(sid)}
                </SortableSectionShell>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {hasInsightsSidebar && insights && (
        <aside className="shrink-0 space-y-4 lg:w-80">
          <div className="sticky top-4">
            <div
              className={`${SECTION_SHELL_CLASS} !p-4 ring-1 ring-fuchsia-500/10`}
            >
              <h4 className="text-sm font-bold text-slate-100">
                Smart suggestions
              </h4>
              {insights.missingFields.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-red-300">Missing</p>
                  <ul className="mt-1 list-disc pl-4 text-xs text-slate-400">
                    {insights.missingFields.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {insights.improvementTips.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-teal-300/90">Tips</p>
                  <ul className="mt-1 list-disc pl-4 text-xs text-slate-400">
                    {insights.improvementTips.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {previewModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0 z-0 bg-black/60 backdrop-blur-md"
                aria-label="Close preview"
                onClick={() => setPreviewModalOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-preview-title"
                className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-[#0c0c12]/98 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl ring-1 ring-teal-500/15"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative flex shrink-0 items-center justify-between gap-3">
                  <h2
                    id="resume-preview-title"
                    className="orio-font-display text-base font-bold text-slate-100"
                  >
                    Live preview
                  </h2>
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/[0.06] p-2 text-slate-400 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
                    aria-label="Close"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="relative mt-1 shrink-0 text-xs text-slate-500">
                  Classic layout preview — your edited fields only. Use{" "}
                  <strong className="text-slate-300">
                    **double asterisks**
                  </strong>{" "}
                  around words to bold them in paragraphs.
                </p>
                <div className="relative mt-4 min-h-[min(55vh,520px)] max-h-[calc(90vh-8rem)] flex-1 overflow-y-auto rounded-xl border border-white/10 bg-zinc-200/95 p-3 shadow-inner shadow-black/20 sm:p-4">
                  <Preview structured={structured} title={docTitle} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
  inputClass,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
  inputClass: string;
}) {
  return (
    <div>
      <label className={className}>{label}</label>
      <input
        className={`${inputClass} mt-1`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SkillGroupEditor({
  group,
  onChange,
  onRemove,
  inputClass,
  labelClass,
}: {
  group: SkillGroupDto;
  onChange: (g: SkillGroupDto) => void;
  onRemove: () => void;
  inputClass: string;
  labelClass: string;
}) {
  const itemsStr = group.items.join(", ");
  return (
    <div className={`${NESTED_CARD_CLASS} relative`}>
      <div className="absolute right-3 top-3">
        <DeleteIconButton onClick={onRemove} label="Remove group" />
      </div>
      <div className="w-full sm:w-[320px] pr-12">
          <label className={labelClass}>Skill type</label>
          <input
            list="skill-category-suggestions"
            className={`${inputClass} mt-1`}
            value={group.category}
            onChange={(e) => onChange({ ...group, category: e.target.value })}
            placeholder="e.g. Frontend, Backend, DevOps, Mobile…"
          />
          <datalist id="skill-category-suggestions">
            {Object.values(SKILL_CATEGORY_LABELS).map((lab) => (
              <option key={lab} value={lab} />
            ))}
          </datalist>
      </div>
      <label className={`${labelClass} mt-2 block`}>
        Skills (comma-separated)
      </label>
      <textarea
        className={`${inputClass} mt-1 min-h-[72px]`}
        value={itemsStr}
        onChange={(e) =>
          onChange({
            ...group,
            items: e.target.value
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          })
        }
      />
    </div>
  );
}

function ExperienceCard({
  job,
  ji,
  onChange,
  onRemove,
  aiPaths,
  clearAi,
  markAiEnhanced,
  improve,
  improveBusy,
  inputClass,
  labelClass,
}: {
  job: ExperienceEntryDto;
  ji: number;
  onChange: (j: ExperienceEntryDto) => void;
  onRemove: () => void;
  aiPaths: Set<string>;
  clearAi: (p: string) => void;
  markAiEnhanced: (p: string) => void;
  improve: (k: string, t: string, text: string) => Promise<string | undefined>;
  improveBusy: string | null;
  inputClass: string;
  labelClass: string;
}) {
  const path = `experience.${ji}`;
  return (
    <div className={NESTED_CARD_CLASS}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-200">
          Job {ji + 1}
          <AiGlowBadge show={aiPaths.has(`${path}.description`)} />
        </span>
        <DeleteIconButton onClick={onRemove} label="Delete job" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company</label>
          <input
            className={`${inputClass} mt-1`}
            value={job.company}
            onChange={(e) => {
              onChange({ ...job, company: e.target.value });
            }}
          />
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <input
            className={`${inputClass} mt-1`}
            value={job.role}
            onChange={(e) => {
              onChange({ ...job, role: e.target.value });
            }}
          />
        </div>
        <div>
          <label className={labelClass}>Time period</label>
          <input
            className={`${inputClass} mt-1`}
            value={job.duration}
            onChange={(e) => {
              onChange({ ...job, duration: e.target.value });
            }}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={`${inputClass} mt-1`}
            value={job.location}
            onChange={(e) => {
              onChange({ ...job, location: e.target.value });
            }}
          />
        </div>
      </div>
      <label className={`${labelClass} mt-2 block`}>Description</label>
      <div className="relative mt-1">
        <WriteWithAiCornerButton
          disabled={improveBusy === path}
          onClick={() => {
            void (async () => {
              const out = await improve(path, "experience", job.description);
              if (out) {
                markAiEnhanced(`${path}.description`);
                onChange({ ...job, description: out });
              }
            })();
          }}
        />
        <textarea
          className={`${inputClass} min-h-[120px] pr-14 pt-3`}
          value={job.description}
          onChange={(e) => {
            clearAi(`${path}.description`);
            onChange({ ...job, description: e.target.value });
          }}
        />
      </div>
    </div>
  );
}

function EducationCard({
  ed,
  ei,
  onChange,
  onRemove,
  inputClass,
  labelClass,
}: {
  ed: EducationEntryDto;
  ei: number;
  onChange: (x: EducationEntryDto) => void;
  onRemove: () => void;
  inputClass: string;
  labelClass: string;
}) {
  return (
    <div className={NESTED_CARD_CLASS}>
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-bold text-slate-200">
          Education {ei + 1}
        </span>
        <DeleteIconButton onClick={onRemove} label="Delete education" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>School</label>
          <input
            className={`${inputClass} mt-1`}
            value={ed.school}
            onChange={(e) => onChange({ ...ed, school: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Degree</label>
          <input
            className={`${inputClass} mt-1`}
            value={ed.degree}
            onChange={(e) => onChange({ ...ed, degree: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Time period</label>
          <input
            className={`${inputClass} mt-1`}
            value={ed.timePeriod}
            onChange={(e) => onChange({ ...ed, timePeriod: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={`${inputClass} mt-1`}
            value={ed.location}
            onChange={(e) => onChange({ ...ed, location: e.target.value })}
          />
        </div>
      </div>
      <label className={`${labelClass} mt-2 block`}>Description</label>
      <textarea
        className={`${inputClass} mt-1 min-h-[72px]`}
        value={ed.description}
        onChange={(e) => onChange({ ...ed, description: e.target.value })}
      />
    </div>
  );
}

function ProjectCard({
  p,
  pi,
  onChange,
  onRemove,
  aiPaths,
  clearAi,
  markAiEnhanced,
  improve,
  improveBusy,
  inputClass,
  labelClass,
}: {
  p: ProjectEntryDto;
  pi: number;
  onChange: (x: ProjectEntryDto) => void;
  onRemove: () => void;
  aiPaths: Set<string>;
  clearAi: (path: string) => void;
  markAiEnhanced: (path: string) => void;
  improve: (k: string, t: string, text: string) => Promise<string | undefined>;
  improveBusy: string | null;
  inputClass: string;
  labelClass: string;
}) {
  const key = `project-${pi}`;
  const aiPath = `projects.${pi}.description`;
  return (
    <div className={NESTED_CARD_CLASS}>
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-bold text-slate-200">
          Project {pi + 1}
          <AiGlowBadge show={aiPaths.has(aiPath)} />
        </span>
        <DeleteIconButton onClick={onRemove} label="Delete project" />
      </div>
      <label className={labelClass}>Title</label>
      <input
        className={`${inputClass} mt-1`}
        value={p.title}
        onChange={(e) => onChange({ ...p, title: e.target.value })}
      />
      <label className={`${labelClass} mt-2 block`}>Description</label>
      <div className="relative mt-1">
        <WriteWithAiCornerButton
          disabled={improveBusy === key}
          onClick={() => {
            void (async () => {
              const out = await improve(key, "project", p.description);
              if (out) {
                markAiEnhanced(aiPath);
                onChange({ ...p, description: out });
              }
            })();
          }}
        />
        <textarea
          className={`${inputClass} min-h-[88px] pr-14 pt-3`}
          value={p.description}
          onChange={(e) => {
            clearAi(aiPath);
            onChange({ ...p, description: e.target.value });
          }}
        />
      </div>
      <label className={`${labelClass} mt-2 block`}>Technologies</label>
      <input
        className={`${inputClass} mt-1`}
        value={p.technologies}
        onChange={(e) => onChange({ ...p, technologies: e.target.value })}
      />
    </div>
  );
}

/** Inline **bold** segments (preview only). */
function renderBoldSegments(text: string): ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function ClassicParagraph({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split(/\n/);
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {renderBoldSegments(line)}
        </p>
      ))}
    </div>
  );
}

function ClassicSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 border-b-2 border-black pb-1 text-[12px] font-bold uppercase tracking-wide text-black first:mt-0">
      {children}
    </h3>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function profileHeadline(
  structured: ResumeStructuredDocument,
  docTitle: string,
) {
  const role = structured.experience[0]?.role?.trim();
  if (role) return role;
  const t = docTitle.trim();
  if (t && t.toLowerCase() !== "my resume") return t;
  return "";
}

function Preview({
  structured,
  title,
}: {
  structured: ResumeStructuredDocument;
  title: string;
}) {
  const p = structured.personal;
  const headline = profileHeadline(structured, title);

  const orderKeys = (
    structured.sectionOrder?.length
      ? structured.sectionOrder
      : [...DEFAULT_SECTION_ORDER]
  ).filter((k) => k !== "personal" && k !== "title");

  const hasSkills = structured.skills.some((g) => g.items.length > 0);

  const sectionBlocks: Record<string, ReactNode | null> = {
    summary: structured.summary.trim() ? (
      <div key="summary">
        <ClassicSectionTitle>Profile</ClassicSectionTitle>
        <ClassicParagraph
          text={structured.summary.trim()}
          className="text-[11px] leading-snug text-black sm:text-xs"
        />
      </div>
    ) : null,
    skills: hasSkills ? (
      <div key="skills">
        <ClassicSectionTitle>Skills</ClassicSectionTitle>
        <div className="space-y-1 text-[11px] leading-snug text-black sm:text-xs">
          {structured.skills.map((g, i) => {
            if (!g.items.length) return null;
            const rawCat =
              SKILL_CATEGORY_LABELS[g.category] ??
              (g.category || "").replace(/([A-Z])/g, " $1").trim();
            const cat = rawCat || "Skills";
            return (
              <p key={i}>
                <strong>{cat}:</strong> {g.items.join(" | ")}
              </p>
            );
          })}
        </div>
      </div>
    ) : null,
    education:
      structured.education.length > 0 ? (
        <div key="education">
          <ClassicSectionTitle>Education</ClassicSectionTitle>
          <ul className="list-none space-y-2 text-[11px] leading-snug text-black sm:text-xs">
            {structured.education.map((ed, i) => {
              const primary = [ed.degree, ed.school]
                .map((x) => (x || "").trim())
                .filter(Boolean);
              const secondary = [ed.location, ed.timePeriod]
                .map((x) => (x || "").trim())
                .filter(Boolean);
              return (
                <li key={i}>
                  <p>
                    {primary.length > 0 ? (
                      <strong>{primary.join(" | ")}</strong>
                    ) : null}
                    {secondary.length > 0 ? (
                      <>
                        {primary.length > 0 ? " | " : null}
                        {secondary.join(" | ")}
                      </>
                    ) : null}
                  </p>
                  {ed.description.trim() ? (
                    <ClassicParagraph
                      text={ed.description.trim()}
                      className="mt-1"
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null,
    experience:
      structured.experience.length > 0 ? (
        <div key="experience">
          <ClassicSectionTitle>Professional Experience</ClassicSectionTitle>
          <div className="space-y-3 text-[11px] leading-snug text-black sm:text-xs">
            {structured.experience.map((j, ji) => {
              const headerParts = [j.role, j.company, j.duration, j.location]
                .map((x) => (x || "").trim())
                .filter(Boolean);
              const headerLine = headerParts.join(" | ");
              const dashItems: string[] = [];
              for (const b of j.bullets) {
                const s = (b || "").trim();
                if (s) dashItems.push(s);
              }
              const desc = (j.description || "").trim();
              if (!dashItems.length && desc) {
                for (const line of desc.split(/\n/)) {
                  const t = line.trim();
                  if (t) dashItems.push(t);
                }
              }
              return (
                <div key={ji}>
                  <p className="flex gap-1.5 font-bold">
                    <span
                      className="shrink-0 select-none font-normal"
                      aria-hidden
                    >
                      •
                    </span>
                    <span>{renderBoldSegments(headerLine)}</span>
                  </p>
                  {dashItems.length > 0 ? (
                    <ul className="ml-5 mt-1 list-none space-y-0.5 border-l border-transparent">
                      {dashItems.map((item, bi) => (
                        <li key={bi} className="flex gap-1.5 pl-1">
                          <span className="shrink-0 text-black">-</span>
                          <span>{renderBoldSegments(item)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {j.bullets.length > 0 && desc ? (
                    <ClassicParagraph
                      text={desc}
                      className="ml-5 mt-1 text-[10px] sm:text-[11px]"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null,
    projects:
      structured.projects.length > 0 ? (
        <div key="projects">
          <ClassicSectionTitle>Projects</ClassicSectionTitle>
          <ul className="list-none space-y-2.5 text-[11px] leading-snug text-black sm:text-xs">
            {structured.projects.map((proj, pi) => {
              const t = (proj.title || "").trim();
              const tech = (proj.technologies || "").trim();
              const desc = (proj.description || "").trim();
              return (
                <li key={pi} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 select-none" aria-hidden>
                    •
                  </span>
                  <div className="min-w-0 flex-1">
                    {t ? (
                      <p className="font-bold text-black">
                        {renderBoldSegments(t)}
                      </p>
                    ) : null}
                    {desc ? (
                      <ClassicParagraph text={desc} className="mt-0.5" />
                    ) : null}
                    {tech ? (
                      <p className="mt-1 text-[10px] sm:text-[11px]">
                        <strong>Technologies:</strong> {tech}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null,
    certifications:
      structured.certifications.length > 0 ? (
        <div key="certifications">
          <ClassicSectionTitle>Certifications</ClassicSectionTitle>
          <ul className="list-none space-y-2 text-[11px] text-black sm:text-xs">
            {structured.certifications.map((c, ci) => (
              <li key={ci} className="flex gap-2">
                <span className="shrink-0">•</span>
                <div>
                  <p className="font-bold">
                    {renderBoldSegments(
                      [c.title, c.issuer, c.date]
                        .map((x) => (x || "").trim())
                        .filter(Boolean)
                        .join(" | "),
                    )}
                  </p>
                  {c.description.trim() ? (
                    <ClassicParagraph
                      text={c.description.trim()}
                      className="mt-0.5"
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null,
    other:
      structured.otherSections.length > 0 ? (
        <div key="other">
          {structured.otherSections.map((o, oi) => (
            <div key={oi}>
              <ClassicSectionTitle>
                {(o.title || "Additional").trim().toUpperCase()}
              </ClassicSectionTitle>
              {o.description.trim() ? (
                <ClassicParagraph text={o.description.trim()} />
              ) : null}
            </div>
          ))}
        </div>
      ) : null,
  };

  const ordered = orderKeys
    .map((k) => sectionBlocks[k])
    .filter(Boolean) as ReactNode[];

  return (
    <article
      className="mx-auto w-full max-w-[820px] bg-white px-8 py-8 text-black shadow-sm"
      style={{
        fontFamily: '"Times New Roman", Georgia, "DejaVu Serif", serif',
      }}
    >
      <header className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-1 text-[11px] leading-snug">
        <div className="min-w-0 self-start">
          {headline ? (
            <p className="flex items-start gap-1 font-bold leading-tight">
              <IconUser className="mt-0.5 shrink-0 text-black" />
              <span>{headline}</span>
            </p>
          ) : null}
        </div>
        <div className="min-w-0 px-1 text-center">
          <h1 className="text-[18px] font-bold uppercase leading-tight tracking-tight text-black">
            {(p.fullName || "Your name").trim()}
          </h1>
        </div>
        <div className="min-w-0 justify-self-end text-right">
          <ul className="space-y-0.5">
            {p.location.trim() ? (
              <li className="flex items-start justify-end gap-1">
                <IconMapPin className="mt-0.5 shrink-0 text-black" />
                <span className="text-left">{p.location.trim()}</span>
              </li>
            ) : null}
            {p.email.trim() ? (
              <li className="flex items-start justify-end gap-1">
                <IconMail className="mt-0.5 shrink-0 text-black" />
                <a
                  href={`mailto:${p.email.trim()}`}
                  className="break-all text-black underline underline-offset-2"
                >
                  {p.email.trim()}
                </a>
              </li>
            ) : null}
            {p.phone.trim() ? (
              <li className="flex items-start justify-end gap-1">
                <IconPhone className="mt-0.5 shrink-0 text-black" />
                <span>{p.phone.trim()}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </header>

      <div className="mt-3 h-0.5 w-full bg-black" />

      {ordered.length === 0 ? (
        <p className="mt-8 text-center text-[11px] text-gray-500 italic">
          Add sections in the editor to see them here.
        </p>
      ) : (
        <div className="mt-4 space-y-4 text-[11px] leading-[1.35] text-black">
          {ordered}
        </div>
      )}
    </article>
  );
}
