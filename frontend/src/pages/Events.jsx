/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Events.css";

function Events() {
  return (
    <div className="events-page">
      <Navbar />
      <div className="events-header">
        <h2>March Events</h2>
      </div>

      <div className="events-table-wrapper">
        <table className="events-table" title="Event listings">
          <thead>
            <tr className="sr-only">
              <th scope="col">Date/Time</th>
              <th scope="col">Events</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            {/* March 2 */}
            <tr className="date-row"><th colSpan="3">March 2, 2026</th></tr>
            <tr><td>Various times</td><td><a href="#">Convocation</a></td><td>Bingemans Conference Centre</td></tr>

            {/* March 3 */}
            <tr className="date-row"><th colSpan="3">March 3, 2026</th></tr>
            <tr><td>Various times</td><td><a href="#">Convocation</a></td><td>Bingemans Conference Centre</td></tr>
            <tr><td>6:00–7:00 p.m.</td><td><a href="#">Community Justice programs info session</a></td><td>Virtual event</td></tr>

            {/* March 4 */}
            <tr className="date-row"><th colSpan="3">March 4, 2026</th></tr>
            <tr><td>11:30–12:30 p.m.</td><td><a href="#">Women in Skilled Trades info session</a></td><td>Skilled Trades Campus</td></tr>
            <tr><td>12:00–1:00 p.m.</td><td><a href="#">Animal Care info session</a></td><td>Virtual event</td></tr>
            <tr><td>4:00–5:00 p.m.</td><td><a href="#">Social & Human Services info session</a></td><td>Virtual event</td></tr>
            <tr><td>6:00–7:00 p.m.</td><td><a href="#">Hospitality & Culinary Arts info session</a></td><td>Virtual event</td></tr>

            {/* March 7 */}
            <tr className="date-row"><th colSpan="3">March 7, 2026</th></tr>
            <tr><td>9:30–12:00 p.m.</td><td><a href="#">Spring Open House: Doon campus</a></td><td>Kitchener – Doon</td></tr>
            <tr><td>Various times</td><td><a href="#">Spring Open House 2026</a></td><td>Various campuses</td></tr>
            <tr><td>10:00–12:00 p.m.</td><td><a href="#">Spring Open House: Cambridge campus</a></td><td>Cambridge – Fountain Street</td></tr>
            <tr><td>1:00–3:00 p.m.</td><td><a href="#">Spring Open House: Waterloo campus</a></td><td>Waterloo</td></tr>
            <tr><td>2:00–4:00 p.m.</td><td><a href="#">Spring Open House: Milton campus</a></td><td>Milton – Steeles Ave</td></tr>

            {/* March 8 */}
            <tr className="date-row"><th colSpan="3">March 8, 2026</th></tr>
            <tr><td>9:15–3:45 p.m.</td><td><a href="#">International Women’s Day Conference</a></td><td>Cambridge – Fountain Street</td></tr>

            {/* March 11 */}
            <tr className="date-row"><th colSpan="3">March 11, 2026</th></tr>
            <tr><td>4:00–6:00 p.m.</td><td><a href="#">SheMeansBusiness – Connection is Currency</a></td><td>Kitchener – Doon</td></tr>

            {/* March 21 */}
            <tr className="date-row"><th colSpan="3">March 21, 2026</th></tr>
            <tr><td>10:00–5:00 p.m.</td><td><a href="#">Sixteenth Annual Traditional Pow Wow</a></td><td>Kitchener – Doon</td></tr>

            {/* March 25 */}
            <tr className="date-row"><th colSpan="3">March 25, 2026</th></tr>
            <tr><td>11:00–2:30 p.m.</td><td><a href="#">Motive Power Job Fair</a></td><td>Guelph campus</td></tr>
            <tr><td>2:00–3:00 p.m.</td><td><a href="#">Pet Grooming info session</a></td><td>Virtual event</td></tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

export default Events;