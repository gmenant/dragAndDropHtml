import { cheminArrondi } from "../utils/arrows";
import type { Arrow } from "../hooks/useFleches";

type FlowArrowsProps = {
  arrows: Arrow[];
};

export const FlowArrows = ({ arrows }: FlowArrowsProps) => (
  <svg
    style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", overflow: "visible",
      zIndex: 1,
    }}
  >
    <defs>
      <marker
        id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse"
      >
        <path
          d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#29438d"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </marker>
    </defs>
    {arrows.map((a) => (
      <path
        key={a.id}
        d={cheminArrondi(a.x1, a.y1, a.x2, a.y2)}
        fill="none"
        stroke="#29438d"
        strokeWidth="2"
        strokeLinejoin="round"
        markerEnd="url(#arrow)"
      />
    ))}
  </svg>
);