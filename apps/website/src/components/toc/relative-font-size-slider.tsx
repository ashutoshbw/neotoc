import { useContext } from "react";
import { TocContext } from "./toc-context";

export function RelativeFontSizeSlider() {
  const tc = useContext(TocContext);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    tc?.setRelativeFontSize(+e.target.value);
  };

  return (
    <div className="p-5 border bg-zinc-100 dark:bg-zinc-900">
      <label htmlFor="relative-font-size">
        <code>--relative-font-size</code>:{" "}
      </label>
      <input
        className="w-[50px]"
        type="range"
        id="relative-font-size"
        min="90"
        max="100"
        step="0.1"
        value={tc?.relativeFontSize}
        onChange={handleChange}
      />
      <span>{tc?.relativeFontSize}</span>
      <br />
    </div>
  );
}
