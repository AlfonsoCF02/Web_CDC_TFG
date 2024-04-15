import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import imgNotFound from '../../../assets/images/image-not-found.jpg';
import { baseUrl } from "../../../config";

interface Category {
  id: string;
  name: string;
}

interface ProductState {
  name: string;
  categoryID: string;
  price: string;
  stock: string;
  imageURL: string;
}

interface TouchedState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string;
}

const EditProduct = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductState>({
    name: '',
    categoryID: '',
    price: '',
    stock: '',
    imageURL: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    categoryID: false,
    price: false,
    stock: false,
    imageURL: false
  });
  const [errors, setErrors] = useState<ErrorState>({
    name: '',
    categoryID: '',
    price: '',
    stock: '',
    imageURL: ''
  });

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/product/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${baseUrl}/api/category/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        setProduct({
          name: productResponse.data.name,
          categoryID: productResponse.data.categoryID,
          price: productResponse.data.price,
          stock: productResponse.data.stock,
          imageURL: productResponse.data.imageURL
        });
        setCategories(categoriesResponse.data.map((cat: any) => ({ id: cat.id, name: cat.categoria })));
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchProductAndCategories();
  }, [id]);

  
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
      case 'categoryID':
        if (!value) error = 'Seleccione una categoría.';
        break;
      case 'price':
        if (!value || isNaN(parseFloat(value))) error = 'Ingrese un precio válido.';
        break;
      case 'stock':
        if (!value || isNaN(parseInt(value))) error = 'Ingrese un stock válido.';
        break;
      case 'imageURL':
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
  
    const formErrors = Object.values(errors).some(x => x);
  
    if (!formErrors) {
      try {
        await axios.put(`${baseUrl}/api/product/update/${id}`, product, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        navigate('/manage-products');
      } catch (error) {
        alert('Error editando el producto.');
        console.error('Error al editar el producto:', error);
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

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Editar Producto</h2>
      <div className="d-flex justify-content-center mb-4">
        <div className="w-50 pe-3">
          <form noValidate onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <div className="mb-3">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                value={product.name}
                onChange={handleChange('name')}
              />
              {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="categoryID">Categoría</label>
              <select
                id="categoryID"
                className={`form-control ${errors.categoryID && touched.categoryID ? 'is-invalid' : ''}`}
                value={product.categoryID}
                onChange={handleChange('categoryID')}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryID && touched.categoryID && <div className="invalid-feedback">{errors.categoryID}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="price">Precio (euros)</label>
              <input
                id="price"
                type="text"
                className={`form-control ${errors.price && touched.price ? 'is-invalid' : ''}`}
                value={product.price}
                onChange={handleChange('price', true)}
              />
              {errors.price && touched.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="stock">Stock (uds.)</label
                ><input
                id="stock"
                type="text"
                className={`form-control ${errors.stock && touched.stock ? 'is-invalid' : ''}`}
                value={product.stock}
                onChange={handleChange('stock', true)}
              />
              {errors.stock && touched.stock && <div className="invalid-feedback">{errors.stock}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="imageURL">URL de la Imagen</label>
              <input
                id="imageURL"
                type="text"
                className={`form-control ${errors.imageURL && touched.imageURL ? 'is-invalid' : ''}`}
                value={product.imageURL}
                onChange={handleChange('imageURL')}
              />
              {errors.imageURL && touched.imageURL && <div className="invalid-feedback">{errors.imageURL}</div>}
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-3">Actualizar Producto</button>
            </div>
          </form>
        </div>
        <div className="w-50 ps-3 d-flex flex-column justify-content-center align-items-center">
          <div className="text-center mb-3">
            <h4>Previsualización de la Imagen</h4>
            <img src={product.imageURL ? product.imageURL : imgNotFound} alt="Preview" className="img-fluid" style={{ maxHeight: '300px', maxWidth: '100%' }} />
          </div>
          <div className="text-center">
            <a href="https://postimages.org/es/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Generar URL de Imagen</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;