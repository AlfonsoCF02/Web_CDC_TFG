function Footer() {
  return (

<>

  {/* Codigo base tomado de: https://getbootstrap.com/docs/5.3/examples/footers/ */}

<div className="b-example-divider"></div>

<div className="container">
  <footer className="py-3 my-4">
    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
      <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
      <li className="nav-item"><a href="/catalogue" className="nav-link px-2 text-body-secondary">Catálogo</a></li>
      <li className="nav-item"><a href="/reservartions" className="nav-link px-2 text-body-secondary">Reservas</a></li>
      <li className="nav-item"><a href="/contact" className="nav-link px-2 text-body-secondary">Contacto</a></li>
      <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
    </ul>
    <p className="text-center text-body-secondary">&copy; 2024 Cárnicas Dehesa Chaparral, SL</p>
  </footer>
</div>

<div className="b-example-divider"></div>

</>

  );
}

export default Footer;
