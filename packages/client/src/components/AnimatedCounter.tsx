import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export type AnimatedCounterProps = {
  value: number;
};

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform([count], ([value]: number[]) =>
    Math.round(value)
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 5 });
    return () => controls.stop();
  }, [value]);

  return <motion.pre>{rounded}</motion.pre>;
}
