import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

const make = (paths: JSX.Element, defaultStroke = 1.75) =>
  function Icon({ size = 16, strokeWidth = defaultStroke, ...rest }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        {paths}
      </svg>
    );
  };

export const IconHome = make(<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />, 1.5);
export const IconChart = make(<><path d="M4 20h16" /><path d="M7 17v-3M11 17v-6M15 17v-4M19 17V8" /></>, 1.5);
export const IconTeam = make(
  <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18.5 14.8c1.6.8 2.7 2.6 3 5.2" /></>,
);
export const IconFolder = make(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, 1.5);
export const IconSettings = make(
  <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  1.5,
);
export const IconChevronDown = make(<path d="M8 10l4 4 4-4" />);
export const IconChevronDownLg = make(<path d="M7 10l5 5 5-5" />);
export const IconChevronRight = make(<path d="M10 7l5 5-5 5" />);
export const IconChevronLeft = make(<path d="M14 7l-5 5 5 5" />);
export const IconChevronsUpDown = make(<path d="M8 9l4-4 4 4M8 15l4 4 4-4" />);
export const IconSearch = make(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>);
export const IconRefresh = make(
  <><path d="M20 11a8 8 0 0 0-14.7-4.3L4 8" /><path d="M4 3v5h5" /><path d="M4 13a8 8 0 0 0 14.7 4.3L20 16" /><path d="M20 21v-5h-5" /></>,
);
export const IconSun = make(
  <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
);
export const IconMoon = make(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />);
export const IconBell = make(<><path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>);
export const IconVideo = make(<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10.5l5-3v9l-5-3" /></>);
export const IconFlag = make(<path d="M5 21V4M5 4h11l-2 4 2 4H5" />);
export const IconCalendar = make(<><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>);
export const IconClose = make(<path d="M6 6l12 12M18 6L6 18" />);
export const IconCheck = make(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const IconCheckCircle = make(<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.3 2.3 4.7-4.8" /></>);
export const IconAlert = make(<><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.2v.1" /></>);
export const IconGauge = make(<><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="M12 13l3.5-3.5" /></>);
export const IconSend = make(<path d="M5 12h13M13 6l6 6-6 6" />);
export const IconPlus = make(<path d="M12 5v14M5 12h14" />);
export const IconUserSwap = make(
  <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5 1.4 0 2.6.4 3.6 1" /><path d="M16 14h6M19 11l3 3-3 3" /></>,
);
export const IconInfo = make(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.1" /></>);
export const IconClock = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const IconTrend = make(<path d="M4 17l6-6 4 4 6-7" />);
export const IconLink = make(<><path d="M9 15l6-6" /><path d="M10.5 6.5l1-1a4 4 0 0 1 5.7 5.7l-1 1M13.5 17.5l-1 1a4 4 0 0 1-5.7-5.7l1-1" /></>);
export const IconArrowRight =make(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconBan = make(<><circle cx="12" cy="12" r="9" /><path d="M5.7 5.7l12.6 12.6" /></>);
export const IconSwap = make(<path d="M7 7h12l-3-3M17 17H5l3 3" />);
export const IconTrash =make(<><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" /></>);
