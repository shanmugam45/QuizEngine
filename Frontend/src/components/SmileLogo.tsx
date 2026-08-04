import type { SVGProps } from 'react'

type SmileLogoProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  width?: number
  height?: number
}

export default function SmileLogo({ width = 200, height = 200, className = '', ...props }: SmileLogoProps) {
  return (
    <svg
      viewBox="0 0 2000 2000"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
      {...props}
    >
      <path d="M0 0 C660 0 1320 0 2000 0 C2000 660 2000 1320 2000 2000 C1340 2000 680 2000 0 2000 C0 1340 0 680 0 0 Z " fill="none" transform="translate(0,0)"/>
      <path d="M0 0 C46.92 0 93.84 0 141 0 C140.95 46.93 140.95 46.93 141 94 C93.84 94 46.92 94 0 94 C0.05 46.93 0.05 46.93 0 0 Z " fill="#1A1A1A" transform="translate(896,1020)"/>
      <path d="M0 0 C0 31.24 0 62.48 0 94 C46.92 94 93.84 94 141 94 C141 62.76 141 31.52 141 0 C93.84 0 46.92 0 0 0 Z " fill="#222222" transform="translate(896,1020)"/>
      <path d="M0 0 C47 0 94 0 141 0 C141 31 141 62 141 94 C94 94 47 94 0 94 C0 62 0 31 0 0 Z " fill="#2A2A2A" transform="translate(896,1020)"/>
      <path d="M0 0 C0.66 0.66 1.32 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#3A3A3A" transform="translate(1037,1113)"/>
      <path d="M0 0 C0.68 0 1.36 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.64 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#424242" transform="translate(1035,1114)"/>
      <path d="M0 0 C2.15 0 4.3 0 6 0 C6 1.99 6 3.98 6 6 C4.3 6 2.15 6 0 6 C0 3.98 0 1.99 0 0 Z " fill="#4A4A4A" transform="translate(1034,1113)"/>
      <path d="M0 0 C10.01 0 20.02 0 30 0 C30 10.02 30 20.04 30 31 C20.02 31 10.01 31 0 31 C0 20.98 0 10.99 0 0 Z " fill="#525252" transform="translate(1000,1083)"/>
      <path d="M0 0 C0.67 0.34 1.34 0.68 2 1 C1.34 1.66 0.68 2.32 0 3 C0 2 0 1 0 0 Z " fill="#5A5A5A" transform="translate(1029,1116)"/>
      <path d="M0 0 C0.99 0 1.98 0 3 0 C3 0.99 3 1.98 3 3 C1.98 3 0.99 3 0 3 C0 1.98 0 0.99 0 0 Z " fill="#626262" transform="translate(1026,1117)"/>
      <path d="M0 0 C5.01 0 10.02 0 15 0 C15 5.01 15 10.02 15 15 C10.02 15 5.01 15 0 15 C0 10.02 0 5.01 0 0 Z " fill="#6A6A6A" transform="translate(993,1098)"/>
      <path d="M0 0 C40 0 80 0 120 0 C120 40 120 80 120 121 C80 121 40 121 0 121 C0 80.99 0 40.99 0 0 Z " fill="#727272" transform="translate(940,1030)"/>
      <path d="M0 0 C2 0 4 0 6 0 C6 2 6 4 6 6 C4 6 2 6 0 6 C0 4 0 2 0 0 Z " fill="#7A7A7A" transform="translate(1022,1121)"/>
      <path d="M0 0 C3 0 6 0 9 0 C9 3 9 6 9 9 C6 9 3 9 0 9 C0 6 0 3 0 0 Z " fill="#828282" transform="translate(1015,1126)"/>
      <path d="M0 0 C100 0 200 0 300 0 C300 100 300 200 300 301 C200 301 100 301 0 301 C0 200.99 0 100.99 0 0 Z " fill="#8A8A8A" transform="translate(850,870)"/>
      <path d="M0 0 C2.34 0 4.68 0 7 0 C7 2.34 7 4.68 7 7 C4.68 7 2.34 7 0 7 C0 4.68 0 2.34 0 0 Z " fill="#929292" transform="translate(1011,1131)"/>
      <path d="M0 0 C5 0 10 0 15 0 C15 5 15 10 15 15 C10 15 5 15 0 15 C0 10 0 5 0 0 Z " fill="#9A9A9A" transform="translate(1006,1136)"/>
      <path d="M0 0 C200 0 400 0 600 0 C600 200 600 400 600 601 C400 601 200 601 0 601 C0 400.99 0 200.99 0 0 Z " fill="#A2A2A2" transform="translate(700,700)"/>
      <path d="M0 0 C3 0 6 0 9 0 C9 3 9 6 9 9 C6 9 3 9 0 9 C0 6 0 3 0 0 Z " fill="#AAAAAA" transform="translate(1000,1141)"/>
      <path d="M0 0 C6.66 0 13.32 0 20 0 C20 6.66 20 13.32 20 20 C13.32 20 6.66 20 0 20 C0 13.32 0 6.66 0 0 Z " fill="#B2B2B2" transform="translate(990,1151)"/>
      <path d="M0 0 C0.67 0 1.34 0 2 0 C2 0.67 2 1.34 2 2 C1.34 2 0.67 2 0 2 C0 1.34 0 0.67 0 0 Z " fill="#BABABA" transform="translate(1018,1163)"/>
      <path d="M0 0 C1 0 2 0 3 0 C3 1 3 2 3 3 C2 3 1 3 0 3 C0 2 0 1 0 0 Z " fill="#C2C2C2" transform="translate(1016,1164)"/>
      <path d="M0 0 C2 0 4 0 6 0 C6 2 6 4 6 6 C4 6 2 6 0 6 C0 4 0 2 0 0 Z " fill="#CACACA" transform="translate(1014,1165)"/>
      <path d="M0 0 C3.33 0 6.66 0 10 0 C10 3.33 10 6.66 10 10 C6.66 10 3.33 10 0 10 C0 6.66 0 3.33 0 0 Z " fill="#D2D2D2" transform="translate(1010,1168)"/>
      <path d="M0 0 C0.65 0 1.3 0 2 0 C2 0.65 2 1.3 2 2 C1.3 2 0.65 2 0 2 C0 1.3 0 0.65 0 0 Z " fill="#DADADA" transform="translate(1019,1174)"/>
      <path d="M0 0 C1.33 0 2.66 0 4 0 C4 1.33 4 2.66 4 4 C2.66 4 1.33 4 0 4 C0 2.66 0 1.33 0 0 Z " fill="#E2E2E2" transform="translate(1017,1175)"/>
      <path d="M0 0 C2.66 0 5.32 0 8 0 C8 2.66 8 5.32 8 8 C5.32 8 2.66 8 0 8 C0 5.32 0 2.66 0 0 Z " fill="#EAEAEA" transform="translate(1013,1178)"/>
      <path d="M0 0 C0.65 0 1.3 0 2 0 C2 0.65 2 1.3 2 2 C1.3 2 0.65 2 0 2 C0 1.3 0 0.65 0 0 Z " fill="#F2F2F2" transform="translate(1020,1184)"/>
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.64 4 1.32 4 0 4 C0 2.64 0 1.32 0 0 Z " fill="#FAFAFA" transform="translate(1018,1185)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#393939" transform="translate(1014,1188)"/>
      <path d="M0 0 C0.67 0 1.34 0 2 0 C2 0.67 2 1.34 2 2 C1.34 2 0.67 2 0 2 C0 1.34 0 0.67 0 0 Z " fill="#414141" transform="translate(1021,1194)"/>
      <path d="M0 0 C1.33 0 2.66 0 4 0 C4 1.33 4 2.66 4 4 C2.66 4 1.33 4 0 4 C0 2.66 0 1.33 0 0 Z " fill="#494949" transform="translate(1019,1195)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#515151" transform="translate(1015,1198)"/>
      <path d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.66 2 0 2 C0 1.32 0 0.66 0 0 Z " fill="#595959" transform="translate(1022,1204)"/>
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.64 4 1.32 4 0 4 C0 2.64 0 1.32 0 0 Z " fill="#616161" transform="translate(1020,1205)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#696969" transform="translate(1016,1208)"/>
      <path d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.66 2 0 2 C0 1.32 0 0.66 0 0 Z " fill="#717171" transform="translate(1023,1214)"/>
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.64 4 1.32 4 0 4 C0 2.64 0 1.32 0 0 Z " fill="#797979" transform="translate(1021,1215)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#818181" transform="translate(1017,1218)"/>
      <path d="M0 0 C0.66 0.66 1.32 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#898989" transform="translate(1024,1223)"/>
      <path d="M0 0 C0.68 0 1.36 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.64 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#919191" transform="translate(1022,1224)"/>
      <path d="M0 0 C2.15 0 4.3 0 6 0 C6 1.99 6 3.98 6 6 C4.3 6 2.15 6 0 6 C0 3.98 0 1.99 0 0 Z " fill="#999999" transform="translate(1018,1227)"/>
      <path d="M0 0 C1 0 2 0 3 0 C3 0.99 3 1.98 3 3 C2 3 1 3 0 3 C0 1.98 0 0.99 0 0 Z " fill="#A1A1A1" transform="translate(1025,1233)"/>
      <path d="M0 0 C2 0 4 0 6 0 C6 1.99 6 3.98 6 6 C4 6 2 6 0 6 C0 3.98 0 1.99 0 0 Z " fill="#A9A9A9" transform="translate(1023,1234)"/>
      <path d="M0 0 C3.33 0 6.66 0 10 0 C10 3.33 10 6.66 10 10 C6.66 10 3.33 10 0 10 C0 6.66 0 3.33 0 0 Z " fill="#B1B1B1" transform="translate(1019,1237)"/>
      <path d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.66 2 0 2 C0 1.32 0 0.66 0 0 Z " fill="#B9B9B9" transform="translate(1026,1243)"/>
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.64 4 1.32 4 0 4 C0 2.64 0 1.32 0 0 Z " fill="#C1C1C1" transform="translate(1024,1244)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#C9C9C9" transform="translate(1020,1247)"/>
      <path d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.66 2 0 2 C0 1.32 0 0.66 0 0 Z " fill="#D1D1D1" transform="translate(1027,1253)"/>
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.64 4 1.32 4 0 4 C0 2.64 0 1.32 0 0 Z " fill="#D9D9D9" transform="translate(1025,1254)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 2.31 7 4.62 7 7 C4.62 7 2.31 7 0 7 C0 4.62 0 2.31 0 0 Z " fill="#E1E1E1" transform="translate(1021,1257)"/>
      <path d="M0 0 C0.66 0.66 1.32 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#E9E9E9" transform="translate(1028,1263)"/>
      <path d="M0 0 C0.68 0 1.36 0 2 0 C2 0.66 2 1.32 2 2 C1.32 2 0.64 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#F1F1F1" transform="translate(1026,1264)"/>
      <path d="M0 0 C2.15 0 4.3 0 6 0 C6 1.99 6 3.98 6 6 C4.3 6 2.15 6 0 6 C0 3.98 0 1.99 0 0 Z " fill="#F9F9F9" transform="translate(1022,1267)"/>
      <path d="M0 0 C1 0 2 0 3 0 C3 0.99 3 1.98 3 3 C2 3 1 3 0 3 C0 1.98 0 0.99 0 0 Z " fill="#393939" transform="translate(1029,1273)"/>
      <path d="M0 0 C2 0 4 0 6 0 C6 1.99 6 3.98 6 6 C4 6 2 6 0 6 C0 3.98 0 1.99 0 0 Z " fill="#414141" transform="translate(1027,1274)"/>
      <path d="M0 0 C3.33 0 6.66 0 10 0 C10 3.33 10 6.66 10 10 C6.66 10 3.33 10 0 10 C0 6.66 0 3.33 0 0 Z " fill="#494949" transform="translate(1023,1277)"/>
      <path d="M0 0 C100 0 200 0 300 0 C300 100 300 200 300 301 C200 301 100 301 0 301 C0 200.99 0 100.99 0 0 Z " fill="#2A2A2A" transform="translate(900,850)"/>
      <path d="M0 0 C200 0 400 0 600 0 C600 200 600 400 600 601 C400 601 200 601 0 601 C0 400.99 0 200.99 0 0 Z " fill="#1A1A1A" transform="translate(700,750)"/>
      <path d="M0 0 C40.02 0 80.04 0 120 0 C120 40 120 80 120 121 C80 121 40 121 0 121 C0 80.99 0 40.99 0 0 Z " fill="#222222" transform="translate(940,930)"/>
      <path d="M0 0 C20.02 0 40.04 0 60 0 C60 20 60 40 60 61 C40 61 20 61 0 61 C0 40.99 0 20.99 0 0 Z " fill="#2A2A2A" transform="translate(970,960)"/>
      <path d="M0 0 C10.01 0 20.02 0 30 0 C30 10.02 30 20.04 30 31 C20.02 31 10.01 31 0 31 C0 20.98 0 10.99 0 0 Z " fill="#323232" transform="translate(985,975)"/>
      <path d="M0 0 C6.75 0.75 6.75 0.75 9 3 C5.625 3.1875 5.625 3.1875 2 3 C1.34 2.01 0.68 1.02 0 0 Z " fill="#393939" transform="translate(1176,434)"/>
      <path d="M0 0 C2.31 0 4.62 0 7 0 C7 0.99 7 1.98 7 3 C4.0625 2.625 4.0625 2.625 1 2 C0.67 1.34 0.34 0.68 0 0 Z " fill="#494949" transform="translate(1160,422)"/>
    </svg>
  )
}
