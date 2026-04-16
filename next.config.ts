import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  /**
   * Permanent redirects for the Wave 5b-era nav restructure.
   *
   * Flat /hospitals /laboratories /pharmacies moved under /solutions/* to
   * make room for Diagnostic Centres (shipping this wave) and Dental +
   * Optical (Wave 7). Backlinks and any crawler memory get 308-forwarded.
   */
  async redirects() {
    return [
      { source: "/hospitals", destination: "/solutions/hospitals-clinics", permanent: true },
      { source: "/laboratories", destination: "/solutions/medical-labs", permanent: true },
      { source: "/pharmacies", destination: "/solutions/pharmacies", permanent: true },
    ];
  },
};

export default config;
