import { MdOutlineBusinessCenter, MdOutlineSchool } from "react-icons/md";
import { FaAward } from "react-icons/fa";

module.exports = [
  {
    id: 1,
    title: "Education",
    icon: <MdOutlineBusinessCenter />,
    items: [
      {
        id: 1,
        date: "2021-2023",
        title: "Ph.D in Horriblensess ",
        place: "ABC University, Los Angeles, CA",
        bg: "#FFF4F4",
      },

      {
        id: 2,
        date: "2019 - Present",
        title: "Sr. Software Tester",
        place: "Google Inc.",
        bg: "#FFF1FB",
      },

      {
        id: 3,
        date: "2021",
        title: "Best Developer ",
        place: "University Of Melbourne, NA",
        bg: "#FFF4F4",
      },
    ],
  },
  {
    id: 2,
    title: "Experience",
    icon: <MdOutlineSchool />,
    items: [
      {
        id: 1,
        date: "2017-2021",
        title: "Computer Science",
        place: "Imperialize Technical Institute",
        bg: "#EEF5FA",
      },

      {
        id: 2,
        date: "2015-2017",
        title: "Cr. Web Developer",
        place: "ib-themes ltd.",
        bg: "#F2F4FF",
      },

      {
        id: 3,
        date: "2008",
        title: "Best Writter",
        place: "Online Typodev Soluation Ltd.",
        bg: "#EEF5FA",
      },
    ],
  },
  {
    id: 3,
    title: "Awards",
    icon: <FaAward />,
    items: [
      {
        id: 1,
        date: "2015-2017",
        title: "  Graphic Designer",
        place: "Web Graphy, Los Angeles, CA",
        bg: "#FCF4FF",
      },

      {
        id: 2,
        date: "2014 - 2015",
        title: "Jr. Web Developer",
        place: "Creative Gigs.",
        bg: "#FCF9F2",
      },

      {
        id: 3,
        date: "2015-2017",
        title: "Best Freelancer",
        place: "Fiver & Upwork Level 2 & Top Rated",
        bg: "#FCF4FF",
      },
    ],
  },
];
