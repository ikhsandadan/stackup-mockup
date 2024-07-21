import tee from '../../public/products/tee.png';
import hoodie from '../../public/products/hoodie.png';

const products = [
    {
        id: 'Tee1',
        name: 'Tee',
        image: tee,
        price: 1200,
        category: 'T-Shirt',
        description: 'Tee Description',
        size: {
                xs: 10,
                s: 12,
                m: 20,
                lg: 15,
                xl: 22,
                xxl: 15
            }
    },
    {
        id: 'Hoodie1',
        name: 'Hoodie',
        image: hoodie,
        price: 2000,
        category: 'Hoodie',
        description: 'Hoodie Description',
        size: {
                xs: 10,
                s: 12,
                m: 20,
                lg: 15,
                xl: 22,
                xxl: 15
            }
    },
];

export default products;