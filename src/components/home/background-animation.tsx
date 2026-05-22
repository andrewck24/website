import "@/components/home/background-animation.css";
import { cn } from "@/lib/utils";

export function BackgroundAnimation({ className }: { className?: string }) {
  return (
    <div
      data-testid="background-animation"
      className={cn(
        "fixed top-0 left-0 h-screen w-screen overflow-hidden",
        className
      )}
    >
      <div className="gradients-container h-full w-full blur-2xl">
        <div
          className={cn(
            `[background:radial-gradient(circle_at_center,_oklch(var(--gradient-1)_/_0.8)_0,_oklch(var(--gradient-1)_/_0)_50%)_no-repeat]`,
            `absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--blending-value)]`,
            `origin-[center_center]`,
            `animate-first opacity-100`
          )}
        />
        <div
          className={cn(
            `[background:radial-gradient(circle_at_center,_oklch(var(--gradient-2)_/_0.8)_0,_oklch(var(--gradient-2)_/_0)_50%)_no-repeat]`,
            `absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second opacity-100`
          )}
        />
        <div
          className={cn(
            `[background:radial-gradient(circle_at_center,_oklch(var(--gradient-3)_/_0.8)_0,_oklch(var(--gradient-3)_/_0)_50%)_no-repeat]`,
            `absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third opacity-100`
          )}
        />
        <div
          className={cn(
            `[background:radial-gradient(circle_at_center,_oklch(var(--gradient-4)_/_0.8)_0,_oklch(var(--gradient-4)_/_0)_50%)_no-repeat]`,
            `absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth opacity-70`
          )}
        />
        <div
          className={cn(
            `[background:radial-gradient(circle_at_center,_oklch(var(--gradient-5)_/_0.8)_0,_oklch(var(--gradient-5)_/_0)_50%)_no-repeat]`,
            `absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth opacity-100`
          )}
        />
      </div>
    </div>
  );
}
