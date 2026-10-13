export const cheminArrondi = (
    x1: number, y1: number, x2: number, y2: number,
    rayon = 16,
    ratio = 0.66          // position du segment central entre départ et arrivée
  ) => {
      const mx = x1 + (x2 - x1) * ratio;          // x du segment vertical
      const dy = y2 - y1;
      if (Math.abs(dy) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;

      const sens = dy > 0 ? 1 : -1;
      const r = Math.min(rayon, Math.abs(dy) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));

      return [
        `M ${x1} ${y1}`,
        `L ${mx - r} ${y1}`,
        `Q ${mx} ${y1} ${mx} ${y1 + sens * r}`,
        `L ${mx} ${y2 - sens * r}`,
        `Q ${mx} ${y2} ${mx + r} ${y2}`,
        `L ${x2} ${y2}`,
      ].join(" ");

 
  };