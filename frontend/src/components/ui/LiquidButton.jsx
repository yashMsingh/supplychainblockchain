import * as React from "react"

function GlassFilter() {
  return (
    <svg style={{ display: "none" }}>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur
            in="displaced"
            stdDeviation="4"
            result="finalBlur"
          />
          <feComposite
            in="finalBlur"
            in2="finalBlur"
            operator="over"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function LiquidButton({
  className,
  size = "xl",
  children,
  ...props
}) {
  const sizeStyles = {
    sm:  { height: "32px",  padding: "0 16px",  fontSize: "12px" },
    md:  { height: "36px",  padding: "0 16px",  fontSize: "14px" },
    lg:  { height: "40px",  padding: "0 24px",  fontSize: "14px" },
    xl:  { height: "48px",  padding: "0 32px",  fontSize: "16px" },
    xxl: { height: "56px",  padding: "0 40px",  fontSize: "16px" },
  }

  const sz = sizeStyles[size] || sizeStyles.xl

  return (
    <>
      <button
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          gap: "8px",
          whiteSpace: "nowrap",
          borderRadius: "9999px",
          fontSize: sz.fontSize,
          fontWeight: "500",
          height: sz.height,
          padding: sz.padding,
          background: "transparent",
          transition: "transform 0.3s ease, filter 0.3s ease",
          transform: "scale(1)",
          outline: "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)"
        }}
        className={className}
        {...props}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            height: "100%",
            width: "100%",
            borderRadius: "9999px",
            boxShadow: `
              0 0 6px rgba(0,0,0,0.03),
              0 2px 6px rgba(0,0,0,0.08),
              inset 3px 3px 0.5px -3px rgba(0,0,0,0.9),
              inset -3px -3px 0.5px -3px rgba(0,0,0,0.85),
              inset 1px 1px 1px -0.5px rgba(0,0,0,0.6),
              inset -1px -1px 1px -0.5px rgba(0,0,0,0.6),
              inset 0 0 6px 6px rgba(0,0,0,0.12),
              inset 0 0 2px 2px rgba(0,0,0,0.06),
              0 0 12px rgba(255,255,255,0.15)
            `,
            transition: "all 0.3s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            height: "100%",
            width: "100%",
            overflow: "hidden",
            borderRadius: "9999px",
            backdropFilter: 'url("#container-glass")',
            WebkitBackdropFilter: 'url("#container-glass")',
          }}
        />
        <div
          style={{
            pointerEvents: "none",
            zIndex: 10,
            position: "relative",
          }}
        >
          {children}
        </div>
        <GlassFilter />
      </button>
    </>
  )
}
