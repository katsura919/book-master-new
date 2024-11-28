import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          &copy; {currentYear} Book Master | USTP Library Borrowing System
        </p>
        <p style={styles.text}>
          <a href="/privacy" style={styles.link}>Privacy Policy</a> | 
          <a href="/terms" style={styles.link}> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#2E3B55",
    color: "#FFFFFF",
    padding: "1rem 0",
    textAlign: "center",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  text: {
    margin: "0.5rem 0",
    fontSize: "0.9rem",
  },
  link: {
    color: "#FFD700",
    textDecoration: "none",
    margin: "0 0.5rem",
  },
};

export default Footer;
