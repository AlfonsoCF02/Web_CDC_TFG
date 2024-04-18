import React from 'react';
import logo from '../assets/images/logo_cdc.png';

const HomePage: React.FC = () => {
  return (
    <>
      <div className="full-page-container d-flex align-items-center justify-content-center" style={{ marginTop: '25px', marginBottom: '120px' }}>
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-4 order-2 order-md-1 mt-5">
                <div className="card text-center mt-4">
                  <img src={'https://static.vecteezy.com/system/resources/previews/014/660/670/non_2x/catalog-line-icon-vector.jpg'} className="card-img-top mx-auto mt-3" alt="Logo" style={{ maxWidth: '200px' }} />
                  <div className="card-body">
                    <h5 className="card-title">Catálogo</h5>
                    <p className="card-text">Descubre nuestros productos.</p>
                    <a href="/catalogue" className="btn btn-primary btn-sm">Ir al Catálogo</a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 order-1 order-md-2 align-self-center text-center" style={{ marginTop: '15px' }}>
                <div className="container">
                  <img src={logo} alt="CDC Logo" className="mb-4" style={{ maxWidth: '200px' }} />
                  <h2>Bienvenido a</h2>
                  <h1 className='mb-3'>Carnicas Dehesa Chaparral</h1>
                  <p>Descubre la calidad y el sabor de nuestros productos</p>
                  <a href="#quienes-somos" className="btn btn-primary btn-lg">Descubrenos</a>
                </div>
              </div>
              <div className="col-md-4 order-3 order-md-3 mt-5">
                <div className="card text-center mt-4">
                  <img src={'https://cdn-icons-png.freepik.com/512/2649/2649019.png'} className="card-img-top mx-auto mt-3" alt="Logo" style={{ maxWidth: '200px' }} />
                  <div className="card-body">
                    <h5 className="card-title">Reservas</h5>
                    <p className="card-text">Reserva una visita ahora.</p>
                    <a href="/reservations" className="btn btn-primary btn-sm">Ir a Reservas</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Nueva sección "Quiénes Somos" independiente debajo del contenedor principal */}
      <section id="quienes-somos" className="section mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className='mb-5'>Quiénes Somos</h2>
              <p className='mb-4'>Somos una empresa dedicada a la venta de productos cárnicos de calidad, con una tradición que respeta el bienestar animal y el medio ambiente. Proveemos productos frescos y de calidad superior, directamente de nuestras granjas a su mesa.</p>
              <p className='mb-4'>Todos nuestros productos ibéricos cuentan con denominación de orign protegida Los Pedroches.</p>
            </div>
            <img src={'https://argataca.com/wp-content/uploads/2019/01/iberico-bellota.jpg'} alt="Imagen descriptiva" className="img-fluid" style={{ maxWidth: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
