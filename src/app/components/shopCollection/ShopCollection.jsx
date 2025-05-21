"use client";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts, setPage } from '@/redux/slices/products/productsSlice';
import ShopCollectionItem from '../shopCollectionItem/ShopCollectionItem';
import Spinner from '../loadingSpinner/Spinner';
import styles from './ShopCollection.module.scss';

const ShopCollection = () => {
    const dispatch = useDispatch();
    const { products, total, isLoading, error, filters, pagination } = useSelector((state) => state.products);

    // Fetch products on mount and when filters or page change
    useEffect(() => {
        dispatch(fetchAllProducts({
            categories: filters.categories,
            sizes: filters.sizes,
            colors: filters.colors,
            sort: filters.sort,
            page: pagination.page,
            limit: pagination.limit,
        }));
    }, [dispatch, filters, pagination.page]);

    // Pagination
    const totalPages = Math.ceil(total / pagination.limit);
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            dispatch(setPage(newPage));
        }
    };

    return (
        <div>
            <div className={styles.productsHeader}>
                <div className={styles.colLeft}>
                    <p>Showing {products.length} of {total} results</p>
                </div>
                <div className={styles.colRight}>
                    <select value={filters.sort} disabled>
                        <option value="">Sort by</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                    </select>
                </div>
            </div>
            {isLoading && <Spinner />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.length === 0 && !isLoading && !error && <p>No products available.</p>}
            <div className={styles.shopCollectionContainer}>
                {products.map((product) => {
                    const thumbnail = product.images.find((img) => img.is_thumbnail)?.img_url || '';
                    const sizes = product.variants.map((variant) => variant.size);
                    return (
                        <ShopCollectionItem
                            key={product.product_id}
                            // id={product.product_id}
                            // name={product.product_name}
                            // img_url={thumbnail}
                            // price={product.price}
                            // sizes={sizes}
                            product={product}
                        />
                    );
                })}
            </div>
            {total > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        style={{ marginRight: '10px' }}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= totalPages - 1}
                        style={{ marginLeft: '10px' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopCollection;