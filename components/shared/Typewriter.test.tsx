import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

let reducedMotion = false;
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => reducedMotion,
}));

import { Typewriter } from "./Typewriter";

const TEXT = "Two souls. One perfect fit.";
const typed = (c: HTMLElement) => c.querySelector("p > span")?.textContent ?? "";

afterEach(() => {
  cleanup();
  reducedMotion = false;
  vi.useRealTimers();
});

describe("Typewriter", () => {
  it("waits for start, then types the full text", () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<Typewriter text={TEXT} start={false} />);

    act(() => vi.runAllTimers());
    expect(typed(container)).toBe("");

    rerender(<Typewriter text={TEXT} start />);
    act(() => vi.advanceTimersByTime(1000 + 55 * 3));
    expect(typed(container)).toBe("Two");

    act(() => vi.runAllTimers());
    expect(typed(container)).toBe(TEXT);
  });

  it("exposes the full text to screen readers", () => {
    const { container } = render(<Typewriter text={"line one\nline two"} start={false} />);
    expect(container.querySelector("p")?.getAttribute("aria-label")).toBe("line one line two");
  });

  it("shows everything at once under reduced motion", () => {
    reducedMotion = true;
    const { container } = render(<Typewriter text={TEXT} start={false} />);
    expect(typed(container)).toBe(TEXT);
  });
});
