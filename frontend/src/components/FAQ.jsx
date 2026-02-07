import "./FAQ.css";

const FAQ = () => {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h1>QUESTIONS</h1>
        <p className="faq-subtitle">
          Everything you need to know about the competition
        </p>

        <div className="faq-grid">
          <div className="faq-item">
            <h3>Who can participate?</h3>
            <p>
              Any student or professional can join. Form a team of up to five
              members and register before the deadline. Your experience level
              doesn't matter. Your drive does.
            </p>
          </div>

          <div className="faq-item">
            <h3>What's the theme about?</h3>
            <p>
              We've built challenges inspired by T20 cricket. Fast-paced
              problems that demand quick thinking and solid code. The theme
              runs through everything, but the coding is what counts.
            </p>
          </div>

          <div className="faq-item">
            <h3>How are teams judged?</h3>
            <p>
              Judges evaluate your solution on functionality, creativity, and
              presentation. You'll have time to pitch your work. Make it count.
            </p>
          </div>

          <div className="faq-item">
            <h3>What prizes are available?</h3>
            <p>
              We're offering fifty thousand dollars in total prizes. Cash,
              sponsorships, and recognition from industry leaders. The winners
              get noticed.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can remote teams participate?</h3>
            <p>
              Yes. You can compete from anywhere. All you need is a connection
              and the will to win. Location doesn't determine your chances.
            </p>
          </div>

          <div className="faq-item">
            <h3>What happens after the hackathon?</h3>
            <p>
              Your work gets showcased to sponsors and industry professionals.
              Networking opportunities follow. Some teams find their next
              opportunity here.
            </p>
          </div>
        </div>

        <div className="faq-cta">
          <h2>NEED MORE ANSWERS?</h2>
          <p>Reach out to our team directly</p>
          <button>Contact</button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
