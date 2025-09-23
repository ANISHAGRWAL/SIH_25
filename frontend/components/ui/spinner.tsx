import {
  LoaderCircleIcon,
  LoaderIcon,
  LoaderPinwheelIcon,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerVariantProps = Omit<SpinnerProps, "variant">;

const Default = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderIcon className={cn("animate-spin", className)} {...props} />
);

const Circle = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
);

const Pinwheel = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderPinwheelIcon className={cn("animate-spin", className)} {...props} />
);

const CircleFilled = ({
  className,
  size = 24,
  ...props
}: SpinnerVariantProps) => (
  <div className="relative" style={{ width: size, height: size }}>
    <div className="absolute inset-0 rotate-180">
      <LoaderCircleIcon
        className={cn("animate-spin", className, "text-foreground opacity-20")}
        size={size}
        {...props}
      />
    </div>
    <LoaderCircleIcon
      className={cn("relative animate-spin", className)}
      size={size}
      {...props}
    />
  </div>
);

// Enhanced Glass Ring - matching signup page style
const GlassRing = ({ size = 64, className, ...rest }: SpinnerVariantProps) => {
  const sizeNum = typeof size === 'number' ? size : 64;
  return (
    <div 
      className={cn(
        "relative rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg flex items-center justify-center",
        className
      )}
      style={{ width: sizeNum, height: sizeNum }}
    >
      <div 
        className="border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent transition-all duration-300"
        style={{ width: sizeNum * 0.7, height: sizeNum * 0.7 }}
      />
    </div>
  );
};

// Premium Loading - with gradient and glow
const Premium = ({ size = 48, className, ...rest }: SpinnerVariantProps) => {
  const sizeNum = typeof size === 'number' ? size : 48;
  return (
    <div className={cn("relative", className)}>
      <div 
        className="border-4 border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-spin"
        style={{ 
          width: sizeNum, 
          height: sizeNum,
          backgroundClip: 'padding-box',
          border: '4px solid transparent',
        }}
      >
        <div 
          className="bg-white rounded-full"
          style={{ 
            width: sizeNum - 8, 
            height: sizeNum - 8,
            margin: '4px'
          }}
        />
      </div>
      <div 
        className="absolute inset-0 border-4 border-transparent rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 animate-pulse"
        style={{ 
          background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />
    </div>
  );
};

// Glassmorphism Pulse - modern glass effect
const GlassPulse = ({ size = 56, className, ...rest }: SpinnerVariantProps) => {
  const sizeNum = typeof size === 'number' ? size : 56;
  return (
    <div className={cn("relative", className)}>
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-xl flex items-center justify-center animate-pulse"
        style={{ width: sizeNum, height: sizeNum }}
      >
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full animate-spin"
          style={{ width: sizeNum * 0.3, height: sizeNum * 0.3 }}
        />
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full opacity-50 animate-ping"
        style={{ 
          animationDuration: '2s',
          animationDelay: '0.5s'
        }}
      />
    </div>
  );
};

// Modern Gradient Ring
const ModernRing = ({ size = 48, className, ...rest }: SpinnerVariantProps) => {
  const sizeNum = typeof size === 'number' ? size : 48;
  return (
    <div className={cn("relative", className)}>
      <svg
        width={sizeNum}
        height={sizeNum}
        viewBox="0 0 50 50"
        className="animate-spin"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#spinner-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
        />
      </svg>
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </div>
  );
};

const Ellipsis = ({ size = 24, className, ...rest }: SpinnerVariantProps) => {
  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Loading...</title>
      <circle cx="4" cy="12" fill="currentColor" r="2">
        <animate
          attributeName="cy"
          begin="0;ellipsis3.end+0.25s"
          calcMode="spline"
          dur="0.6s"
          id="ellipsis1"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="12" cy="12" fill="currentColor" r="2">
        <animate
          attributeName="cy"
          begin="ellipsis1.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="20" cy="12" fill="currentColor" r="2">
        <animate
          attributeName="cy"
          begin="ellipsis1.begin+0.2s"
          calcMode="spline"
          dur="0.6s"
          id="ellipsis3"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
    </svg>
  );
};

const Ring = ({ size = 24, className, ...rest }: SpinnerVariantProps) => (
  <svg
    height={size}
    stroke="currentColor"
    viewBox="0 0 44 44"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Loading...</title>
    <g fill="none" fillRule="evenodd" strokeWidth="2">
      <circle cx="22" cy="22" r="1">
        <animate
          attributeName="r"
          begin="0s"
          calcMode="spline"
          dur="1.8s"
          keySplines="0.165, 0.84, 0.44, 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          values="1; 20"
        />
        <animate
          attributeName="stroke-opacity"
          begin="0s"
          calcMode="spline"
          dur="1.8s"
          keySplines="0.3, 0.61, 0.355, 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          values="1; 0"
        />
      </circle>
      <circle cx="22" cy="22" r="1">
        <animate
          attributeName="r"
          begin="-0.9s"
          calcMode="spline"
          dur="1.8s"
          keySplines="0.165, 0.84, 0.44, 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          values="1; 20"
        />
        <animate
          attributeName="stroke-opacity"
          begin="-0.9s"
          calcMode="spline"
          dur="1.8s"
          keySplines="0.3, 0.61, 0.355, 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          values="1; 0"
        />
      </circle>
    </g>
  </svg>
);

const Bars = ({ size = 24, className, ...rest }: SpinnerVariantProps) => (
  <svg
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Loading...</title>
    <style>{`
        .spinner-bar {
          animation: spinner-bars-animation .8s linear infinite;
          animation-delay: -.8s;
        }
        .spinner-bars-2 {
          animation-delay: -.65s;
        }
        .spinner-bars-3 {
          animation-delay: -0.5s;
        }
        @keyframes spinner-bars-animation {
          0% {
            y: 1px;
            height: 22px;
          }
          93.75% {
            y: 5px;
            height: 14px;
            opacity: 0.2;
          }
        }
      `}</style>
    <rect
      className="spinner-bar"
      fill="currentColor"
      height="22"
      width="6"
      x="1"
      y="1"
    />
    <rect
      className="spinner-bar spinner-bars-2"
      fill="currentColor"
      height="22"
      width="6"
      x="9"
      y="1"
    />
    <rect
      className="spinner-bar spinner-bars-3"
      fill="currentColor"
      height="22"
      width="6"
      x="17"
      y="1"
    />
  </svg>
);

const Infinite = ({ size = 24, className, ...rest }: SpinnerVariantProps) => (
  <svg
    height={size}
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 100 100"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Loading...</title>
    <path
      d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
      fill="none"
      stroke="currentColor"
      strokeDasharray="205.271142578125 51.317785644531256"
      strokeLinecap="round"
      strokeWidth="10"
      style={{
        transform: "scale(0.8)",
        transformOrigin: "50px 50px",
      }}
    >
      <animate
        attributeName="stroke-dashoffset"
        dur="2s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="0;256.58892822265625"
      />
    </path>
  </svg>
);

export type SpinnerProps = LucideProps & {
  variant?:
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "glass-ring"
    | "premium"
    | "glass-pulse"
    | "modern-ring"
    | "ellipsis"
    | "ring"
    | "bars"
    | "infinite";
};

export const Spinner = ({ variant = "glass-ring", ...props }: SpinnerProps) => {
  switch (variant) {
    case "circle":
      return <Circle {...props} />;
    case "pinwheel":
      return <Pinwheel {...props} />;
    case "circle-filled":
      return <CircleFilled {...props} />;
    case "glass-ring":
      return <GlassRing {...props} />;
    case "premium":
      return <Premium {...props} />;
    case "glass-pulse":
      return <GlassPulse {...props} />;
    case "modern-ring":
      return <ModernRing {...props} />;
    case "ellipsis":
      return <Ellipsis {...props} />;
    case "ring":
      return <Ring {...props} />;
    case "bars":
      return <Bars {...props} />;
    case "infinite":
      return <Infinite {...props} />;
    default:
      return <Default {...props} />;
  }
};