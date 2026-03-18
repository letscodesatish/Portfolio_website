export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  link?: string;
  image?: string;
}

export const certificates: Certificate[] = [
  {
    title: "500 Difficulty Rating Milestone",
    issuer: "CodeChef",
    date: "March 2026",
    description: "Successfully completed all practice problems for the 500 difficulty rating milestone on CodeChef.",
    link: "https://drive.google.com/file/d/1xnIBetm6frUAo0Wzyvbx2SUAdp2r0blV/view?usp=drive_link",
    image: "/images/cert_codechef.jpg"
  }
];
