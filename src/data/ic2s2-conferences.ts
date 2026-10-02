// Add a new entry here each year — the Events and Past Events pages consume this automatically.
export interface IC2S2Conference {
  year: number;
  edition: string; // e.g. "12th"
  location: string;
  dates: string;
  url: string;
  upcoming: boolean; // true = show on Events page; false = show on Past Events page
}

export const IC2S2_CONFERENCES: IC2S2Conference[] = [
  {
    year: 2026,
    edition: '12th',
    location: 'Burlington, Vermont, USA',
    dates: 'July 28–31, 2026',
    url: 'https://2026.ic2s2.net',
    upcoming: true,
  },
  {
    year: 2025,
    edition: '11th',
    location: 'Norrköping, Sweden',
    dates: 'July 21–24, 2025',
    url: 'https://2025.ic2s2.net',
    upcoming: false,
  },
  {
    year: 2024,
    edition: '10th',
    location: 'Philadelphia, USA',
    dates: 'July 17–20, 2024',
    url: 'https://2024.ic2s2.net',
    upcoming: false,
  },
  {
    year: 2023,
    edition: '9th',
    location: 'Copenhagen, Denmark',
    dates: 'July 17–20, 2023',
    url: 'https://ic2s2-2023.org',
    upcoming: false,
  },
  {
    year: 2022,
    edition: '8th',
    location: 'Chicago, USA',
    dates: 'July 19–22, 2022',
    url: 'https://2022.ic2s2.org',
    upcoming: false,
  },
  {
    year: 2021,
    edition: '7th',
    location: 'ETH Zürich (Virtual)',
    dates: 'July 27–31, 2021',
    url: 'https://ic2s2.ethz.ch',
    upcoming: false,
  },
  {
    year: 2020,
    edition: '6th',
    location: 'MIT (Virtual)',
    dates: 'July 17–19, 2020',
    url: 'https://2020.ic2s2.org',
    upcoming: false,
  },
];
