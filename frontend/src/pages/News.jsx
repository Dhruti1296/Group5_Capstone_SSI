import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./News.css";

const newsItems = [
  {
    id: 1,
    title: "Conestoga team receives award at international baking competition",
    date: "March 2, 2026",
    description: "Baking and Pastry Arts Management graduate Emilie Duffin and student Thuy Thanh Nhan Huynh recently travelled to Italy to participate in the Juniores Pastry World Cup, hosted from January 23-27 at the Rimini Expo Centre.Conestoga’s team paid homage to Dr. Roberta Bondar, Canada’s first woman in space. A detailed chocolate sculpture of Roberta Bondar was at the centre of the showpiece, which also featured a chocolate rocket ship, a galaxy and an Earth-shaped vegan coffee cake. Alongside it, the team presented a maple-leaf-shaped cherry butter Danish and Saskatoon and birch syrup bannock, a staple bread in many Indigenous cultures in Canada.They had only ten hours to complete their showpiece.Aside from the time pressure, the team also had to handle unpredictable temperatures at the competition. “It was very hot. Our chocolate didn’t set. When we tried to assemble the sculpture, we failed at first. But we still tried our best to get our product out there,” said Huynh.",
    image: "/images/news1.jpg",
    link: "/news/sustainability"
  },
  {
    id: 2,
    title: "Conestoga entrepreneurs compete at annual pitch competition",
    date: "November 28, 2025",
    description: "Entrepreneurs in Conestoga’s Venture Lab pitched their business ideas to a panel of judges and the community on November 19 at the sixth annual Wilf Rieck Business Pitch Day. ",
    image: "/images/news2.jpg",
    link: "/news/mentorship"
  },
  {
    id: 3,
    title: "Conestoga student wins Royal Sustainability Award for food-waste solution",
    date: "Feb 20, 2026",
    description: "Agri-Business Management graduate Kayode Olukayode was recently awarded a Royal Sustainability Award at the Royal Agriculture Winter Fair for his project on food waste reduction.",
    image: "/images/news3.jpg",
    link: "/news/culturalfest"
  }
];

function News() {
  return (
    <div className="news-page">
      <Navbar />
      <div className="news-header">
        <h2>Latest News</h2>
      </div>
      <div className="news-grid">
        {newsItems.map((item) => (
          <a href={item.link} key={item.id} className="news-card">
            <div className="news-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="news-content">
              <span className="news-date">{item.date}</span>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-description">{item.description}</p>
            </div>
          </a>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default News;