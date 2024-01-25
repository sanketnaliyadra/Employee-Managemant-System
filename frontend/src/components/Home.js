import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <main>
      <Container fluid className="hero-section">
        <div className="overlay"></div>
        <Container className="text-container">
          <Row>
            <Col md={12}>
              <h1 className="display-4">Welcome to the Admin Panel</h1>
              <p className="lead mb-4">Manage your resources efficiently.</p>
              <Button href="/table" className="play-btn">View</Button>
            </Col>
          </Row>
        </Container>
      </Container>

    </main>
  );
};

export default Home;
