// src/pages/ContactPage.tsx
import React from 'react';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de contacto de la aplicación
 * 
 ******************************************************************************/

const ContactPage: React.FC = () => {
  return (
    <div className='container'>
      {/* Sección "Contáctanos" */}
      <section id="contacto" className="section mt-5">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-md-8 text-center">
              <h2 className='mb-5'>Contáctanos</h2>
              <p className='mb-4'>Puedes contactarnos mediante las siguientes vías para más información sobre nuestros productos y servicios, hacer pedidos o resolver cualquier duda.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center align-items-center justify-content-center d-flex flex-column">
                  <h3 className="card-title">Email</h3>
                  <p className="card-text"><a href="mailto:info@nuestraempresa.com">info@cdc.com</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center align-items-center justify-content-center d-flex flex-column">
                  <h3 className="card-title">Teléfono</h3>
                  <p className="card-text"><a href="tel:+34902123456">+34 902 123 456</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center align-items-center justify-content-center d-flex flex-column">
                  <h3 className="card-title">Dirección</h3>
                  <p className="card-text">Carretera de Cardenña KM. 23;<br/>Villanueva de Córdoba (14440);<br/>Córdoba, España</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br /><br /><br />
    </div>
  );
};

export default ContactPage;
