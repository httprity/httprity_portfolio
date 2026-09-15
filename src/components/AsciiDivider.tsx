import './AsciiDivider.css';

/** +------------------------------+  full-width hairline with crosshair ends. */
export function AsciiDivider({ label }: { label?: string }) {
  return (
    <div className="ascii-divider" aria-hidden="true">
      <span className="ascii-divider__mark">+</span>
      <span className="ascii-divider__line" />
      {label && <span className="ascii-divider__label mono mono--faint">{label}</span>}
      <span className="ascii-divider__mark">+</span>
    </div>
  );
}
