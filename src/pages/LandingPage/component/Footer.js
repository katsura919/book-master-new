import React from "react";
import ContactUs from './ContactUs';
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h3 style={styles.heading}>Company</h3>
          <ul style={styles.list}>
            <li><a  style={styles.link}>About Us</a></li>
            <li><a href="https://www.ustp.edu.ph/cdeo/library/services/" style={styles.link}>Our Services</a></li>
            <li><a  style={styles.link}>Privacy Policy</a></li>
            <li><a style={styles.link}>Affiliate Program</a></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h3 style={styles.heading}>Get Help</h3>
          <ul style={styles.list}>
            <li><a  style={styles.link}>FAQ</a></li>
            <li><a style={styles.link}>Payment Options</a></li>
          </ul>
        </div>


        <div style={styles.column}>
          <h3 style={styles.heading}>Follow Us</h3>
          <div style={styles.socialIcons}>
            <ContactUs/>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#2E3B55",
    color: "#FFFFFF",
    padding: "2rem 0",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  column: {
    flex: "1 1 200px",
    margin: "1rem",
    textAlign: "left",
  },
  heading: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    borderBottom: "2px solid #fff",
    paddingBottom: "0.5rem",
    color: "#FFFFFF",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    margin: "0.5rem 0",
  },
  socialIcons: {
    display: "flex",
    gap: "0.5rem",
  },
};

export default Footer;
