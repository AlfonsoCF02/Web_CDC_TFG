import React, { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imgNotFound from '../../../assets/images/image-not-found.jpg';
import { baseUrl } from "../../../config";

interface Category {
  id: string;
  name: string;
}

interface ProductState {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  imageUrl: string;
}

interface TouchedState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string;
}

const CreateProduct = () => {
  const [product, setProduct] = useState<ProductState>({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    categoryId: false,
    price: false,
    stock: false,
    imageUrl: false
  });
  const [errors, setErrors] = useState<ErrorState>({
    name: 'Por favor, ingrese el nombre del producto.',
    categoryId: 'Seleccione una categoría.',
    price: 'Ingrese un precio válido.',
    stock: 'Ingrese un stock válido.',
    imageUrl: 'Ingrese una URL válida de imagen (debe acabar en .[formato de imagen]).\n' +
      'Por ejemplo:\n' +
      'https://i.postimg.cc/G3zkz5Wd/bellota.png\n' +
      'Puede usar el "Enlace directo de" https://postimages.org/es/'
  });  
  
  const navigate = useNavigate();

  useEffect(() => {
    validate('name', product.name);
    validate('categoryId', product.categoryId);
    validate('price', product.price);
    validate('stock', product.stock);
    validate('imageUrl', product.imageUrl);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/category/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCategories(response.data.map((cat: any) => ({ id: cat.id, name: cat.categoria })));
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field: string, isNumeric: boolean = false) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = isNumeric ? e.target.value.replace(/[^\d.]/g, '') : e.target.value;
    setProduct({ ...product, [field]: value });
    setTouched({ ...touched, [field]: true });
    validate(field, value);
  };

  const validate = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value) error = 'Por favor, ingrese el nombre del producto.';
        break;
      case 'categoryId':
        if (!value) error = 'Seleccione una categoría.';
        break;
      case 'price':
        if (!value || isNaN(parseFloat(value))) error = 'Ingrese un precio válido.';
        break;
      case 'stock':
        if (!value || isNaN(parseInt(value))) error = 'Ingrese un stock válido.';
        break;
      case 'imageUrl':
        if (!value || !value.match(/\.(jpeg|jpg|gif|png)$/)) {
          error = 'Ingrese una URL válida de imagen (debe acabar en .[formato de imagen]).\n';
          error += 'Por ejemplo:\n';
          error += 'https://i.postimg.cc/G3zkz5Wd/bellota.png\n';
          error += 'Puede usar el "Enlace directo de" https://postimages.org/es/';
        }
        break;
      default:
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    validate('name', product.name);
    validate('categoryId', product.categoryId);
    validate('price', product.price);
    validate('stock', product.stock);
    validate('imageUrl', product.imageUrl);
  
    const formErrors = Object.values(errors).some(x => x);
    const formTouched = Object.values(touched).every(x => x);
  
    if (!formErrors && formTouched) {
      try {
        await axios.post(`${baseUrl}/api/product/create`, product, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        navigate('/manage-products');
      } catch (error) {
        alert('Error creando el producto.');
        console.error('Error al crear el producto:', error);
      }
    } else {
      // Ensure all fields are touched to show errors
      setTouched({
        name: true,
        categoryId: true,
        price: true,
        stock: true,
        imageUrl: true
      });
    }
  };
  

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event as unknown as FormEvent<HTMLFormElement>); // Forzar el tipo si es necesario
  };

  const getInputClass = (field: string) => {
    if (!touched[field]) return 'form-control';
    return `form-control ${errors[field] ? 'is-invalid' : 'is-valid'}`;
  };

  const displayImage = product.imageUrl ? product.imageUrl : imgNotFound;

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Crear Producto</h2>
      <div className="d-flex justify-content-center mb-4">
        <div className="w-50 pe-3">
          <form noValidate onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <div className="mb-3">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                className={getInputClass('name')}
                value={product.name}
                onChange={handleChange('name')}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="categoryId">Categoría</label>
              <select
                id="categoryId"
                className={getInputClass('categoryId')}
                value={product.categoryId}
                onChange={handleChange('categoryId')}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="price">Precio (euros)</label>
              <input
                id="price"
                type="text"
                className={getInputClass('price')}
                value={product.price}
                onChange={handleChange('price', true)}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="stock">Stock (uds.)</label>
              <input
                id="stock"
                type="text"
                className={getInputClass('stock')}
                value={product.stock}
                onChange={handleChange('stock', true)}
              />
              {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl">URL de la Imagen</label>
              <input
                id="imageUrl"
                type="text"
                className={getInputClass('imageUrl')}
                value={product.imageUrl}
                onChange={handleChange('imageUrl')}
              />
              {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
            </div>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn btn-primary mt-3" onClick={handleButtonClick}>Crear Producto</button>
            </div>
          </form>
        </div>
        <div className="w-50 ps-3 d-flex flex-column justify-content-center align-items-center">
          <div className="text-center mb-3">
            <h4>Previsualización de la Imagen</h4>
            <img src={displayImage} alt="Preview" className="img-fluid" style={{ maxHeight: '300px', maxWidth: '100%' }} />
          </div>
          <div className="text-center">
            <a href="https://postimages.org/es/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Generar URL de Imagen</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
