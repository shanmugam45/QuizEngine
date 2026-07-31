import type { SVGProps } from 'react'

export type AvatarVariant =
  | 'alex'
  | 'maya'
  | 'leo'
  | 'zara'
  | 'noah'
  | 'luna'
  | 'kai'
  | 'emma'
  | 'riley'
  | 'sam'

type MascotProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  variant?: AvatarVariant
  size?: number
  title?: string
}

const stroke = {
  fill: 'none',
  stroke: '#000',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function FaceBase({ variant }: { variant: AvatarVariant }) {
  const isCurious = variant === 'alex' || variant === 'riley'
  const isPlayful = variant === 'leo'
  const isConfident = variant === 'zara' || variant === 'kai'
  const isGentle = variant === 'luna' || variant === 'emma'
  const eyeR = isCurious ? 5 : 4.5
  const mouthWidth = isPlayful ? 11 : isConfident ? 13 : isGentle ? 10 : 12

  return (
    <>
      <circle cx="32" cy="34" r="24" fill="#fff" stroke="#000" strokeWidth="3" />
      <g>
        {variant === 'leo' ? (
          <path d="M22 30c1.5-2 3.5-3 5.5-3" {...stroke} />
        ) : (
          <>
            <circle cx="24" cy="31" r={eyeR} fill="#fff" stroke="#000" strokeWidth="3" />
            <circle cx="40" cy="31" r={eyeR} fill="#fff" stroke="#000" strokeWidth="3" />
            <circle cx="24" cy="31" r="1.5" fill="#000" />
            <circle cx="40" cy="31" r="1.5" fill="#000" />
          </>
        )}
        {variant === 'zara' || variant === 'sam' ? (
          <>
            <circle cx="24" cy="31" r="7.5" fill="none" stroke="#000" strokeWidth="3" />
            <circle cx="40" cy="31" r="7.5" fill="none" stroke="#000" strokeWidth="3" />
            <path d="M31 31h2" {...stroke} />
          </>
        ) : null}
      </g>
      <path d="M31.5 36.5h1" {...stroke} />
      <path d="M26 42c3 3 9 3 12 0" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${32 - mouthWidth / 2} 42c3 2 6 2 9 0`} stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0} />
    </>
  )
}

function HairAndAccessory({ variant }: { variant: AvatarVariant }) {
  switch (variant) {
    case 'alex':
      return (
        <>
          <path d="M13 29c1-8 7-13 19-13 10 0 17 4 19 12v7H13z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 24c3-3 7-5 14-5 5 0 10 2 14 5" {...stroke} />
        </>
      )
    case 'maya':
      return (
        <>
          <path d="M15 28c0-10 7-17 17-17s17 7 17 17v17H15z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 21h28" {...stroke} />
          <rect x="42" y="20" width="4" height="7" rx="1.5" fill="#fff" stroke="#000" strokeWidth="3" />
        </>
      )
    case 'leo':
      return (
        <>
          <path d="M13 30c0-9 8-16 19-16s19 7 19 16v10H13z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M15 28c1-4 3-7 6-9" {...stroke} />
          <path d="M49 28c-1-4-3-7-6-9" {...stroke} />
          <path d="M20 18l3 4M27 15l2 5M34 14l1 5M41 16l-1 5" {...stroke} />
          <path d="M16 47c4-5 9-7 16-7s12 2 16 7" {...stroke} />
        </>
      )
    case 'zara':
      return (
        <>
          <path d="M17 24c0-9 6-14 15-14s15 5 15 14v20H17z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M31 10c1 9 7 14 14 19" {...stroke} />
          <path d="M32 11c2 8 5 13 11 18" {...stroke} />
          <path d="M22 19h20" {...stroke} />
        </>
      )
    case 'noah':
      return (
        <>
          <path d="M15 25c2-8 8-12 17-12 10 0 16 4 17 12v11H15z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <rect x="15" y="22" width="34" height="6" rx="3" fill="#fff" stroke="#000" strokeWidth="3" />
          <path d="M18 20c2-2 5-4 8-5" {...stroke} />
        </>
      )
    case 'luna':
      return (
        <>
          <path d="M16 24c0-8 7-14 16-14s16 6 16 14v19H16z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M16 25c4 2 7 3 16 3s12-1 16-3" {...stroke} />
          <rect x="44" y="19" width="4" height="4" rx="1" fill="#fff" stroke="#000" strokeWidth="3" />
        </>
      )
    case 'kai':
      return (
        <>
          <path d="M14 28c0-7 7-15 18-15s18 8 18 15v12H14z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M17 21l5 6 5-8 5 8 5-7 5 7" {...stroke} />
          <path d="M18 46c4-5 8-7 14-7s10 2 14 7" {...stroke} />
        </>
      )
    case 'emma':
      return (
        <>
          <path d="M18 25c0-10 6-16 14-16s14 6 14 16v18H18z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="18" cy="24" r="6" fill="#000" stroke="#000" strokeWidth="3" />
          <circle cx="46" cy="24" r="6" fill="#000" stroke="#000" strokeWidth="3" />
          <rect x="14" y="22" width="4" height="4" rx="1" fill="#fff" stroke="#000" strokeWidth="3" />
          <rect x="46" y="22" width="4" height="4" rx="1" fill="#fff" stroke="#000" strokeWidth="3" />
        </>
      )
    case 'riley':
      return (
        <>
          <path d="M15 30c0-8 6-15 17-15s17 7 17 15v11H15z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M17 28c2-3 5-5 8-6" {...stroke} />
          <path d="M47 28c-2-3-5-5-8-6" {...stroke} />
        </>
      )
    case 'sam':
      return (
        <>
          <path d="M15 25c1-9 8-15 17-15s16 6 17 15v15H15z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M20 19c4-3 8-4 12-4s8 1 12 4" {...stroke} />
          <path d="M18 20c3 2 6 3 14 3s11-1 14-3" {...stroke} />
        </>
      )
    default:
      return null
  }
}

function MascotFace({ variant }: { variant: AvatarVariant }) {
  return (
    <g>
      <HairAndAccessory variant={variant} />
      <FaceBase variant={variant} />
      {variant === 'maya' && <path d="M19 48h6" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'leo' && <path d="M17 22c2 1 3 2 4 4" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'zara' && <path d="M17 22h4M43 22h4" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'noah' && <path d="M18 21h28" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'luna' && <path d="M21 20c2 1 4 1 6 0" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'kai' && <path d="M19 19h26" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'emma' && <circle cx="18" cy="24" r="1.5" fill="#000" />}
      {variant === 'riley' && <path d="M25 42c2 1 4 1 8 1s6 0 8-1" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {variant === 'sam' && (
        <>
          <path d="M18 18h6M40 18h6" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M31 17l2 4" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </g>
  )
}

export function StudentAvatar({ variant = 'sam', size = 64, title, className, ...props }: MascotProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title || `Student avatar ${variant}`}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <MascotFace variant={variant} />
    </svg>
  )
}

export function StudentLoader({ variant = 'sam', size = 64, title = 'Loading', className, ...props }: MascotProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <circle cx="32" cy="32" r="26" fill="#fff" stroke="#000" strokeWidth="3" />
      <MascotFace variant={variant} />
      <g>
        <circle cx="32" cy="8" r="3" fill="#000" stroke="#000" strokeWidth="3">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  )
}
