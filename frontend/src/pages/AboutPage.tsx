// src/pages/AboutPage.tsx
import React from 'react';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de about de la aplicación
 * 
 ******************************************************************************/

const AboutPage: React.FC = () => {
  return (
    <div className='container'>
     {/* Nueva sección "Quiénes Somos" independiente debajo del contenedor principal */}
     <section id="quienes-somos" className="section mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className='mb-5'>Quiénes Somos</h2>
              <p className='mb-4'>Somos una empresa dedicada a la venta de productos cárnicos de calidad, con una tradición que respeta el bienestar animal y el medio ambiente. Proveemos productos frescos y de calidad superior directamente de nuestra ganadería a su mesa.</p>
              <p className='mb-4'>Todos nuestros productos ibéricos cuentan con Denominación de Origen Protegida Los Pedroches.</p>
              <p className='mb-4'>Si quieres descubrir más sobre el día a día en la finca, el proceso de fabricación o crianza, no dudes en <a href="/reservations">visitarnos</a>.</p>
            </div>
            <img src={'https://argataca.com/wp-content/uploads/2019/01/iberico-bellota.jpg'} alt="Imagen descriptiva" className="img-fluid" style={{ maxWidth: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
