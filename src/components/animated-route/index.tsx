import { useEffect, useRef, useState } from "react";
import { RFeature } from "rlayers";
import { Style, Stroke } from "ol/style";
import { LineString } from "ol/geom";

interface AnimatedRouteProps {
  route: LineString;
}

export default function AnimatedRoute({ route }: AnimatedRouteProps) {
  const [dashOffset, setDashOffset] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let offset = 0;
    function animate() {
      offset = (offset - 1 + 20) % 20;
      setDashOffset(offset);
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const animatedStyle = new Style({
    stroke: new Stroke({
      color: "#007bff",
      width: 4,
      lineDash: [12, 8],
      lineDashOffset: dashOffset,
    }),
  });

  return <RFeature geometry={route} style={animatedStyle} />;
}
