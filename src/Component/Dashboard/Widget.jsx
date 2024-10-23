import React, { useEffect, useState } from 'react';
import apiClient from '../../Utils/config/apiClient';

const Widget = ({ title, value, icon, style }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [expiringProductsCount, setExpiringProductsCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient._get('/products/getAll');
        const allProducts = response.products;

        setProducts(allProducts);

        // Assuming each product has an `expiary_date` property in the format YYYY-MM-DD
        const expiringProducts = allProducts.filter(product => {
          const expiryDate = new Date(product.expiary_date); // Convert the expiry date to a Date object
          const today = new Date();

          // Calculate 30 days from today
          const thirtyDaysFromToday = new Date();
          thirtyDaysFromToday.setDate(today.getDate() + 30);

          // Check if the product is expiring in the next 30 days
          return expiryDate > today && expiryDate <= thirtyDaysFromToday;
        });

        setExpiringProductsCount(expiringProducts.length);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to fetch products", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow" style={style}>
      <div className="flex items-center">
        <div className="text-purple-600 text-2xl mr-4">{icon}</div>
        <div>
          <h2 className="font-bold text-purple-600">{title}</h2>
          <p className="text-3xl font-semibold">
            {value === "products" ? products.length
              : value === "expiary" ? expiringProductsCount
                : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Widget;
