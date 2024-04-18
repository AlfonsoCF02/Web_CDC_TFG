import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

type ProductoCesta = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  url: string;
  stock: number;
};

const BasketPage: React.FC = () => {
  const [cesta, setCesta] = useState<{ [productId: string]: ProductoCesta }>({});
  const [showAlertStock, setShowAlertStock] = useState(false);
  const [showAlertTotalZero, setShowAlertTotalZero] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCesta(JSON.parse(savedCart));
    }
  }, []);

  const handleIncrement = (productId: string) => {
    const item = cesta[productId];
    if (item.cantidad < item.stock) {
      const updatedItem = { ...item, cantidad: item.cantidad + 1 };
      updateCart(productId, updatedItem);
    } else {
      setShowAlertStock(true);
    }
  };

  const handleDecrement = (productId: string) => {
    const item = cesta[productId];
    if (item.cantidad > 1) {
      const updatedItem = { ...item, cantidad: item.cantidad - 1 };
      updateCart(productId, updatedItem);
    }
  };

  const handleRemove = (productId: string) => {
    const updatedCart = { ...cesta };
    delete updatedCart[productId];
    setCesta(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCesta({});
    localStorage.setItem('cart', JSON.stringify({}));
  };

  const updateCart = (productId: string, item: ProductoCesta) => {
    const updatedCart = { ...cesta, [productId]: item };
    setCesta(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalGlobal = Object.values(cesta).reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleTramitarPedido = () => {
    if (totalGlobal <= 0) {
      setShowAlertTotalZero(true);
    } else {
      navigate('/payment');
    }
};


return (
  <div className="container mt-3">
      <div className="container d-flex justify-content-between align-items-center mb-3">
          <h2>Cesta</h2>
          <div>
              <Button variant="danger" onClick={clearCart} className="me-3 mb-3 ">Borrar Todo</Button>
              <Button variant="primary" onClick={handleTramitarPedido} className='mb-3'>Tramitar Pedido</Button>
          </div>
      </div>
      {Object.keys(cesta).length === 0 ? (
          <div className='container'>
              <p>Tu cesta está vacía.</p>
          </div>
      ) : (
          <div>
              <table className="table">
                  <thead>
                      <tr>
                          <th>Producto</th>
                          <th>Precio Ud.</th>
                          <th>Cantidad</th>
                          <th>Total</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      {Object.values(cesta).map(item => (
                          <tr key={item.id}>
                              <td>
                                  <div>
                                      <img src={item.url} alt={item.nombre} style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                                      <span>{item.nombre}</span>
                                  </div>
                              </td>
                              <td style={{ verticalAlign: 'middle' }}>{item.precio.toFixed(2)}€</td>
                              <td style={{ verticalAlign: 'middle' }}>
                                  <div className="d-flex align-items-center">
                                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleDecrement(item.id)}>-</button>
                                      <span className="px-2">{item.cantidad}</span>
                                      <button className="btn btn-outline-primary btn-sm ms-2" onClick={() => handleIncrement(item.id)}>+</button>
                                  </div>
                              </td>
                              <td style={{ verticalAlign: 'middle' }}>{(item.precio * item.cantidad).toFixed(2)}€</td>
                              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>Eliminar</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <div className="justify-content-between align-items-center mb-3">
                  <h4 className="text-center">Total: {totalGlobal.toFixed(2)}€</h4>
              </div>
          </div>
      )}
      <Modal show={showAlertStock} onHide={() => setShowAlertStock(false)} centered>
          <Modal.Header closeButton>
              <Modal.Title>¡Alerta!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              No puedes agregar más productos de los que hay en stock.
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAlertStock(false)}>
                  Cerrar
              </Button>
          </Modal.Footer>
      </Modal>
      <Modal show={showAlertTotalZero} onHide={() => setShowAlertTotalZero(false)} centered>
          <Modal.Header closeButton>
              <Modal.Title>¡Alerta!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              No puedes tramitar un pedido sin productos.
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAlertTotalZero(false)}>
                  Cerrar
              </Button>
          </Modal.Footer>
      </Modal>
  </div>
);

};

export default BasketPage;
