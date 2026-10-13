import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type Arrow = { id: string; x1: number; y1: number; x2: number; y2: number };

type StepLike = { id: string; };

export const useFleches = (
  steps: StepLike[],
  processStarted: boolean
) => {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const demandeRef = useRef<HTMLDivElement>(null);
  const cleApiRef = useRef<HTMLDivElement>(null);

  const calculerFleches = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const c = container.getBoundingClientRect();

    const sortie = (r: DOMRect) => ({ x: r.right - c.left, y: r.top + r.height / 2 - c.top });

    const entree = (r: DOMRect) => ({ x: r.left - c.left, y: r.top + r.height / 2 - c.top });

    const creer = (id: string, from: DOMRect, to: DOMRect): Arrow => {
      const p1 = sortie(from);
      const p2 = entree(to);
      return { id, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    };

    const noeuds: { id: string; el: HTMLElement | null }[] = [
  { id: "demande", el: demandeRef.current },
  ...steps.map((s) => ({ id: s.id, el: stepRefs.current[s.id] ?? null })),
  { id: "cleapi", el: cleApiRef.current },
];

    const next: Arrow[] = [];
        for (let i = 0; i < noeuds.length - 1; i++) {
        const a = noeuds[i];
        const b = noeuds[i + 1];
        if (!a.el || !b.el) continue;
        next.push(
            creer(`${a.id}-${b.id}`, a.el.getBoundingClientRect(), b.el.getBoundingClientRect())
        );
        }

    

    setArrows(next);
  }, [steps, processStarted]);

  useLayoutEffect(() => {
    calculerFleches();
    window.addEventListener("resize", calculerFleches);

    const ro = new ResizeObserver(calculerFleches);
    const container = containerRef.current;
    if (container) {
      ro.observe(container);
    }
    Object.values(stepRefs.current).forEach((el) => el && ro.observe(el));
    if (demandeRef.current) ro.observe(demandeRef.current);
    if (cleApiRef.current) ro.observe(cleApiRef.current);

    return () => {
      window.removeEventListener("resize", calculerFleches);
      ro.disconnect();
    };
  }, [calculerFleches]);

  return { arrows, containerRef, stepRefs, demandeRef, cleApiRef };
};