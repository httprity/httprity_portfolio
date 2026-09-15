import './SectionLabel.css';

type Props = {
  index: string; // "01"
  label: string; // "EXPERTISE"
};

/**
 * [01]
 * EXPERTISE
 * ////////////
 */
export function SectionLabel({ index, label }: Props) {
  return (
    <div className="section-label mono">
      <span className="section-label__index" aria-hidden="true">
        [{index}]
      </span>
      <span className="section-label__text">
        <span className="sr-only">Section {index}: </span>
        {label}
      </span>
      <span className="section-label__rule" aria-hidden="true">
        ////////////////
      </span>
    </div>
  );
}
