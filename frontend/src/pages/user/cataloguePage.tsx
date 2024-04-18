import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from "../../config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

type ProductInCart = {
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
    url: string;
    stock: number;
};

type Category = {
    id: string;
    name: string;
};

const CataloguePage: React.FC = () => {
    const [productos, setProductos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
    const [cantidades, setCantidades] = useState<{ [productId: string]: number }>({});
    const [showStockAlert, setShowStockAlert] = useState<boolean>(false);
    const [showCartAlert, setShowCartAlert] = useState<boolean>(false);
    const [cesta, setCesta] = useState<{ [productId: string]: ProductInCart }>(() => {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : {};
  });
  

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriasResponse = await axios.get(`${baseUrl}/api/category/categories`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setCategorias(categoriasResponse.data.map((cat: any) => ({ id: cat.id, name: cat.categoria })));

                const productosResponse = await axios.get(`${baseUrl}/api/product/catalogue`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setProductos(productosResponse.data);
                // Inicializa las cantidades de todos los productos a 0
                const initialCantidades: { [productId: string]: number } = {};
                productosResponse.data.forEach((producto: any) => {
                    initialCantidades[producto.id] = 0;
                });
                setCantidades(initialCantidades);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoriaSeleccionada(event.target.value);
    };

    const handleCantidadIncrement = (productId: string) => {
        if (cantidades[productId] + 1 > productos.find(producto => producto.id === productId)?.stock) {
            setShowStockAlert(true);
            return;
        }
        setCantidades(prevState => ({
            ...prevState,
            [productId]: (prevState[productId] || 0) + 1
        }));
    };

    const handleCantidadDecrement = (productId: string) => {
        if (cantidades[productId] && cantidades[productId] > 0) {
            setCantidades(prevState => ({
                ...prevState,
                [productId]: prevState[productId] - 1
            }));
        }
    };

    const handleAgregarALaCesta = (productId: string, cantidad: number) => {
        const producto = productos.find(p => p.id === productId);
        if (!producto || producto.stock === 0) {
            setShowCartAlert(true);
            return;
        }

        const itemEnCesta = cesta[productId];
        const cantidadActual = itemEnCesta ? itemEnCesta.cantidad : 0;

        if (cantidadActual + cantidad > producto.stock) {
            setShowCartAlert(true);
            return;
        }

        const nuevoItem: ProductInCart = {
            id: producto.id,
            nombre: producto.name,
            cantidad: cantidadActual + cantidad,
            precio: producto.price,
            url: producto.imageURL,
            stock: producto.stock
        };

        setCesta(prevCesta => ({
            ...prevCesta,
            [productId]: nuevoItem
        }));
    };

    const handleAlertClose = () => {
        setShowStockAlert(false);
        setShowCartAlert(false);
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cesta));
    }, [cesta]);

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Catálogo de Productos</h2>
                <div className="mb-3">
                    <label htmlFor="categoriaSelector" className="form-label">Filtrar por Categoría:</label>
                    <select id="categoriaSelector" className="form-select w-auto" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
                        <option value="">Todas</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row">
                {productos
                    .filter(producto => !categoriaSeleccionada || producto.categoryID === categoriaSeleccionada)
                    .map((producto) => (
                        <div className="col-md-4 mb-4" key={producto.id}>
                            <div className="card producto-card">
                                <img src={producto.imageURL} className="card-img-top producto-imagen" alt={producto.name} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title producto-titulo">{producto.name}</h5>
                                    <p className="card-text producto-precio">Precio: {producto.price}€</p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        {producto.stock === 0 ? (
                                            <button className="btn btn-danger" disabled>Sin Stock</button>
                                        ) : (
                                            <button className="btn btn-primary" onClick={() => handleAgregarALaCesta(producto.id, cantidades[producto.id] || 1)}>Agregar a la cesta</button>
                                        )}
                                        <div className="d-flex align-items-center">
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleCantidadDecrement(producto.id)}>-</button>
                                            <span className="px-2">{cantidades[producto.id] || 1}</span>
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleCantidadIncrement(producto.id)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <Modal show={showStockAlert} onHide={handleAlertClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¡Alerta!</Modal.Title>
                </Modal.Header>
                <Modal.Body>No puedes agregar más productos de los que hay en stock.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAlertClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCartAlert} onHide={handleAlertClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¡Alerta!</Modal.Title>
                </Modal.Header>
                <Modal.Body>No puedes agregar más productos a la cesta de los que hay en stock.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAlertClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CataloguePage;
